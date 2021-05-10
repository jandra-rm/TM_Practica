function getInstalacionesBySport(instalaciones, sport) {
  var instSport = [];
  for (var i = 0; i < instalaciones.length; i++) {
    if (instalaciones[i].detall.localeCompare(sport) == 0) {
      instSport.push(instalaciones[i]);
    }
  }
  return instSport;
}

function getInstalacionesByNameAndSport(instalaciones, name, sport) {
  var inst;
  for (var i = 0; i < instalaciones.length; i++) {
    if (instalaciones[i].nom.localeCompare(name) == 0 && instalaciones[i].detall.localeCompare(sport) == 0) {
      inst = instalaciones[i];
    }
  }
  return inst;
}




function getInstalacionandSport(instalaciones) {
  var instSport = [];
  for (var i = 0; i < instalaciones.length; i++) {
    instSport.push(instalaciones[i].nom + ' - ' + instalaciones[i].detall);
  }
  return instSport;
}

function getServeisSport(instalaciones) {
  var serv = [];
  for (var i = 0; i < instalaciones.length; i++) {
    for (var j = 0; j < instalaciones[i].dadesPropies.serveis.length; j++){
      if(serv.includes(instalaciones[i].dadesPropies.serveis[j].nom) == false){
        serv.push(instalaciones[i].dadesPropies.serveis[j].nom);
      }
    }
  }
  return serv;
}

function getActivitatsSport(instalaciones) {
  var act = [];
  for (var i = 0; i < instalaciones.length; i++) {
    for (var j = 0; j < instalaciones[i].dadesPropies.esports.length; j++){
      if(act.includes(instalaciones[i].dadesPropies.esports[j]) == false){
        act.push(instalaciones[i].dadesPropies.esports[j]);
      }
    }
  }
  return act;
}

function creategeoJSON(instalaciones) {
  jsonObj = {};
  jsonObj['type'] = 'FeatureCollection';
  features = [];
  for (var i = 0; i < instalaciones.length; i++) {
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
    for (var j = 0; j < instalaciones[i].imatges.length; j++) {
      im.push([instalaciones[i].imatges[j],]);
    }
    prop['images'] = im;
    item["properties"] = prop;
    features.push(item);
  }
  jsonObj['features'] = features;
  return jsonObj;
}


