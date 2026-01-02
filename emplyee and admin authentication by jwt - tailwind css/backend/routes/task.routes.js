

const express = require("express");
const {
    createTaskAndAssign,
    addSubtask,
    getEmployeeTasks,
    updateSubtask,
    getTaskDetails,
    getTaskSummaryForAdmin,getAllAssignedTasksForAdmin
} = require('../controllers/task.controller.js');

const auth = require('../Middleware/auth.middleware.js');
const role = require('../Middleware/role.middleware.js');

const router = express.Router();

// --------------------- ADMIN ROUTES ---------------------
router.post('/assign', auth, role("admin"), createTaskAndAssign);        // create + assign task
router.get('/task/:id', auth, role("admin"), getTaskDetails);          // task + employees + subtasks
router.get('/status', auth, role("admin"), getTaskSummaryForAdmin);    // task summary (completed / in-progress / pending)
router.get('/all', auth, role("admin"), getAllAssignedTasksForAdmin);
// --------------------- EMPLOYEE ROUTES ---------------------
router.get('/my-tasks', auth, role("employee"), getEmployeeTasks);     // employee tasks
router.post('/subtask', auth, role("employee"), addSubtask);           // create subtask
router.put('/subtask/:id', auth, role("employee"), updateSubtask);    // update status + description

module.exports = router;
