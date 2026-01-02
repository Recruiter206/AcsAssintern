// const db = require('../config/db.js'); // your SQLite DB

// // ---------------- MARK ATTENDANCE ----------------
// const markAttendance = (req, res) => {
//   const { employee_id, date, check_in } = req.body;

//   if (!employee_id || !date || !check_in) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   const query = `INSERT INTO ATTENDANCE (employee_id, date, check_in, status) VALUES (?, ?, ?, 'pending')`;
//   db.run(query, [employee_id, date, check_in], function(err) {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Failed to mark attendance" });
//     }
//     res.json({ success: true, attendance_id: this.lastID });
//   });
// };

// // ---------------- GET ATTENDANCE ----------------
// // Employee fetches their own attendance
// const getAttendance = (req, res) => {
//   const employeeId = req.user.id;

//   const query = `
//     SELECT attendance_id, date, check_in, check_out, status
//     FROM ATTENDANCE
//     WHERE employee_id = ?
//     ORDER BY date DESC
//   `;
  
//   db.all(query, [employeeId], (err, rows) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     res.json({
//       success: true,
//       data: rows
//     });
//   });
// };


// // Admin updates attendance status
// const updateAttendanceStatus = (req, res) => {
//   const { attendance_id } = req.params; // attendance id in URL
//   const { status } = req.body;

//   const validStatus = ["approved", "rejected"];
//   if (!validStatus.includes(status.toLowerCase())) {
//     return res.status(400).json({ success: false, message: "Invalid status" });
//   }

//   const query = `UPDATE ATTENDANCE SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE attendance_id = ?`;
//   db.run(query, [status.toLowerCase(), attendance_id], function(err) {
//     if (err) return res.status(500).json({ success: false, message: "Failed to update status" });

//     res.json({ success: true, message: "Status updated successfully" });
//   });
// };

// const getAllAttendance = (req, res) => {
//   const { date } = req.query; // e.g., /attendance/all?date=2025-12-30
//   if (!date) return res.status(400).json({ success: false, message: "Date is required" });

//   const query = `
//     SELECT a.attendance_id, a.employee_id, u.name as employee_name, a.check_in, a.check_out, a.status
//     FROM ATTENDANCE a
//     JOIN USERS u ON a.employee_id = u.id
//     WHERE a.date = ?
//     ORDER BY u.name ASC
//   `;

//   db.all(query, [date], (err, rows) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     // Count total present employees
//     const totalPresent = rows.filter(r => r.status === "approved").length;

//     res.json({
//       success: true,
//       date,
//       total_present: totalPresent,
//       attendance: rows
//     });
//   });
// };
// module.exports = {
//   markAttendance,
//   getAttendance,
//   updateAttendanceStatus,getAllAttendance
// };
const db = require('../config/db.js'); // SQLite DB

// ---------------- MARK ATTENDANCE ----------------
const markAttendance = (req, res) => {
  const employee_id = req.user.id; // from token
  const { date, check_in } = req.body;

  if (!date || !check_in) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const query = `
    INSERT INTO ATTENDANCE (employee_id, date, check_in, status)
    VALUES (?, ?, ?, 'pending')
  `;
  db.run(query, [employee_id, date, check_in], function(err) {
    if (err) return res.status(500).json({ success: false, message: "Failed to mark attendance" });

    res.json({ success: true, attendance_id: this.lastID, status: "pending" });
  });
};

// ---------------- GET EMPLOYEE ATTENDANCE ----------------
const getAttendance = (req, res) => {
  const employee_id = req.user.id;

  const query = `
    SELECT attendance_id, date, check_in, check_out, status
    FROM ATTENDANCE
    WHERE employee_id = ?
    ORDER BY date DESC
  `;
  db.all(query, [employee_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    res.json({ success: true, data: rows });
  });
};

// ---------------- UPDATE ATTENDANCE STATUS ----------------
// Admin approves or rejects attendance
const updateAttendanceStatus = (req, res) => {
  const { attendance_id } = req.params;
  const { status } = req.body;

  const validStatus = ["approved", "rejected"];
  if (!validStatus.includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const query = `
    UPDATE ATTENDANCE
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE attendance_id = ?
  `;
  db.run(query, [status.toLowerCase(), attendance_id], function(err) {
    if (err) return res.status(500).json({ success: false, message: "Failed to update status" });

    res.json({ success: true, message: "Status updated successfully" });
  });
};

// ---------------- GET ALL ATTENDANCE FOR ADMIN ----------------
const getAllAttendance = (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: "Date is required" });

  const query = `
    SELECT a.attendance_id, a.employee_id, u.name AS employee_name, a.check_in, a.check_out, a.status
    FROM ATTENDANCE a
    JOIN USERS u ON a.employee_id = u.id
    WHERE a.date = ?
    ORDER BY u.name ASC
  `;
  db.all(query, [date], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    const total_present = rows.filter(r => r.status === "approved").length;

    res.json({
      success: true,
      date,
      total_present,
      attendance: rows
    });
  });
};

module.exports = {
  markAttendance,
  getAttendance,
  updateAttendanceStatus,
  getAllAttendance
};
