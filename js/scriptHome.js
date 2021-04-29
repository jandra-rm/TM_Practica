var map = null;
//Cuando la página esté cargada, ejecuta myInitCode
if (document.readyState !== 'loading') {
  myInitCode();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    myInitCode();
  });
}

// FUNCIONES

//Código inicial, crea la página principal
function myInitCode() {
  // Cargamos los datos del JSON
  var request = new XMLHttpRequest();
  var url = "JSON/datos.json";
  request.responseType = 'text';
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const instalaciones = JSON.parse(this.responseText);
      createPortfolio(instalaciones);
    }
  };
  request.open("GET", url, true);
  request.send();


  // Cargamos las pantallas
  createNavBar();
  createPortada();
  //createPortfolio();
  createFooter();

}

function show(shown, hidden) {
  document.getElementById(shown).style = "display:show";
  document.getElementById(hidden).style = "display:none";
  return false;
}

//VIDEO CON LOGO
function createPortada() {
  var div = document.createElement("div");
  div.classList.add('cabecera');
  div.id = "intro";

  var vid = document.createElement("video");
  vid.src = "assets/videos/video-deportes.mp4";
  vid.muted = true;
  vid.autoplay = true;
  vid.loop = true;

  var div2 = document.createElement("div");
  div2.classList.add('overlay');

  var img = document.createElement("img");
  img.className = "logo";
  img.src = "assets/img/logo.png";

  div2.appendChild(img);
  div.appendChild(vid);
  div.appendChild(div2);

  document.querySelector("#Portada").appendChild(div);
}

//CATALOGO
function createPortfolio(datosJson) {
  var div1 = document.createElement("div");
  div1.classNAme = "container";
  var div2 = document.createElement("div");
  div2.classList.add('row', 'justify-content-center');

  const sports = [
    "GIMNASIO",
    "PÁDEL",
    "NATACIÓN",
    "TENIS",
    "GOLF",
    "FÚTBOL",
    "BALONCESTO",
    "VOLEIBOL",
    "BALONMANO"
  ];
  const imatges = ["assets/img/portfolio/gym.png",
    "assets/img/portfolio/padel.png",
    "assets/img/portfolio/natacion.png",
    "assets/img/portfolio/tenis.png",
    "assets/img/portfolio/golf.png",
    "assets/img/portfolio/futbol.png",
    "assets/img/portfolio/basket.png",
    "assets/img/portfolio/volleyball.png",
    "assets/img/portfolio/balonmano.png"];

  var i = 0;
  //Primera iteración
  var a = document.createElement("div");
  a.classList.add('col-md-6', 'col-lg-4', 'mb-5');
  var b = document.createElement("div");
  b.classList.add('portfolio-item', 'mx-auto');
  b.id = sports[i];
  var c = document.createElement("div");
  c.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');
  var d = document.createElement("div");
  d.classList.add('portfolio-item-caption-content', 'text-center', 'text-white');
  d.innerHTML = sports[i];
  b.onclick = function () {
    const instBySport = getInstalacionesBySport(datosJson, b.id);
    if (instBySport.length > 0) {
      show('SportPage', 'HomePage');
      const myCar = document.getElementById("car");
      if (myCar.hasChildNodes() == true) {
        while (myCar.firstChild) {
          myCar.removeChild(myCar.lastChild);
        }
      }
      createCarousel(instBySport);
      //createMap(instBySport);
      createMap2(instBySport);
    } else {
      alert("No hay instalaciones del deporte seleccionado");
    }
  };
  var im = document.createElement("img");
  im.className = 'img-fluid';
  im.src = imatges[i];

  c.appendChild(d);
  b.appendChild(c);
  b.appendChild(im);
  a.appendChild(b);
  div2.appendChild(a);

  //Siguientes iteraciones 
  for (i = 1; i < sports.length; i++) {
    var clna = a.cloneNode(false);
    var clnb = b.cloneNode(false);
    clnb.id = sports[i];
    var clnc = c.cloneNode(false);
    var clnd = d.cloneNode(false);
    clnd.innerHTML = sports[i];
    const dep = clnb;
    dep.onclick = function () {
      const instBySport = getInstalacionesBySport(datosJson, dep.id);
      if (instBySport.length > 0) {
        show('SportPage', 'HomePage');
        const myCar = document.getElementById("car");
        if (myCar.hasChildNodes() == true) {
          while (myCar.firstChild) {
            myCar.removeChild(myCar.lastChild);
          }
        }
        createCarousel(instBySport);
        //createMap(instBySport);
        createMap2(instBySport);
      } else {
        alert("No hay instalaciones del deporte seleccionado");
      }

    };
    var clnim = im.cloneNode(false);
    clnim.src = imatges[i];
    clnc.appendChild(clnd);
    clnb.appendChild(clnc);
    clnb.appendChild(clnim);
    clna.appendChild(clnb);
    div2.appendChild(clna);
  }

  div1.appendChild(div2);
  document.querySelector("#Portfolio").appendChild(div1);
}


