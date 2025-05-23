from sqlalchemy import Column, Integer, String
from forum.models.meta import Base
# from passlib.hash import bcrypt

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(25), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    password = Column(String(25), nullable=False)
