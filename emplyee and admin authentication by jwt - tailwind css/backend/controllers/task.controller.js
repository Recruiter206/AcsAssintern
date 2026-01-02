
const db = require('../config/db.js');

const getTaskDetails = (req, res) => {
    const taskId = req.params.id;
    db.get(`SELECT * FROM TASKS WHERE id = ?`, [taskId], (err, task) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        db.all(`SELECT TA.id AS assignment_id, TA.employee_id, U.name, TA.status 
                FROM TASK_ASSIGNMENTS TA
                JOIN USERS U ON TA.employee_id = U.id
                WHERE TA.task_id = ?`, [taskId], (err, assignments) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.all(`SELECT * FROM SUBTASKS WHERE task_id = ?`, [taskId], (err, subtasks) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                res.json({ success: true, task, assignments, subtasks });
            });
        });
    });
};


// ---------------- CREATE TASK AND ASSIGN TO MULTIPLE EMPLOYEES ----------------


const createTaskAndAssign = (req, res) => {
    const { title, description, start_date, end_date, employee_ids } = req.body;

    if (!title || !employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Title and employee_ids are required' });
    }

    const insertTaskSql = `INSERT INTO TASKS (title, description, start_date, end_date) VALUES (?, ?, ?, ?)`;
    db.run(insertTaskSql, [title, description, start_date || null, end_date || null], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const taskId = this.lastID;

        const placeholders = employee_ids.map(() => '(?, ?, ?)').join(', ');
        const values = employee_ids.flatMap(id => [taskId, id, 'pending']);

        const assignSql = `INSERT INTO TASK_ASSIGNMENTS (task_id, employee_id, status) VALUES ${placeholders}`;
        db.run(assignSql, values, function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, message: 'Task created and assigned successfully', task_id: taskId });
        });
    });
};

// ---------------- ADD SUBTASK ----------------
const addSubtask = (req, res) => {
    const { task_id, title, employee_id } = req.body;

    if (!task_id || !title || !employee_id) {
        return res.status(400).json({ success: false, message: 'Task ID, subtask title, and employee_id are required' });
    }

    const checkAssignmentSql = `SELECT * FROM TASK_ASSIGNMENTS WHERE task_id = ? AND employee_id = ?`;
    db.get(checkAssignmentSql, [task_id, employee_id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(400).json({ success: false, message: 'Employee not assigned to this task' });

        const sql = `INSERT INTO SUBTASKS (task_id, employee_id, title, status) VALUES (?, ?, ?, 'pending')`;
        db.run(sql, [task_id, employee_id, title], function(err) {
            if (err) return res.status(500).json({ success: false, message: 'Failed to add subtask' });

            res.status(201).json({
                success: true,
                message: 'Subtask added successfully',
                subtask: { id: this.lastID, task_id, title, employee_id, status: 'pending' }
            });
        });
    });
};

// ---------------- UPDATE SUBTASK STATUS ----------------
const updateSubtask = (req, res) => {
    const subtask_id = req.params.id;
    const employeeId = req.user.id;
    const { status, employee_description } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status required' });

    const normalizedStatus = status.toLowerCase();
    const sql = `
        UPDATE SUBTASKS
        SET status = ?, employee_description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND employee_id = ?
    `;

    db.run(sql, [normalizedStatus, employee_description || '', subtask_id, employeeId], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Subtask not found or not yours' });

        // Update TASK_ASSIGNMENTS status for this employee only
        db.get(`SELECT task_id FROM SUBTASKS WHERE id = ?`, [subtask_id], (err, row) => {
            if (err || !row) return;
            const task_id = row.task_id;

            db.get(
                `SELECT COUNT(*) AS pending_count
                 FROM SUBTASKS
                 WHERE task_id = ? AND employee_id = ? AND status != 'completed'`,
                [task_id, employeeId],
                (err, result) => {
                    if (!err && result.pending_count === 0) {
                        db.run(`UPDATE TASK_ASSIGNMENTS SET status = 'completed' WHERE task_id = ? AND employee_id = ?`, [task_id, employeeId]);
                    }
                }
            );
        });

        res.json({
            success: true,
            message: 'Subtask updated successfully',
            subtask: { id: subtask_id, status: normalizedStatus, employee_description: employee_description || '' }
        });
    });
};

