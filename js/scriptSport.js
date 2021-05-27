var map = null;
var lat = null;
var long = null;
var myLayer = null;


function inicializarPagina(instalaciones) {
  setFullList(instalaciones);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      document.getElementById("findMe").setAttribute('style', 'display:show;');
      document.getElementById("distOpt").setAttribute('style', 'display:show;');
    },
      function (error) { //si soporta geo pero está bloqueada
        if (error.code == error.PERMISSION_DENIED)
        alert("La geolocalización está bloqueada");
      });

  } else { //el navegador no soporta geo
    document.getElementById("findMe").setAttribute('style', 'display:none;');
    alert("La geolocalización no está disponible");
  }
  createMap(instalaciones);
  menuFiltros(instalaciones);
  ordenarPor(instalaciones);
  aplicarOrden(document.getElementById("ordenacion").value, instalaciones);
}

function createMap(instalaciones) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxlLXJtIiwiYSI6ImNrbnZrdHBycDAzOXoydm1wcW9qYzgxbngifQ.Aj8rXdMUqmfNkQBb0Y29Hg';

  if (map !== undefined && map !== null) {
    map.remove(); // should remove the map from UI and clean the inner children of DOM element
  }
  map = L.mapbox.map('map')
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

  myLayer = L.mapbox.featureLayer().addTo(map);

  map.scrollWheelZoom.disable();

  var geoJson = creategeoJSON(instalaciones);

  myLayer.on('layeradd', function (e) {
    var marker = e.layer;
    var feature = marker.feature;
    var images = feature.properties.images
    var slideshowContent = '';

    for (var i = 0; i < images.length; i++) {
      var img = images[i];

      slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
        '<img src="' + img[0] + '" />' +
        '<div class="caption">' + '</div>' +
        '</div>';
    }

    // Create custom popup content
    var popupContent = '<div id="' + feature.properties.id + '" class="popup">' +
      '<h2>' + feature.properties.title + '</h2>' +
      '<div class="slideshow">' +
      slideshowContent +
      '</div>' +
      '<div class="cycle">' +
      '<a href="#" class="prev">&laquo; Anterior</a>' +
      '<a href="#" class="next">Siguiente &raquo;</a>' +
      '</div>' +
      '</div>';

    marker.bindPopup(popupContent, {
      closeButton: true,
      minWidth: 400
    });
  });

  // Add features to the map
  myLayer.setGeoJSON(geoJson);

  $('#map').on('click', '.popup .cycle a', function () {
    var $slideshow = $('.slideshow'),
      $newSlide;

    if ($(this).hasClass('prev')) {
      $newSlide = $slideshow.find('.active').prev();
      if ($newSlide.index() < 0) {
        $newSlide = $('.image').last();
      }
    } else {
      $newSlide = $slideshow.find('.active').next();
      if ($newSlide.index() < 0) {
        $newSlide = $('.image').first();
      }
    }

    $slideshow.find('.active').removeClass('active').hide();
    $newSlide.addClass('active').show();
    return false;
  });
  map.setView([39.66366548429903, 3.0069055189508664], 9);


  // This uses the HTML5 geolocation API, which is available on
  // most mobile browsers and modern browsers, but not in Internet Explorer
  //
  // See this chart of compatibility for details:
  // http://caniuse.com/#feat=geolocation
  var myLayer2 = L.mapbox.featureLayer().addTo(map);

  document.getElementById('geolocate').onclick = function () {
    map.flyTo([lat, long], 15);
    myLayer2.setGeoJSON({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [long, lat]
      },
      properties: {
        'title': 'Estoy aquí',
        'marker-color': '#FF6B6B',
        'marker-size': 'medium',
        'marker-symbol': 'pitch'
      }
    });
  };
}

function ordenarPor(instalaciones) {
  var divOrdenacion = document.createElement("div");
  var span = document.createElement("span");
  var b = document.createElement("b");
  b.innerText = "Ordenar por: ";
  span.appendChild(b);

  var sel = document.createElement("select");
  sel.name = "ordenacion";
  sel.id = "ordenacion";
  sel.onchange = function () {
    aplicarOrden(document.getElementById("ordenacion").value, instalacionesVisibles);
  };
  var def = document.createElement("option");
  def.value = "default";

  var val = document.createElement("option");
  val.value = "valoracion";
  val.innerText = "Valoración";

  var prec = document.createElement("option");
  prec.value = "precio";
  prec.innerText = "Precio";
  if (instalaciones[0].tipus.localeCompare("Campo") == 0) {
    prec.setAttribute('style', 'display:none;');
  }

  var dist = document.createElement("option");
  dist.id = "distOpt";
  dist.value = "distancia";
  dist.innerText = "Distancia";
  dist.setAttribute('style', 'display:none;');

  sel.appendChild(def);
  sel.appendChild(val);
  sel.appendChild(prec);
  sel.appendChild(dist);

  divOrdenacion.appendChild(span);
  divOrdenacion.appendChild(sel);

  document.getElementById('orden').appendChild(divOrdenacion);
}

