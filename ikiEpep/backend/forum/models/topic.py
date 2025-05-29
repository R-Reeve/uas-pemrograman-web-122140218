# backend/forum/models/topic.py
from sqlalchemy import Column, Integer, String, DateTime
from .meta import Base
from datetime import datetime

class Topic(Base):
    __tablename__ = 'topics'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(String, nullable=False)
    username = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)