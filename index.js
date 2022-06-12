'use strict'

// imports
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
var cors = require('cors');
var logger = require('./logger');

// initialize express app
const app = module.exports = express();
app.use(cors());

// define middlewares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//app.use(middleware.myLogger); will involve middleware for all endpoints

// read environment variables
dotenv.config();

var diabeticRoute = require('./routes/diabeticRoutes');
diabeticRoute(app);
var medicineRoutes = require('./routes/medicineRoutes');
medicineRoutes(app);
require('./routes/other')(app);
require('./routes/userRoutes')(app);

//start listening on port
var dt=new Date();
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.clearLogFiles();
  logger.info(`Server is up and running on ${PORT}, ${dt.getHours()}:${dt.getMinutes()}`);
  console.log(`Server is up and running on ${PORT}, ${dt.getHours()}:${dt.getMinutes()}`);
});