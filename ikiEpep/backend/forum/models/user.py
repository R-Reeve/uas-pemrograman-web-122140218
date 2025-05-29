from sqlalchemy import Column, Integer, String
from .meta import Base
import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)  # Changed from 'password' to 'password_hash'

    def check_password(self, password):
        """Check if provided password matches the stored hash"""
        if isinstance(password, str):
            password = password.encode('utf-8')
        if isinstance(self.password_hash, str):
            stored_hash = self.password_hash.encode('utf-8')
        else:
            stored_hash = self.password_hash
        return bcrypt.checkpw(password, stored_hash)