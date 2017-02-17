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
        document.getElementById("latitude").textContent = latitude;
        document.getElementById("longitude").textContent = longitude;
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
        moveISS();
        exlatitude = latitude;
        exlongitude = longitude;
        refreshView();
    }, 1000);
}

// Fonction de génération de l'URL pour la création de la photo du Tweet
function URLphoto(zoom) {
    var URL = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v8/static/'
    // add longitude
    URL += longitude.toString()
    URL += ','
    // add latitude
    URL += latitude.toString()
    URL += ','
    // add zoom
    URL += zoom.toString()
    URL += ','
    // add bearing
    URL += '0,'
    // add pitch
    URL += '0/'
    // add width and height
    URL += '400x640?'
    // add key
    URL += 'access_token=pk.eyJ1IjoiYnJ1Y2V0aG9tYXMiLCJhIjoiY2l6N2tzeHNpMDAwNzMycGl2MHM1djVydiJ9.u4j45a8gVHB8BW_3DR6xAA'
    return URL
}

// Fonction de création de la photo
function createPhoto(zoom) {
    var photo = document.createElement("img");
    // Suppression de l'ancienne photo
    var twt = document.getElementById("tweetPhoto")
    while (twt.firstChild) {twt.removeChild(twt.firstChild);}
    // Affichage de la photo
    photo.setAttribute("src", URLphoto(zoom));
    document.getElementById("tweetPhoto").appendChild(photo);
}

// Lorsque l'utilisateur clique sur le bouton "Tweet like Pesquet", la photo du lieu survolé apparaît en tenant compte du zoom voulu
document.getElementById('clicTweet').addEventListener("click", function() {
    var zoom = $('input[name="zoom"]:checked').val();
    createPhoto(zoom);
});

// Initialisation de la carte avec les coordonnées de l'ISS à l'instant présent
getCoords();
// Mise à jour de la carte toutes les secondes
refreshView();
