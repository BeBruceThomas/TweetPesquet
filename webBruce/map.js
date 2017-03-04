// Initialisation de la carte
var valzoom = 6
var map = L.map('mapid',{zoom : valzoom});


// Provider de tuile OpenStreetMap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);


// Marker personnalisé
var markerISS = L.icon({
    iconUrl: 'iss.png',
    iconSize: [60, 60], // size of the icon
    iconAnchor: [30, 30], // point of the icon which will correspond to marker's location
});


// Définition des variables de latitude et longitude
var latitude;
var longitude;
// Initialisation des variables de latitude et longitude précédant les nouvelles valeurs
var exlatitude = 0;
var exlongitude = 0;
// Définition des couches de marker, de la trace et du debug pour tester
var markerLayer = L.featureGroup();
var traceLayer = L.featureGroup();
var debugLayer = L.featureGroup();
// Définition de la clé et du nom d'utilisateur pour l'accès à certaines données
var key = 'pk.eyJ1IjoiYnJ1Y2V0aG9tYXMiLCJhIjoiY2l6N2tzeHNpMDAwNzMycGl2MHM1djVydiJ9.u4j45a8gVHB8BW_3DR6xAA'
var username = 'brucethomas';

// Description des variables nécessaires pour le troisième niveau

var connexion1 = Date.now();
var vitesseFacteur = 20;
var vitesseISS = 27600; // en km/h
var rayonTerre = 6371; // en km
var altiISS = 400; // en km
var polarISS = 90; // en °
var incliISS = 51.64; // en °



// Niveau 1 et 2 : Fonction de récupération des coordonnées en latitude et longitude de l'ISS
function getCoords() {
    /*
    $.getJSON('http://api.open-notify.org/iss-now.json', function(data) {
        // Récupération latitude et longitude
        latitude = data.iss_position.latitude;
        longitude = data.iss_position.longitude;
        // Affichage latitude et longitude
        document.getElementById("latitude").textContent = 'Latitude : ' + latitude;
        document.getElementById("longitude").textContent = 'Longitude : ' + longitude;
    });
    */
    var ajax = new XMLHttpRequest();
    ajax.open("GET", 'http://api.open-notify.org/iss-now.json', false);
    ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    ajax.send(null);
    var data = JSON.parse(ajax.responseText);
    if (data) {
      latitude = data.iss_position.latitude;
      longitude = data.iss_position.longitude;
    }
    document.getElementById("latitude").textContent = 'Latitude : ' + latitude;
    document.getElementById("longitude").textContent = 'Longitude : ' + longitude;
}


// Niveau 3 : Fonction de calcul physique des coordonnées de l'ISS
function calculISS() {

    // Calcul du temps écoulé entre deux connexions  
    var connexionNew = Date.now();
    var tpsEcoule = connexionNew - connexion1;

    // Le calcul de l'azimuth consiste à calculer la distance parcourue par l'ISS entre les 2 connexions sur son orbite.
    // On a donc le periOrbite sur 360°, il s'agit de trouver l'angle correspondant à distParcourue.
    // Il faut calculer le reste de la division par l'angle 360° au cas où l'azimuth dépasse 360°. 
    var periOrbite = 2 * Math.PI * (rayonTerre + altiISS);
    var distParcourue = tpsEcoule / 1000000 * vitesseISS * vitesseFacteur;
    var azimuth = ( distParcourue / periOrbite * 360 ) % 360;

    // Calcul des coordonnées X, Y, Z du point avec les coordonnées polaires
    var x = rayonTerre * Math.cos(azimuth*Math.PI/180) * Math.cos(polarISS*Math.PI/180)
    var y = rayonTerre * Math.sin(azimuth*Math.PI/180) * Math.cos(polarISS*Math.PI/180)
    var z = rayonTerre * Math.sin(polarISS*Math.PI/180)

    // Rotation autour de l'axe Y suivant les matrices de rotation
    x = x * Math.cos(incliISS*Math.PI/180) - z * Math.sin(incliISS*Math.PI/180);
    z = x * Math.sin(incliISS*Math.PI/180) + z * Math.cos(incliISS*Math.PI/180);

    // Rotation de la Terre 
    var rotTerre = ( vitesseFacteur * (tpsEcoule/1000) * 2*Math.PI / 86400 ) % (2*Math.PI);

    // Rotation autour de l'axe Z suivant les matrices de rotation
    x = x * Math.cos(incliISS*Math.PI/180) - y * Math.sin(incliISS*Math.PI/180);
    y = x * Math.sin(incliISS*Math.PI/180) + y * Math.cos(incliISS*Math.PI/180);

    // Calcul de la latitude et longitude
    latitude = ( Math.asin(z/rayonTerre) * 180/Math.PI ).toFixed(6);
    longitude = ( Math.atan(y/x) * 180/Math.PI ).toFixed(6);

    document.getElementById("latitude").textContent = 'Latitude : ' + latitude;
    document.getElementById("longitude").textContent = 'Longitude : ' + longitude;    
}


