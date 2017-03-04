<?php 

// Création de l'URL 
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$username = 'brucethomas';

$URL = 'http://api.geonames.org/extendedFindNearby'.'?lat='.$latitude.'&lng='.$longitude.'&username=brucethomas';

// Conversion du résultat XML en JSON
$xml = simplexml_load_file($URL);
$json = json_encode($xml);

echo($json);

?>
