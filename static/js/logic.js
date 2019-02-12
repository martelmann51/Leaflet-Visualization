// link for earthquake data
var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
 d3.json (earthquakeurl, function(data){
   createfeatures(data.features)
 });

 function getRadius(value){
    return value*20000

} 

function markercolor(magnitude) {
    if (magnitude > 5) {
      return 'blue'
  } else if (magnitude > 4) {
      return 'brown'
  } else if (magnitude > 3) {
      return 'green'
  } else if (magnitude > 2) {
      return 'yellow'
  } else if (magnitude > 1) {
      return 'orange'
  } else {
      return 'red'

  }

};




function createfeatures(earthquakedata) {
var earthquakes = L.geoJson(earthquakedata, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + new Date(feature.properties.time) + "</p>");
},
  pointToLayer: function (feature, latlng) {
    return new L.circle(latlng, 
      {radius: getRadius (feature.properties.mag),
       fillColor: markercolor(feature.properties.mag),
       fillOpacity: .9
       

    })
  }
});
createMap (earthquakes)
function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [30.73, -150.0059],
    zoom: 3.1,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markercolor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  
  };
  
  legend.addTo(map);
}

function markercolor(d) {
    return d > 5 ? 'blue':
    d > 4 ? 'brown':
    d > 3 ? 'green':
    d > 2 ? 'yellow':
    d > 1 ? 'orange':
          'red';
}

}


