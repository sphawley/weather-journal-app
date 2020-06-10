// Setup empty JS object to act as endpoint for all routes
const projectData = [];

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

// Callback to debug
app.get('/test', (request, response) => {
  console.log('received test');
  response.send('working');
});

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
};

// Post Route
app.post('/add', addEntry);

// Jest example
const sum = (a, b) => {
  return a + b;
};
module.exports = sum;
