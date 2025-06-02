from sqlalchemy import Column, Integer, String
from .meta import Base
import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # store hashed password in production

    @staticmethod
    def hash_password(password: str) -> str:
        # Hash the password with bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'),salt)
        return hashed.decode('utf-8')
    def verify_password(self, password: str) -> bool:
        # Verify the password with bcrypt
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))