function aplicarOrden(valor, instalaciones) {
  switch (valor) {
    case "default":
      createCards(instalaciones);
      break;
    case "valoracion":
      var valoraciones = getValoraciones(instalaciones);
      orderByVal(valoraciones, instalaciones);
      break;
    case "precio":
      var precios = getPrecios(instalaciones);
      orderByPrecio(precios, instalaciones);
      break;
    case "distancia":
      getDistancias(instalaciones);
      break;

  }
}
function menuFiltros(instalaciones) {
  if (instalaciones[0].tipus.localeCompare("Campo") == 0) {
    filtrosFutbol(instalaciones);
  } else {
    var filterButton = document.createElement("button");
    filterButton.classList.add('btn', 'btn-info');
    filterButton.setAttribute("type", "button");
    filterButton.setAttribute("data-toggle", "collapse");
    filterButton.setAttribute("data-target", "#filtross");
    filterButton.setAttribute("style", "margin-right:20px; margin-top:20px;");
    filterButton.innerHTML =
      'Filtros: <span class="fa fa-filter pl-1"></span>';

    var divFiltros = document.createElement("div");
    divFiltros.id = "filtross";
    divFiltros.classList.add('collapse');


    var filters = document.createElement("div");
    filters.classList.add('card', 'card-body');
    filters.setAttribute("style", "text-align: left;overflow:auto");


    var servicios = document.createElement("div");
    servicios.innerHTML = '<div class="py-2 border-bottom ml-3">' +
      '<h3 class="font-weight-bold" style="color:#FF6B6B">Servicios</h3>' +
      '<form>';
    var listaServ = getServeisSport(instalaciones);
    for (var i = 0; i < listaServ.length; i++) {
      servicios.innerHTML += '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="checkbox" name = "servicios" onclick = "validarInstalaciones()" id="' + listaServ[i] + '"> <label for="' + listaServ[i] + '">' +
        listaServ[i] + '</label> </div>';
    }
    servicios.innerHTML += '</form>' +
      '</div>';

    var actividades = document.createElement("div");
    actividades.innerHTML = '<div class="py-2 border-bottom ml-3">' +
      '<h3 style="color:#FF6B6B" class="font-weight-bold">Se puede practicar</h3>' +
      '<form>';
    var listaAct = getActivitatsSport(instalaciones);
    for (var i = 0; i < listaAct.length; i++) {
      actividades.innerHTML += '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="checkbox" name = "actividades" onclick = "validarInstalaciones()" id="' + listaAct[i] + '"> <label for="' + listaAct[i] + '">' +
        listaAct[i] + '</label> </div>';
    }
    actividades.innerHTML += '</form>' +
      '</div>';

    filters.appendChild(servicios);
    filters.appendChild(actividades);
    divFiltros.appendChild(filters);

    document.getElementById("menuFiltros").appendChild(filterButton);
    document.getElementById("menuFiltros").appendChild(divFiltros);
  }
}

function filtrosFutbol(instalaciones) {
  var filterButton = document.createElement("button");
  filterButton.classList.add('btn', 'btn-info');
  filterButton.setAttribute("type", "button");
  filterButton.setAttribute("data-toggle", "collapse");
  filterButton.setAttribute("data-target", "#filtross");
  filterButton.setAttribute("style", "margin-right:20px; margin-top:20px;");
  filterButton.innerHTML =
    'Filtros: <span class="fa fa-filter pl-1"></span>';

  var divFiltros = document.createElement("div");
  divFiltros.id = "filtross";
  divFiltros.classList.add('collapse');


  var filters = document.createElement("div");
  filters.classList.add('card', 'card-body');
  filters.setAttribute("style", "text-align: left;overflow:auto");

  var cesped = document.createElement("div");
  cesped.innerHTML = '<div class="py-2 border-bottom ml-3">' +
    '<h3 class="font-weight-bold" style="color:#FF6B6B">Césped</h3>' +
    '<form>' +
    '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="radio" name="cesped" checked="checked" onclick = "validarInstalacionesFutbol()" id="Cualquier"> <label for="Cualquier">Cualquiera</label> </div>' +
    '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="radio" name="cesped" onclick = "validarInstalacionesFutbol()" id="Natural"> <label for="Natural">Natural</label> </div>' +
    '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="radio" name="cesped" onclick = "validarInstalacionesFutbol()" id="Artificial"> <label for="Artificial">Artificial</label> </div>' +
    '</form>' +
    '</div>';

  var servicios = document.createElement("div");
  servicios.innerHTML = '<div class="py-2 border-bottom ml-3">' +
    '<h3 class="font-weight-bold" style="color:#FF6B6B">Servicios</h3>' +
    '<form>';
  var listaServ = getServeisSport(instalaciones);
  for (var i = 0; i < listaServ.length; i++) {
    servicios.innerHTML += '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"> <input type="checkbox" name="servicios" onclick = "validarInstalacionesFutbol()" id="' + listaServ[i] + '"> <label for="' + listaServ[i] + '">' +
      listaServ[i] + '</label> </div>';
  }
  servicios.innerHTML += '</form>' +
    '</div>';

  var capacidades = getCapacidadesCampos();
  var min = Math.min.apply(null, capacidades);
  var max = Math.max.apply(null, capacidades);
  var capacidad = document.createElement("div");
  capacidad.innerHTML = '<div class="py-2 border-bottom ml-3">' +
    '<h3 class="font-weight-bold" style="color:#FF6B6B">Capacidad</h3>' +
    '<div class="d-flex justify-content-center my-4">' +
    '<span class="font-weight-bold mr-2 ">' + min + '</span>' +
    '<form class="range-field w-50">' +
    '<div class="form-group" style=font-size:1.5rem;font-family:"Montserrat"><input class="custom-range border-0" type="range" id="capacidad" onmouseup="validarInstalacionesFutbol()" min="' + min + '" max="' + max + '" /></div>' +
    '</form>' +
    '<span class="font-weight-bold ml-2">' + max + '</span>' +
    '</div>';


  filters.appendChild(cesped);
  filters.appendChild(servicios);
  filters.appendChild(capacidad);
  divFiltros.appendChild(filters);

  document.getElementById("menuFiltros").appendChild(filterButton);
  document.getElementById("menuFiltros").appendChild(divFiltros);
}


