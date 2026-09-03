import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from database import init_db
import models.user # Ensure models are imported
import models.trip
import models.conversation

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/kelana_ai")

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        print("Dropping existing tables to apply Session 8 auth migrations...")
        conn.execute(text("DROP TABLE IF EXISTS trips CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        conn.commit()
        print("Success! Tables dropped.")
    
    print("Recreating tables...")
    init_db()
    print("Success! Database migration completed for Session 8.")
except Exception as e:
    print("Migration failed:", e)
