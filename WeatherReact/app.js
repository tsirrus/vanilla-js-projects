const e = React.createElement;

const cityForm = e(
  'form', {className: "cityForm"}
  , e('input', {type: 'text', placeholder: 'Enter city name'})
  , e('button', {type: "submit"},"Get Weather!")
);

/*
const container = React.createClass({
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
  render : {

  };
});
*/
ReactDOM.render(
  cityForm,
  document.getElementById('userForm')
);

/*
ReactDOM.render(
  container,
  document.getElementById('app')
)
*/