// ---------------- GET TASKS FOR EMPLOYEE ----------------
const getEmployeeTasks = (req, res) => {
    const employeeId = req.user.id;
    const sql = `
        SELECT T.id AS task_id, T.title, T.description, T.start_date, T.end_date,
               S.id AS subtask_id, S.title AS subtask_title, S.status AS subtask_status, S.employee_description
        FROM TASK_ASSIGNMENTS TA
        JOIN TASKS T ON TA.task_id = T.id
        LEFT JOIN SUBTASKS S ON S.task_id = T.id AND S.employee_id = TA.employee_id
        WHERE TA.employee_id = ?
        ORDER BY T.id, S.id
    `;
    db.all(sql, [employeeId], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const tasks = {};
        rows.forEach(row => {
            if (!tasks[row.task_id]) {
                tasks[row.task_id] = {
                    task_id: row.task_id,
                    title: row.title,
                    description: row.description,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    subtasks: []
                };
            }
            if (row.subtask_id) {
                tasks[row.task_id].subtasks.push({
                    subtask_id: row.subtask_id,
                    title: row.subtask_title,
                    status: row.subtask_status,
                    employee_description: row.employee_description || ''
                });
            }
        });

        res.json({ success: true, tasks: Object.values(tasks) });
    });
};

// ---------------- GET TASK SUMMARY (ADMIN) ----------------
const getTaskSummaryForAdmin = (req, res) => {
    const sql = `
        SELECT T.id AS task_id, T.title, T.description, T.start_date, T.end_date,
               TA.employee_id, U.name AS employee_name, TA.status AS employee_status,
               S.id AS subtask_id, S.title AS subtask_title, S.status AS subtask_status, S.employee_description
        FROM TASKS T
        LEFT JOIN TASK_ASSIGNMENTS TA ON TA.task_id = T.id
        LEFT JOIN USERS U ON U.id = TA.employee_id
        LEFT JOIN SUBTASKS S ON S.task_id = T.id AND S.employee_id = TA.employee_id
        ORDER BY T.id, TA.employee_id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const tasks = {};
        rows.forEach(row => {
            if (!tasks[row.task_id]) {
                tasks[row.task_id] = {
                    task_id: row.task_id,
                    title: row.title,
                    description: row.description,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    employees: {}
                };
            }

            if (row.employee_id) {
                if (!tasks[row.task_id].employees[row.employee_id]) {
                    tasks[row.task_id].employees[row.employee_id] = {
                        employee_id: row.employee_id,
                        name: row.employee_name,
                        status: row.employee_status,
                        subtasks: []
                    };
                }
                if (row.subtask_id) {
                    tasks[row.task_id].employees[row.employee_id].subtasks.push({
                        subtask_id: row.subtask_id,
                        title: row.subtask_title,
                        status: row.subtask_status,
                        employee_description: row.employee_description || ''
                    });
                }
            }
        });

        res.json({ success: true, tasks: Object.values(tasks) });
    });
};

// ---------------- GET ALL ASSIGNED TASKS (ADMIN) ----------------
const getAllAssignedTasksForAdmin = (req, res) => {
    const sql = `
        SELECT T.id AS task_id, T.title, T.description, T.start_date, T.end_date,
               TA.employee_id, U.name AS employee_name, TA.status AS employee_status,
               S.id AS subtask_id, S.title AS subtask_title, S.status AS subtask_status, S.employee_description
        FROM TASKS T
        LEFT JOIN TASK_ASSIGNMENTS TA ON TA.task_id = T.id
        LEFT JOIN USERS U ON U.id = TA.employee_id
        LEFT JOIN SUBTASKS S ON S.task_id = T.id AND S.employee_id = TA.employee_id
        ORDER BY T.id, TA.employee_id, S.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const tasks = {};
        rows.forEach(row => {
            if (!tasks[row.task_id]) {
                tasks[row.task_id] = {
                    task_id: row.task_id,
                    title: row.title,
                    description: row.description,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    employees: {}
                };
            }

            if (row.employee_id) {
                if (!tasks[row.task_id].employees[row.employee_id]) {
                    tasks[row.task_id].employees[row.employee_id] = {
                        employee_id: row.employee_id,
                        name: row.employee_name,
                        status: row.employee_status,
                        subtasks: []
                    };
                }
                if (row.subtask_id) {
                    tasks[row.task_id].employees[row.employee_id].subtasks.push({
                        subtask_id: row.subtask_id,
                        title: row.subtask_title,
                        status: row.subtask_status,
                        employee_description: row.employee_description || ''
                    });
                }
            }
        });

        res.json({ success: true, tasks: Object.values(tasks) });
    });
};

module.exports = {
    createTaskAndAssign,
    addSubtask,
    updateSubtask,
    getEmployeeTasks,
    getTaskSummaryForAdmin,getTaskDetails ,
    getAllAssignedTasksForAdmin
};
