(function () {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = '56c3d30b602ef7ec8a9e56fd71d269b9';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

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



  const container = React.createClass({
    render : {

    };
  });


  cityForm.addEventListener('submit', function(event) { // this line changes
    event.preventDefault(); // prevent the form from submitting

    // This code doesn't change!
    var city = cityInput.value;
    //cityWeather.innerText = 'Fetching temperature for ' + city;

    getCoordinatesForCity(city)
    //.then(getCurrentWeather)
    .then(getWeather)
    .then(function(weather) {
      ReactDOM.render(
        container,
        document.getElementById('app')
      )

      /*
      //Assign skycons to classes, allowing duplicates.
      for (i = weatherList.length; i--;) {
        var weatherType = weatherList[i];
        var elements = document.getElementsByClassName(weatherType);
        for (e = elements.length; e--;) {
          skycons.set(elements[e], weatherType);
        }
      }


      skycons.play();
      */
      console.log("Weather Info=",weather);

      //cityWeather.innerText = 'Current temperature: ' + weather.currently.summary + ' it is ' + weather.currently.temperature;

    });
  });
})();
