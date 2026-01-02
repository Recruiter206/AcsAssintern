const express=require('express')

const cors = require('cors');
require("dotenv").config();
const auth=require('./routes/auth.routes.js')
const task=require('./routes/task.routes.js')
const attanceroute=require('./routes/attance.route.js')
const chatconversion=require('./routes/chat.routes.js')
const app=express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api", auth);
app.use("/api/task", task);
app.use('/api/attantance',attanceroute)
app.use('/api/chat',chatconversion)



module.exports = app;