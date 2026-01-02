const authorizerole = (role) => {

    return (req, res, next) => {
        if (req.user.role !== role) return res.status(401).json("invalide role")
        next()
    }

}

module.exports=authorizerole