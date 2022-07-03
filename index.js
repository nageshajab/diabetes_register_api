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

require('./routes/medicineRoutes')(app);
require('./routes/visitRoutes')(app);
require('./routes/other')(app);
require('./routes/userRoutes')(app);
require('./routes/roleRoutes')(app);
require('./routes/reportRoutes')(app);
require('./routes/reminderRoutes')(app);

//start listening on port
var dt=new Date();
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.clearLogFiles();
  logger.info(`Server is up and running on ${PORT}, ${dt.getHours()}:${dt.getMinutes()}`);
  console.log(`Server is up and running on ${PORT}, ${dt.getHours()}:${dt.getMinutes()}`);
});

process.on('uncaughtException', (err) => {
  console.log('whoops! there was an error');
  console.log(err);
  logger.error(err);
});