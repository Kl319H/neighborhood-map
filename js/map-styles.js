//This is what makes my map be the color that it is
var styles = [{
  "featureType": "road",
  "stylers": [{
    "hue": "#f1592a"
  }]
}, {
  "featureType": "road",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "poi",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "gamma": 0.5
  }]
}, {
  "featureType": "water",
  "elementType": "all",
  "stylers": [{
    "hue": "#00a8e2"
  }, {
    "gamma": 0.2
  }]
}];
