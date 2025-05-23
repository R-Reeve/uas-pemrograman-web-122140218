# forum/models/meta.py
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# ⬇️ import semua model agar mereka terdaftar di Base.metadata
# sangat penting! tanpa ini, Alembic tidak akan tahu ada tabel baru
from forum.models import user, post  # sesuaikan dengan nama file model kamu