function validarInstalaciones(){
  var servicios = validarServicios();
  var actividades = validarActividades();
  var instCompatibles = getInstalacionesByFiltros(servicios, actividades);
  const myList = document.getElementById("listado");
  if (myList.hasChildNodes() == true) {
    while (myList.firstChild) {
      myList.removeChild(myList.lastChild);
    }
  }
  if(instCompatibles.length > 0){
    myLayer.setGeoJSON(creategeoJSON(instCompatibles));
    aplicarOrden(document.getElementById("ordenacion").value, instCompatibles);
  }else{
    document.getElementById("resultados").innerHTML = instCompatibles.length + " resultados";
  }
  
}

function validarInstalacionesFutbol(){
  var cesped = validarCesped();
  var servicios = validarServicios();
  var capacidad = document.getElementById("capacidad").value;
  var instCompatibles = getInstalacionesByFiltrosFut(servicios, cesped, capacidad);
  const myList = document.getElementById("listado");
  if (myList.hasChildNodes() == true) {
    while (myList.firstChild) {
      myList.removeChild(myList.lastChild);
    }
  }
  if(instCompatibles.length > 0){
    myLayer.setGeoJSON(creategeoJSON(instCompatibles));
    aplicarOrden(document.getElementById("ordenacion").value, instCompatibles);
  }else{
    document.getElementById("resultados").innerHTML = instCompatibles.length + " resultados";
  }
}

function validarServicios() {
  var checkboxes = document.getElementsByName("servicios");
  var serviciosSelected = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      serviciosSelected.push(checkboxes[i].id);
    }
  }
  return serviciosSelected;
}

function validarActividades() {
  var checkboxes = document.getElementsByName("actividades");
  var actividadesSelected = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      actividadesSelected.push(checkboxes[i].id);
    }
  }
  return actividadesSelected;
}


function validarCesped() {
  var radio = document.getElementsByName("cesped");
  for(var i = 0; i<radio.length; i++){
    if (radio[i].checked) {
      return radio[i].id;
    }
  }
}


function getDistancias(inst) {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=" + lat + "," + long + "&destinations=";
  for (l = 0; l < inst.length; l++) {
    url += inst[l].geo1.lat + "," + inst[l].geo1.long;
    if (l < (inst.length - 1)) url += ";";
  }
  url += "&travelMode=driving&key=Aq4r7Sjg24ktC2N-8CfobSzEJNwXA_wD1aZXNKP6NIC12Iuj0b7ad3iYINUgpnSt";

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      instDist = [];
      for (l = 0; l < myArr["resourceSets"][0]["resources"][0]["results"].length; l++) {
        instDist[l] = myArr["resourceSets"][0]["resources"][0]["results"][l]["travelDistance"];
      }

      var indexOrderedByDist = getInstCercanas(instDist);
      const myList = document.getElementById("listado");
      if (myList.hasChildNodes() == true) {
        while (myList.firstChild) {
          myList.removeChild(myList.lastChild);
        }
      }
      var instOrderedByDist = [];
      for (var i = 0; i < inst.length; i++) {
        instOrderedByDist.push(inst[indexOrderedByDist[0][i]]);
      }
      createCards(instOrderedByDist);

      return instDist;
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

}

function getInstCercanas(distanciasSinOrdenar) {
  var distancias = distanciasSinOrdenar.slice(); //duplicar array para tener uno ordenado y otro sin ordenar
  distancias.sort((a, b) => a - b); //ordenar por distancia (menor a mayor)

  var instCercanas = [];
  var n;
  for (i = 0; i < distancias.length; i++) {
    n = distanciasSinOrdenar.indexOf(distancias[i]);
    if (!instCercanas.includes(n)) {
      instCercanas.push(n);
    } else {
      for (ind = 0; ind < distancias.length; ind++) {
        var aux = distanciasSinOrdenar.slice(n + 1, distanciasSinOrdenar.length);
        n += 1 + aux.indexOf(distancias[i]);
        console.log(n);
        if (!instCercanas.includes(n)) {
          instCercanas.push(n);
          break;
        }
      }
    }
  }
  return [instCercanas, distancias];
}



function orderByVal(valoracionesSinOrdenar, instalaciones) {
  var valoraciones = valoracionesSinOrdenar.slice(); //duplicar array para tener uno ordenado y otro sin ordenar
  valoraciones.sort((a, b) => b - a); //ordenar por valoracion (mayor a menor)

  var valOrdenadas = [];
  var n;
  for (i = 0; i < valoraciones.length; i++) {
    n = valoracionesSinOrdenar.indexOf(valoraciones[i]);
    if (!valOrdenadas.includes(n)) {
      valOrdenadas.push(n);
    } else {
      for (ind = 0; ind < valOrdenadas.length; ind++) {
        var aux = valoracionesSinOrdenar.slice(n + 1, valoracionesSinOrdenar.length);
        n += 1 + aux.indexOf(valoraciones[i]);
        if (!valOrdenadas.includes(n)) {
          valOrdenadas.push(n);
          break;
        }
      }
    }
  }

  const myList = document.getElementById("listado");
  if (myList.hasChildNodes() == true) {
    while (myList.firstChild) {
      myList.removeChild(myList.lastChild);
    }
  }
  var instOrderedByVal = [];
  for (var i = 0; i < instalaciones.length; i++) {
    instOrderedByVal.push(instalaciones[valOrdenadas[i]]);
  }
  createCards(instOrderedByVal);

}

