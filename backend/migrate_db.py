import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/kelana_ai")

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        print("Checking if 'currency' column exists...")
        conn.execute(text("ALTER TABLE trips ADD COLUMN currency VARCHAR NOT NULL DEFAULT 'USD'"))
        conn.commit()
        print("Success! The 'currency' column has been added to your database.")
except Exception as e:
    print("Notice (Safe to ignore if column already exists):", e)
