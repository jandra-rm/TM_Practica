
/*
  var request = new XMLHttpRequest();
  var url = "JSON/datos.json";
  var instalacionesText;
  var instalaciones;
  request.open("GET", url, true);
  request.responseType = 'text';
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      instalacionesText = request.response; //cogemos la cadena de response
      instalaciones = JSON.parse(instalacionesText); //la convertimos a objeto
    }
  }
*/
  function getInstalacionesBySport(instalaciones, sport){
    var instSport = [];
    for(var i = 0; i < instalaciones.length; i++){
      if (instalaciones[i].detall.localeCompare(sport) == 0){
        instSport.push(instalaciones[i]);
      }
    }
    return instSport;
  }

  function creategeoJSON(instalaciones) {
    jsonObj = {};
    jsonObj['type'] = 'FeatureCollection';
    features = [];
    for(var i = 0; i < instalaciones.length; i++){
        item = {};
        item['type'] = 'Feature';
        geo = {};
        geo["type"] = "Point";
        geo["coordinates"] = [instalaciones[i].geo1.long, instalaciones[i].geo1.lat];
        item["geometry"] = geo;
        prop = {};
        prop['title'] = instalaciones[i].nom;
        prop['marker-color'] = '#FF6B6B';
        prop['marker-symbol'] = 'marker';
        prop['marker-size'] = 'medium';
        im = [];
        for(var j = 0; j < instalaciones[i].imatges.length; j++){
          im.push([instalaciones[i].imatges[j],]);
        }
        prop['images'] = im;
        item["properties"] = prop;
        features.push(item);
    }
    jsonObj['features'] = features;
    return jsonObj;
}

function getInstalacionandSport(instalaciones){
  var instSport = [];
    for(var i = 0; i < instalaciones.length; i++){
      instSport.push(instalaciones[i].nom + ' - ' + instalaciones[i].detall);
    }
    return instSport;
}




