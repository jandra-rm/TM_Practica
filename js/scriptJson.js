var gimnasios = null;
var campos = null;
var instPropias = null;
var comentarios = null;
var fullListDeporte = null;
var instalacionesVisibles = null;

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

function setFullList(instalaciones) {
  fullListDeporte = instalaciones;
  instalacionesVisibles = instalaciones;
}

function getCapacidadesCampos() {
  var arr = [];
  for (var i = 0; i < campos.length; i++) {
    arr.push(campos[i].dadesPropies.capacidad);
  }
  return arr;
}

function getValoraciones(inst) {
  var arr = [];
  for (var i = 0; i < inst.length; i++) {
    arr.push(inst[i].puntuacio);
  }
  return arr;
}

function getPrecios(inst) {
  var arr = [];
  for (var i = 0; i < inst.length; i++) {
    arr.push(inst[i].preu.import);
  }
  return arr;
}


function getInstalacionesByFiltros(servicios, actividades) {
  var inst = [];
  var cumpleFiltros;
  if (fullListDeporte[0].tipus.localeCompare("gym") == 0) {
    for (var i = 0; i < fullListDeporte.length; i++) {
      cumpleFiltros = true;
      for (var j = 0; j < servicios.length; j++) {
        switch (servicios[j]) {
          case "Piscina":
            if (fullListDeporte[i].dadesPropies.serveis.piscina == false) {
              cumpleFiltros = false;
            }
            break;
          case "Spa":
            if (fullListDeporte[i].dadesPropies.serveis.spa == false) {
              cumpleFiltros = false;
            }
            break;
          case "Sala fitness":
            if (fullListDeporte[i].dadesPropies.serveis.salaFitness == false) {
              cumpleFiltros = false;
            }
            break;
        }
      }

      for (var k = 0; k < actividades.length; k++) {
        switch (actividades[k]) {
          case "Pádel":
            if (fullListDeporte[i].dadesPropies.serveis.padel == false) {
              cumpleFiltros = false;
            }
            break;
          case "Tenis":
            if (fullListDeporte[i].dadesPropies.serveis.tenis == false) {
              cumpleFiltros = false;
            }
            break;
          case "Spinning":
            if (fullListDeporte[i].dadesPropies.serveis.spinning == false) {
              cumpleFiltros = false;
            }
            break;
        }
      }

      if (cumpleFiltros) {
        inst.push(fullListDeporte[i]);
      }
    }

  } else {
    var serv = [];
    var act = [];
    for (var i = 0; i < fullListDeporte.length; i++) {
      serv = [];
      act = [];
      cumpleFiltros = true;
      for (var j = 0; j < fullListDeporte[i].dadesPropies.serveis.length; j++) {
        serv.push(fullListDeporte[i].dadesPropies.serveis[j].nom);
      }
      for (var j = 0; j < fullListDeporte[i].dadesPropies.esports.length; j++) {
        act.push(fullListDeporte[i].dadesPropies.esports[j]);
      }
      for (var k = 0; k < servicios.length; k++) {
        if (serv.includes(servicios[k]) == false) {
          cumpleFiltros = false;
        } 
      }
      for (var k = 0; k < actividades.length; k++) {
        if (act.includes(actividades[k]) == false) {
          cumpleFiltros = false;
        }
      }

      if (cumpleFiltros) {
        inst.push(fullListDeporte[i]);
      }

    }
  }
  instalacionesVisibles = inst;
  return inst;
}


function getInstalacionesByFiltrosFut(servicios, cesped, capacidad) {
  var inst = [];
  var cumpleFiltros;
  for (var i = 0; i < fullListDeporte.length; i++){
    cumpleFiltros = true;
    switch (cesped){
      case "Cualquiera":
        cumpleFiltros = true;
        break;
      case "Artificial":
        if(fullListDeporte[i].detall.localeCompare("Artificial") != 0){
          cumpleFiltros = false;
        } 
        break;
      case "Natural":
        if(fullListDeporte[i].detall.localeCompare("Natural") != 0){
          cumpleFiltros = false;
        } 
        break;
    }

    if(fullListDeporte[i].dadesPropies.capacidad > capacidad){
      cumpleFiltros = false;
    }

    for (var j = 0; j < servicios.length; j++) {
      switch (servicios[j]) {
        case "Internet":
          if ((fullListDeporte[i].dadesPropies.internet).localeCompare("No") == 0) {
            cumpleFiltros = false;
          }
          break;
        case "Despacho arbitral":
          if ((fullListDeporte[i].dadesPropies.despachoarbitral).localeCompare("No") == 0) {
            cumpleFiltros = false;
          }
          break;
        case "Sala antidopaje":
          if ((fullListDeporte[i].dadesPropies.salaantidopaje).localeCompare("No") == 0) {
            cumpleFiltros = false;
          }
          break;
          case "Vallado":
            if ((fullListDeporte[i].dadesPropies.vallado).localeCompare("No") == 0) {
              cumpleFiltros = false;
            }
            break;
      }
    }
    if (cumpleFiltros) {
      inst.push(fullListDeporte[i]);
    }

  }
  
  instalacionesVisibles = inst;
  return inst;
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
var comentarios = null;

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
      cVal = $("input[name='like']:checked").val(),
      cmtList = getObject('cmtlist');

      if (instalacion.tipus.localeCompare("Campo") == 0) {
        cDpt = "FÚTBOL";
      } else if (instalacion.tipus.localeCompare("gym") == 0) {
        cDpt = "GIMNASIO";
      } else {
        cDpt = instalacion.detall;
      }

  if (cmtList){
    cmtList.push({dpt:cDpt,inst:cInst,name: cName, text: cText,val:cVal});
    setObject('cmtlist', cmtList);
  }else{ //Add a comment
    setObject('cmtlist', [{dpt:cDpt,inst:cInst,name: cName, text: cText,val:cVal}]);
  }

  bindCmt(cInst,cDpt);
}

