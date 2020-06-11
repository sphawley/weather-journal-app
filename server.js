// Setup empty JS object to act as endpoint for all routes
let projectData = [];
const MAX_PROJECT_DATA_LENGTH = 20;

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 8080;
const listening = () => console.log(`listening on port: ${port}`);
app.listen(port, listening);

// Callback function to complete GET '/all'
const sendData = (request, response) => {
  response.send(projectData);
};

// Initialize all route with a callback function
app.get('/all', sendData);

// Initialize add route with a callback function
const addEntry = (request, response) => {
  projectData.push(request.body);
  response.send({ response: 'Entry saved.' });
  if (projectData.length > MAX_PROJECT_DATA_LENGTH) {
    projectData = projectData.slice(projectData.length - MAX_PROJECT_DATA_LENGTH);
  }
};

// Post Route
app.post('/add', addEntry);

// Jest example
const sum = (a, b) => {
  return a + b;
};
module.exports = sum;
