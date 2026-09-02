from database import SessionLocal
from models.user import User
from services.auth_service import hash_password

db = SessionLocal()
email = "test@kelana.ai"
if not db.query(User).filter(User.email == email).first():
    dummy_user = User(
        name="Kelana Tester",
        email=email,
        password_hash=hash_password("password123")
    )
    db.add(dummy_user)
    db.commit()
    print("Dummy user created successfully!")
else:
    print("Dummy user already exists!")
db.close()
