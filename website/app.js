/* Global Variables */
const MAX_HISTORY_LIST_LENGTH = 5;

// Create a new date instance dynamically with JS
const getCurrentDateAndTime = () => {
  const d = new Date();
  const newDateAndTime = d.toLocaleString();
  return newDateAndTime
}

// Personal API Key for OpenWeatherMap API
const apiKey = 'a82da9fd33ad3905f25a5cf58bce890f';
const createWeatherEndpoint = (zipCode) => {
  return `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`;
};


/* Function to GET Web API Data */
const getCurrentWeatherByZip = (zipCode) => getData(createWeatherEndpoint(zipCode)).main.temp;

/* Function to POST data */
const postData = async (url = '', data = {}) => {
  console.log('Posting data');
  console.log(data);
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
    console.log('Server response from post');
    console.log(newData);
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
    console.log('Received data');
    console.log(data);
    if (data.hasOwnProperty('cod') && data.cod[0] == '4') {
      alert("Something went wrong.\nDid you enter a valid zipcode?");
    }
    return data;
  } catch (error) {
    console.log('error in get. error: ', error);
  }
};

const kelvinToFahrenheit = (kelvin) => {
  let fahrenheit = (kelvin - 273.15)*(9/5) + 32;
  return fahrenheit
};

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

const updateUI = async () => {
  try {
    const data = await getData('/all');
    console.log('Got all data');
    console.log(data);
    if (data.length > 0) {
      document.querySelector('#recentDate').innerHTML = data[data.length -1].date;
      document.querySelector('#recentTemp').innerHTML = data[data.length -1].temperature;
      document.querySelector('#recentContent').innerHTML = data[data.length -1].userResponse;
      console.log('Updating history');
      updateHistory(data.reverse().slice(1));
    }
    return data;
  } catch (error) {
    console.log('error in updateUI. error: ', error);
  }
};

const submitForm = () => {
  if ((document.querySelector('#zip').value != '') && (document.querySelector('#feelings').value != '')) {
    getWeatherPostDataUpdateUI();
  } else {
    alert("Zipcode and feelings are required.");
  }
}

/* Function called by event listener */
const getWeatherPostDataUpdateUI = () => {
  console.log('Step 1: getData');
  getData(createWeatherEndpoint(document.querySelector('#zip').value)).then(function(value){
    console.log('Step 2: postData');
    const postPromise = postData(
      '/add',
      {temperature: `${kelvinToFahrenheit(value.main.temp).toFixed(1)}°F`,
      date: getCurrentDateAndTime(), userResponse: document.querySelector('#feelings').value}
      );
    console.log('postPromise');
    console.log(postPromise);
    return postPromise;
  }).then(function(value){
      console.log('Step 3: updateUI');
      const updatePromise = updateUI();
      console.log('updatePromise');
      console.log(updatePromise);
    }
  );
}

// Event listener to add function to existing HTML DOM element
document.querySelector('#generate').addEventListener('click', submitForm);

window.addEventListener('load', () => {
  updateUI();
});