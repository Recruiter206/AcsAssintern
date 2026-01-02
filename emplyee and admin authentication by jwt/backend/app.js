const express=require('express')

const cors = require('cors');
require("dotenv").config();
const auth=require('./routes/auth.routes.js')

const app=express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api", auth);

module.exports = app;