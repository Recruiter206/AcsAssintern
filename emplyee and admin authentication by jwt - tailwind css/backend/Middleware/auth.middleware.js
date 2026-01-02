const jwt=require('jsonwebtoken')

const authMiddleware=(req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) return res.status(400).json({message:'token is not provide'})
        try {
           const decode=jwt.verify(token,process.env.JWT_SECRET) 
           req.user=decode;
           next()
        } catch (error) {
            console.log("JWT ERROR:", error.message);
            res.status(401).json({message:'invalid token'})
        }
}
module.exports=authMiddleware