// that is by sqlite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Direct DB file path
const dbPath = path.join(__dirname, '../database');

// Connect to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("SQLite connection failed:", err.message);
    } else {
        console.log("SQLite connected");
    }
});

// Create table automatically
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`);

module.exports = db;



// this by mongodb
// const mongoose=require('mongoose')
// require('dotenv').config();

// const connectDb=async()=>{
//     try {
//         await mongoose.connect(process.env.MONGO_URI,{
//              useNewUrlParser: true,
//             useUnifiedTopology: true,

//         })
//         console.log("MongoDB Connected");
//     } catch (error) {
//         console.error("db connection is failed",error.message);
//         process.exit(1)
//     }
// }

// module.exports=connectDb