<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Carte</title>

    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/master/leaflet.css" />
    <script src="jquery-3.1.1.min.js"></script>


  </head>
  <body>

    <?php
      $link = "http://api.open-notify.org/iss-now.json";
      if (!$link)
      {
        die('Erreur de connexion!');
      }
      else {
        echo 'Succès...!';
      }
    ?>

    <h1>Latitude</h1>
    <div id="lat"></div>
    <h1>Longitude</h1>
    <div id="lon"></div>

    <label>Smartphone<input type="radio" name="zoom" value="7"/></label>
    <label>Réflex<input type="radio" name="zoom" value="10"/></label>
    <label>Téléobjectif<input type="radio" name="zoom" value="13"/></label>
    <input type="submit" name="envoi" value="Tweet comme Pesquet"/>

    <div id="map" style="height: 300px;"></div>

    <form class="ajax" action="search.php" method="get">
    	<p>
    		<label for="recherche">Recherche</label>
    		<input type="text"  id="recherche" />
    	</p>
    </form>


    <script src="http://cdn.leafletjs.com/leaflet/master/leaflet.js"></script>
    <script src='leaflet.js'></script>

  </body>
</html>
