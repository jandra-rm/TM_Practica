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


function menuFiltros(instalaciones){
  var filterButton = document.createElement("button");
  filterButton.classList.add('btn','btn-info');
  filterButton.setAttribute("type","button");
  filterButton.setAttribute("data-toggle","collapse");
  filterButton.setAttribute("data-target","#filtross");
  filterButton.setAttribute("style","margin-right:20px; margin-top:20px;");
  filterButton.innerHTML = 
                                'Filtros: <span class="fa fa-filter pl-1"></span>';

  
  
  var divFiltros = document.createElement("div");
  divFiltros.id="filtross";
  divFiltros.classList.add('collapse');

  
  var filters = document.createElement("div");
  filters.classList.add('card','card-body');
  filters.setAttribute("style", "text-align: left;overflow:auto");


  var servicios = document.createElement("div");
  servicios.innerHTML = '<div class="py-2 border-bottom ml-3">' +
                          '<h4 class="font-weight-bold" style="color:#FF6B6B">Servicios</h4>' + 
                          '<div id="orange"><span class="fa fa-minus"></span></div>' +
                          '<form>';
  var listaServ = getServeisSport(instalaciones);
  for (var i=0; i<listaServ.length; i++){
    servicios.innerHTML += '<div class="form-group"> <input type="checkbox" id="'+ listaServ[i] + '"> <label for="'+ listaServ[i] + '">' +
                            listaServ[i] + '</label> </div>';
  }
  servicios.innerHTML +=   '</form>' +
                        '</div>';

  var actividades = document.createElement("div");
  actividades.innerHTML = '<div class="py-2 border-bottom ml-3">' +
                            '<h4 style="color:#FF6B6B" class="font-weight-bold">Se puede practicar</h4>' + 
                            '<div id="orange"><span class="fa fa-minus"></span></div>' +
                            '<form>';
  var listaAct = getActivitatsSport(instalaciones);
  for (var i=0; i<listaAct.length; i++){
    actividades.innerHTML += '<div class="form-group"> <input type="checkbox" id="'+ listaAct[i] + '"> <label for="'+ listaAct[i] + '">' +
                            listaAct[i] + '</label> </div>';
  }
  actividades.innerHTML +=  '</form>' + 
                          '</div>';
  

  filters.appendChild(servicios);
  filters.appendChild(actividades);
  divFiltros.appendChild(filters);

  document.getElementById("resultados").appendChild(filterButton);
  document.getElementById("resultados").appendChild(divFiltros);
}

function createCards(instalaciones) {
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
  

  for (var k = 0; k < instalaciones.length; k++){
    document.getElementById("stars"+instalaciones[k].nom).innerHTML = getStars(instalaciones[k].puntuacio);
  }
}


