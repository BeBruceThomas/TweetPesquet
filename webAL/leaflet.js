var valzoom=3

function ZoomChange(){
if(document.getElementById('smart').checked){
      valzoom=document.getElementById("smart").value;
}else if (document.getElementById("reflex").checked) {
      valzoom=document.getElementById("reflex").value;
}else{valzoom=document.getElementById("tele").value}
}


var map = L.map('map',{zoom: valzoom});
var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib}).addTo(map);


var latitude;
var longitude;
var exlatitude = 0;
var exlongitude = 0;

var markerLayer = L.featureGroup();
var traceLayer = L.featureGroup();


function getCoords() {
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        latitude = data['iss_position']['latitude'];
        longitude = data['iss_position']['longitude'];
        document.getElementById("latitude").textContent = latitude;
        document.getElementById("longitude").textContent = longitude;
    });
}

var IconISS = L.icon({
    iconUrl: 'ISS.png',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function moveISS() {
    markerLayer.clearLayers();
    var iss = L.marker([latitude, longitude],{icon: IconISS});

    if (exlatitude!=0 && exlongitude!=0) {
        var positions = [new L.LatLng(exlatitude, exlongitude), new L.LatLng(latitude, longitude)];
        var trace = new L.Polyline(positions);
        trace.addTo(traceLayer);
    }

    if ((document.getElementById("controleMap").checked)) {
        map.setView([latitude, longitude], 6);
    }

    iss.addTo(markerLayer);
    markerLayer.addTo(map);
    traceLayer.addTo(map);
}

// Fonction de mise à jour de la carte
function refreshView() {
    setTimeout(function() {
        getCoords();
        ZoomChange();
        moveISS();
        exlatitude = latitude;
        exlongitude = longitude;
        refreshView();
    }, 1000);
}
