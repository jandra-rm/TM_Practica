var map = null;

function createMap(instalaciones) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxlLXJtIiwiYSI6ImNrbnZrdHBycDAzOXoydm1wcW9qYzgxbngifQ.Aj8rXdMUqmfNkQBb0Y29Hg';

  if (map !== undefined && map !== null) {
    map.remove(); // should remove the map from UI and clean the inner children of DOM element
  }
  map = L.mapbox.map('map')
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

  var myLayer = L.mapbox.featureLayer().addTo(map);

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

  var geolocate = document.getElementById('geolocate');
  if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
  } else {
    geolocate.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      map.locate();
    };
  }

  // Once we've got a position, zoom and center the map
  // on it, and add a single marker.
  map.on('locationfound', function (e) {
    map.flyTo([e.latlng.lat, e.latlng.lng], 15);
    myLayer2.setGeoJSON({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.latlng.lng, e.latlng.lat]
      },
      properties: {
        'title': 'Estoy aquí',
        'marker-color': '#FF6B6B',
        'marker-size': 'medium',
        'marker-symbol': 'pitch'
      }
    });




  });
  // If the user chooses not to allow their location
  // to be shared, display an error message.
  map.on('locationerror', function () {
    alert("La geolocalización no está disponible");
  });

}

function menuFiltros(instalaciones) {
  const filtros = document.getElementById("filtros");
  var titulo = document.createElement("h1");
  titulo.innerText = "Filtrar por";
  //servicios
  var servicios = document.createElement("h3");
  servicios.innerText = "Servicios:";
  var listServ = document.createElement("form");
  var lista = getServeisSport(instalaciones);
  
  for(var i=0; i<lista.length; i++){
  var check = document.createElement("div");
    check.className = "checkbox";
    var lab = document.createElement("label");
    var inp = document.createElement("input");
    inp.type = "checkbox";
    inp.value = "";
    lab.appendChild(inp);
    lab.innerText = lista[i];
    check.appendChild(lab);
    listServ.appendChild(check);
  }
  
  filtros.appendChild(titulo);
  filtros.appendChild(servicios);
  filtros.appendChild(listServ);
}

function createCards(instalaciones) {
  var i = 0;
  //Primera iteración
  var cont = document.createElement("div");
  cont.className = "col-6";
  var flipcard = document.createElement("div");
  flipcard.className = "flip-card";

  var inner = document.createElement("div");
  inner.className = "flip-card-inner";

  var front = document.createElement("div");
  front.className = "flip-card-front";

  var img = document.createElement("img");
  img.src = instalaciones[i].imatges[0];
  img.alt = instalaciones[i].nom;
  img.width = 400;
  img.height = 200;
  front.appendChild(img);

  var back = document.createElement("div");
  back.className = "flip-card-back";

  var name = document.createElement("h4");
  name.className = "flip-card-back-text";
  name.innerText = instalaciones[i].nom;

  var rating = document.createElement("h3");
  rating.className = "flip-card-back-text";
  rating.textContent = "Valoración: ";
  var stars = document.createElement("span");
  stars.id = "stars" + instalaciones[i].nom;
  rating.appendChild(stars);

  var button = document.createElement("button");
  button.id = "bModal";
  button.classList.add('btn', 'btn-info', 'btn-lg', 'flip-card-back-text');
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
  }
  back.appendChild(name);
  back.appendChild(rating);
  back.appendChild(button);

  inner.appendChild(front);
  inner.appendChild(back);
  flipcard.appendChild(inner);
  cont.appendChild(flipcard);
  document.getElementById("listado").appendChild(cont);

  
  //Siguientes iteraciones 
  for (i = 1; i < instalaciones.length; i++) {
    var clncont = cont.cloneNode(false);
    var clnflipcard = flipcard.cloneNode(false);
    var clninner = inner.cloneNode(false);
    var clnfront = front.cloneNode(false);
    var clnimg = img.cloneNode(false);
    clnimg.src = instalaciones[i].imatges[0];
    clnimg.alt = instalaciones[i].nom;
    clnfront.appendChild(clnimg);
    var clnback = back.cloneNode(false);
    var clnname = name.cloneNode(false);
    clnname.innerText = instalaciones[i].nom;
    var clnrating = rating.cloneNode(false);
    clnrating.textContent = "Valoración: ";
    var clnstars = stars.cloneNode(false);
    clnstars.id = "stars" + instalaciones[i].nom;
    clnrating.appendChild(clnstars);
    var clnbutton = button.cloneNode(false);
    clnbutton.id = "bModal";
    clnbutton.textContent = "Ver más";
    const bU = clnbutton;
    const inst = instalaciones[i];
    bU.onclick = function () {
      const myModal = document.getElementById("myModal");
      if (myModal.hasChildNodes() == true) {
        while (myModal.firstChild) {
          myModal.removeChild(myModal.lastChild);
        }
      }
      createModal(inst);
    }
    clnback.appendChild(clnname);
    clnback.appendChild(clnrating);
    clnback.appendChild(clnbutton);

    clninner.appendChild(clnfront);
    clninner.appendChild(clnback);
    clnflipcard.appendChild(clninner);
    clncont.appendChild(clnflipcard);
    document.getElementById("listado").appendChild(clncont);
  }
  

  for (var k = 0; k < instalaciones.length; k++){
    document.getElementById("stars"+instalaciones[k].nom).innerHTML = getStars(instalaciones[k].puntuacio);
  }
}


