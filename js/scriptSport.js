var map = null;

function createCarousel(instalaciones) {
    // Primera iteración del bucle del JSON
    var i = 0;
    var article = document.createElement("article");
    var a = document.createElement("a");
    //a.href = "#";
    a.classList.add('image', 'featured');
    var img = document.createElement("img");
    img.src = instalaciones[i].imatges[0];
    //img.alt="";
  
    var header = document.createElement("header");
    var h3 = document.createElement("h3");

    var button = document.createElement("button");
    button.id="bModal";
    button.classList.add('btn', 'btn-info', 'btn-lg');
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#myModal");
    button.textContent = instalaciones[i].nom;
    const b = button;
    const inst = instalaciones[i];
    b.onclick=function(){
      createModal(inst);
    }
  
  
    var p = document.createElement("p");
    p.textContent = instalaciones[i].geo1.address;
  
    h3.appendChild(button);
    header.appendChild(h3);
    a.appendChild(img);
    article.appendChild(a);
    article.appendChild(header);
    article.appendChild(p);
    document.getElementById('car').appendChild(article);
  
    // Siguientes iteraciones
    for (i = 1; i < instalaciones.length; i++) {
      var clnArticle = article.cloneNode(false);
      var clnA = a.cloneNode(false);
      var clnImg = img.cloneNode(false);
      clnImg.src = instalaciones[i].imatges[0];
      var clnHeader = header.cloneNode(false);
      var clnH3 = h3.cloneNode(false);
      var clnButton = button.cloneNode(false);
      clnButton.id="bModal";
      clnButton.textContent = instalaciones[i].nom;
      const bU = clnButton;
      const inst = instalaciones[i];
      bU.onclick=function(){
        createModal(inst);
      }

      var clnP = p.cloneNode(false);
      clnP.textContent = instalaciones[i].geo1.address;
  
      clnH3.appendChild(clnButton);
      clnHeader.appendChild(clnH3);
      clnA.appendChild(clnImg);
      clnArticle.appendChild(clnA);
      clnArticle.appendChild(clnHeader);
      clnArticle.appendChild(clnP);
      document.getElementById('car').appendChild(clnArticle);
    }
  
  }

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
  map.on('locationfound', function(e) {
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
              'marker-size' : 'medium',
              'marker-symbol': 'pitch'
          }
      });
  
  
  
  
  });
  // If the user chooses not to allow their location
  // to be shared, display an error message.
  map.on('locationerror', function() {
    alert("La geolocalización no está disponible");
  });
  
  }

  function menuFiltros(){
      //de momento filtrar por distancia
  }


  function createModal(instalacion) {

    var divModal2 = document.createElement("div");
    divModal2.classList.add('modal-dialog','modal-xl','modal-dialog-scrollable');
   
    var divModalContent = document.createElement("div");
    divModalContent.classList.add('modal-content');
  
    var divModalHeader = document.createElement("div");
    divModalHeader.classList.add('modal-header');
  
    var h4 = document.createElement("h4");
    h4.classList.add('modal-title');
    h4.textContent=instalacion.nom;
   
    var divModalBody = document.createElement("div");
    divModalBody.classList.add('modal-body');
    divModalBody.id="modalBody";
   
    // EN ESTE DIV VAN TODAS LAS COSAS QUE QUERAMOS METER EN EL MODAL
    var divModalFooter = document.createElement("div");
    divModalFooter.classList.add('modal-footer');
  
    var buttonClose = document.createElement("button");  
    buttonClose.classList.add('btn','btn-danger');
    buttonClose.setAttribute("data-dismiss","modal");
    buttonClose.textContent="Close";

    divModalHeader.appendChild(h4);
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
    divCol.classList.add('col-10');
    divCol.id="info-instalacion";
  
    var divCol2 = document.createElement("div");
    divCol2.classList.add('col-2');

    // Ubicación
    var pUbicacio = document.createElement("p");
    pUbicacio.classList.add('small');
    var marker = document.createElement("i");
    marker.classList.add('fas','fa-map-marker-alt');
    var spanMarker = document.createElement("span");
    spanMarker.setAttribute("style","font-size:20px");
    spanMarker.textContent = "  "+instalacion.geo1.address; 
    pUbicacio.appendChild(marker);
    pUbicacio.appendChild(spanMarker);
  
    // Horario  
    var pHorari = document.createElement("p");
    pHorari.classList.add('small');
    var clock = marker.cloneNode(false);
    clock.classList.add('fas','fa-clock');
    var spanClock = spanMarker.cloneNode(false);
    spanClock.setAttribute("style","font-size:20px");
    spanClock.textContent = "  Horario:  "; 
  
    /* ------- FUNCION HORARIO ---------- */
    var horari = instalacion.horari;
    var d = new Date();
  
    var buttonHorari = document.createElement("button");
    buttonHorari.classList.add('btn','btn-primary');
    buttonHorari.setAttribute("type","button");
    buttonHorari.setAttribute("data-toggle","collapse");
    buttonHorari.setAttribute("data-target","#collapseInfo");
    var divButton = document.createElement("div");
    divButton.classList.add('collapse');
    divButton.id="collapseInfo";
    var divInfo = document.createElement("div");
    divInfo.classList.add('card','card-body');
    divInfo.setAttribute('style', 'white-space: pre;');
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
    divInfo.textContent+="Domingo: "+horari.dv[0].in+" - "+horari.dv[0].out;
    if(horari.dm[1].in.localeCompare('-')!=0){
      divInfo.textContent+=", "+horari.dm[1].in+" - "+horari.dm[1].out+"\r\n";
    }else{divInfo.textContent+="\r\n";}
  
    divButton.appendChild(divInfo);
    pHorari.appendChild(clock);
    pHorari.appendChild(spanClock);
    pHorari.appendChild(buttonHorari);
    pHorari.appendChild(divButton);
  
    buttonWeb = document.createElement("button");
    //buttonWeb.classList('');
  
    /* --- TWITTER --- */
    var divTwitter = document.createElement("div");
    divTwitter.classList.add('col');
    var a = document.createElement("a");
    a.classList.add('twitter-timeline');
    a.setAttribute("data-lang","es");
    a.setAttribute("data-width","300");
    a.setAttribute("data-height","1000");
    a.setAttribute("data-theme","light");
    a.href = "https://twitter.com/Campusesport?ref_src=twsrc%5Etfw%22%3E";
    a.textContent ="Tweets By"; // Aquí va el nombre del gimnasio
   
  
    divTwitter.appendChild(a);
    divCol.appendChild(pUbicacio);
    divCol.appendChild(pHorari);
    divCol2.appendChild(divTwitter);
  
    divRow.appendChild(divCol);
    divRow.appendChild(divCol2);
    divContainer.appendChild(divRow);

    document.getElementById('modalBody').appendChild(divContainer);
    
  }
