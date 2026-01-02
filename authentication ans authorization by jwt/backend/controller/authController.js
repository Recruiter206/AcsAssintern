const bycrpt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require('dotenv').config();
const { FindUserbyEmail, registerUser } = require('../model/User.js')

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // check exists user
        const exitsUser = await FindUserbyEmail(email)
        if (exitsUser) return res.status(400).json({ message: 'user already exists please use other email id' })
        // pass word ko hash me convert
        const hashpassword = await bycrpt.hash(password, 10)
        // create user
        const user = await registerUser(username, email, hashpassword)

        res.status(200).json({ user })



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await FindUserbyEmail(email)
        if (!user) return res.status(500).json({ message: "incorrect  email" })
        const isMatch = await bycrpt.compare(password, user.password)
        if (!isMatch) return res.status(500).json({ message: "incorrect password" })
        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {

    }
}
module.exports = { register, login }