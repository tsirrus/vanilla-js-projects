(function () {
  FLICKR_API_URL='https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1';
  FLICKR_API_KEY='d9561d083dabc6d467cb66a45ea1a457';

  function createFlickrThumb(photoData) {
    var link = document.createElement('a');
    link.setAttribute('href', photoData.large);
    link.setAttribute('target', '_blank');

    var image = document.createElement('img');
    image.setAttribute('src', photoData.thumb);
    image.setAttribute('alt', photoData.title);

    link.appendChild(image);

    return link;
  }

  function getPictures(searchTerm) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${FLICKR_API_URL}&text=${searchTerm}&api_key=${FLICKR_API_KEY}`;

    return (
      fetch(url) // Returns a promise for a Response
      .then(response => response.json()) // Returns a promise for the parsed JSON
      .then(data => {
        console.log(data);
      }) // Transform the response to only take what we need
    );
  }

  getPictures('cat');
})();
