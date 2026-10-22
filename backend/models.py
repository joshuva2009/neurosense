from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    is_guest = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("AssessmentSession", back_populates="user", cascade="all, delete-orphan")
    test_results = relationship("TestResult", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    sleep_hours = Column(Float, nullable=True)
    physical_activity_level = Column(String(50), nullable=True) # sedentary, moderate, active
    family_history_neurological = Column(Boolean, default=False)
    chronic_conditions = Column(String(255), nullable=True)
    consent_given = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_code = Column(String(50), unique=True, index=True, nullable=False)
    status = Column(String(20), default="in_progress") # in_progress, completed
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    overall_score = Column(Float, nullable=True)
    is_simulated = Column(Boolean, default=False)
    summary_feedback = Column(Text, nullable=True)

    user = relationship("User", back_populates="sessions")
    test_results = relationship("TestResult", back_populates="session", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("assessment_sessions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_type = Column(String(50), nullable=False) # memory_recall, reaction_time, attention, cognitive_flexibility, finger_tapping, visual_recognition, language_fluency, problem_solving
    raw_score = Column(Float, nullable=False)
    normalized_score = Column(Float, nullable=False) # 0 to 100
    accuracy = Column(Float, nullable=True) # percentage
    reaction_time_ms = Column(Float, nullable=True)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("AssessmentSession", back_populates="test_results")
    user = relationship("User", back_populates="test_results")
