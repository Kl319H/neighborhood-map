var map;
// Empty array for all the listing markers
var markers = [];

var largeInfowindow;
// Function to initialize the map in the map div
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.842285,
      lng: -105.043716
    },
    zoom: 10,
    styles: styles,
    mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();

  createMarkers();
  showLocation();
}

//Create markers from locations and attach event listeners
function createMarkers() {
  var icon = "images/Tennis-icon.png";
  var iconMouseOver = "images/Tennis-icon-bg.png";
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var placeID = locations[i].placeID;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: icon,
      id: placeID
    });

    marker.data = locations[i];

    markers.push(marker);

    marker.addListener('click', function() {
      var self = this;
      populateInfoWindow(this, largeInfowindow);
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        self.setAnimation(null);
      }, 2100);
    });

    marker.addListener('mouseover', function() {
      this.setIcon(iconMouseOver);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(icon);
    });
  }
}

function openMarkerInfoWindowByID(markerID) {
  console.log(markers, markerID);
  markers.forEach(function(marker) {
    if (marker.id === markerID) {
      new google.maps.event.trigger(marker, 'click');
    }
  });
}

function addWeatherToContent(latLng, content, cb) {

  getWeather(latLng, function(error, weatherData) {
    if (!error) {
      var temp = parseInt(weatherData.main.temp);
      var iconCode = weatherData.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode +
        ".png";

      console.log(weatherData);
      content += '<img src="' + iconUrl + '" alt=""><p>Temp ' +
        temp +
        '&deg;</p> <img width="130" src="images/logo_OpenWeatherMap_orange.svg" > ';
    } else {
      console.log(error);
      content += '<p>' + error + '</p>';
    }
    cb(content);
  });

}


function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    var latLng = marker.getPosition().toJSON();
    map.panTo(latLng);
    sidebar.close();
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // get the pano & display it or put up an error message
    function getStreetView(data, status) {

      var content = "";
      if (status == google.maps.StreetViewStatus.OK) {
        content = '<h5>' + marker.title +
          '</h5><div id="pano"></div>';

      } else {
        content = '<h5>' + marker.title + '</h5>' +
          '<div>No Street View Found</div>';
      }
      addWeatherToContent(latLng, content, function(fullContent) {
        infowindow.setContent(fullContent);
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);

          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        }
      });
    }
    // Streetview service for the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius,
      getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

function getWeather(latLng, cb) {
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" +
    latLng.lat + "&lon=" + latLng.lng +
    "&appid=218ae9b4cfe09af3abd8acdfa0fbaa15&units=imperial";
  $.ajax(url).done(function(data, status) {
    cb(null, data);
  }).fail(function(e) {
    console.log(e);
    cb('Weather not available', null);
  });
}
// Displays Markers for locations in array
function showLocation() {
  if (largeInfowindow) {
    largeInfowindow.close();
  }
  if (sidebar) {
    sidebar.close();
  }
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
//Filters markers shown by city only and removes the other makrers
function showLocationByCity(city) {
  hideLocation();
  var bounds = new google.maps.LatLngBounds();
  sidebar.close();
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].data.city === city) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }

  }
  map.fitBounds(bounds);
}

// Hide markers
function hideLocation() {
  largeInfowindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function makeMarkerIcon() {
  var markerImage = new google.maps.MarkerImage(
    icon);
  return markerImage;
}
