// Create the map object with center on Denver and set zoom.
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
    let colorScale =d3.scaleLinear().domain([0,110]).range(["#02fa1b","#f50202"])
    // if depth less than 0 assign green color
    if (depth <0){
      return "#02fa1b"
    }
    // if depth more than 110 assign red color
    if(depth>110) {
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
    // Set the style for each circleMarker using our styleInfo function.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, styleInfo(feature))
    },
    // Create a popup for each marker to display the magnitude, depth and location of the earthquake 
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}:</h3> 
        <h4 style="font-weight: normal";> Magnitude (${feature.properties.mag})<br> 
        Depth (${feature.geometry.coordinates[2]} km)</h4>`)
    }
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
  // Initialize depth intervals and colors for the legend
    let limits = [0,10,30,50,70,90,110]
    let colorScale =d3.scaleLinear().domain([0,110]).range(["#02fa1b","#f50202"])
    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < limits.length - 1; i++) {
      let color = colorScale((limits[i] + limits[i + 1]) / 2)
      div.innerHTML += '<li style="background:' + color + '"></li> ' + 
      limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] : '+') +'<br>';
  }
  return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap)
  });
