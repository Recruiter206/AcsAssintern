const express=require('express')
const vrifyToken=require('../middleware/verifyToken.js')
const router=express.Router()

router.get('/dashboard',vrifyToken,function(req,res){
    res.status(200).json({message:`welcome to my dashboard ${req.user.id} `})
})

module.exports = router;