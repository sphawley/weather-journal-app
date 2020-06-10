/* Global Variables */

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

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
    return data;
  } catch (error) {
    console.log('error in get. error: ', error);
  }
};

const updateUI = async () => {
  const data = await getData('/all');
  try {
    console.log('Got all data');
    console.log(data);
    document.querySelector('#date').innerHTML = data[data.length -1].date;
    document.querySelector('#temp').innerHTML = data[data.length -1].temperature;
    document.querySelector('#content').innerHTML = data[data.length -1].userResponse;
    return data;
  } catch (error) {
    console.log('error in updateUI. error: ', error);
  }
};

/* Function called by event listener */
const getWeatherPostDataUpdateUI = () => {
  console.log('Step 1: getData');
  getData(createWeatherEndpoint(document.querySelector('#zip').value)).then(function(value){
    console.log('Step 2: postData');
    const postPromise = postData('/add', {temperature: value.main.temp, date: newDate, userResponse: document.querySelector('#feelings').value});
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
document.querySelector('#generate').addEventListener('click', getWeatherPostDataUpdateUI);