function createModal(instalacion) {
  var divModal2 = document.createElement("div");
  divModal2.classList.add('modal-dialog', 'modal-xl', 'modal-dialog-scrollable');

  var divModalContent = document.createElement("div");
  divModalContent.classList.add('modal-content');

  var divModalHeader = document.createElement("div");
  divModalHeader.classList.add('modal-header');

  var h4 = document.createElement("h4");
  h4.classList.add('modal-title', 'col-11');
  h4.style = "color:white;";
  h4.textContent = instalacion.nom + " - " + instalacion.detall;

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
}


function rellenarModal(instalacion){
  var divContainer = document.createElement("div");
  divContainer.classList.add('container');
 
  var divRow = document.createElement("div");
  divRow.classList.add('row');
 
  var divCol = document.createElement("div");
  divCol.classList.add('col-7');
  divCol.id="info-instalacion";

  var divCol2 = document.createElement("div");
  divCol2.classList.add('col','text-center');
  
  // Ubicación
  var pUbicacio = document.createElement("p");
  pUbicacio.classList.add('small');
  var marker = document.createElement("i");
  marker.classList.add('fas','fa-map-marker-alt');
  var spanMarker = document.createElement("span");
  spanMarker.setAttribute("style","font-size:17px");
  spanMarker.textContent = "  "+instalacion.geo1.address; 
  pUbicacio.appendChild(marker);
  pUbicacio.appendChild(spanMarker);

  // Horario  
  var pHorari = document.createElement("p");
  pHorari.classList.add('small');
  var clock = document.createElement("i");
  clock.classList.add('fas','fa-clock');
  var spanClock = document.createElement("span");
  spanClock.setAttribute("style","font-size:17px");
  spanClock.textContent = "  Horario:  "; 

  /* ------- FUNCION HORARIO ---------- */

  var horari = instalacion.horari;
  var d = new Date();

  var buttonHorari = document.createElement("button");
  buttonHorari.classList.add('btn','btn-info');
  buttonHorari.setAttribute("type","button");
  buttonHorari.setAttribute("data-toggle","collapse");
  buttonHorari.setAttribute("data-target","#collapseInfo");
  var divButton = document.createElement("div");
  divButton.classList.add('collapse');
  divButton.id="collapseInfo";
  var divInfo = document.createElement("div");
  divInfo.classList.add('card','card-body');
  divInfo.setAttribute('style', 'white-space: pre');
  // Cogemos el día de hoy para mostrarlo
  switch(d.getDay()){
    case 0: buttonHorari.textContent= "Hoy : "+horari.di[0].in+" - "+ horari.di[0].out;
    if(horari.di[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.di[1].in+" - "+horari.di[1].out+"\r\n";
    }
    break;
    case 1: buttonHorari.textContent= "Hoy : "+horari.dm[0].in+" - "+ horari.dm[0].out;
    if(horari.dm[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dm[1].in+" - "+horari.dm[1].out+"\r\n";
    }
    break;
    case 2: buttonHorari.textContent= "Hoy : "+horari.dx[0].in+" - "+ horari.dx[0].out;
    if(horari.dx[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dx[1].in+" - "+horari.dx[1].out+"\r\n";
    }
    break;
    case 3: buttonHorari.textContent= "Hoy : "+horari.dj[0].in+" - "+ horari.dj[0].out;
    if(horari.dj[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dj[1].in+" - "+horari.dj[1].out+"\r\n";
    }
    break;
    case 4: buttonHorari.textContent= "Hoy : "+horari.dv[0].in+" - "+ horari.dv[0].out;
    if(horari.dv[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dv[1].in+" - "+horari.dv[1].out+"\r\n";
    }
    break;
    case 5: buttonHorari.textContent= "Hoy : "+horari.ds[0].in+" - "+ horari.ds[0].out;
    if(horari.ds[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.ds[1].in+" - "+horari.ds[1].out+"\r\n";
    }  
    break;
    case 6: buttonHorari.textContent= "Hoy : "+horari.dg[0].in+" - "+ horari.dg[0].out;
    if(horari.dm[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dm[1].in+" - "+horari.dm[1].out+"\r\n";
    }
    break;
  }
  
  // Mostramos la semana al desplegar
  divInfo.textContent="Lunes: "+horari.di[0].in+" - "+horari.di[0].out;
  if(horari.di[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.di[1].in+" - "+horari.di[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Martes: "+horari.dm[0].in+" - "+horari.dm[0].out;
  if(horari.dm[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.dm[1].in+" - "+horari.dm[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Miércoles: "+horari.dx[0].in+" - "+horari.dx[0].out;
  if(horari.dx[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.dx[1].in+" - "+horari.dx[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Jueves: "+horari.dj[0].in+" - "+horari.dj[0].out;
  if(horari.dj[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.dj[1].in+" - "+horari.dj[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Viernes: "+horari.dv[0].in+" - "+horari.dv[0].out;
  if(horari.dv[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.dv[1].in+" - "+horari.dv[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Sábado: "+horari.ds[0].in+" - "+horari.ds[0].out;
  if(horari.ds[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.ds[1].in+" - "+horari.ds[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}
  divInfo.textContent+="Domingo: "+horari.dg[0].in+" - "+horari.dg[0].out;
  if(horari.dg[1].in.localeCompare('-')!=0){
    divInfo.textContent+=", "+horari.dg[1].in+" - "+horari.dg[1].out+"\r\n";
  }else{divInfo.textContent+="\r\n";}

  divButton.appendChild(divInfo);
  pHorari.appendChild(clock);
  pHorari.appendChild(spanClock);
  pHorari.appendChild(buttonHorari);
  pHorari.appendChild(divButton);

  buttonWeb = document.createElement("button");
  //buttonWeb.classList('');

  // Teléfono
  var pTelf = document.createElement("p");
  pTelf.classList.add('small');
  var telf = document.createElement("i");
  telf.classList.add('fas','fa-phone');
  var spanTelf = document.createElement("span");
  spanTelf.setAttribute("style","font-size:17px");
  spanTelf.textContent = "  "+instalacion.contacte.telf; 
  pTelf.appendChild(telf);
  pTelf.appendChild(spanTelf);

  var pDescripcio = document.createElement("p");
  pDescripcio.setAttribute("style","font-size:17px;text-align:justify");
  //pDescripcio.setAttribute("style","");
  //pDescripcio.setAttribute("text-justify","inter-word");
  pDescripcio.textContent=instalacion.descripcio;

  var divTiempo = document.createElement("div");
  divTiempo.classList.add('container','shadow-lg', 'bg-white', 'rounded');



  var icono = document.createElement("img");
  icono.id="icono-weather";

  pTiempo = document.createElement("span");
  pTiempo.setAttribute("style","font-size:15px");

  var divTemp = document.createElement("span");
  divTemp.id="temperatura";

  var divViento = document.createElement("span");
  divViento.id="viento";

  var divHumedad = document.createElement("span");
  divHumedad.id="humedad";

  //Meteo
  var lat = instalacion.geo1.lat;
  var long = instalacion.geo1.long;
  $.getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&lang=es&appid=d1546bfd8c828a6a1add9c7173a462ac", function (json) {
      //Ahora
      $('#icono-weather').attr("src", "http://openweathermap.org/img/wn/" + json.current.weather[0].icon + "@2x.png");
      $('#temperatura').html((Math.round((json.current.temp - 273.15) * 10) / 10) + " °C");
      $('#viento').html("&emsp; <i class='fas fa-wind fa-1x'></i> "+(Math.round(json.current.wind_speed * 3.6)) + " kmh");
      $('#humedad').html(" &emsp; <i class='fas fa-wind fa-1x'></i> "+json.current.humidity + "%");
  });

  /* ------- COLUMNA DERECHA ------- */
  var visitaWeb = document.createElement("button");
  visitaWeb.classList.add('btn','btn-info');
  visitaWeb.textContent="Visita la web";
  visitaWeb.onclick = function(){
    window.location.replace(instalacion.dadesPropies.pag_web);
  }

  /* --- TWITTER --- */
  var a = document.createElement("a");
  a.className = "twitter-timeline";
  a.setAttribute("data-lang","es");
  a.setAttribute("data-width","400");
  a.setAttribute("data-height","580");
  a.setAttribute("data-theme","light");
  a.href = instalacion.contacte.xarxes[0].twitter;
 
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
  divCol.appendChild(divTiempo);
  
  divCol2.appendChild(visitaWeb);
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
  if (i == .5){
    output.push('<i class="fa fa-star-half" aria-hidden="true" style="color: gold;"></i>&nbsp;');
  }

  // Fill the empty stars
  for (let i = (5 - rating); i >= 1; i--)
    output.push('<i class="far fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  return output.join('');
}
