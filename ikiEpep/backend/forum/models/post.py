from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .meta import Base

class Post(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    topic_id = Column(Integer, ForeignKey('topics.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    topic = relationship("Topic", back_populates="posts")
    author = relationship("User", back_populates="posts")
