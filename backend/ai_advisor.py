import re
from typing import Dict, Any, List

# Emergency stroke keywords
STROKE_KEYWORDS = [
    "sudden numbness", "face drooping", "face droop", "arm weakness", "cannot lift arm",
    "slurred speech", "cant speak", "can't speak", "sudden confusion", "sudden vision loss",
    "worst headache of my life", "paralysis", "stroke", "fast protocol", "facial numbness"
]

STROKE_EMERGENCY_RESPONSE = {
    "is_emergency": True,
    "category": "stroke_alert",
    "en": (
        "🚨 **CRITICAL MEDICAL ALERT: IMMEDIATE ACTION REQUIRED** 🚨\n\n"
        "The symptoms you mentioned could indicate an acute **Stroke** or Transient Ischemic Attack (TIA). "
        "Every second counts. **Call emergency services immediately (911 in US / 108 or 112 in India / your local emergency number)** or proceed to the nearest emergency room.\n\n"
        "Remember the **F.A.S.T.** Protocol:\n"
        "• **F - Face:** Is one side of the face drooping? Ask the person to smile.\n"
        "• **A - Arms:** Can the person raise both arms, or does one arm drift downward?\n"
        "• **S - Speech:** Is speech slurred or strange? Ask them to repeat a simple sentence.\n"
        "• **T - Time:** If you observe any of these signs, call emergency medical services immediately.\n\n"
        "*Do NOT wait to see if symptoms improve. Do NOT drive yourself to the hospital.*"
    ),
    "ta": (
        "🚨 **முக்கிய மருத்துவ எச்சரிக்கை: உடனடியாக செயல்படவும்** 🚨\n\n"
        "நீங்கள் குறிப்பிட்ட அறிகுறிகள் கடுமையான **பக்கவாதம் (Stroke)** அல்லது தற்காலிக இரத்த ஓட்டக் குறைபாட்டைக் குறிக்கலாம். "
        "ஒவ்வொரு வினாடியும் முக்கியம். **உடனடியாக அவசர சிகிச்சை எண்ணை அழைக்கவும் (108 அல்லது 112 அல்லது 911)** அல்லது அருகிலுள்ள அவசர சிகிச்சைப் பிரிவிற்குச் செல்லவும்.\n\n"
        "**F.A.S.T.** நினைவூட்டல்:\n"
        "• **F - முகம் (Face):** முகத்தின் ஒரு பக்கம் கோணுகிறதா? சிரிக்கச் சொல்லுங்கள்.\n"
        "• **A - கைகள் (Arms):** இரு கைகளையும் உயர்த்த முடிகிறதா? ஒரு கை கீழே சரிகிறதா?\n"
        "• **S - பேச்சு (Speech):** பேச்சு குழறுகிறதா? ஒரு எளிய வாக்கியத்தைச் சொல்லச் சொல்லுங்கள்.\n"
        "• **T - நேரம் (Time):** இவற்றில் ஏதேனும் ஒன்றை கவனித்தால், தாமதிக்காமல் உடனே ஆம்புலன்ஸை அழைக்கவும்."
    )
}

