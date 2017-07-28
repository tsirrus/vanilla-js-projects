(function () {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = '56c3d30b602ef7ec8a9e56fd71d269b9';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  // This function returns a promise that will resolve with an object of lat/lng coordinates
  function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url) // Returns a promise for a Response
      .then(response => response.json()) // Returns a promise for the parsed JSON
      .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
  }

  function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
  }

  function getWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,alerts,flags`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => {
        //console.log(data); //Test
        return data;
      })
    );
  }


  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  //var getWeatherButton = cityForm.querySelector('.get-weather-button');
  //var cityWeather = app.querySelector('.city-weather');
  var cityWeatherBar = app.querySelector('.city-weather-bar');
  var currentWeather = document.querySelector('.current-weather');
  var forecastBar = document.querySelector('.forecast-bar');

  //Basic skycons config
  var skycons = new Skycons ({
    "monochrome": false,
    "colors": {
      "main": "blue",
      "moon": '#7FFFD4',
      "fog": "lightgray",
      "fogbank": "darkgray",
      "cloud": "gray",
      "snow": "white",
      "leaf": "green",
      "rain": "blue",
      "sun": "yellow"
    }
  });
  var weatherList = [
    "clear-day", "clear-night", "partly-cloudy-day",
    "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
    "fog"
  ];

  function generateListItemTag(parentElement, listItemClass, listItemInfo) {
    var li = document.createElement('li');
    var label = document.createElement('label');
    li.className = listItemClass;
    label.innerText = listItemClass + ": " + listItemInfo;
    li.appendChild(label);
    parentElement.appendChild(li);
  }

  function generateForecastTag(parentElement, forecast, skyconName) {
    var canvas = document.createElement('canvas')
    canvas.id = skyconName;
    canvas.className = `weather-skycon ${forecast.icon}`;
    canvas.width = 140;
    canvas.height = 140;
    parentElement.appendChild(canvas);
    skycons.set(forecast.icon, forecast.icon);

    var ul = document.createElement('ul');
    ul.className = 'weather-info';
    var date = new Date(forecast.time * 1000)
    generateListItemTag(ul, "date", date.toLocaleString('en-CA'));
    generateListItemTag(ul, "summary", forecast.summary);
    generateListItemTag(ul, "temperature", forecast.temperature);
    generateListItemTag(ul, "feels-like", forecast.apparentTemperature);
    generateListItemTag(ul, "humidity", +forecast.humidity * 100);

    parentElement.appendChild(ul);
  }

  function generateForecastTimeList(parentElement, forecastArray) {
    for (var i in forecastArray) {
      //console.log("forecast=", forecastArray[i]);
      var date = new Date(forecastArray[i].time * 1000).toLocaleString('en-CA');
      //console.log(`Date=${date}`);
      var li = document.createElement('li');
      li.className = 'weather';
      li.margin = '5px';
      generateForecastTag(li, forecastArray[i], `forecast-item-${i}`);
      parentElement.appendChild(li);
    }


  }

  //getCoordinatesForCity("montreal").then(console.log); //Test
  //getCurrentWeather({lat: 45.5, lng: -73.5}).then(console.log); //Test

  /* Testing
  getCoordinatesForCity("montreal")
  .then(getCurrentWeather)
  .then(data => console.log(`The current temperature is ${data.temperature}`));
  */

  /*
  getWeatherButton.addEventListener('click', function() {
    var city = cityInput.value; // Grab the current value of the input

    getCoordinatesForCity(city) // get the coordinates for the input city
    .then(getCurrentWeather) // get the weather for those coordinates
    .then(function(weather) {
      cityWeather.innerText = 'Current temperature: ' + weather.temperature;
    });
  });
  */

  cityForm.addEventListener('submit', function(event) { // this line changes
    event.preventDefault(); // prevent the form from submitting

    // This code doesn't change!
    var city = cityInput.value;
    //cityWeather.innerText = 'Fetching temperature for ' + city;

    getCoordinatesForCity(city)
    //.then(getCurrentWeather)
    .then(getWeather)
    .then(function(weather) {
      generateForecastTag(currentWeather,weather.currently,"currently");
      generateForecastTimeList(forecastBar, weather.hourly.data);
      //skycons.add("city-weather-skycon", weather.currently.icon);

      //Assign skycons to classes, allowing duplicates.
      for (i = weatherList.length; i--;) {
        var weatherType = weatherList[i];
        var elements = document.getElementsByClassName(weatherType);
        for (e = elements.length; e--;) {
          skycons.set(elements[e], weatherType);
        }
      }

      skycons.play();
      console.log("Weather Info=",weather);

      //cityWeather.innerText = 'Current temperature: ' + weather.currently.summary + ' it is ' + weather.currently.temperature;

    });
  });
})();

/*
fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/56c3d30b602ef7ec8a9e56fd71d269b9/37.8267,-122.4233')
.then(response => response.json())
.then(data => console.log(data))


fetch('https://maps.googleapis.com/maps/api/geocode/json?address=montreal&key=AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs')
.then(response => response.json())
.then(data => console.log(data))
*/