function orderByPrecio(preciosSinOrdenar, instalaciones) {
  var precios = preciosSinOrdenar.slice(); //duplicar array para tener uno ordenado y otro sin ordenar
  precios.sort((a, b) => a - b); //ordenar por valoracion (menor a mayor)

  var precOrdenados = [];
  var n;
  for (i = 0; i < precios.length; i++) {
    n = preciosSinOrdenar.indexOf(precios[i]);
    if (!precOrdenados.includes(n)) {
      precOrdenados.push(n);
    } else {
      for (ind = 0; ind < precOrdenados.length; ind++) {
        var aux = preciosSinOrdenar.slice(n + 1, preciosSinOrdenar.length);
        n += 1 + aux.indexOf(precios[i]);
        if (!precOrdenados.includes(n)) {
          precOrdenados.push(n);
          break;
        }
      }
    }
  }

  const myList = document.getElementById("listado");
  if (myList.hasChildNodes() == true) {
    while (myList.firstChild) {
      myList.removeChild(myList.lastChild);
    }
  }
  var instOrderedByPrec = [];
  for (var i = 0; i < instalaciones.length; i++) {
    instOrderedByPrec.push(instalaciones[precOrdenados[i]]);
  }
  createCards(instOrderedByPrec);

}



function createCards(instalaciones) {
  if (instalaciones.length == 1) {
    document.getElementById("resultados").innerHTML = instalaciones.length + " resultado";
  } else {
    document.getElementById("resultados").innerHTML = instalaciones.length + " resultados";
  }
  var i = 0;
  //Primera iteración
  var card = document.createElement("div");
  card.classList.add('card', 'card-borde', 'card-size-1');

  var img = document.createElement("img");
  img.className = "card-img-top";
  img.src = instalaciones[i].imatges[0];
  img.alt = instalaciones[i].nom;

  var cont = document.createElement("div");
  cont.className = "card-body";

  var inner = document.createElement("div");
  inner.classList.add('d-flex', 'justify-content-between');

  var name = document.createElement("h3");
  name.className = "card-title";
  name.innerText = instalaciones[i].nom;


  var stars = document.createElement("span");
  stars.id = "stars" + instalaciones[i].nom;

  var button = document.createElement("button");
  button.id = "bModal";
  button.classList.add('btn', 'btn-info', 'btn-lg', 'float-right');
  button.setAttribute("data-toggle", "modal");
  button.setAttribute("data-target", "#myModal");
  button.textContent = "Ver más";
  const b = button;
  const inst = instalaciones[i];
  b.onclick = function () {
    const myModal = document.getElementById("myModal");
    if (myModal.hasChildNodes() == true) {
      while (myModal.firstChild) {
        myModal.removeChild(myModal.lastChild);
      }
    }
    createModal(inst);
    if (inst.tipus.localeCompare("Campo") == 0) {
      bindCmt(inst.nom, "FÚTBOL");
    } else if (inst.tipus.localeCompare("gym") == 0) {
      bindCmt(inst.nom, "GIMNASIO");
    } else {
      bindCmt(inst.nom, inst.detall);
    }
  }
  inner.appendChild(name);
  inner.appendChild(stars);
  cont.appendChild(inner);
  cont.appendChild(button);
  card.appendChild(img);
  card.appendChild(cont);
  document.getElementById("listado").appendChild(card);


  //Siguientes iteraciones 
  for (i = 1; i < instalaciones.length; i++) {
    var clncard = card.cloneNode(false);

    var clnimg = img.cloneNode(false);
    clnimg.src = instalaciones[i].imatges[0];
    clnimg.alt = instalaciones[i].nom;

    var clncont = cont.cloneNode(false);

    var clninner = inner.cloneNode(false);

    var clnname = name.cloneNode(false);
    clnname.innerText = instalaciones[i].nom;

    var clnstars = stars.cloneNode(false);
    clnstars.id = "stars" + instalaciones[i].nom;

    var clnbutton = button.cloneNode(false);
    clnbutton.id = "bModal";
    clnbutton.textContent = "Ver más";
    const b = clnbutton;
    const inst = instalaciones[i];
    b.onclick = function () {
      const myModal = document.getElementById("myModal");
      if (myModal.hasChildNodes() == true) {
        while (myModal.firstChild) {
          myModal.removeChild(myModal.lastChild);
        }
      }
      createModal(inst);
    }
    clninner.appendChild(clnname);
    clninner.appendChild(clnstars);
    clncont.appendChild(clninner);
    clncont.appendChild(clnbutton);
    clncard.appendChild(clnimg);
    clncard.appendChild(clncont);
    document.getElementById("listado").appendChild(clncard);
  }


  for (var k = 0; k < instalaciones.length; k++) {
    document.getElementById("stars" + instalaciones[k].nom).innerHTML = getStars(instalaciones[k].puntuacio);
  }

  /*var s="";
  for(var x=0; x<instalaciones.length; x++){
    //Añadimos la información al json ld
    s+='{'+
      '"@context": "https://schema.org/SportsActivityLocation",'+
      '"@type": "Organization",'+
      '"description": "'+instalaciones[x].descripcio+'",'
      '"address": {'+
        '"@type": "PostalAddress",'+
        '"streetAddress": "'+instalaciones[x].geo1.address+'",'+
        '"addressLocality": "'+instalaciones[x].geo1.city+'",'+
        '"addressRegion": "a",'+
        '"postalCode": "'+instalaciones[x].geo1.zip+'",'+
        '"addressCountry": "Spain"'+
      '},'+
      '"geo": {'+
        '"@type": "GeoCoordinates",'+
        '"latitude": "'+instalaciones[x].geo1.lat+'",'+
        '"longitude": "'+instalaciones[x].geo1.long+'"'+
      '},'+
      '"openingHours": "'+instalaciones[x].horari+'",'+
      '"contactPoint": {'+
        '"@type": "ContactPoint",'+
        '"telephone": "'+instalaciones[x].contacte.telf+'"'+
      '}'+
    '}';
    $("#webSemantica").innerHTML+=JSON.stringify(s);
    console.log(s);
  }*/
}


