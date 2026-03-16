import fs from "fs";

const employees = [
  "Arun",
  "Kumar",
  "Priya",
  "Rajesh",
  "Divya",
  "Suresh",
  "Anitha"
];

const statuses = ["Present", "Late", "Absent", "Leave"];

const startDate = new Date("2026-02-15");
const days = 30;

let attendance = [];
let id = 1;

for (let i = 0; i < days; i++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);

  const dateStr = date.toISOString().split("T")[0];

  employees.forEach(emp => {

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    let checkIn = null;
    let checkOut = null;

    if (status === "Present") {
      checkIn = "09:05";
      checkOut = "18:00";
    }

    if (status === "Late") {
      checkIn = "09:25";
      checkOut = "18:10";
    }

    attendance.push({
      id: id++,
      employee_name: emp,
      attendance_date: dateStr,
      check_in: checkIn,
      check_out: checkOut,
      status: status
    });

  });
}

const db = { attendance };

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("✅ db.json generated with", attendance.length, "records");
