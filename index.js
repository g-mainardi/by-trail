const express = require('express');
const mongoose = require('mongoose');
const {User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify } = require('./server/src/models/models');

const app = express();
app.use(express.json());

// Env var injected from Docker Compose
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Connection to MongoDB failed: ', error));

app.listen(3000, () => {
    console.log('Server listening at: http://localhost:3000/');
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
