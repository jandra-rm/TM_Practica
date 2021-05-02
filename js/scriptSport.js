var map = null;

function createCarousel(instalaciones) {
    //console.log(instalaciones);
    //var instalaciones = d;
    /*var divC = document.createElement("div");
    divC.classList.add('carousel');
  
    var divR = document.createElement("div");
    divR.classList.add('reel');
    */
  
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
    /*
    var ah = document.createElement("a");
    ah.href="#";
    ah.textContent= instalaciones[i].nom;
    */
    var button = document.createElement("button");
    button.classList.add('btn', 'btn-info', 'btn-lg');
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#myModal");
    button.textContent = instalaciones[i].nom;
  
  
    var p = document.createElement("p");
    p.textContent = instalaciones[i].geo1.address;
  
    //h3.appendChild(ah);
    h3.appendChild(button);
    header.appendChild(h3);
    a.appendChild(img);
    article.appendChild(a);
    article.appendChild(header);
    article.appendChild(p);
    //divR.appendChild(article);
    document.getElementById('car').appendChild(article);
  
    // Siguientes iteraciones
    for (i = 1; i < instalaciones.length; i++) {
      var clnArticle = article.cloneNode(false);
      var clnA = a.cloneNode(false);
      var clnImg = img.cloneNode(false);
      clnImg.src = instalaciones[i].imatges[0];
      var clnHeader = header.cloneNode(false);
      var clnH3 = h3.cloneNode(false);
      //var clnAh = ah.cloneNode(false);
      //clnAh.textContent= instalaciones[i].nom;
      var clnButton = button.cloneNode(false);
      clnButton.textContent = instalaciones[i].nom;
      var clnP = p.cloneNode(false);
      clnP.textContent = instalaciones[i].geo1.address;
  
      //clnH3.appendChild(clnAh);
      clnH3.appendChild(clnButton);
      clnHeader.appendChild(clnH3);
      clnA.appendChild(clnImg);
      clnArticle.appendChild(clnA);
      clnArticle.appendChild(clnHeader);
      clnArticle.appendChild(clnP);
      //divR.appendChild(clnArticle);
      document.getElementById('car').appendChild(clnArticle);
    }
  
    //divC.appendChild(divR);
    //document.getElementById('Carousel').appendChild(divC);
    //document.querySelector("#CarouselInst").appendChild(divC);
  
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