// BARRA DE NAVEGACION
function createNavBar() {
  var nav = document.createElement("nav");
  nav.classList.add('navbar-nav', '.navbar-nav-scroll', 'navbar-expand-lg', 'bg-secondary', 'text-uppercase', 'fixed-top');
  nav.id = "mainNav";

  var div1 = document.createElement("div");
  div1.className = "container";

  var a = document.createElement("a");
  a.classList.add('navbar-brand', 'js-scroll-trigger');
  a.href = "#page-top";
  a.onclick = function () { show('HomePage', 'SportPage'); };


  var i = document.createElement("i");
  i.classList.add('fas', 'fa-home', 'fa-1x');

  var button = document.createElement("button");
  button.classList.add('navbar-toggler', 'navbar-toggler-right', 'text-uppercase', 'font-weight-bold', 'bg-primary', 'text-white', 'rounded');
  button.type = "button";
  button.innerHTML = "MENÚ";

  button.setAttribute("data-toggle", "collapse");
  button.setAttribute("data-target", "#navbarResponsive");
  button.setAttribute("aria-controls", "navbarResponsive");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Toggle navigation");


  var ib = document.createElement("i");
  ib.classList.add('fas', 'fa-bars');

  var div2 = document.createElement("div");
  div2.classList.add('collapse', 'navbar-collapse');
  div2.id = "navbarResponsive";

  var ul = document.createElement("ul");
  ul.classList.add('navbar-nav', 'ml-auto');

  var li = document.createElement("li");
  li.classList.add('nav-item', 'mx-0', 'mx-lg-1');

  var a2 = document.createElement("a");
  a2.classList.add('nav-link', 'py-3', 'px-0', 'px-lg-3', 'rounded', 'js-scroll-trigger');
  a2.href = "#Portfolio";
  a2.innerHTML = "Catálogo";

  var li2 = document.createElement("li");
  li2.classList.add('nav-item', 'mx-0', 'mx-lg-1');
  var form = document.createElement("form");
  form.classList.add('form-inline', 'my-2', 'my-lg-0');

  var inp = document.createElement("input");
  inp.classList.add('form-control', 'mr-sm-2', 'rounded');
  inp.type = "search";
  inp.placeholder = "Búsqueda";

  var button2 = document.createElement("button");
  button2.classList.add('nav-item', 'btn', 'btn-outline-success', 'my-2', 'my-sm-0', 'rounded');

  var i2 = document.createElement("i");
  i2.classList.add('fas', 'fa-search');


  button2.appendChild(i2);
  form.appendChild(inp);
  form.appendChild(button2);
  li2.appendChild(form);

  li.appendChild(a2);
  ul.appendChild(li);
  ul.appendChild(li);
  div2.appendChild(ul);
  div2.appendChild(form);

  button.appendChild(ib);
  a.appendChild(i);

  div1.appendChild(a);
  div1.appendChild(button);
  div1.appendChild(div2);

  nav.appendChild(div1);
  document.getElementById('BarraNavegacion').appendChild(nav);
  // document.getElementById('mainNav').appendChild(div1);
}