// Niveau 1 : Fonction de récupération du nom du lieu et de l'affichage
function findNearbyPlaceName() {
    var URLlieu = 'http://api.geonames.org/findNearbyPlaceNameJSON' + '?lat=' + latitude.toString() + '&lng=' + longitude.toString() + "&username=" + username;
    /*
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: URLlieu,
        complete: function (data) {
            if (data.readyState === 4 && data.status === 200) {
                if (data.responseJSON.geonames.length>0) {
                    var name = data.responseJSON.geonames[0].name;
                    var country = data.responseJSON.geonames[0].countryName;
                    document.getElementById("lieu").innerHTML = 'Hello '+ name +', ' + country + ' !';
                }
                else {
                    document.getElementById("lieu").innerHTML = 'Hello World !'
                }
            }
        }
    })*/
    var ajax = new XMLHttpRequest();
    ajax.open("GET", URLlieu, false);
    ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    ajax.send(null);
    var data = JSON.parse(ajax.responseText);
    if (data.geonames[0]) {
        var name = data.geonames[0].name;
        var country = data.geonames[0].countryName;
        document.getElementById("lieu").innerHTML = 'Hello '+ name +', ' + country + ' !';
    }
    else {
        document.getElementById("lieu").innerHTML = 'Hello World !'
    }
}


// Niveau 2 : Fonction de récupération du nom du lieu et de l'affichage plus précis avec les noms des océans 
function extendedfindNearby() {
    //var URLphp = 'http://127.0.0.1/webBruce/map.php';

    var ajax = new XMLHttpRequest();
    ajax.open("POST", 'map.php', false);
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajax.send('latitude='+latitude+'&longitude='+longitude);
    var data = JSON.parse(ajax.responseText);
    if (data.geoname==null) {
        var name = data.ocean.name;
        document.getElementById("lieu").innerHTML = 'Hello ' + name + ' !';
    }
    else {
        var len = data.geoname.length;
        var name = data.geoname[len-1].name;
        var country = data.geoname[len-1].countryName;
        document.getElementById("lieu").innerHTML = 'Hello ' + name + ', ' + country + ' !';
    }
}


// Fonction de mouvement de l'ISS et dessin de la trace
function moveISS() {

    // Libération de la couche des markers
    markerLayer.clearLayers();

    // Création du marker avec les nouvelles coordonnées
    var iss = L.marker([latitude, longitude], {icon: markerISS});

    // Dessin de la trace et vérification lors du passage de longitude 180 à -180
    if (exlatitude!=0 && exlongitude!=0 && longitude*exlongitude>-20000) {
        var positions = [new L.LatLng(exlatitude, exlongitude), new L.LatLng(latitude, longitude)];
        var trace = new L.Polyline(positions);
        if (document.getElementById("debugMap").checked) {
            trace.addTo(debugLayer)
        }
        else {
            trace.addTo(traceLayer)
        }
    }

    // Ajout du marker dans la couche
    iss.addTo(markerLayer);

    // Ajout du marker et de la trace sur la carte
    markerLayer.addTo(map);
    traceLayer.addTo(map);
    debugLayer.addTo(map);
}


// Fonction de mise à jour de la carte toutes les secondes
function mapMAJ() {
    setTimeout(function() {

        // Obtenir les coordonnées
        if (document.getElementById("debugMap").checked) {
            calculISS();
        }
        else {
            getCoords();
        }

        // Dessiner la trace 
        moveISS();

        // Permettre le choix de suivre ou non l'ISS : case cochée initialement pour le suivi
        if ((document.getElementById("controleMap").checked)) {
            map.setView([latitude, longitude], 6);
        }

        // Permettre la boucle sur latitude et longitude 
        exlatitude = latitude;
        exlongitude = longitude;

        // Mise à jour toutes les secondes 
        mapMAJ();

    }, 1000);
}

document.getElementById("debugMap").addEventListener("click", function() {
    traceLayer.clearLayers();
    debugLayer.clearLayers();
    markerLayer.clearLayers();
    latitude=0;
    exlatitude=0;
});


// Lorsque l'utilisateur clique sur le bouton "Tweet like Pesquet", la photo du lieu survolé apparaît en tenant compte du zoom voulu
document.getElementById('clicTweet').addEventListener("click", function() {

    var zoom = $('input[name="zoom"]:checked').val();

    // Création de la photo 
    var photo = document.createElement("img");

    // Suppression de l'ancienne photo
    var twt = document.getElementById("photo")
    while (twt.firstChild) {twt.removeChild(twt.firstChild);}

    // Affichage de la photo
    var URLphoto = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v8/static/' + longitude.toString() + ',' + latitude.toString() + ',' + zoom.toString() + ',' + '0,0/' + '400x400?' + 'access_token=' + key
    photo.setAttribute("src", URLphoto);
    document.getElementById("photo").appendChild(photo);

    // Recherche de la location : on utilise la fonction du niveau 2
    //findNearbyPlaceName();
    extendedfindNearby();

});


// Initialiser la carte avec les coordonnées de l'ISS à l'instant présent puis la mettre à jour
getCoords();
mapMAJ();
