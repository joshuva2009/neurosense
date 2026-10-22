import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
from scoring_engine import (
    TEST_METRICS_INFO,
    normalize_test_score,
    synthesize_cognitive_profile
)
from ai_advisor import generate_ai_response

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeuroSense API",
    description="Early Detection & Monitoring of Brain Disorders API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_global_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# ----------------- Pydantic Schemas -----------------

class RegisterRequest(BaseModel):
    username: str
    email: Optional[str] = None
    password: Optional[str] = "demopassword"
    age: Optional[int] = 52
    sleep_hours: Optional[float] = 7.0
    physical_activity_level: Optional[str] = "moderate"
    family_history_neurological: Optional[bool] = False
    chronic_conditions: Optional[str] = "None reported"

class LoginRequest(BaseModel):
    username: str
    password: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    sleep_hours: Optional[float] = None
    physical_activity_level: Optional[str] = None
    family_history_neurological: Optional[bool] = None
    chronic_conditions: Optional[str] = None
    consent_given: Optional[bool] = True

class StartSessionRequest(BaseModel):
    user_id: int

class SubmitTestRequest(BaseModel):
    session_id: int
    user_id: int
    test_type: str
    raw_score: float
    details: Optional[Dict[str, Any]] = None

class CompleteSessionRequest(BaseModel):
    session_id: int

class ChatMessageRequest(BaseModel):
    user_id: Optional[int] = None
    message: str
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None

# ----------------- Helper Functions -----------------

def seed_simulated_sessions(db: Session, user: models.User):
    """Seed initial realistic longitudinal screening history for demo and testing."""
    existing_count = db.query(models.AssessmentSession).filter(models.AssessmentSession.user_id == user.id).count()
    if existing_count > 0:
        return

    # Create 3 historical sessions spaced across past weeks
    past_offsets = [28, 14, 3] # days ago
    variations = [
        {"memory": 72.0, "reaction": 340.0, "tapping": 48.0, "overall": 74.0},
        {"memory": 78.0, "reaction": 320.0, "tapping": 52.0, "overall": 77.5},
        {"memory": 82.0, "reaction": 305.0, "tapping": 55.0, "overall": 81.0},
    ]

    for idx, days_ago in enumerate(past_offsets):
        s_date = datetime.utcnow() - timedelta(days=days_ago)
        sess = models.AssessmentSession(
            user_id=user.id,
            session_code=f"SIM-{uuid.uuid4().hex[:8].upper()}",
            status="completed",
            started_at=s_date - timedelta(minutes=15),
            completed_at=s_date,
            overall_score=variations[idx]["overall"],
            is_simulated=True,
            summary_feedback="Historical demonstration screening record. Values simulate typical adult baseline variations."
        )
        db.add(sess)
        db.flush()

        # Add sample test results for this session
        v = variations[idx]
        tests = [
            ("memory_recall", v["memory"] / 100 * 8, v["memory"], 100, None),
            ("reaction_time", v["reaction"], 100.0 - (v["reaction"] - 200) * 0.15, 95.0, v["reaction"]),
            ("attention_concentration", 14.0, 78.0 + idx * 3, 88.0, 420.0),
            ("cognitive_flexibility", 28.0 - idx * 2, 75.0 + idx * 4, 90.0, None),
            ("finger_tapping", v["tapping"], 76.0 + idx * 3, 92.0, None),
            ("visual_recognition", 5.0, 83.3, 83.3, None),
            ("language_fluency", 11.0 + idx, 80.0 + idx * 4, 90.0, None),
            ("problem_solving", 4.0, 80.0, 80.0, None),
        ]
        for t_type, raw, norm, acc, rt in tests:
            tr = models.TestResult(
                session_id=sess.id,
                user_id=user.id,
                test_type=t_type,
                raw_score=raw,
                normalized_score=round(norm, 1),
                accuracy=acc,
                reaction_time_ms=rt,
                details_json=json.dumps({"simulated": True, "date": s_date.isoformat()}),
                created_at=s_date
            )
            db.add(tr)

    db.commit()