function createModal(instalacion) {
  var divModal2 = document.createElement("div");
  divModal2.classList.add('modal-dialog', 'modal-xl', 'modal-dialog-scrollable');
  divModal2.setAttribute("itemtype","https://schema.org/SportsActivityLocation");

  var divModalContent = document.createElement("div");
  divModalContent.classList.add('modal-content');

  var divModalHeader = document.createElement("div");
  divModalHeader.classList.add('modal-header');
  //divModalHeader.setAttribute("itemscope");
  //divModalHeader.setAttribute("itemtype","http://schema.org/SportsActivityLocation")

  var h4 = document.createElement("h4");
  h4.classList.add('modal-title', 'col-11');
  h4.setAttribute('style', 'color: white;');
  if (instalacion.tipus.localeCompare("Campo") == 0) {
    h4.textContent = instalacion.nom + " - " + "FÚTBOL";
  } else if (instalacion.tipus.localeCompare("gym") == 0) {
    h4.textContent = instalacion.nom + " - " + "GIMNASIO";
  } else {
    h4.textContent = instalacion.nom + " - " + instalacion.detall;
  }


  var divModalBody = document.createElement("div");
  divModalBody.classList.add('modal-body');
  divModalBody.id = "modalBody";

  // EN ESTE DIV VAN TODAS LAS COSAS QUE QUERAMOS METER EN EL MODAL
  var divModalFooter = document.createElement("div");
  divModalFooter.classList.add('modal-footer');

  var buttonClose = document.createElement("button");
  buttonClose.classList.add('btn', 'btn-info');
  buttonClose.setAttribute("data-dismiss", "modal");
  buttonClose.textContent = "Cerrar";

  var crossClose = document.createElement("button");
  crossClose.type = "button";
  crossClose.className = "close";
  crossClose.setAttribute("data-dismiss", "modal");
  crossClose.setAttribute("aria-label", "Close");

  var span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = "&times";
  crossClose.appendChild(span);

  divModalHeader.appendChild(h4);
  divModalHeader.appendChild(crossClose);
  divModalFooter.appendChild(buttonClose);
  divModalContent.appendChild(divModalHeader);
  divModalContent.appendChild(divModalBody);
  divModalContent.appendChild(divModalFooter);
  divModal2.appendChild(divModalContent);

  document.getElementById('myModal').appendChild(divModal2);

  rellenarModal(instalacion);

  /*var s ='{'+
      '"@context": "https://schema.org/SportsActivityLocation",'+
      '"@type": "Organization",'+
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
      //'"openingHours": "'+instalacion.horari+'",'+
      '"contactPoint": {'+
        '"@type": "ContactPoint",'+
        '"telephone": "'+instalacion.contacte.telf+'"'+
      '}'+
    '}';
    $("#webSemantica").textContent+=JSON.stringify(s);*/

    var s ='{'+
      '"@context": "https://schema.org/SportsActivityLocation",'+
      '"@type": "Organization",'+
      '"description": "hola",'
      '"address": {'+
        '"@type": "PostalAddress",'+
        '"streetAddress": "0.323",'+
        '"addressLocality": "0.343",'+
        '"addressRegion": "a",'+
        '"postalCode": "aaaa",'+
        '"addressCountry": "Spain"'+
      '},'+
      '"geo": {'+
        '"@type": "GeoCoordinates",'+
        '"latitude": "0.323",'+
        '"longitude": "0.343"'+
      '},'+
      //'"openingHours": "'+instalacion.horari+'",'+
      '"contactPoint": {'+
        '"@type": "ContactPoint",'+
        '"telephone": "123456789"'+
      '}'+
    '}';
    $("#webSemantica").textContent+=JSON.stringify(s);


}

