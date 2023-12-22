require('dotenv').config();

const cors = require('cors'); 
const express = require ('express');
const mongoose = require ('mongoose');
const clientinfoRoutes = require('./routes/clientinfo');
const userRoutes = require('./routes/user');
const pwRoutes = require('./routes/pwreset');
const path = require('path');

// express app
const app = express();

// middleware
app.use(express.json())
app.use(cors());


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

// routes
app.use('/api/info', clientinfoRoutes);
app.use('/api/user', userRoutes);
app.use('/api/', pwRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Handle React Router routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for request
            app.listen(process.env.PORT,() => {
                console.log(' connected to db & listening on port', process.env.PORT)
            });
    })
    .catch((error) => {
        console.log(error)
    });

