<?

// Création de l'URL 
$URL = 'http://api.geonames.org/extendedFindNearby' + '?lat=' + $_GET['latitude'] + '&lng=' + $_GET['longitude'] + '&username=' + $_GET['username'];

// Récupération des données 

//  Initiate curl
$ch = curl_init();
// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set the url
curl_setopt($ch, CURLOPT_URL , $URL);
// Execute
$data = curl_exec($ch);
// Closing
curl_close($ch);

// Conversion du résultat XML en JSON
$xml = simplexml_load_string($data);
$json = convert($xml);

echo($json);

?>
