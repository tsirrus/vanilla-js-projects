$(document).ready(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = '56c3d30b602ef7ec8a9e56fd71d269b9';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  var app = $('#app');
  var cityForm = $('.city-form');
  var cityInput = $('.city-input');
  //var getWeatherButton = cityForm.querySelector('.get-weather-button');
  //var cityWeather = app.querySelector('.city-weather');
  var cityWeatherBar = $('.city-weather-bar');
  var currentWeather = $('.current-weather');
  var forecastBar = $('.forecast-bar');

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


  // This function returns a promise that will resolve with an object of lat/lng coordinates
  function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log("Location=",cityName);
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

  function generateListItemTag(parentElement, listItemClass, listItemInfo) {
    var li = this.$('<li>');
    var label = this.$('<label>');
    li.append(listItemClass);
    label.text(listItemInfo);
    li.append(label);
    parentElement.append(li);
  }

  function generateForecastTag(parentElement, forecast, skyconName) {
    parentElement.empty();
    var canvas = this.$('<canvas>');
    canvas.attr("id",skyconName);
    canvas.addClass(`weather-skycon ${forecast.icon}`);
    canvas.attr("width", 140);
    canvas.attr("height", 140);
    parentElement.append(canvas);
    skycons.set(forecast.icon, forecast.icon);

    var ul = this.$('<ul>');
    ul.addClass('weather-info');
    var date = new Date(forecast.time * 1000)
    generateListItemTag(ul, "date", date.toLocaleString('en-CA'));
    generateListItemTag(ul, "summary", forecast.summary);
    generateListItemTag(ul, "temperature", forecast.temperature);
    generateListItemTag(ul, "feels-like", forecast.apparentTemperature);
    generateListItemTag(ul, "humidity", +forecast.humidity * 100);

    parentElement.append(ul);
  }




  cityForm.submit(function(event) { // this line changes
    event.preventDefault(); // prevent the form from submitting
    //console.log("cityInput=",cityInput);
    getCoordinatesForCity(cityInput.val())
    .then(getWeather)
    .then(function(weather) {
      //console.log("Weather=",weather);
      generateForecastTag(currentWeather,weather.currently,"currently");

      //Assign skycons to classes, allowing duplicates.
      for (i = weatherList.length; i--;) {
        var weatherType = weatherList[i];
        var elements = document.getElementsByClassName(weatherType);
        for (e = elements.length; e--;) {
          skycons.set(elements[e], weatherType);
        }
      }
      
      //console.log
      skycons.play();
    });
  });
});
