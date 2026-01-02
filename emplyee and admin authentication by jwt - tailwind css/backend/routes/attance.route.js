
const express = require("express");
const {
  markAttendance,
  getAttendance,
  updateAttendanceStatus,
  getAllAttendance
} = require('../controllers/attendanceController.js');

const auth = require('../Middleware/auth.middleware.js');
const role = require('../Middleware/role.middleware.js');

const router = express.Router();

// ---------------- ADMIN ROUTES ----------------
router.put('/update-status/:attendance_id', auth, role("admin"), updateAttendanceStatus);
router.get('/all', auth, role("admin"), getAllAttendance);

// ---------------- EMPLOYEE ROUTES ----------------
router.post('/mark', auth, role("employee"), markAttendance);
router.get('/', auth, role("employee"), getAttendance);

module.exports = router;
