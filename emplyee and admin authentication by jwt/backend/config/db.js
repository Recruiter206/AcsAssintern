const sqlite3=require('sqlite3').verbose()

// Create or open database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});
db.run(`CREATE TABLE IF NOT EXISTS USERS(
    
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT

    
    )`)

    module.exports=db;