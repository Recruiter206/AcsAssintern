const db = require("../db")

// get user 
const getUser = (req, res) => {
    db.all("select * from  users", (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
}

// create
const createUser = (req, res) => {
    const { name } = req.body
    db.run("insert into users (name) values (?)", [name], function (err, result) {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: this.lastID, name })
    })
}

// update by id
const updateUser = (req, res) => {
    const { id } = req.params;
    const { name } = req.body
    db.run('update users set name=? where id=?', [name, id], function (err, result) {
        if (err) return res.status(500).json(err);
        if (this.changes === 0) return res.status(400).json({ message: "user not found" });
        res.json({ id: parseInt(id), name })
    })
}
// delete uset by id
const deleteUser = (req, res) => {
    const { id } = req.params;
    db.run('delete from users where id =?', [id], function (err, result) {
        if (err) return res.status(500).json(err);
        if (this.changes === 0) return res.status(400).json({ message: 'user is not exits' })
        res.json({ message: `user ${id} is delete sucessfully ` })
    })
}

// get single user by id

const getSingleUser=(req,res)=>{
    const {id}=req.params
    db.get("select * from users where id=?",[id],(err,result)=>{
        if(err) return res.status(500).json(err);
        if(! result) return res.status(400).json({message:'user id not exits'})    ;
        res.json(result)
    })
}
module.exports = { getUser, createUser, updateUser, deleteUser,getSingleUser };