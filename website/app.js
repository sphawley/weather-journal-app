/* Global Variables */
const MAX_HISTORY_LIST_LENGTH = 5;

// Personal API Key for OpenWeatherMap API
const apiKey = 'a82da9fd33ad3905f25a5cf58bce890f';
const createWeatherEndpoint = (zipCode) => {
  return `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`;
};

// Create a new date instance dynamically with JS
const getCurrentDateAndTime = () => {
  const d = new Date();
  const newDateAndTime = d.toLocaleString();
  return newDateAndTime;
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error in post. error: ', error);
  }
};

/* Function to GET Project Data */
const getData = async (url = '') => {
  const response = await fetch(url);
  try {
    const data = await response.json();
    if (Object.prototype.hasOwnProperty.call(data, 'cod') && data.cod[0] === '4') {
      alert('Something went wrong.\nDid you enter a valid zipcode?');
    }
    return data;
  } catch (error) {
    console.log('error in get. error: ', error);
  }
};

const kelvinToFahrenheit = (kelvin) => {
  const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
  return fahrenheit;
};

/* Update the history section to contain the latest entries */
const updateHistory = (data) => {
  data = data.slice(0, MAX_HISTORY_LIST_LENGTH);
  const ol = document.createElement('ol');
  ol.className = 'history__list';
  for (const datum of data) {
    const li = document.createElement('li');
    li.className = 'entryHolder';
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    const tempDiv = document.createElement('div');
    tempDiv.className = 'temp';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    dateDiv.innerHTML = datum.date;
    tempDiv.innerHTML = datum.temperature;
    contentDiv.innerHTML = datum.userResponse;
    li.appendChild(dateDiv);
    li.appendChild(tempDiv);
    li.appendChild(contentDiv);
    ol.appendChild(li);
  }
  document.querySelector('.history').removeChild(document.querySelector('.history .history__list'));
  document.querySelector('.history').appendChild(ol);
};

/* update the most recent entry and history */
const updateUI = async () => {
  try {
    const data = await getData('/all');
    if (data.length > 0) {
      document.querySelector('#recentDate').innerHTML = data[data.length - 1].date;
      document.querySelector('#recentTemp').innerHTML = data[data.length - 1].temperature;
      document.querySelector('#recentContent').innerHTML = data[data.length - 1].userResponse;
      updateHistory(data.reverse().slice(1));
    }
    return data;
  } catch (error) {
    console.log('error in updateUI. error: ', error);
  }
};

/* Function called by event listener */
const submitForm = () => {
  if ((document.querySelector('#zip').value !== '') && (document.querySelector('#feelings').value !== '')) {
    getWeatherPostDataUpdateUI();
  } else {
    alert('Zipcode and feelings are required.');
  }
};

/* Function that 
1. gets weather data 
2. posts date, temperature, and user response to the server
3. gets stored entries from the server and updates
the most recent entry and history sections */
const getWeatherPostDataUpdateUI = () => {
  getData(createWeatherEndpoint(document.querySelector('#zip').value)).then((value) => {
    const postPromise = postData(
      '/add',
      {
        temperature: `${kelvinToFahrenheit(value.main.temp).toFixed(1)}°F`,
        date: getCurrentDateAndTime(),
        userResponse: document.querySelector('#feelings').value
      }
    );
    return postPromise;
  }).then(() => {
    updateUI();
  }
  );
};

// Event listener to add function to existing HTML DOM element
document.querySelector('#generate').addEventListener('click', submitForm);

// Update the page with old entries on page load
window.addEventListener('load', () => {
  updateUI();
});