function rellenarModal(instalacion) {
  var divContainer = document.createElement("div");
  divContainer.classList.add('container', 'ml-0', 'mr-0');

  var divRow = document.createElement("div");
  divRow.classList.add('row');

  var divCol = document.createElement("div");
  divCol.classList.add('col', 'ml-0', 'mr-0');
  divCol.id = "info-instalacion";

  var divCol2 = document.createElement("div");
  divCol2.classList.add('col', 'text-center', 'ml-0', 'mr-0');

  // Ubicación
  var pUbicacio = document.createElement("p");
  pUbicacio.classList.add('small');
  var marker = document.createElement("i");
  marker.classList.add('fas', 'fa-map-marker-alt');
  var spanMarker = document.createElement("span");
  spanMarker.setAttribute("style", "font-size:17px");
  spanMarker.textContent = "  " + instalacion.geo1.address;
  pUbicacio.appendChild(marker);
  pUbicacio.appendChild(spanMarker);

  // Horario  
  var pHorari = document.createElement("p");
  pHorari.classList.add('small');
  var clock = document.createElement("i");
  clock.classList.add('fas', 'fa-clock');
  var spanClock = document.createElement("span");
  spanClock.setAttribute("style", "font-size:17px");
  spanClock.textContent = "  Horario:  ";

  /* ------- FUNCION HORARIO ---------- */

  var horari = instalacion.horari;
  var d = new Date();

  var buttonHorari = document.createElement("button");
  buttonHorari.classList.add('btn', 'btn-info');
  buttonHorari.setAttribute("type", "button");
  buttonHorari.setAttribute("data-toggle", "collapse");
  buttonHorari.setAttribute("data-target", "#collapseInfo");
  var divButton = document.createElement("div");
  divButton.classList.add('collapse');
  divButton.id = "collapseInfo";
  var divInfo = document.createElement("div");
  divInfo.classList.add('card', 'card-body');
  divInfo.setAttribute('style', 'white-space:pre; overflow:auto');
  
  // Cogemos el día de hoy para mostrarlo
  switch (d.getDay()) {
    case 0:
      if (horari.dg.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.dg[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.dg[0].in + " - " + horari.dg[0].out;
        if (horari.dg.length > 1) {
          if (horari.dg[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.dg[1].in + " - " + horari.dg[1].out + "\r\n";
          }
        }
      }
      break;
    case 1:
      if (horari.di.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.di[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.di[0].in + " - " + horari.di[0].out;
        if (horari.di.length > 1) {
          if (horari.di[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.di[1].in + " - " + horari.di[1].out + "\r\n";
          }
        }
      }
      break;
    case 2:
      if (horari.dm.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.dm[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.dm[0].in + " - " + horari.dm[0].out;
        if (horari.dm.length > 1) {
          if (horari.dm[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.dm[1].in + " - " + horari.dm[1].out + "\r\n";
          }
        }
      }
      break;
    case 3:
      if (horari.dx.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.dx[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.dx[0].in + " - " + horari.dx[0].out;
        if (horari.dx.length > 1) {
          if (horari.dx[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.dx[1].in + " - " + horari.dx[1].out + "\r\n";
          }
        }
      }
      break;
    case 4:
      if (horari.dj.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.dj[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.dj[0].in + " - " + horari.dj[0].out;
        if (horari.dj.length > 1) {
          if (horari.dj[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.dj[1].in + " - " + horari.dj[1].out + "\r\n";
          }
        }
      }
      break;
    case 5:
      if (horari.dv.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.dv[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.dv[0].in + " - " + horari.dv[0].out;
        if (horari.dv.length > 1) {
          if (horari.dv[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.dv[1].in + " - " + horari.dv[1].out + "\r\n";
          }
        }
      }
      break;
    case 6:
      if (horari.ds.length == 0) {
        buttonHorari.textContent = "Hoy → cerrado";
      } else if (horari.ds[0].in.localeCompare('-') == 0) {
        buttonHorari.textContent = "Hoy →  cerrado";
      } else {
        buttonHorari.textContent = "Hoy → " + horari.ds[0].in + " - " + horari.ds[0].out;
        if (horari.ds.length > 1) {
          if (horari.ds[1].in.localeCompare('-') != 0) {
            buttonHorari.textContent += ", " + horari.ds[1].in + " - " + horari.ds[1].out + "\r\n";
          }
        }
      }
      break;
  }
  // Mostramos la semana al desplegar
  //LUNES
  if (horari.di.length == 0) {
    divInfo.textContent += "Lunes → cerrado\r\n";
  } else if (horari.di[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Lunes →  cerrado\r\n";
  } else {
    divInfo.textContent += "Lunes → " + horari.di[0].in + " - " + horari.di[0].out;
    if (horari.di.length > 1) {
      if (horari.di[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.di[1].in + " - " + horari.di[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //MARTES
  if (horari.dm.length == 0) {
    divInfo.textContent += "Martes → cerrado\r\n";
  } else if (horari.dm[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Martes →  cerrado\r\n";
  } else {
    divInfo.textContent += "Martes → " + horari.dm[0].in + " - " + horari.dm[0].out;
    if (horari.dm.length > 1) {
      if (horari.dm[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.dm[1].in + " - " + horari.dm[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //MIÉRCOLES
  if (horari.dx.length == 0) {
    divInfo.textContent += "Miércoles → cerrado\r\n";
  } else if (horari.dx[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Miércoles →  cerrado\r\n";
  } else {
    divInfo.textContent += "Miércoles → " + horari.dx[0].in + " - " + horari.dx[0].out;
    if (horari.dx.length > 1) {
      if (horari.dx[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.dx[1].in + " - " + horari.dx[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //JUEVES
  if (horari.dj.length == 0) {
    divInfo.textContent += "Jueves → cerrado\r\n";
  } else if (horari.dj[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Jueves →  cerrado\r\n";
  } else {
    divInfo.textContent += "Jueves → " + horari.dj[0].in + " - " + horari.dj[0].out;
    if (horari.dj.length > 1) {
      if (horari.dj[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.dj[1].in + " - " + horari.dj[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //VIERNES
  if (horari.dv.length == 0) {
    divInfo.textContent += "Viernes → cerrado\r\n";
  } else if (horari.dv[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Viernes →  cerrado\r\n";
  } else {
    divInfo.textContent += "Viernes → " + horari.dv[0].in + " - " + horari.dv[0].out;
    if (horari.dv.length > 1) {
      if (horari.dv[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.dv[1].in + " - " + horari.dv[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //SÁBADO
  if (horari.ds.length == 0) {
    divInfo.textContent += "Sábado → cerrado\r\n";
  } else if (horari.ds[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Sábado →  cerrado\r\n";
  } else {
    divInfo.textContent += "Sábado → " + horari.ds[0].in + " - " + horari.ds[0].out;
    if (horari.ds.length > 1) {
      if (horari.ds[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.ds[1].in + " - " + horari.ds[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //DOMINGO
  if (horari.dg.length == 0) {
    divInfo.textContent += "Domingo → cerrado\r\n";
  } else if (horari.dg[0].in.localeCompare('-') == 0) {
    divInfo.textContent += "Domingo →  cerrado\r\n";
  } else {
    divInfo.textContent += "Domingo → " + horari.dg[0].in + " - " + horari.dg[0].out;
    if (horari.dg.length > 1) {
      if (horari.dg[1].in.localeCompare('-') != 0) {
        divInfo.textContent += ", " + horari.dg[1].in + " - " + horari.dg[1].out;
      }
    }
    divInfo.textContent += "\r\n";
  }
  //FESTIVOS
  if(instalacion.tipus.localeCompare("gym") != 0 && instalacion.tipus.localeCompare("Campo") != 0){
    if (instalacion.dadesPropies.festiu.esFestiu == true) {
      divInfo.textContent += "Festivos → ";
      divInfo.textContent += instalacion.dadesPropies.festiu.in + " - " + instalacion.dadesPropies.festiu.out + "\r\n";
    }
  }


divButton.appendChild(divInfo);
pHorari.appendChild(clock);
pHorari.appendChild(spanClock);
pHorari.appendChild(buttonHorari);
pHorari.appendChild(divButton);

buttonWeb = document.createElement("button");

// Teléfono
var pTelf = document.createElement("p");
pTelf.classList.add('small');
var telf = document.createElement("i");
telf.classList.add('fas', 'fa-phone');
var spanTelf = document.createElement("span");
spanTelf.setAttribute("style", "font-size:17px");
spanTelf.textContent = "  " + instalacion.contacte.telf;
pTelf.appendChild(telf);
pTelf.appendChild(spanTelf);

var pDescripcio = document.createElement("p");
pDescripcio.setAttribute("style", "font-size:17px;text-align:justify");
pDescripcio.textContent = instalacion.descripcio;

var divTiempo = document.createElement("div");
divTiempo.classList.add('container', 'shadow-lg', 'bg-white', 'rounded');
divTiempo.innerHTML+="<b>El tiempo de hoy:<b>";

var icono = document.createElement("img");
icono.id = "icono-weather";

pTiempo = document.createElement("span");
pTiempo.setAttribute("style", "font-size:17px");

var divTemp = document.createElement("span");
divTemp.id = "temperatura";

var divViento = document.createElement("span");
divViento.id = "viento";

var divHumedad = document.createElement("span");
divHumedad.id = "humedad";

//Meteo
var lat = instalacion.geo1.lat;
var long = instalacion.geo1.long;
$.getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&lang=es&appid=d1546bfd8c828a6a1add9c7173a462ac", function (json) {
  //Ahora
  $('#icono-weather').attr("src", "http://openweathermap.org/img/wn/" + json.current.weather[0].icon + "@2x.png");
  $('#temperatura').html((Math.round((json.current.temp - 273.15) * 10) / 10) + " °C");
  $('#viento').html("&emsp; <i class='fas fa-wind fa-1x'></i> " + (Math.round(json.current.wind_speed * 3.6)) + " kmh");
  $('#humedad').html(" &emsp; <i class='fas fa-tint fa-1x'></i> " + json.current.humidity + "%"); // <i class="fas fa-humidity"></i>
});

var comentario = document.createElement("div");
comentario.innerHTML = "<h4>Déjanos una valoración y un comentario:</h4><br><br>";
comentario.setAttribute("style", "margin-top:50px; font-size:17px");
comentario.classList.add('container', 'bg-white', 'rounded');
var formulario = document.createElement("form");
formulario.action = "javascript:void(0);";
var divForm = document.createElement("div");
var label = document.createElement("label");
var input = document.createElement("input");
var buttonForm = document.createElement("button");
buttonForm.id="dejarComentario";

divForm.classList.add('form-group');
label.setAttribute("for", "email");
label.textContent = "Nombre: ";
input.id = "namebox";
input.type="text";
input.classList.add('form-control');
input.setAttribute("placeholder","ejemplo: pepito");
divForm.appendChild(label);
divForm.appendChild(input);

var divForm2 = document.createElement("div");
var label2 = document.createElement("label");
var input2 = document.createElement("textarea");

divForm2.classList.add('form-group');
label2.setAttribute("for", "email");
label2.textContent = "Comentario: ";
input2.id = "txt1";
input2.classList.add('form-control');
input2.setAttribute("rows", "5");
input2.setAttribute("placeholder","Introduce aquí tu comentario.");
divForm2.appendChild(label2);
divForm2.appendChild(input2);


buttonForm.classList.add('btn', 'btn-info');
buttonForm.setAttribute("type", "submit");
buttonForm.textContent = "Dejar comentario";
buttonForm.onclick=function(){
  saveComment(instalacion);
}

var h4 = document.createElement("h4");
h4.textContent="Comentarios publicados:";


var cmts = document.createElement("div");
cmts.classList.add('comments-container');

var cmtsList = document.createElement("ul");
cmtsList.id="cmtlist";
cmtsList.classList.add('comments-list');

cmts.appendChild(cmtsList);




var fieldset = document.createElement("div");
fieldset.setAttribute("style", "overflow:hidden;margin-bottom:5px;");
fieldset.innerHTML =

'<section id="like" class="rating">'+
  '<input type="radio" id="heart_5" name="like" value="5" />'+
  '<label for="heart_5" title="Five">&#10084;</label>'+
  '<input type="radio" id="heart_4" name="like" value="4" />'+
  '<label for="heart_4" title="Four">&#10084;</label>'+
  '<input type="radio" id="heart_3" name="like" value="3" />'+
  '<label for="heart_3" title="Three">&#10084;</label>'+
  '<input type="radio" id="heart_2" name="like" value="2" />'+
  '<label for="heart_2" title="Two">&#10084;</label>'+
  '<input type="radio" id="heart_1" name="like" value="1" />'+
  '<label for="heart_1" title="One">&#10084;</label>'+
'</section>';

var servicios = document.createElement("div");
servicios.setAttribute("style", "font-size:17px");
servicios.innerHTML = "<h4>Servicios de la instalación:</h4> <br>";

if (instalacion.tipus.localeCompare("Campo") == 0) { // JSON de los campos de fútbol
  servicios.innerHTML += "  Capacidad: " + instalacion.dadesPropies.capacidad + "<br>";
  servicios.innerHTML += "  Vallado: " + instalacion.dadesPropies.vallado + "<br>";
  servicios.innerHTML += "  Dimensiones: " + instalacion.dadesPropies.dimensiones + "<br>";
  servicios.innerHTML += "  Internet: " + instalacion.dadesPropies.internet + "<br>";
}
else if (instalacion.tipus.localeCompare("gym") == 0) { // JSON de los gimnasios
  if (instalacion.dadesPropies.serveis.piscina == true) {
    servicios.innerHTML += "  Piscina<br>";
  }
  if (instalacion.dadesPropies.serveis.spa == true) {
    servicios.innerHTML += "  Spa<br>";
  }
  if (instalacion.dadesPropies.serveis.salaFitness == true) {
    servicios.innerHTML += "  Sala fitness<br>";
  }
  
} else {
  for (var i = 0; i < instalacion.dadesPropies.serveis.length; i++) {
    servicios.innerHTML +=
      '<p>' + instalacion.dadesPropies.serveis[i].icono + '   <span>' + instalacion.dadesPropies.serveis[i].nom + '</span></p>';
  }
}

servicios.innerHTML += "<br>";

var suscripcion = document.createElement("div");
suscripcion.setAttribute("style","margin-top:30px;");
suscripcion.id="suscrp";
if(instalacion.tipus.localeCompare("gym") !=0 && instalacion.tipus.localeCompare("Campo") !=0 && instalacion.dadesPropies.suscripcio.length !=0){
  var suscripciones = instalacion.dadesPropies.suscripcio;
  var s="";
  s+= '<h4>Precios:</h4>'+
  '<table class="table">'+
    '<thead><tr>'+
      '<th>Individual/Familiar</th>'+
      '<th>Cateogria</th>'+
      '<th>Precio</th>'+
    '</tr></thead>';
  for(var i=0; i<suscripciones.length; i++){
    s+=
    '<tr>'+
    '<td>'+suscripciones[i].familia+'</td>'+
    '<td>'+suscripciones[i].categoria+'</td>'+
    '<td>'+suscripciones[i].preu+' - '+ suscripciones[i].periodo +'</td>'+
    '</tr>';
  }
  s.innerHTML+="</table>";
  suscripcion.innerHTML=s;
}else{
  if(instalacion.tipus.localeCompare("Campo") !=0){
    suscripcion.innerHTML="<h4>Precio:</h4><b>"+instalacion.preu.import+"€</b>";
  }
}


formulario.appendChild(divForm);
formulario.appendChild(divForm2);
formulario.appendChild(fieldset);
formulario.appendChild(buttonForm);
comentario.appendChild(formulario);
comentario.appendChild(h4);
//cmts.appendChild(cmtsRow);
//comentario.appendChild(cmts);


/* ------- COLUMNA DERECHA ------- */
if(instalacion.contacte.xarxes.web.localeCompare("")!=0){
  var visitaWeb = document.createElement("button");
  visitaWeb.classList.add('btn', 'btn-info');
  //visitaWeb.setAttribute("target","_blank"); //  target="_blank" -> esto hace que se vaya a otra página
  visitaWeb.textContent = "Visita la web";
  visitaWeb.onclick = function () {
    window.open(instalacion.contacte.xarxes.web);
  }
  divCol2.appendChild(visitaWeb);
}


/* --- TWITTER --- */
var a = document.createElement("a");
a.className = "twitter-timeline";
a.setAttribute("data-lang", "es");
a.setAttribute("data-width", "400");
a.setAttribute("data-height", "550");
a.setAttribute("data-theme", "light");
a.href = instalacion.contacte.xarxes.twitter;

var script = document.createElement("script");
script.async = true;
script.src = "https://platform.twitter.com/widgets.js"
script.charset = "utf-8;"


pTiempo.appendChild(divTemp);
pTiempo.appendChild(divViento);
pTiempo.appendChild(divHumedad);

divTiempo.appendChild(icono);

divTiempo.appendChild(pTiempo);


divCol.appendChild(pUbicacio);
divCol.appendChild(pHorari);
divCol.appendChild(pTelf);
divCol.appendChild(pDescripcio);
divCol.appendChild(servicios);
divCol.appendChild(divTiempo);
divCol.appendChild(suscripcion);
divCol.appendChild(comentario);
divCol.appendChild(cmts);


divCol2.appendChild(a);
divCol2.appendChild(script);

divRow.appendChild(divCol);
divRow.appendChild(divCol2);
divContainer.appendChild(divRow);


document.getElementById('modalBody').appendChild(divContainer);

}

function getStars(rating) {
  // Round to nearest half
  rating = Math.round(rating * 2) / 2;
  let output = [];

  // Append all the filled whole stars
  for (var i = rating; i >= 1; i--)
    output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // If there is a half a star, append it
  if (i == .5) {
    output.push('<i class="fa fa-star-half" aria-hidden="true" style="color: gold;"></i>&nbsp;');
  }

  // Fill the empty stars
  for (let i = (5 - rating); i >= 1; i--)
    output.push('<i class="far fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  return output.join('');
}

//Funcion que cambia el arr[num]ero de objetos que salen por cada fila segun la eleccion del usuario
function objetosPorFila(n) {
  var elementos = document.getElementsByClassName('card-borde');

  switch (n) {
    case 1:
      for (i = 0; i < elementos.length; i++) {
        elementos[i].classList.remove("card-size-1");
        elementos[i].classList.remove("card-size-2");
        elementos[i].classList.add("card-size-1");
      }
      break;
    case 2:
      for (i = 0; i < elementos.length; i++) {
        elementos[i].classList.remove("card-size-1");
        elementos[i].classList.remove("card-size-2");
        elementos[i].classList.add("card-size-2");
      }
      break;
  }
}

//Funcion que cambia los objetos por fila segun la anchura de la ventana
function cambiarObjetosPorFila() {
  var w = document.documentElement.clientWidth;
  if (w < 750) {
    objetosPorFila(1);
  }
  else {
    objetosPorFila(2);
  }
}
function resizeListado() {
  window.addEventListener("resize", cambiarObjetosPorFila);
}