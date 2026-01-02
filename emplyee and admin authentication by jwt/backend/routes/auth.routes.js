const express=require('express')
const {register, login,getEmployee,updateEmployee ,getOwndata,deleteEmployee}=require('../controllers/auth.controller.js')
const auth=require('../Middleware/auth.middleware.js')
const role=require('../Middleware/role.middleware.js')

const router=express.Router();
router.post('/register',register);
router.post('/login',login)

// procted route

router.get('/admin',auth,role("admin"),(req,res)=>{
    res.status(200).json({message:"admin allow to access"})
})
 router.get('/employee',auth,role("employee"),(req,res)=>{
res.status(200).json({message:"emplyee allow to access"})
 })

 // Admin routes
router.get('/employees', auth, role("admin"),getEmployee);  // Admin sees all employees
router.put('/employee', auth, role("admin"), updateEmployee);  // Admin updates employee
router.delete('/delete', auth, role("admin"), deleteEmployee);  // Admin updates employee
// Employee route
router.get('/me', auth, role("employee"),getOwndata);  // Employee sees own data

 module.exports=router