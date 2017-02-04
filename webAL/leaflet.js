var valzoom=4
if(document.getElementById('smart').checked){
      valzoom=document.getElementById("smart").value;
}else if (document.getElementById("reflex").checked) {
      valzoom=document.getElementById("reflex").value;
}else{valzoom=document.getElementById("tele").value}

var map = L.map('map',{zoom : valzoom});
var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib}).addTo(map);


var lat;
var lon;
var iss = L.marker([0,0]).addTo(map);


/*ajaxGet("http://api.open-notify.org/iss-now.json", function(reponse){
  var latitude = JSON.parse(reponse);
  latitude.textContent = latitude.latitude;
  var longitude = JSON.parse(reponse);
  longitude.textContent = longitude.longitude;
})

navigator.geolocation.getCurrentPosition(function (address) {
  map.setView([address.coords.latitude, address.coords.longitude,],13);
  map.addLayer(osm);
    var marker = L.marker([address.coords.latitude, address.coords.longitude,]).addTo(map);
});*/

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
