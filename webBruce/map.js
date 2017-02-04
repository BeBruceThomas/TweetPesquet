//var map = L.map('mapid').setView([19.421, -155.287], 13);
var map = L.map('mapid',{zoom : 4});

// Provider de tuile OpenStreetMap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

var lat;
var lon;
var iss = L.marker([0,0]).addTo(map);

function moveISS () {
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        lat = data['iss_position']['latitude'];
        lon = data['iss_position']['longitude'];

        // See leaflet docs for setting up icons and map layers
        // The update to the map is done here:
        iss.setLatLng([lat, lon]);
        map.panTo([lat, lon], animate=true);
    });
    setTimeout(moveISS, 5000);
}

moveISS();