# ----------------- Auth & User Routes -----------------

@app.post("/api/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username is already registered")

    new_user = models.User(
        username=req.username,
        email=req.email,
        password_hash=req.password, # For demo, plain or hashed
        is_guest=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = models.UserProfile(
        user_id=new_user.id,
        age=req.age,
        sleep_hours=req.sleep_hours,
        physical_activity_level=req.physical_activity_level,
        family_history_neurological=req.family_history_neurological,
        chronic_conditions=req.chronic_conditions,
        consent_given=True
    )
    db.add(profile)
    db.commit()

    seed_simulated_sessions(db, new_user)

    return {
        "success": True,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "is_guest": False
        }
    }

@app.post("/api/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Try Guest Access or Register.")

    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_guest": user.is_guest
        }
    }

@app.post("/api/auth/guest")
def guest_login(db: Session = Depends(get_db)):
    guest_username = f"Guest_{uuid.uuid4().hex[:6]}"
    guest_user = models.User(
        username=guest_username,
        email=None,
        is_guest=True
    )
    db.add(guest_user)
    db.commit()
    db.refresh(guest_user)

    profile = models.UserProfile(
        user_id=guest_user.id,
        age=58,
        sleep_hours=6.5,
        physical_activity_level="moderate",
        family_history_neurological=False,
        chronic_conditions="Mild Hypertension",
        consent_given=True
    )
    db.add(profile)
    db.commit()

    seed_simulated_sessions(db, guest_user)

    return {
        "success": True,
        "user": {
            "id": guest_user.id,
            "username": guest_user.username,
            "is_guest": True
        }
    }

