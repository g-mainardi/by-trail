const express = require('express');
const mongoose = require('mongoose');
const {User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify } = require('./models');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/trekkingApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Connection to MongoDB failed: ', error));

app.listen(3000, () => {
    console.log('Server listening at: http://localhost:3000/');
});
