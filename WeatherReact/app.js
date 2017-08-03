const e = React.createElement;

var inputCity=''; //Input value
var currentWeather = {};

var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '56c3d30b602ef7ec8a9e56fd71d269b9';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyBAvoEOV4XMBZSjzSli-IGgshL9uNeqqjs';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

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



function _handleSubmit(e){
  e.preventDefault();
  //console.log("Event info=",e);
  //console.log('Input info=',input);
  if (inputCity.length > 0){
    getCoordinatesForCity(inputCity)
    .then(getCurrentWeather)
    .then(weather => {
      console.log("Weather=",weather);
      //WeatherInfo(weather);
      currentWeather = weather;
      renderUserForm();
      renderApp();
    });
  }
}

function _handleChange(e){
  inputCity = e.target.value;
  renderUserForm();
}

function WeatherForm(){
  return e(
  'form', {onSubmit: _handleSubmit}
  , e('input', {type: 'text', placeholder: 'Enter city name', value: inputCity, onInput: _handleChange})
  , e('button', {type: "submit"},"Get Weather!")
  );
}

function generateListItemTag(listItemClass, listItemInfo) {
  return e('li'
    , {className: listItemClass}
    , e('label', {}, `${listItemClass}: ${listItemInfo}` )
  );
}

function WeatherInfo(){
  var date = new Date(currentWeather.time * 1000)
  skycons.set(currentWeather.icon, currentWeather.icon);
  return e('div'
    , null
    , e('canvas', {className: `weather-skycon ${currentWeather.icon}`, width: 140, height: 140})
    , e('ul'
      , {className:'weather-info'}
      , generateListItemTag('date', date)
      , generateListItemTag("summary", currentWeather.summary)
      , generateListItemTag("temperature", currentWeather.temperature)
      , generateListItemTag("feels-like", currentWeather.apparentTemperature)
      , generateListItemTag("humidity", +currentWeather.humidity * 100)
    )
  );
}

function renderUserForm(){
  ReactDOM.render(
    WeatherForm(),
    document.getElementById('userForm')
  );
}

function renderApp() {

  skycons.play();

  ReactDOM.render(
    WeatherInfo(),
    document.getElementById('app')
  );
}

renderUserForm();
/*
function renderWeather(){



  render : {

  };
});
*/


/*
ReactDOM.render(
  container,
  document.getElementById('app')
)
*/
