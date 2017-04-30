var sidebar;
var processedLocations = [];
var uniqueCities = [];
var processedCities = [];

$(document).ready(function() {
  sidebar = $('#sidebar').sidebar();
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});



var Location = function(locationData) {
  this.data = locationData;

  this.showInfoWindow = function() {
    console.log(this.data);
    openMarkerInfoWindowByID(this.data.placeID);
  }.bind(this);
}

var City = function(name) {
  this.name = name;
}

//to iterate over the citys to only pull unique names
locations.forEach(function(locationData, i) {
  var location = new Location(locationData);
  processedLocations.push(location);

  var hasCity = uniqueCities.indexOf(locationData.city) > -1;
  if (!hasCity) {
    uniqueCities.push(locationData.city)
  }
});

uniqueCities.forEach(function(cityName) {
    var city = new City(cityName);
    processedCities.push(city);
  })
  //filter and display or remove locations
var ViewModel = function() {
  var self = this;
  this.showMapApiError = ko.observable(false);
  this.locations = ko.observableArray(processedLocations);
  this.cities = processedCities;
  this.showAllLocations = function() {
    showLocation();
    this.locations.removeAll();
    locations.forEach(function(location) {
      location = new Location(location);
      self.locations.push(location);
    });
  }
  this.filterByCity = function(city) {
    showLocationByCity(city.name);
    this.locations.removeAll();
    locations.forEach(function(location) {
      if (location.city === city.name) {
        location = new Location(location);
        self.locations.push(location);
      }
    });
  }.bind(this);
};
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function onMapApiError() {
  viewModel.showMapApiError(true);
}
