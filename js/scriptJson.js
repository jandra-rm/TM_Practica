var gimnasios = null;
var campos = null;
var instPropias = null;
var comentarios = null;
var fullListDeporte = null;

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
  for (var i = 0; instPropias != null && i < instPropias.length; i++) {
    instSport.push(instPropias[i].nom + ' - ' + instPropias[i].detall);
  }
  for (var i = 0; campos != null && i < campos.length; i++) {
    instSport.push(campos[i].nom + ' -  FÚTBOL');
  }
  for (var i = 0; gimnasios != null && i < gimnasios.length; i++) {
    instSport.push(gimnasios[i].nom + ' -  GIMNASIO');
  }
  autocomplete(document.getElementById("myInput"), instSport);
}

function getServeisSport(instalaciones) {
  var serv = [];
  if (instalaciones[0].tipus.localeCompare("gym") == 0) {
    serv.push("Piscina");
    serv.push("Spa");
    serv.push("Sala fitness");
  } else if (instalaciones[0].tipus.localeCompare("Campo") == 0) {
    serv.push("Internet");
    serv.push("Despacho arbitral");
    serv.push("Sala antidopaje");
    serv.push("Vallado");

  } else {
    for (var i = 0; i < instalaciones.length; i++) {
      for (var j = 0; j < instalaciones[i].dadesPropies.serveis.length; j++) {
        if (serv.includes(instalaciones[i].dadesPropies.serveis[j].nom) == false) {
          serv.push(instalaciones[i].dadesPropies.serveis[j].nom);
        }
      }
    }
  }
  return serv;
}

function getActivitatsSport(instalaciones) {
  var act = [];
  if (instalaciones[0].tipus.localeCompare("gym") == 0) {
    act.push("Pádel");
    act.push("Tenis");
    act.push("Spinning");
  } else {
    for (var i = 0; i < instalaciones.length; i++) {
      for (var j = 0; j < instalaciones[i].dadesPropies.esports.length; j++) {
        if (act.includes(instalaciones[i].dadesPropies.esports[j]) == false) {
          act.push(instalaciones[i].dadesPropies.esports[j]);
        }
      }
    }
  }
  return act;
}


function setJsonFutbol(instalaciones) {
  campos = instalaciones;
}

function setJsonGimnasio(instalaciones) {
  gimnasios = instalaciones;
}

function setJsonPropio(instalaciones) {
  instPropias = instalaciones;
}

function getCapacidadesCampos() {
  var arr = [];
  for (var i = 0; i < campos.length; i++) {
    arr.push(campos[i].dadesPropies.capacidad);
  }
  return arr;
}

function getValoraciones(inst){
  var arr = [];
  for (var i = 0; i < inst.length; i++) {
    arr.push(inst[i].puntuacio);
  }
  return arr;
}

function getPrecios(inst){
  var arr = [];
  for (var i = 0; i < inst.length; i++) {
    arr.push(inst[i].puntuacio);
  }
  return arr;
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



/* -- COMENTARIOS -- */

function setJsonComentario(cs) {
  comentarios = cs;
}
// utility functions for localstorage
function setObject(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
function getObject(key) {
  var storage = window.localStorage,
      value = storage.getItem(key);
  return value && JSON.parse(value);
}
function clearStorage() {
  window.localStorage.clear();
}

// Clear inputfields and localstorage
function clearComment(){
  $('#txt1').val('');
  $('#namebox').val('');
  clearStorage();
}

function saveComment(instalacion){
  var cText = $('#txt1').val(),
      cName = $('#namebox').val(),
      cInst = instalacion.nom,
      cmtList = getObject('cmtlist');

      if (instalacion.tipus.localeCompare("Campo") == 0) {
        cDpt = "FÚTBOL";
      } else if (instalacion.tipus.localeCompare("gym") == 0) {
        cDpt = "GIMNASIO";
      } else {
        cDpt = instalacion.detall;
      }

  if (cmtList){
    cmtList.push({dpt:cDpt,inst:cInst,name: cName, text: cText});
    setObject('cmtlist', cmtList);
  }else{ //Add a comment
    setObject('cmtlist', [{dpt:cDpt,inst:cInst,name: cName, text: cText}]);
  }

  bindCmt(cInst,cDpt);
}

function bindCmt(nom,esport){
  var cmtListElement = $('#cmtlist'),
      cmtList = getObject('cmtlist');

  //Out with the old
  cmtListElement.empty();
  //And in with the new

  for (var j = 0; j < comentarios.length; j++) {
    if(comentarios[j].instalacio.localeCompare(nom)==0){
      
      cmtListElement.append( $('<li><div class="comment-main-level">'+
			'<div class="comment-avatar"><img src="https://img.icons8.com/bubbles/2x/user-male.png" alt=""></div>'+
			'<div class="comment-box">'+
			'<div class="comment-head"><h6 class="comment-name by-author"><a href="http://creaticode.com/blog">'+ comentarios[j].nom +'</a></h6><span>hace 20 minutos</span>'+
			'</div><div class="comment-content">'+ comentarios[j].comentari +'</div></div></div></li>'));
    }
  }
  
  $.each(cmtList, function(i, k){
    if(k.inst == nom && k.dpt == esport){
      cmtListElement.append( $('<li><div class="comment-main-level">'+
			'<div class="comment-avatar"><img src="https://img.icons8.com/bubbles/2x/user-male.png" alt=""></div>'+
			'<div class="comment-box">'+
			'<div class="comment-head"><h6 class="comment-name by-author"><a href="http://creaticode.com/blog">'+ k.name +'</a></h6><span>hace 20 minutos</span>'+
			'</div><div class="comment-content">'+ k.text +'</div></div></div></li>'));
    }
  });

  
}

