import sys
from sqlalchemy import text
sys.path.insert(0, '/home/partheepan/Desktop/HRMS/HRMS_Backend')
from database import SessionLocal
db = SessionLocal()
res = db.execute(text("SELECT departments.\"Dep_id\", departments.\"Dep_name\", count(employees.\"Emp_id\") FROM departments LEFT OUTER JOIN employees ON trim(departments.\"Dep_name\") = trim(employees.\"Department\") GROUP BY departments.\"Dep_id\", departments.\"Dep_name\"")).fetchall()
for r in res:
    print(r)
