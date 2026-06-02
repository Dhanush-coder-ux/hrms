import sys
import os

sys.path.insert(0, '/home/partheepan/Desktop/HRMS/HRMS_Backend')

from database import SessionLocal
from sqlalchemy import func
import module.DepartmentDB as DepartmentDB
import module.EmplyeeDB as EmplyeeDB

db = SessionLocal()
results = (
    db.query(
        DepartmentDB.Department,
        func.count(EmplyeeDB.Employee.Emp_id).label("total_count")
    )
    .outerjoin(
        EmplyeeDB.Employee,
        func.trim(DepartmentDB.Department.Dep_name) == func.trim(EmplyeeDB.Employee.Department)
    )
    .group_by(
        DepartmentDB.Department.Dep_id,
        DepartmentDB.Department.Dep_name,
        DepartmentDB.Department.Dep_head,
        DepartmentDB.Department.Dep_icon,
        DepartmentDB.Department.bg_color,
        DepartmentDB.Department.icon_color,
    )
    .all()
)
print("RESULTS:", results)
for r in results:
    print(r)