DISORDER_KNOWLEDGE_BASE = {
    "alzheimer": {
        "keywords": ["alzheimer", "alzheimers", "memory loss", "forgetting names", "dementia", "அல்சைமர்", "மறதி"],
        "title": "Understanding Alzheimer's Disease & Cognitive Health",
        "content_en": (
            "**Alzheimer's Disease** is the most common form of progressive neurodegenerative dementia, "
            "primarily characterized by extracellular amyloid-beta plaques and intracellular tau neurofibrillary tangles.\n\n"
            "**Key Early Signs:**\n"
            "• Disruptive short-term memory loss (e.g., repeatedly asking the same question)\n"
            "• Challenges in planning or problem-solving (e.g., managing monthly bills or familiar recipes)\n"
            "• Spatial and temporal disorientation (losing track of dates or seasons)\n"
            "• Difficulty finding the right words in conversation\n\n"
            "**Normal Aging vs. Alzheimer's:**\n"
            "• *Normal aging:* Occasionally forgetting where you placed keys, but remembering later.\n"
            "• *Potential concern:* Forgetting what the keys are used for, or not recalling having placed them.\n\n"
            "**Neuroprotective Habits:** Regular cardiovascular exercise, adherence to the MIND/Mediterranean diet, "
            "engaging in continuous social learning, and quality sleep to promote glymphatic waste clearance."
        ),
        "content_ta": (
            "**அல்சைமர் நோய் (Alzheimer's Disease)** என்பது மூளையின் நரம்பு செல்கள் படிப்படியாக சிதைவடைவதால் ஏற்படும் மிகவும் பொதுவான மறதி நோயாகும்.\n\n"
            "**ஆரம்ப அறிகுறிகள்:**\n"
            "• சமீபத்திய நிகழ்வுகளை விரைவாக மறப்பது (ஒரே கேள்வியை மீண்டும் மீண்டும் கேட்பது)\n"
            "• திட்டமிடுதல் மற்றும் கணக்கு வழக்குகளை நிர்வகிப்பதில் சிரமம்\n"
            "• நேரம் மற்றும் இடத்தைக் கணிப்பதில் குழப்பம்\n"
            "• உரையாடலில் சரியான சொற்களைத் தேடுவதில் தடுமாற்றம்\n\n"
            "**இயல்பான முதுமை vs அல்சைமர்:**\n"
            "• *இயல்பான முதுமை:* சாவியை எங்கு வைத்தோம் என்று எப்போதாவது மறந்து, பின்னர் நினைவு கூர்வது.\n"
            "• *அல்சைமர் அறிகுறி:* சாவி எதற்குப் பயன்படுகிறது என்பதையே மறந்துவிடுவது.\n\n"
            "**பாதுகாப்பு வழிகள்:** சீரான உடற்பயிற்சி, சத்தான உணவு முறை, நல்ல தூக்கம் மற்றும் தொடர்ந்து மூளைக்கு வேலை தரும் புதிய பயிற்சிகள்."
        )
    },
    "parkinson": {
        "keywords": ["parkinson", "parkinsons", "tremor", "shaking", "rigidity", "slowness", "tapping", "பார்கின்சன்", "நடுக்கம்"],
        "title": "Parkinson's Disease & Motor Health",
        "content_en": (
            "**Parkinson's Disease** is a movement disorder caused by the loss of dopamine-producing neurons in the "
            "substantia nigra region of the basal ganglia.\n\n"
            "**Primary Motor Symptoms (TRAP):**\n"
            "• **T - Tremor:** Resting tremor, often beginning as a 'pill-rolling' motion in one hand or thumb.\n"
            "• **R - Rigidity:** Muscle stiffness or resistance in the limbs and neck.\n"
            "• **A - Akinesia / Bradykinesia:** Slowness of movement, reduced arm swing when walking, and masked facial expression.\n"
            "• **P - Postural Instability:** Balance difficulties and tendency to lean or fall.\n\n"
            "**Early Non-Motor Warning Signs:**\n"
            "• Loss of sense of smell (hyposmia) years before tremors appear\n"
            "• REM sleep behavior disorder (acting out vivid dreams)\n"
            "• Micrographia (handwriting becoming unusually small and cramped)\n\n"
            "*Our Finger Tapping Test assesses fine motor pacing and rhythm variability, which can reflect basal ganglia coordination.*"
        ),
        "content_ta": (
            "**பார்கின்சன் நோய் (Parkinson's Disease)** என்பது மூளையின் அடி நரம்பு மண்டலத்தில் (Substantia Nigra) டோபமைன் நரம்பு செல்கள் குறைவதால் ஏற்படும் இயக்கக் குறைபாடாகும்.\n\n"
            "**முக்கிய அறிகுறிகள்:**\n"
            "• கைகள் அல்லது கால்களில் ஓய்வு நேரத்தில் ஏற்படும் நடுக்கம்\n"
            "• தசைகளின் விறைப்புத் தன்மை (Stiffness)\n"
            "• அசைவுகளில் மந்தம் (Bradykinesia) மற்றும் நடை வேகம் குறைதல்\n"
            "• சமநிலையின்மை மற்றும் உடலின் நிலைத்தன்மை தடுமாறுதல்\n\n"
            "**முந்தைய எச்சரிக்கை அறிகுறிகள்:** வாசனை உணர்வு குறைதல், தூக்கத்தில் கை கால்களை ஆட்டுவது, கையெழுத்து மிகவும் சிறிதாக மாறுவது.\n\n"
            "நியூரோசென்ஸின் 'விரல் தட்டுதல் சோதனை' (Finger Tapping Test) இயக்க வேகம் மற்றும் தாள ஒழுங்கைக் கண்காணிக்க உதவுகிறது."
        )
    },
    "mci": {
        "keywords": ["mci", "mild cognitive impairment", "forgetful", "brain fog", "லேசான அறிவாற்றல் குறைபாடு"],
        "title": "Mild Cognitive Impairment (MCI)",
        "content_en": (
            "**Mild Cognitive Impairment (MCI)** represents an intermediate transitional stage between the cognitive "
            "changes of normal healthy aging and the more pronounced deficits of dementia.\n\n"
            "**Key Characteristics:**\n"
            "• Measurable objective decline in one or more cognitive domains (memory, executive function, language, attention).\n"
            "• **Critical Distinction:** Daily functional independence is preserved. An individual with MCI can still manage shopping, finances, medication, and self-care, though tasks may take greater mental effort.\n"
            "• Early detection is crucial: some people with MCI stabilize or even revert to normal with lifestyle optimization and medical management."
        ),
        "content_ta": (
            "**லேசான அறிவாற்றல் குறைபாடு (MCI):**\n"
            "இது இயல்பான முதுமை மாற்றங்களுக்கும், தீவிர மறதி நிலைக்கும் (Dementia) இடைப்பட்ட ஒரு நிலையாகும்.\n\n"
            "**முக்கிய அம்சங்கள்:**\n"
            "• நினைவாற்றல் அல்லது முடிவெடுக்கும் திறனில் லேசான குறைவு ஏற்படுதல்.\n"
            "• இருப்பினும், அன்றாட வேலைகள், வங்கிப் பணிகள், மருந்துகள் உட்கொள்ளுதல் போன்றவற்றை சுயாதீனமாக செய்ய முடியும்.\n"
            "• ஆரம்பத்திலேயே கண்டறிந்து ஆரோக்கியமான வாழ்க்கை முறையைக் கடைப்பிடித்தால் இந்த நிலையை சீரமைக்க முடியும்."
        )
    }
}

