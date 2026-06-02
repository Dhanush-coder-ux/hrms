import sqlite3
conn = sqlite3.connect('/home/partheepan/Desktop/HRMS/HRMS_Backend/hrms.db')
c = conn.cursor()
c.execute("SELECT departments.Dep_id, count(employees.Emp_id) FROM departments LEFT OUTER JOIN employees ON trim(departments.Dep_name) = trim(employees.Department) GROUP BY departments.Dep_id;")
print(c.fetchall())