//FOOTER
function createFooter() {
  var f = document.createElement("footer");
  f.classList.add('footer', 'text-center');

  var div = document.createElement("div");
  div.className = "container";

  var div1 = document.createElement("div");
  div1.className = "row";

  var div2 = document.createElement("div");
  div2.classList.add('col-lg-4', 'mb-5', 'mb-lg-0');
  var h = document.createElement("h4");
  h.classList.add('text-uppercase', 'mb-4');
  h.innerHTML = "LOCALIZACIÓN";
  var p1 = document.createElement("p");
  p1.classList.add('lead', 'mb-0');
  p1.innerHTML = "Palma de Mallorca";

  var div3 = document.createElement("div");
  div3.classList.add('col-lg-4', 'mb-5', 'mb-lg-0');
  var div4 = document.createElement("div");
  div4.className = "container";
  div4.innerHTML = "<br> Copyright © Mallorca Sports";

  var div5 = document.createElement("div");
  div5.classList.add('col-lg-4', 'mb-5', 'mb-lg-0');

  var h4 = document.createElement("h4");
  h4.classList.add('text-uppercase', 'mb-4');
  h4.innerHTML = "Creadoras"

  var p2 = document.createElement("p");
  p2.classList.add('lead', 'mb-0');
  p2.innerHTML = "Alejandra Ribas Marí <br> Andrea Morey Sánchez";

  div5.appendChild(h4);
  div5.appendChild(p2);
  div3.appendChild(div4);
  div2.appendChild(h);
  div2.appendChild(p1);
  div1.appendChild(div2);
  div1.appendChild(div3);
  div1.appendChild(div5);
  div.appendChild(div1);
  f.appendChild(div);
  document.querySelector("#Footer").appendChild(f);
}

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
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlLXJtIiwiYSI6ImNrbnZrdHBycDAzOXoydm1wcW9qYzgxbngifQ.Aj8rXdMUqmfNkQBb0Y29Hg';

  var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // style URL
    center: [3.0069055189508664, 39.66366548429903], // starting position [lng, lat]
    zoom: 8.3 // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }));

  var marker;
  for (var i = 0; i < instalaciones.length; i++) {
    marker = new mapboxgl.Marker()
      .setLngLat([instalaciones[i].geo1.long, instalaciones[i].geo1.lat])
      .addTo(map);
  }

}

function createMap2(instalaciones) {
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

function createModal() {
  /*
  <!-- Modal -->
        <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
 
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Modal Header</h4>
                    </div>
                    <div class="modal-body">
                        <p>Some text in the modal.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
 
        
  var divModal = document.createElement("div");
  divModal.classList.add('modal','fade');
  divModal.id = "myModal";
  divModal.setAttribute("role","dialog");
 
  var divModal2 = document.createElement("div");
  divModal2.classList.add('modal-dialog','modal-xl','modal-dialog-scrollable');
 
  var divModalContent = document.createElement("div");
  divModalContent.classList.add('modal-content');
 
  var divModalBody = document.createElement("div");
  divModalBody.classList.add('modal-body');
 
  var p = document.createElement("p");
  p.textContent = ""; // Aquí va el nombre del JSON
 
  var divContainer = document.createElement("div");
  divContainer.classList.add('container');
 
  var divRow = document.createElement("div");
  divRow.classList.add('row');
 
  var divCol = document.createElement("div");
  divCol.classList.add('col-10');
  // EN ESTE DIV VAN TODAS LAS COSAS QUE QUERAMOS METER EN EL MODAL
 
  var divTwitter = document.createElement("div");
  divTwitter.classList.add('col');
 
  var a = document.createElement("a");
  a.classList.add('twitter-timeline');
  a.setAttribute("data-lang","es");
  a.setAttribute("data-width","300");
  a.setAttribute("data-height","1000");
  a.setAttribute("data-theme","light");
  a.href = "https://twitter.com/Campusesport?ref_src=twsrc%5Etfw%22%3E";
  a.textContent = "Tweets by "; // Aquí va el nombre del gimnasio
 
  divTwitter.appendChild(a);
  divRow.appendChild(divCol);
  divRow.appendChild(divTwitter);
  divContainer.appendChild(divRow);
  divModalBody.appendChild(divContainer);
  divModalContent.appendChild(divModalBody);
  divModal2.appendChild(divModalContent);
  divModal.appendChild(divModal2);
 
*/



}