def generate_ai_response(user_message: str, user_context: Dict[str, Any] = None, language: str = "en") -> Dict[str, Any]:
    """
    Generate an intelligent, medically cautious, empathetic response to user inquiries.
    """
    msg_lower = user_message.lower().strip()
    lang = "ta" if language == "ta" or any("\u0b80" <= c <= "\u0bff" for c in user_message) else "en"

    # 1. Check for stroke emergency
    for kw in STROKE_KEYWORDS:
        if kw in msg_lower:
            return {
                "message": STROKE_EMERGENCY_RESPONSE[lang],
                "is_emergency": True,
                "suggested_actions": ["Call Emergency Services (108 / 112 / 911)", "View F.A.S.T. Guide", "Find Nearest Hospital"]
            }

    # 2. Check for test result explanation requests
    if any(k in msg_lower for k in ["my score", "my result", "test results", "how did i do", "என்னுடைய மதிப்பெண்", "மதிப்பெண்"]):
        recent_score = user_context.get("overall_score", 76.0) if user_context else 76.0
        if lang == "ta":
            resp = (
                f"உங்கள் அண்மைப் பரிசோதனை அறிக்கை: ஒட்டுமொத்த அறிவாற்றல் மதிப்பீடு **{recent_score}/100**.\n\n"
                "• இந்த மதிப்பெண் டிஜிட்டல் சோதனைகளில் உங்கள் நினைவாற்றல், எதிர்வினை வேகம் மற்றும் இயக்க ஒருங்கிணைப்பைக் காட்டுகிறது.\n"
                "• **நினைவில் கொள்க:** இது ஒரு நோயறிதல் அல்ல. தூக்கமின்மை, உடல் சோர்வு அல்லது கவனச்சிதறல் போன்ற காரணங்களாலும் மதிப்பெண்கள் மாறுபடலாம்.\n"
                "• உங்கள் மூளை ஆரோக்கியத்தைப் பேண தினமும் 7-8 மணிநேர ஆழ்ந்த தூக்கம் மற்றும் 30 நிமிட உடற்பயிற்சி அவசியம்."
            )
        else:
            resp = (
                f"Based on your recent assessment, your overall Composite Brain Health Index is **{recent_score}/100**.\n\n"
                "• **What this indicates:** This composite reflects your performance across memory recall, reaction latency, attention filtering, and motor rhythm.\n"
                "• **Important context:** Digital tests capture functional snapshots. Temporary factors such as sleep deprivation, ambient noise, or physical fatigue can influence test latency.\n"
                "• **Actionable advice:** Retesting at the same time of day under quiet conditions provides the most reliable longitudinal trend. Review the domain radar chart on your dashboard for specific lobe breakdowns."
            )
        return {
            "message": resp,
            "is_emergency": False,
            "suggested_actions": ["View Dashboard Charts", "Download Screening PDF", "Explore Cognitive Modules"]
        }

    # 3. Check for specific disorder questions
    for d_key, d_data in DISORDER_KNOWLEDGE_BASE.items():
        if any(kw in msg_lower for kw in d_data["keywords"]):
            resp = d_data["content_ta"] if lang == "ta" else d_data["content_en"]
            return {
                "message": resp,
                "is_emergency": False,
                "suggested_actions": ["Read Full Educational Guide", "Take Screening Test", "Doctor Discussion Checklist"]
            }

    # 4. Lifestyle & Brain Health tips
    if any(k in msg_lower for k in ["sleep", "diet", "food", "exercise", "lifestyle", "prevention", "உணவு", "தூக்கம்"]):
        if lang == "ta":
            resp = (
                "**மூளை ஆரோக்கியத்திற்கான முக்கிய 4 தூண்கள்:**\n\n"
                "1. **ஆழ்ந்த தூக்கம்:** தூக்கத்தின் போது மூளையில் உள்ள கிளிம்பேடிக் அமைப்பு (Glymphatic system) நச்சுப் புரதங்களை வெளியேற்றுகிறது.\n"
                "2. **மத்திய தரைக்கடல் உணவு முறை (MIND Diet):** கீரைகள், நட்ஸ், பெர்ரி பழங்கள் மற்றும் ஆலிவ் எண்ணெய் மூளை செல்களைப் பாதுகாக்கின்றன.\n"
                "3. **ஏரோபிக் உடற்பயிற்சி:** வாரத்திற்கு 150 நிமிடங்கள் நடைபயிற்சி செய்வது மூளையின் ஹிப்போகாம்பஸ் பகுதியை சுறுசுறுப்பாக வைக்கிறது.\n"
                "4. **தொடர் கற்றல்:** புதிய மொழிகள் அல்லது இசைக்கருவிகளைக் கற்றுக்கொள்வது புதிய நரம்பு இணைப்புகளை உருவாக்குகிறது."
            )
        else:
            resp = (
                "**The 4 Pillars of Long-Term Brain Health & Cognitive Resilience:**\n\n"
                "1. **Restorative Sleep:** During stage 3 slow-wave sleep, the brain's glymphatic system expands, flushing out metabolic byproducts like amyloid-beta.\n"
                "2. **Cardiovascular Aerobic Activity:** 150 minutes per week of brisk walking or swimming stimulates BDNF (Brain-Derived Neurotrophic Factor) to support hippocampal neurogenesis.\n"
                "3. **MIND & Mediterranean Nutrition:** Prioritize dark leafy greens, blueberries, walnuts, olive oil, and wild fatty fish rich in DHA/EPA.\n"
                "4. **Cognitive Reserve & Social Connection:** Novel cognitive stimulation builds synaptic redundancy, helping preserve function against age-related changes."
            )
        return {
            "message": resp,
            "is_emergency": False,
            "suggested_actions": ["Open Lifestyle Tracker", "Start Memory Test", "Questions for Your Neurologist"]
        }

    # 5. General helpful conversational response with medical safety reminder
    if lang == "ta":
        default_resp = (
            "வணக்கம்! நான் **NeuroSense AI நரம்பியல் ஆரோக்கிய உதவியாளர்**.\n\n"
            "நான் உங்களுக்கு உதவக்கூடிய பகுதிகள்:\n"
            "• அல்சைமர், பார்கின்சன் மற்றும் நினைவாற்றல் குறைபாடுகள் பற்றிய அறிவியல் விளக்கங்கள்\n"
            "• உங்கள் 8 அறிவாற்றல் சோதனைகளின் முடிவுகளைப் புரிந்துகொள்ளுதல்\n"
            "• மூளை ஆரோக்கியத்திற்கான தூக்கம், உணவு மற்றும் உடற்பயிற்சி ஆலோசனைகள்\n"
            "• மருத்துவரிடம் விவாதிக்க வேண்டிய குறிப்புகளைத் தயாரித்தல்\n\n"
            "*கவனிக்க: நான் ஒரு மருத்துவ வழிகாட்டி மட்டுமே, மருத்துவர் அல்ல. உங்களுக்கு ஏதேனும் சந்தேகங்கள் இருந்தால் மருத்துவரிடம் ஆலோசனை பெறவும்.*"
        )
    else:
        default_resp = (
            "Hello! I am **NeuroSense AI**, your brain health and neurological wellness assistant.\n\n"
            "I can assist you with:\n"
            "• Understanding early warning signs of Alzheimer's, Parkinson's, and Mild Cognitive Impairment\n"
            "• Explaining what each of our 8 cognitive screening tests measures in the brain\n"
            "• Interpreting your performance trends without diagnostic labels\n"
            "• Evidence-based lifestyle habits for neuroprotection and sleep hygiene\n"
            "• Preparing structured questions for a consultation with a neurologist\n\n"
            "*Reminder: NeuroSense is an educational Design Thinking screening platform. I do not provide clinical diagnoses or replace professional medical care.*"
        )

    return {
        "message": default_resp,
        "is_emergency": False,
        "suggested_actions": [
            "What causes Alzheimer's?",
            "What is the F.A.S.T. stroke test?",
            "How does the Finger Tapping test work?",
            "Tips for improving sleep and memory"
        ]
    }
