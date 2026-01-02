const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message)
    else console.log("it is contected db succesfully")
}

)
db.run(`create table  if not exists users(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username  TEXT,
   email TEXT,
   password text


    ) `)
     module.exports=db