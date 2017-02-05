var valzoom = 4
var map = L.map('mapid',{zoom : valzoom});

// Provider de tuile OpenStreetMap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

var latitude;
var longitude;
var exlatitude = 0;
var exlongitude = 0;

var markerLayer = L.featureGroup();
var traceLayer = L.featureGroup();

// Récupération des coordonnées en latitude et longitude de l'ISS
function getCoords() {
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        latitude = data['iss_position']['latitude'];
        longitude = data['iss_position']['longitude'];
    });
}

// Mouvement de l'ISS et dessin de la trace
function moveISS() {
    markerLayer.clearLayers();
    var iss = L.marker([latitude, longitude]);

    if (exlatitude!=0 && exlongitude!=0) {
        var positions = [new L.LatLng(exlatitude, exlongitude), new L.LatLng(latitude, longitude)];
        var trace = new L.Polyline(positions);
        trace.addTo(traceLayer);
    }

    map.setView([latitude, longitude], 6);
    iss.addTo(markerLayer);
    markerLayer.addTo(map);
    traceLayer.addTo(map);
}

// Fonction de mise à jour de la carte
function refreshView() {
    setTimeout(function() {
        getCoords();
        moveISS();
        exlatitude = latitude;
        exlongitude = longitude;
        refreshView();
    }, 1000);
}

// Initialisation de la carte avec les coordonnées de l'ISS à l'instant présent
getCoords();
// Mise à jour de la carte toutes les secondes
refreshView();
