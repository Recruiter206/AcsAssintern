
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Failed to connect to database:', err.message);
  else {
    console.log('Connected to SQLite database.');
    db.run("PRAGMA encoding = 'UTF-8'"); 
  }
});



// USERS TABLE
db.run(`CREATE TABLE IF NOT EXISTS USERS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin','employee')) NOT NULL
)`);

// ---------------- TASKS TABLE ----------------
db.run(`
  CREATE TABLE IF NOT EXISTS TASKS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---------------- TASK_ASSIGNMENTS TABLE ----------------
db.run(`
  CREATE TABLE IF NOT EXISTS TASK_ASSIGNMENTS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed')),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES TASKS(id),
    FOREIGN KEY(employee_id) REFERENCES USERS(id)
  )
`);

// ---------------- SUBTASKS TABLE ----------------
db.run(`
  CREATE TABLE IF NOT EXISTS SUBTASKS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    employee_id INTEGER,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed')),
    employee_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES TASKS(id),
    FOREIGN KEY(employee_id) REFERENCES USERS(id)
  )
`);

// ---------------- ATTENDANCE TABLE ----------------
db.run(`
  CREATE TABLE IF NOT EXISTS ATTENDANCE (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    check_in TEXT,
    check_out TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES USERS(id)
  )
`);



// Corrected admin_employee_chat TABLE

db.run(`CREATE TABLE IF NOT EXISTS admin_employee_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_status TEXT DEFAULT 'unread' CHECK(read_status IN ('unread','read')),
    FOREIGN KEY(admin_id) REFERENCES USERS(id),
    FOREIGN KEY(employee_id) REFERENCES USERS(id),
    FOREIGN KEY(sender_id) REFERENCES USERS(id)
)`);

// Corrected chat_attachments TABLE
db.run(`CREATE TABLE IF NOT EXISTS chat_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT, 
    file_type TEXT,
    file_size INTEGER,
    FOREIGN KEY(chat_id) REFERENCES admin_employee_chat(id) ON DELETE CASCADE
)`);


module.exports = db;