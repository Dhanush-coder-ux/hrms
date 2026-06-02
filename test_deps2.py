import sys
import os

sys.path.insert(0, '/home/partheepan/Desktop/HRMS/HRMS_Backend')

from database import SessionLocal
import module.DepartmentDB as DepartmentDB
import module.EmplyeeDB as EmplyeeDB
import module.PayrollDB as PayrollDB
import module.CandidateDB as CandidateDB
import module.RequirementDB as RequirementDB
import module.ATSScoreDB as ATSScoreDB
from routers.Department import get_departments
import traceback

db = SessionLocal()
try:
    deps = get_departments(db)
    print("SUCCESS")
except Exception as e:
    print("FAILED")
    traceback.print_exc()
finally:
    db.close()