@app.get("/api/user/profile/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = user.profile
    return {
        "username": user.username,
        "email": user.email,
        "is_guest": user.is_guest,
        "age": profile.age if profile else 55,
        "gender": profile.gender if profile else "Not specified",
        "sleep_hours": profile.sleep_hours if profile else 7.0,
        "physical_activity_level": profile.physical_activity_level if profile else "moderate",
        "family_history_neurological": profile.family_history_neurological if profile else False,
        "chronic_conditions": profile.chronic_conditions if profile else "None",
        "consent_given": profile.consent_given if profile else True
    }

@app.put("/api/user/profile/{user_id}")
def update_user_profile(user_id: int, req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not profile:
        profile = models.UserProfile(user_id=user_id)
        db.add(profile)

    if req.age is not None: profile.age = req.age
    if req.gender is not None: profile.gender = req.gender
    if req.sleep_hours is not None: profile.sleep_hours = req.sleep_hours
    if req.physical_activity_level is not None: profile.physical_activity_level = req.physical_activity_level
    if req.family_history_neurological is not None: profile.family_history_neurological = req.family_history_neurological
    if req.chronic_conditions is not None: profile.chronic_conditions = req.chronic_conditions
    if req.consent_given is not None: profile.consent_given = req.consent_given

    db.commit()
    return {"success": True, "message": "Profile updated successfully"}

# ----------------- Screening Test Routes -----------------

@app.get("/api/screening/modules")
def get_screening_modules():
    """Return all 8 screening test definitions and metadata."""
    return TEST_METRICS_INFO

@app.post("/api/screening/session/start")
def start_screening_session(req: StartSessionRequest, db: Session = Depends(get_db)):
    code = f"NS-{uuid.uuid4().hex[:8].upper()}"
    sess = models.AssessmentSession(
        user_id=req.user_id,
        session_code=code,
        status="in_progress",
        started_at=datetime.utcnow()
    )
    db.add(sess)
    db.commit()
    db.refresh(sess)
    return {
        "session_id": sess.id,
        "session_code": sess.session_code,
        "status": sess.status,
        "started_at": sess.started_at.isoformat()
    }

@app.post("/api/screening/test/submit")
def submit_test_result(req: SubmitTestRequest, db: Session = Depends(get_db)):
    sess = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == req.session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Assessment session not found")

    normalized_data = normalize_test_score(req.test_type, req.raw_score, req.details or {})
    
    # Check if this test was already submitted in this session; if so, update it
    existing = db.query(models.TestResult).filter(
        models.TestResult.session_id == req.session_id,
        models.TestResult.test_type == req.test_type
    ).first()

    if existing:
        existing.raw_score = req.raw_score
        existing.normalized_score = normalized_data["normalized_score"]
        existing.accuracy = normalized_data["accuracy"]
        existing.reaction_time_ms = normalized_data["reaction_time_ms"]
        existing.details_json = json.dumps(req.details or {})
        db.commit()
        tr = existing
    else:
        tr = models.TestResult(
            session_id=req.session_id,
            user_id=req.user_id,
            test_type=req.test_type,
            raw_score=req.raw_score,
            normalized_score=normalized_data["normalized_score"],
            accuracy=normalized_data["accuracy"],
            reaction_time_ms=normalized_data["reaction_time_ms"],
            details_json=json.dumps(req.details or {})
        )
        db.add(tr)
        db.commit()
        db.refresh(tr)

    return {
        "success": True,
        "test_result": {
            "id": tr.id,
            "test_type": tr.test_type,
            "raw_score": tr.raw_score,
            "normalized_score": tr.normalized_score,
            "accuracy": tr.accuracy,
            "reaction_time_ms": tr.reaction_time_ms,
            "info": TEST_METRICS_INFO.get(req.test_type, {})
        }
    }

@app.post("/api/screening/session/complete")
def complete_screening_session(req: CompleteSessionRequest, db: Session = Depends(get_db)):
    sess = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == req.session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Assessment session not found")

    results = db.query(models.TestResult).filter(models.TestResult.session_id == req.session_id).all()
    if not results:
        raise HTTPException(status_code=400, detail="Cannot complete session without any completed tests")

    results_data = [
        {
            "test_type": r.test_type,
            "normalized_score": r.normalized_score,
            "raw_score": r.raw_score,
            "accuracy": r.accuracy,
            "reaction_time_ms": r.reaction_time_ms
        }
        for r in results
    ]

    analysis = synthesize_cognitive_profile(results_data)

    sess.status = "completed"
    sess.completed_at = datetime.utcnow()
    sess.overall_score = analysis["overall_composite"]
    sess.summary_feedback = analysis["tier_summary"]
    db.commit()

    return {
        "success": True,
        "session_id": sess.id,
        "session_code": sess.session_code,
        "overall_score": sess.overall_score,
        "analysis": analysis
    }

@app.get("/api/screening/session/{session_id}")
def get_session_details(session_id: int, db: Session = Depends(get_db)):
    sess = db.query(models.AssessmentSession).filter(models.AssessmentSession.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    results = db.query(models.TestResult).filter(models.TestResult.session_id == session_id).all()
    results_data = [
        {
            "test_type": r.test_type,
            "normalized_score": r.normalized_score,
            "raw_score": r.raw_score,
            "accuracy": r.accuracy,
            "reaction_time_ms": r.reaction_time_ms,
            "info": TEST_METRICS_INFO.get(r.test_type, {})
        }
        for r in results
    ]
    analysis = synthesize_cognitive_profile(results_data)

    return {
        "session_id": sess.id,
        "session_code": sess.session_code,
        "status": sess.status,
        "started_at": sess.started_at.isoformat() if sess.started_at else None,
        "completed_at": sess.completed_at.isoformat() if sess.completed_at else None,
        "overall_score": sess.overall_score,
        "is_simulated": sess.is_simulated,
        "test_results": results_data,
        "analysis": analysis
    }

# ----------------- Longitudinal Analytics Route -----------------

@app.get("/api/analytics/overview/{user_id}")
def get_analytics_overview(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(models.AssessmentSession).filter(
        models.AssessmentSession.user_id == user_id,
        models.AssessmentSession.status == "completed"
    ).order_by(models.AssessmentSession.started_at.asc()).all()

    # Format trend timeline
    history_trend = []
    for s in sessions:
        date_str = s.started_at.strftime("%b %d") if s.started_at else "Recent"
        history_trend.append({
            "session_id": s.id,
            "session_code": s.session_code,
            "date": date_str,
            "score": round(s.overall_score, 1) if s.overall_score else 75.0,
            "is_simulated": s.is_simulated
        })

    # Get most recent session or latest test results for radar breakdown
    latest_sess = sessions[-1] if sessions else None
    if latest_sess:
        results = db.query(models.TestResult).filter(models.TestResult.session_id == latest_sess.id).all()
        results_data = [
            {"test_type": r.test_type, "normalized_score": r.normalized_score}
            for r in results
        ]
        synthesis = synthesize_cognitive_profile(results_data)
    else:
        synthesis = synthesize_cognitive_profile([])

    # Radar data format for Recharts
    radar_data = [
        {"domain": d["name"], "score": d["score"], "baseline": 75.0}
        for d in synthesis["domains"].values()
    ]

    return {
        "total_assessments": len(sessions),
        "history_trend": history_trend,
        "latest_score": latest_sess.overall_score if latest_sess else 78.0,
        "latest_session_id": latest_sess.id if latest_sess else None,
        "radar_data": radar_data,
        "synthesis": synthesis
    }

# ----------------- Chatbot Route -----------------

@app.post("/api/chat/message")
def chat_with_neurobot(req: ChatMessageRequest):
    response = generate_ai_response(
        user_message=req.message,
        user_context=req.context or {},
        language=req.language or "en"
    )
    return response

# ----------------- Educational Disorders Route -----------------

@app.get("/api/education/disorders")
def get_educational_disorders():
    return [
        {
            "id": "alzheimer",
            "name": "Alzheimer's Disease",
            "tamil_name": "அல்சைமர் நோய்",
            "overview": "A progressive neurodegenerative condition causing gradual memory loss, language impairment, and executive dysfunction.",
            "primary_symptoms": [
                "Short-term memory loss interfering with daily routine",
                "Difficulty navigating familiar routes or remembering appointments",
                "Challenges in calculating, budgeting, or following multi-step tasks",
                "Word-finding hesitations and semantic substitutions"
            ],
            "underlying_biology": "Accumulation of extracellular beta-amyloid plaques and intracellular tau tangles, leading to synaptic loss predominantly in the hippocampus and cerebral cortex.",
            "lifestyle_protection": [
                "Consistent aerobic physical activity (150 min/wk)",
                "MIND / Mediterranean diet (antioxidants, flavonoids, omega-3s)",
                "7-8 hours restorative sleep for glymphatic clearance",
                "Lifelong mental stimulation and bilingual/multilingual practice"
            ],
            "when_to_see_doctor": "When memory lapses disrupt everyday independence or are noticed by family and colleagues."
        },
        {
            "id": "parkinson",
            "name": "Parkinson's Disease",
            "tamil_name": "பார்கின்சன் நோய்",
            "overview": "A movement disorder marked by dopaminergic neural degeneration in the substantia nigra, affecting motor coordination and pacing.",
            "primary_symptoms": [
                "Unilateral resting tremor (often described as pill-rolling)",
                "Bradykinesia: slowness in initiating voluntary movements",
                "Limb rigidity and stiffness in joints",
                "Postural instability, reduced arm swing, and shuffling gait"
            ],
            "underlying_biology": "Degeneration of dopamine-producing neurons and abnormal accumulation of alpha-synuclein aggregates (Lewy bodies) in subcortical brain areas.",
            "lifestyle_protection": [
                "High-intensity interval and balance training (Tai Chi, boxing)",
                "Rhythm-based physical activities to facilitate motor cueing",
                "Gut microbiome health (high fiber, polyphenol intake)"
            ],
            "when_to_see_doctor": "Any unexplained resting tremor, persistent limb stiffness, or noticeable reduction in handwriting size (micrographia)."
        },
        {
            "id": "mci",
            "name": "Mild Cognitive Impairment (MCI)",
            "tamil_name": "லேசான அறிவாற்றல் குறைபாடு",
            "overview": "A clinical stage characterized by measurable cognitive decline beyond normal aging, while preserving personal functional independence.",
            "primary_symptoms": [
                "Noticeable memory or attention changes corroborated by loved ones",
                "Mild delays in task switching or complex decision making",
                "Fully capable of independent living, bill paying, and self-care"
            ],
            "underlying_biology": "Early subclinical neurodegenerative, vascular, or metabolic perturbations that have not yet caused widespread cortical failure.",
            "lifestyle_protection": [
                "Strict cardiovascular risk control (hypertension, diabetes, lipid management)",
                "Regular cognitive training exercises and social engagement",
                "Correction of hearing and vision loss, which reduces cognitive strain"
            ],
            "when_to_see_doctor": "Early evaluation is vital because MCI can sometimes be reversed or stabilized if treated early."
        },
        {
            "id": "dementia",
            "name": "Dementia Spectrum",
            "tamil_name": "மறதி நோய் வகைகள்",
            "overview": "An overarching clinical umbrella term describing cognitive impairment severe enough to compromise independent day-to-day life.",
            "primary_symptoms": [
                "Significant memory and executive function deficits",
                "Personality changes, apathy, or emotional dysregulation",
                "Loss of ability to independently manage medication and finances"
            ],
            "underlying_biology": "Encompasses Alzheimer's, Vascular Dementia (cerebral ischemic infarcts), Lewy Body Dementia, and Frontotemporal Lobar Degeneration.",
            "lifestyle_protection": [
                "Vascular health protection: smoking cessation, BP optimization",
                "Mediterranean-style diet and stress reduction"
            ],
            "when_to_see_doctor": "Whenever cognitive changes interfere with safety, medication adherence, or social functioning."
        },
        {
            "id": "stroke",
            "name": "Acute Stroke & Warning Signs",
            "tamil_name": "பக்கவாதம் மற்றும் அவசர எச்சரிக்கை",
            "overview": "A medical emergency caused by disrupted blood supply to a portion of the brain, leading to rapid cellular ischemia.",
            "primary_symptoms": [
                "Face drooping: One side of the face droops or is numb",
                "Arm weakness: One arm becomes weak or paralyzed",
                "Speech difficulty: Slurred, garbled, or absent speech",
                "Time to call emergency services immediately (911 / 108 / 112)"
            ],
            "underlying_biology": "Either ischemic (arterial thrombus or embolus) or hemorrhagic (ruptured cerebral vessel), depriving brain cells of oxygen within minutes.",
            "lifestyle_protection": [
                "Rigorous blood pressure control (target < 120/80 mmHg)",
                "Management of atrial fibrillation and high cholesterol",
                "Smoking cessation and active daily movement"
            ],
            "when_to_see_doctor": "IMMEDIATELY. Call emergency services without delay if FAST signs are observed."
        }
    ]

# ----------------- Privacy / Data Deletion Route -----------------

@app.post("/api/user/delete-data/{user_id}")
def delete_user_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"success": True, "message": "All personal records and screening data permanently purged per GDPR/privacy guidelines."}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NeuroSense API",
        "timestamp": datetime.utcnow().isoformat()
    }

# ----------------- Serve Frontend Static Build on Port 8000 -----------------
from fastapi.staticfiles import StaticFiles

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")


