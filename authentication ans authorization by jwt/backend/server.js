
const express = require('express');
const cors=require('cors')
const authRoutes = require('./routes/authRoutes');
const protrctedRoutes=require('./routes/protectedRoutes.js')

const app = express();
app.use(cors());
const PORT = 5000;

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/auth',protrctedRoutes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
