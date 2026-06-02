import sys
from sqlalchemy import text
sys.path.insert(0, '/home/partheepan/Desktop/HRMS/HRMS_Backend')
from database import SessionLocal
db = SessionLocal()
res = db.execute(text("SELECT * FROM departments")).fetchall()
for r in res:
    print(r)