function createModal(instalacion) {
  var divModal2 = document.createElement("div");
  divModal2.classList.add('modal-dialog','modal-xl','modal-dialog-scrollable');
 
  var divModalContent = document.createElement("div");
  divModalContent.classList.add('modal-content');

  var divModalHeader = document.createElement("div");
  divModalHeader.classList.add('modal-header');

  var h4 = document.createElement("h4");
  h4.classList.add('modal-title','text-responsive');
  if(instalacion.tipus.localeCompare("Campo")==0){
    h4.textContent=instalacion.nom + " - " + "FÚTBOL";
  } else{
    h4.textContent=instalacion.nom + " - " + instalacion.detall;
  }
  
 
  var divModalBody = document.createElement("div");
  divModalBody.classList.add('modal-body');
  divModalBody.id="modalBody";
 
  // EN ESTE DIV VAN TODAS LAS COSAS QUE QUERAMOS METER EN EL MODAL
  var divModalFooter = document.createElement("div");
  divModalFooter.classList.add('modal-footer');

  var buttonClose = document.createElement("button");  
  buttonClose.classList.add('btn','btn-info');
  buttonClose.setAttribute("data-dismiss","modal");
  buttonClose.textContent="Cerrar";

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
  divContainer.classList.add('container','ml-0','mr-0');
 
  var divRow = document.createElement("div");
  divRow.classList.add('row');
 
  var divCol = document.createElement("div");
  divCol.classList.add('col','ml-0','mr-0');
  divCol.id="info-instalacion";

  var divCol2 = document.createElement("div");
  divCol2.classList.add('col','text-center','ml-0','mr-0');
  
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
  divInfo.setAttribute('style', 'white-space:pre; overflow:auto');
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
  pTiempo.setAttribute("style","font-size:17px");

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
      $('#humedad').html(" &emsp; <i class='fas fa-tint fa-1x'></i> "+json.current.humidity + "%"); // <i class="fas fa-humidity"></i>
  });

  var comentario = document.createElement("div");
  comentario.innerHTML="Déjanos una valoración y un comentario<br><br>";
  comentario.setAttribute("style","margin-top:50px; font-size:17px");
  comentario.classList.add('container', 'bg-white', 'rounded');
  var formulario = document.createElement("form");
  formulario.action = "javascript:void(0);";
  var divForm = document.createElement("div");
  var label = document.createElement("label");
  var input = document.createElement("input");
  var buttonForm = document.createElement("button");

  divForm.classList.add('form-group');
  label.setAttribute("for","email");
  label.textContent="Dirección email: ";
  input.id="email";
  input.classList.add('form-control');
  divForm.appendChild(label);
  divForm.appendChild(input);

  var divForm2 = document.createElement("div");
  var label2 = document.createElement("label");
  var input2 = document.createElement("textarea");

  divForm2.classList.add('form-group');
  label2.setAttribute("for","email");
  label2.textContent="Comentario: ";
  input2.id="email";
  input2.classList.add('form-control');
  input2.setAttribute("rows","5");
  divForm2.appendChild(label2);
  divForm2.appendChild(input2);

  buttonForm.classList.add('btn','btn-info');
  buttonForm.setAttribute("type","submit");
  buttonForm.textContent="Dejar comentario";

  var fieldset = document.createElement("div");
  fieldset.setAttribute("style","overflow:hidden");
  var stars = 0;
 fieldset.innerHTML=
  '<fieldset class="rating">'+
      '<input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="Rocks!">5 stars</label>'+
      '<input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="Pretty good">4 stars</label>'+
      '<input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="Meh">3 stars</label>'+
      '<input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="Kinda bad">2 stars</label>'+
      '<input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="Sucks big time">1 star</label>'+
  '</fieldset> <br><br><br><br>';

  var servicios = document.createElement("div");
  servicios.setAttribute("style","font-size:17px");
  servicios.innerHTML="<b>Servicios de la instalación:<b> <br>";

  if(instalacion.tipus.localeCompare("Campo")==0){ // JSON de los campos de fútbol
    servicios.innerHTML+="  Capacidad: "+instalacion.dadesPropies.capacidad+"<br>";
    servicios.innerHTML+="  Vallado: "+instalacion.dadesPropies.vallado+"<br>";
    servicios.innerHTML+="  Dimensiones: "+instalacion.dadesPropies.dimensiones+"<br>";
    servicios.innerHTML+="  Internet: "+instalacion.dadesPropies.internet+"<br>";
  }
  else if(instalacion.tipus.localeCompare("gym")==0){ // JSON de los gimnasios
    servicios.innerHTML+="  Piscina: "+instalacion.dadesPropies.piscina+"<br>";
    servicios.innerHTML+="  Spa: "+instalacion.dadesPropies.spa+"<br>";
    servicios.innerHTML+="  SalaFitness: "+instalacion.dadesPropies.salaFitness+"<br>";
    servicios.innerHTML+="  Padel: "+instalacion.dadesPropies.padel+"<br>";
    servicios.innerHTML+="  Tennis: "+instalacion.dadesPropies.tenis+"<br>";
    servicios.innerHTML+="  Spinning: "+instalacion.dadesPropies.spinning+"<br>";
  }else{
    for(var  i=0; i<instalacion.dadesPropies.serveis.length; i++){
      servicios.innerHTML+=
        '<p>'+ instalacion.dadesPropies.serveis[i].icono+'   <span>'+instalacion.dadesPropies.serveis[i].nom+'</span></p>';
    }
  }

  servicios.innerHTML+="<br>";

  var suscripcion = document.createElement("div");
  /*suscripcion.classList.add('container');
  if(instalacion.tipus.localeCompare("gym") !=0 && instalacion.tipus.localeCompare("Campo") !=0){
    suscripcion.innerHTML=
    "<div class='table-responsive'>"+
    "<table class='table table-hover'>"+
    "<thead>"+
      "<tr>"+
        "<th>Individual/Familiar</th>"+
        "<th>Cateogria</th>"+
        "<th>Precio</th>"+
      "</tr>"+
    "</thead>"+
    "<tbody>";
    for(var i=0; i<instalacion.dadesPropies.suscripcio.length; i++){
      suscripcion.innerHTML+= 
      "<tr>"+
      "<td>"+instalacion.dadesPropies.suscripcio[i].familia+"</td>"+
      "<td>"+instalacion.dadesPropies.suscripcio[i].categoria+"</td>"+
      "<td>"+instalacion.dadesPropies.suscripcio[i].preu+" - "+ instalacion.dadesPropies.suscripcio[i].periodo +"</td>"+
    "</tr>";
    }
    suscripcion.innerHTML+=  
    "</tbody></table></div>";
  }*/

  formulario.appendChild(fieldset);
  formulario.appendChild(divForm);
  formulario.appendChild(divForm2);
  formulario.appendChild(buttonForm);
  comentario.appendChild(formulario);


  /* ------- COLUMNA DERECHA ------- */
  var visitaWeb = document.createElement("button");
  visitaWeb.classList.add('btn','btn-info');
  //visitaWeb.setAttribute("target","_blank"); //  target="_blank" -> esto hace que se vaya a otra página
  visitaWeb.textContent="Visita la web";
  visitaWeb.onclick = function(){
    window.open(instalacion.contacte.xarxes.web);
  }

  /* --- TWITTER --- */
  var a = document.createElement("a");
  a.className = "twitter-timeline";
  a.setAttribute("data-lang","es");
  a.setAttribute("data-width","400");
  a.setAttribute("data-height","580");
  a.setAttribute("data-theme","light");
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

//carlos
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
  else{
      objetosPorFila(2);
  }
}
function resizeListado() {
  window.addEventListener("resize", cambiarObjetosPorFila);
}