// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [39.7392, -104.9903],
  zoom: 4
});

// Create and add the 'basemap' tile layer to the map.
let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      color: "black",
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      weight: 1.5,
      fillOpacity: 0.75,
      opacity:0.5,
      weight: 1
    }
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    //set a color scale for depth with red for deep and green for shallow
    let colorScale =d3.scaleLinear().domain([0,80]).range(["#02fa1b","#f50202"])
    // if depth less than 0 assign green color
    if (depth <0){
      return "#02fa1b"
    }
    // if depth more than 100 assign red color
    if(depth>80) {
      return "#f50202"
    }
    //for depths within the range use the colorScale
    return colorScale(depth)
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude *3
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      let marker =L.circleMarker(latlng, styleInfo(feature))
      return marker
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}:</h3> <h3>Magnitude ${feature.properties.mag}</h3>`)
    }

  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [0,10,30,50,70,90,110]

    // Initialize depth intervals and colors for the legend


    // Loop through our depth intervals to generate a label with a colored square for each interval.


    return div;
  };

  // Finally, add the legend to the map.


  });

  // let legend = L.control({ position: "topright" });
  // legend.onAdd = function() {
  //   let div = L.DomUtil.create("div", "info legend");
  //   let limits = geojson.options.limits;
  //   let colors = geojson.options.colors;
  //   let labels = [];
  //   // Add minimum and maximum.
  //   let legendInfo =`<h1>Population with Children</br> (ages 6-17)</h1> \
  //   <div class="labels">\
  //    <div class="min"> ${limits[0]}</div>\
  //    <div class="max"> ${limits[limits.length - 1]}</div><div>`