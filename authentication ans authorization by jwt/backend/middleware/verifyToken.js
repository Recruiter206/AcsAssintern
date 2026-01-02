// const jwt=require('jsonwebtoken')

// const vrifyToken=(req,res,next)=>{
//     const authHeaders=req.headers['authorization']
//    const token = authHeaders && authHeaders.split(' ')[1]

//     if(!token) return res.status(401).json({message:"no token is provided"})

// try {
//     const decode=jwt.verify(token,process.env.JWT_SECRET);
//     req.user=decode
//     next()
// } catch (error) {
//     res.status(403).json({message:'invalid token expire'})
// }

// }
// module.exports = vrifyToken;

const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user id to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
