const express=require('express')
const router=express.Router()

const {getUser,createUser,updateUser,deleteUser,getSingleUser}=require('../controllers/userController')

router.get('/users',getUser)
router.post('/create',createUser)
router.put('/update/:id',updateUser)
router.delete('/delete/:id',deleteUser)
router.get('/user/:id',getSingleUser)

module.exports =router