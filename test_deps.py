import sys
import traceback
import os

# Add HRMS_Backend to path
sys.path.insert(0, '/home/partheepan/Desktop/HRMS/HRMS_Backend')

from database import SessionLocal
from routers.Department import get_departments

db = SessionLocal()
try:
    deps = get_departments(db)
    print("Success")
except Exception as e:
    traceback.print_exc()
finally:
    db.close()
