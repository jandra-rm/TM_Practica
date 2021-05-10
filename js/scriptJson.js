var gimnasios = null;
var campos = null;
var instPropias = null;

function getInstalacionesBySport(instalaciones, sport) {
  var instSport = [];
  for (var i = 0; i < instalaciones.length; i++) {
    if (instalaciones[i].detall.localeCompare(sport) == 0) {
      instSport.push(instalaciones[i]);
    }
  }
  return instSport;
}

function getInstalacionesByNameAndSport(name, sport) {
  var inst;
  for (var i = 0; i < instPropias.length; i++) {
    if (instPropias[i].nom.localeCompare(name) == 0 && instPropias[i].detall.localeCompare(sport) == 0) {
      inst = instPropias[i];
    }
  }
  for (var i = 0; i < campos.length; i++) {
    if (campos[i].nom.localeCompare(name) == 0 && campos[i].tipus.localeCompare("Campo") == 0) {
      inst = campos[i];
    }
  }
  for (var i = 0; i < gimnasios.length; i++) {
    if (gimnasios[i].nom.localeCompare(name) == 0 && gimnasios[i].tipus.localeCompare("gym") == 0) {
      inst = gimnasios[i];
    }
  }
  return inst;
}

function startAutocomplete() {
  var instSport = [];
  for (var i = 0; i < instPropias.length; i++) {
    instSport.push(instPropias[i].nom + ' - ' + instPropias[i].detall);
  }
  for (var i = 0; campos!= null && i < campos.length; i++) {
    instSport.push(campos[i].nom + ' -  FÚTBOL');
  }
  for (var i = 0; gimnasios!= null && i < gimnasios.length; i++) {
    instSport.push(gimnasios[i].nom + ' -  GIMNASIO');
  }
  autocomplete(document.getElementById("myInput"), instSport);
}

function getServeisSport(instalaciones) {
  var serv = [];
  for (var i = 0; i < instalaciones.length; i++) {
    if(instalaciones[i].tipus.localeCompare("gym") == 0){
      if(instalaciones[i].dadesPropies.serveis.piscina == true && serv.includes("Piscina") == false){
        serv.push("Piscina");
      }
      if(instalaciones[i].dadesPropies.serveis.spa == true && serv.includes("Spa") == false){
        serv.push("Spa");
      }
      if(instalaciones[i].dadesPropies.serveis.salaFitness == true && serv.includes("Sala fitness") == false){
        serv.push("Sala fitness");
      }

    } else {
      for (var j = 0; j < instalaciones[i].dadesPropies.serveis.length; j++){
        if(serv.includes(instalaciones[i].dadesPropies.serveis[j].nom) == false){
          serv.push(instalaciones[i].dadesPropies.serveis[j].nom);
        }
      }
    }
  }
  return serv;
}

function getActivitatsSport(instalaciones) {
  var act = [];
  for (var i = 0; i < instalaciones.length; i++) {
    if(instalaciones[i].tipus.localeCompare("gym") == 0){
      if(instalaciones[i].dadesPropies.serveis.padel == true && act.includes("Pádel") == false){
        act.push("Pádel");
      }
      if(instalaciones[i].dadesPropies.serveis.tenis == true && act.includes("Tenis") == false){
        act.push("Tenis");
      }
      if(instalaciones[i].dadesPropies.serveis.spinning == true && act.includes("Spinning") == false){
        act.push("Spinning");
      }
    } 
    else {
      for (var i = 0; i < instalaciones.length; i++) {
        for (var j = 0; j < instalaciones[i].dadesPropies.esports.length; j++){
          if(act.includes(instalaciones[i].dadesPropies.esports[j]) == false){
            act.push(instalaciones[i].dadesPropies.esports[j]);
          }
        }
      }
    }
  }
  return act;
}


function setJsonFutbol(instalaciones){
  campos = instalaciones;
}

function setJsonGimnasio(instalaciones){
  gimnasios = instalaciones;
}

function setJsonPropio(instalaciones){
  instPropias = instalaciones;
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


