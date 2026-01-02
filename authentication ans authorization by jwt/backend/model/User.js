const db=require('../config/db.js')
const bycrpt=require('bcryptjs')

// find user by email
const FindUserbyEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.get('select * from users where email=?',[email],(err,result)=>{
            if(err) reject(err);
            else resolve(result)
        })
    })
}
//Register a new user
const registerUser=(username,email,password)=>{
    return new Promise((resolve,reject)=>{
        const stm= db.prepare('insert  into users (username,email,password) VALUES (?,?,?)')
        stm.run(username,email,password,function(err,result){
            if (err) reject(err);
            else resolve({id:this.lastID,username,email,password})

        })
    })
}

module.exports={FindUserbyEmail,registerUser}