function bindCmt(nom,esport){
  //clearStorage();
  var cmtListElement = $('#cmtlist'),
      cmtList = getObject('cmtlist');

  //Out with the old
  cmtListElement.empty();
  //And in with the new
  var today = new Date();
  for (var j = 0; j < comentarios.length; j++) {
    if(comentarios[j].instalacio.localeCompare(nom)==0){
      
      cmtListElement.append( $('<li><div class="comment-main-level">'+
			'<div class="comment-avatar"><img src="https://img.icons8.com/bubbles/2x/user-male.png" alt=""></div>'+
			'<div class="comment-box">'+
			'<div class="comment-head"><h6 class="comment-name by-author"><a href="http://creaticode.com/blog">'+ comentarios[j].nom +'</a></h6><span>'+comentarios[j].data+"   "+getStars(comentarios[j].valoracio)+'</span>'+
			'</div><div class="comment-content">'+ comentarios[j].comentari +'</div></div></div></li>'));
    }
  }
  
  $.each(cmtList, function(i, k){
    if(k.inst == nom && k.dpt == esport){
      cmtListElement.append( $('<li><div class="comment-main-level">'+
			'<div class="comment-avatar"><img src="https://img.icons8.com/bubbles/2x/user-male.png" alt=""></div>'+
			'<div class="comment-box">'+
			'<div class="comment-head"><h6 class="comment-name by-author"><a href="http://creaticode.com/blog">'+ k.name +'</a></h6><span>'+getStars(k.val)+'</span>'+
			'</div><div class="comment-content">'+ k.text +'</div></div></div></li>'));
    }
  });

  
}

function createJSONLD(instalaciones){
  var instalacion="";
  //var s="";
  /*for (var j = 0; j < instalaciones.length-1; j++) {
    instalacion=instalaciones[j];
    s +='{'+
      '"@context": "https://schema.org",'+
      '"@type": "SportsActivityLocation",'+
      '"description": "'+instalacion.descripcio+'",'
      '"address": {'+
        '"@type": "PostalAddress",'+
        '"streetAddress": "'+instalacion.geo1.address+'",'+
        '"addressLocality": "'+instalacion.geo1.city+'",'+
        '"addressRegion": "a",'+
        '"postalCode": "'+instalacion.geo1.zip+'",'+
        '"addressCountry": "Spain"'+
      '},'+
      '"geo": {'+
        '"@type": "GeoCoordinates",'+
        '"latitude": "'+instalacion.geo1.lat+'",'+
        '"longitude": "'+instalacion.geo1.long+'"'+
      '},'+
      '"openingHours": "'+instalacion.horari+'",'+
      '"contactPoint": {'+
        '"@type": "ContactPoint",'+
        '"telephone": "'+instalacion.contacte.telf+'"'+
      '}'+
    '},';
  }*/

  instalacion=instalaciones[0];
  let s ={
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "name": instalacion.nom,
      "image": instalacion.imatges[0],
      "description": instalacion.descripcio,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": instalacion.geo1.address,
        "addressLocality": instalacion.geo1.city,
        "addressRegion": "Islas Baleares",
        "postalCode": instalacion.geo1.zip,
        "addressCountry": "España"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": instalacion.geo1.lat,
        "longitude": instalacion.geo1.long,
      },
      "openingHours": instalacion.horari,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": instalacion.contacte.telf,
      }
    };
    //$("#webSemantica").textContent+=JSON.stringify(s);

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(s);
    document.head.appendChild(script);

}

/*

 '"@context": "https://schema.org",'+
      '"@type": "SportsActivityLocation",'+
      '"description": "'+instalacion.descripcio+'",'
      '"address": {'+
        '"@type": "PostalAddress",'+
        '"streetAddress": "'+instalacion.geo1.address+'",'+
        '"addressLocality": "'+instalacion.geo1.city+'",'+
        '"addressRegion": "a",'+
        '"postalCode": "'+instalacion.geo1.zip+'",'+
        '"addressCountry": "Spain"'+
      '},'+
      '"geo": {'+
        '"@type": "GeoCoordinates",'+
        '"latitude": "'+instalacion.geo1.lat+'",'+
        '"longitude": "'+instalacion.geo1.long+'"'+
      '},'+
      '"openingHours": "'+instalacion.horari+'",'+
      '"contactPoint": {'+
        '"@type": "ContactPoint",'+
        '"telephone": "'+instalacion.contacte.telf+'"'+
      '}'+
    '}';

*/