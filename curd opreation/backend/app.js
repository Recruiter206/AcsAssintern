const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());

app.use(express.json()); // parse JSON body

app.use('/api', userRoutes);

module.exports = app;
