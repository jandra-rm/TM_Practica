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

//Cuando la página esté cargada, ejecuta myInitCode
if (document.readyState !== 'loading') {
  myInitCode();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    myInitCode();
    resizeListado();
  });
}

// FUNCIONES

//Código inicial, crea la página principal
function myInitCode() {
  //JSON gimnasios
  var reqGym = new XMLHttpRequest();
  var url = "https://lcp-tm-api.herokuapp.com/gyms.json";
  reqGym.responseType = 'text';
  reqGym.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const instGym = JSON.parse(this.responseText);
      setJsonGimnasio(instGym);
      startAutocomplete();
    }
  };
  reqGym.open("GET", url, true);
  reqGym.send();

  //JSON campos de fútbol
  var reqFutbol = new XMLHttpRequest();
  var url = "https://raw.githubusercontent.com/xescnova/WebApp/main/json/campos.json";
  reqFutbol.responseType = 'text';
  reqFutbol.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const instFutbol = JSON.parse(this.responseText);
      setJsonFutbol(instFutbol);
      startAutocomplete();
    }
  };
  reqFutbol.open("GET", url, true);
  reqFutbol.send();

  //JSON propio
  var request = new XMLHttpRequest();
  var url = "JSON/datos.json";
  request.responseType = 'text';
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const instalaciones = JSON.parse(this.responseText);
      setJsonPropio(instalaciones);
      createPortfolio(instalaciones);
      createNavBar(instalaciones);
    }
  };
  request.open("GET", url, true);
  request.send();

  // Cargamos la pantalla principal
  createPortada();
  createFooter();
}

function show(shown, hidden) {
  document.getElementById(shown).style = "display:show";
  document.getElementById(hidden).style = "display:none";
  document.getElementById("myInput").value = "";
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
  div2.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 425.68 277.21"><defs><style>.cls-1{fill:url(#Degradado_sin_nombre_133);}.cls-2{fill:url(#Degradado_sin_nombre_133-2);}.cls-3{fill:url(#Degradado_sin_nombre_133-3);}.cls-4{fill:url(#Degradado_sin_nombre_133-4);}.cls-5{fill:url(#Degradado_sin_nombre_133-5);}.cls-6{fill:url(#Degradado_sin_nombre_133-6);}.cls-7{fill:url(#Degradado_sin_nombre_133-7);}.cls-8{fill:url(#Degradado_sin_nombre_133-8);}.cls-9{fill:url(#Degradado_sin_nombre_133-9);}</style><linearGradient id="Degradado_sin_nombre_133" x1="-14.18" y1="200.05" x2="410.54" y2="125.01" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ed6a6d"/><stop offset="0.22" stop-color="#ee6e6b"/><stop offset="0.45" stop-color="#f07b65"/><stop offset="0.69" stop-color="#f38f5b"/><stop offset="0.92" stop-color="#f8ac4c"/><stop offset="1" stop-color="#fab747"/></linearGradient><linearGradient id="Degradado_sin_nombre_133-2" x1="-14.17" y1="200.11" x2="410.55" y2="125.07" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-3" x1="-14.17" y1="200.08" x2="410.54" y2="125.04" gradientTransform="translate(340.18 -23.47) rotate(87.69)" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-4" x1="-14.17" y1="200.13" x2="410.55" y2="125.09" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-5" x1="-32.67" y1="95.37" x2="392.04" y2="20.33" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-6" x1="-33.06" y1="93.18" x2="391.66" y2="18.14" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-7" x1="-32.58" y1="95.92" x2="392.14" y2="20.88" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-8" x1="-32.66" y1="95.45" x2="392.06" y2="20.41" xlink:href="#Degradado_sin_nombre_133"/><linearGradient id="Degradado_sin_nombre_133-9" x1="-18.72" y1="174.34" x2="406" y2="99.3" xlink:href="#Degradado_sin_nombre_133"/></defs><g id="Capa_2" data-name="Capa 2"><g id="Capa_1-2" data-name="Capa 1"><path class="cls-1" d="M116.88,97.2l-41.45,7.31v159.4l41.45-7.31V203.47c27.62-4.87,27.62-39,27.62-58C144.5,127,144.5,92.33,116.88,97.2Z"/><path class="cls-2" d="M289.19,120c0-18.51,0-53.13-27.62-48.26L220.11,79V238.4l69.08-12.18-15-53.67C289.18,161,289.19,135.46,289.19,120Z"/><ellipse class="cls-3" cx="182.31" cy="165.37" rx="79.98" ry="34.41" transform="translate(9.71 340.85) rotate(-87.69)"/><polygon class="cls-4" points="361.53 96.57 361.53 71.36 361.53 54.07 292.46 66.25 292.46 83.54 292.46 108.75 306.28 106.31 306.28 223.21 347.71 215.9 347.71 99.01 361.53 96.57 361.53 96.57"/><path class="cls-5" d="M125.35,66.12c-.15.47-.29.94-.44,1.41s-.28,1-.43,1.41-.29.9-.43,1.31l3.45-.61-1.72-4.83C125.64,65.21,125.49,65.65,125.35,66.12Z"/><path class="cls-6" d="M279.7,36.63a1.75,1.75,0,0,0-.54-.38,1.59,1.59,0,0,0-.7-.12l-.59.07-.6.08-1.55.28v4.13l2.07-.37.36-.07.35-.1a1.94,1.94,0,0,0,.7-.36,2.3,2.3,0,0,0,.53-.55,2.38,2.38,0,0,0,.33-.68,2.57,2.57,0,0,0,.11-.72,1.82,1.82,0,0,0-.12-.65A1.71,1.71,0,0,0,279.7,36.63Z"/><path class="cls-7" d="M240.56,44.51a3.26,3.26,0,0,0-1.35-.72,3.91,3.91,0,0,0-1.71,0,4.67,4.67,0,0,0-1.71.65A5.46,5.46,0,0,0,233.25,49a4.35,4.35,0,0,0,.32,1.69,3.27,3.27,0,0,0,2.22,2,3.91,3.91,0,0,0,1.71,0,4.84,4.84,0,0,0,1.71-.64,5.46,5.46,0,0,0,1.35-1.18,5.38,5.38,0,0,0,.88-1.57,5.24,5.24,0,0,0,.31-1.8,4.37,4.37,0,0,0-.31-1.68A3.41,3.41,0,0,0,240.56,44.51Z"/><path class="cls-8" d="M354.39,25.73c-.14.47-.29.94-.43,1.42s-.29.94-.43,1.41-.3.9-.44,1.3l3.46-.6-1.72-4.84C354.68,24.83,354.54,25.27,354.39,25.73Z"/><path class="cls-9" d="M404.1,139.54c0-25.92,21.17-57.17,21.17-83.43,0-53.45-31.52-60.86-70.85-53.92L71.26,52.12C31.93,59.05.41,77.57.41,131c0,26.26,21.17,50,21.17,76,0,15-9.66,28.89-21.58,31v39.23c39.32-6.93,71.2-25,71.2-79,0-26.56-21.53-47.65-21.53-75.9,0-15,9.66-19.14,21.59-21.25L354.42,51.16C366.34,49.06,376,49.78,376,64.8c0,28.25-21.53,56.92-21.53,83.49,0,54,31.88,60.8,71.2,53.86V162.92C413.76,165,404.1,154.56,404.1,139.54Zm-310.62-58A.51.51,0,0,1,93,82l-3.19.56c-.34.06-.52-.07-.54-.4l-1-8.52-2.53,9.19a1,1,0,0,1-.17.3.5.5,0,0,1-.27.21l-3,.52a.36.36,0,0,1-.29-.1.4.4,0,0,1-.16-.25l-2.53-8.28-1,8.85a.59.59,0,0,1-.55.59l-3.18.56c-.33.06-.49-.08-.49-.41l1.61-16a.68.68,0,0,1,.16-.37.57.57,0,0,1,.38-.22l3.89-.68a.42.42,0,0,1,.54.33l3.06,9.67L86.9,66.84a.73.73,0,0,1,.58-.53l3.84-.68a.48.48,0,0,1,.37.08.39.39,0,0,1,.18.32c.27,2.59.53,5.16.81,7.71s.54,5.12.8,7.72Zm40.42-6.83a.65.65,0,0,1-.43.22l-3.23.57a.6.6,0,0,1-.39,0,.43.43,0,0,1-.22-.28c-.15-.36-.3-.71-.44-1.06s-.29-.71-.43-1.07l-6,1c-.14.41-.29.82-.43,1.22s-.3.81-.44,1.22a.71.71,0,0,1-.57.52l-3.32.58a.45.45,0,0,1-.35-.05c-.1-.06-.11-.17-.05-.33l6.1-16.89a.37.37,0,0,1,.08-.15A1.19,1.19,0,0,1,124,60a1.33,1.33,0,0,1,.19-.14.56.56,0,0,1,.19-.07l2.88-.51a.45.45,0,0,1,.33.06,1.25,1.25,0,0,1,.2.17l.28.59,5.9,14.19A.35.35,0,0,1,133.9,74.68Zm35.4-6.62a.68.68,0,0,1-.12.38.62.62,0,0,1-.37.23l-10,1.77c-.33.06-.5-.08-.5-.41V54.31a.63.63,0,0,1,.51-.59l3.33-.58a.49.49,0,0,1,.35.07.38.38,0,0,1,.16.33V65.78l6.19-1.09a.43.43,0,0,1,.35.07.4.4,0,0,1,.14.35Zm35.76-6.3a.66.66,0,0,1-.13.37.58.58,0,0,1-.37.23l-10,1.78c-.33,0-.5-.08-.5-.41V48a.62.62,0,0,1,.14-.38.6.6,0,0,1,.37-.21l3.33-.59a.48.48,0,0,1,.35.08.41.41,0,0,1,.17.33V59.47l6.18-1.09a.42.42,0,0,1,.35.08.38.38,0,0,1,.15.34ZM245.8,49.05a10.62,10.62,0,0,1-2.22,4.17,11.33,11.33,0,0,1-1.74,1.65,10.21,10.21,0,0,1-2.06,1.23,9.12,9.12,0,0,1-2.28.7,8.12,8.12,0,0,1-2.29.1,7.23,7.23,0,0,1-2.06-.5,7,7,0,0,1-1.74-1,6.56,6.56,0,0,1-1.34-1.49,7,7,0,0,1-.87-1.9,8,8,0,0,1-.3-2.23,9.16,9.16,0,0,1,.3-2.34,10.26,10.26,0,0,1,.87-2.21,11,11,0,0,1,1.34-2,10.9,10.9,0,0,1,3.8-2.88,9.51,9.51,0,0,1,2.29-.71,8.41,8.41,0,0,1,2.28-.1,7.59,7.59,0,0,1,2.06.51,6.61,6.61,0,0,1,1.74,1,6.52,6.52,0,0,1,1.35,1.52,7.48,7.48,0,0,1,.87,1.9,8.06,8.06,0,0,1,.31,2.23A9.3,9.3,0,0,1,245.8,49.05Zm39.19-1a.6.6,0,0,1-.32.15l-3.86.68a.55.55,0,0,1-.34-.05.43.43,0,0,1-.2-.27l-2.73-4.66-1.82.32v5.07a.55.55,0,0,1-.52.58l-3.34.59a.47.47,0,0,1-.36-.06.37.37,0,0,1-.13-.34V34.4a.65.65,0,0,1,.12-.4.56.56,0,0,1,.37-.2l7.27-1.28a5.09,5.09,0,0,1,2.17,0,4.46,4.46,0,0,1,1.76.86A4.39,4.39,0,0,1,284.25,35a4.69,4.69,0,0,1,.43,2,5.31,5.31,0,0,1-.21,1.49,6.36,6.36,0,0,1-.58,1.4,6.72,6.72,0,0,1-.88,1.25,7.28,7.28,0,0,1-1.12,1l2.89,4.94c.06.09.12.2.21.33a.7.7,0,0,1,.12.35A.41.41,0,0,1,285,48.09ZM322.73,40a1.07,1.07,0,0,1-.28.33,11.22,11.22,0,0,1-2.28,1.5,9.56,9.56,0,0,1-2.57.84,8.49,8.49,0,0,1-2.29.1,7.24,7.24,0,0,1-2.05-.5,6.92,6.92,0,0,1-1.74-1,6.9,6.9,0,0,1-2.21-3.39,8.08,8.08,0,0,1-.3-2.24,9.27,9.27,0,0,1,.3-2.34,10.15,10.15,0,0,1,.87-2.21,10.6,10.6,0,0,1,1.34-2,11,11,0,0,1,3.79-2.88,9.24,9.24,0,0,1,2.29-.72,8.47,8.47,0,0,1,2.55-.07,7.18,7.18,0,0,1,2.25.69.51.51,0,0,1,.28.24.5.5,0,0,1,0,.44l-1.9,3a.58.58,0,0,1-.27.27.48.48,0,0,1-.34,0,3.79,3.79,0,0,0-1.21-.43,4.19,4.19,0,0,0-1.41,0,4.86,4.86,0,0,0-1.7.64,5.68,5.68,0,0,0-1.34,1.2,5.59,5.59,0,0,0-.87,1.57,5.15,5.15,0,0,0-.32,1.79,4.29,4.29,0,0,0,.32,1.67,3.51,3.51,0,0,0,.87,1.25,3.39,3.39,0,0,0,1.34.71,3.86,3.86,0,0,0,1.7.05,5.18,5.18,0,0,0,1.42-.48,5.27,5.27,0,0,0,1.22-.86.6.6,0,0,1,.34-.16.38.38,0,0,1,.27.15l1.92,2.43A.41.41,0,0,1,322.73,40ZM363,34.3a.7.7,0,0,1-.43.21l-3.23.57a.72.72,0,0,1-.4,0,.49.49,0,0,1-.22-.29c-.15-.35-.3-.71-.44-1.06l-.42-1.07-6,1.06c-.14.4-.28.81-.43,1.22s-.29.81-.43,1.21a.7.7,0,0,1-.58.52l-3.31.59a.52.52,0,0,1-.36-.06c-.09,0-.11-.16-.05-.32L352.78,20a.43.43,0,0,1,.07-.16.8.8,0,0,1,.15-.17,1.25,1.25,0,0,1,.19-.15,1,1,0,0,1,.2-.07l2.87-.51a.45.45,0,0,1,.33.06.92.92,0,0,1,.2.18l.28.59L363,33.93A.35.35,0,0,1,363,34.3Z"/></g></g></svg>';

  var img = document.createElement("img");
  img.className = "logo";
  img.src = "assets/img/logo.png";

  //div2.appendChild(img);
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
    const myList = document.getElementById("listado");
    if (myList.hasChildNodes() == true) {
      while (myList.firstChild) {
        myList.removeChild(myList.lastChild);
      }
    }
    document.getElementById("resultados").innerHTML = "";
    show('SportPage', 'HomePage');

    if (b.id.localeCompare("GIMNASIO") == 0) {
      if (gimnasios.length > 0) {
        createMap(gimnasios);
        menuFiltros(gimnasios);
        ordenarPor();
        createCards(gimnasios);
      } else {
        alert("No hay instalaciones de GIMNASIO");
      }
    } else if (b.id.localeCompare("FÚTBOL") == 0) {
      if (campos.length > 0) {
        createMap(campos);
        //menuFiltros(campos);
        ordenarPoer(gimnasios);
        createCards(campos);
      } else {
        alert("No hay instalaciones de FÚTBOL");
      }

    } else {
      const instBySport = getInstalacionesBySport(datosJson, b.id);
      if (instBySport.length > 0) {
        createMap(instBySport);
        menuFiltros(instBySport);
        ordenarPor();
        createCards(instBySport);
      } else {
        alert("No hay instalaciones de " + b.id);
      }
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
      const myList = document.getElementById("listado");
      if (myList.hasChildNodes() == true) {
        while (myList.firstChild) {
          myList.removeChild(myList.lastChild);
        }
      }
      document.getElementById("resultados").innerHTML = "";
      show('SportPage', 'HomePage');

      if (dep.id.localeCompare("GIMNASIO") == 0) {
        if (gimnasios.length > 0) {
          createMap(gimnasios);
          menuFiltros(gimnasios);
          ordenarPor();
          createCards(gimnasios);
        } else {
          alert("No hay instalaciones de GIMNASIO");
        }
      } else if (dep.id.localeCompare("FÚTBOL") == 0) {
        if (campos.length > 0) {
          createMap(campos);
          //menuFiltros(campos);
          ordenarPor();
          createCards(campos);
        } else {
          alert("No hay instalaciones de FÚTBOL");
        }

      } else {
        const instBySport = getInstalacionesBySport(datosJson, dep.id);
        if (instBySport.length > 0) {
          createMap(instBySport);
          menuFiltros(instBySport);
          ordenarPor();
          createCards(instBySport);
        } else {
          alert("No hay instalaciones de " + dep.id);
        }
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
function createNavBar(datosJson) {
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

  var divli = document.createElement("div");
  divli.className = "dropdown";
  var butli = document.createElement("button");
  butli.className = "dropbtn";
  butli.textContent = "DEPORTES";
  var divcat = document.createElement("div");
  divcat.className = "dropdown-content";
  for (var k = 0; k < sports.length; k++) {
    var acat = document.createElement("a");
    acat.textContent = sports[k];
    const adep = acat;
    adep.onclick = function () {
      const myList = document.getElementById("listado");
      if (myList.hasChildNodes() == true) {
        while (myList.firstChild) {
          myList.removeChild(myList.lastChild);
        }
      }
      document.getElementById("resultados").innerHTML = "";
      show('SportPage', 'HomePage');

      if (adep.innerText.localeCompare("GIMNASIO") == 0) {
        if (gimnasios.length > 0) {
          createMap(gimnasios);
          //menuFiltros(gimnasios);
          createCards(gimnasios);
        } else {
          alert("No hay instalaciones de GIMNASIO");
        }
      } else if (adep.innerText.localeCompare("FÚTBOL") == 0) {
        if (campos.length > 0) {
          createMap(campos);
          //menuFiltros(campos);
          createCards(campos);
        } else {
          alert("No hay instalaciones de FÚTBOL");
        }

      } else {
        const instBySport = getInstalacionesBySport(datosJson, adep.innerText);
        if (instBySport.length > 0) {
          createMap(instBySport);
          menuFiltros(instBySport);
          createCards(instBySport);
        } else {
          alert("No hay instalaciones de " + adep.innerText);
        }
      }
    };
    divcat.appendChild(acat);
  }

  divli.appendChild(butli);
  divli.appendChild(divcat);
  li.appendChild(divli);


  var li2 = document.createElement("li");
  li2.classList.add('nav-item', 'mx-0', 'mx-lg-1');


  //Make sure the form has the autocomplete function switched off
  var form = document.createElement("form");
  form.autocomplete = "off";
  form.action = "javascript:void(0);";
  var div3 = document.createElement("div");
  div3.className = "autocomplete";
  var inp = document.createElement("input");
  inp.id = "myInput";
  inp.type = "text";
  inp.placeholder = "Instalación";
  div3.appendChild(inp);

  var input = document.createElement("input");
  input.type = "submit";
  input.value = "Buscar";
  input.onclick = function () {
    const myModal = document.getElementById("myModal");
    if (myModal.hasChildNodes() == true) {
      while (myModal.firstChild) {
        myModal.removeChild(myModal.lastChild);
      }
    }
    var split = document.getElementById("myInput").value.split(" - ");
    var name = split[0];
    var sport = split[1];
    var instInput = getInstalacionesByNameAndSport(name, sport);
    if (instInput != null) {
      input.setAttribute("data-toggle", "modal");
      input.setAttribute("data-target", "#myModal");
      createModal(instInput);
    } else {
      alert("No hay resultados. Por favor introduzca otra instalación");
    }
    document.getElementById("myInput").value = "";
  }

  form.appendChild(div3);
  form.appendChild(input);
  li2.appendChild(form);

  ul.appendChild(li);
  ul.appendChild(li2);
  div2.appendChild(ul);

  button.appendChild(ib);
  a.appendChild(i);

  div1.appendChild(a);
  div1.appendChild(button);
  div1.appendChild(div2);

  nav.appendChild(div1);
  document.getElementById('BarraNavegacion').appendChild(nav);

  /*initiate the autocomplete function on the "myInput" element, and pass along the array as possible autocomplete values:*/
  startAutocomplete(datosJson);
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
  /*
  div2.setAttribute("data-aos","fade-up");
  div2.setAttribute("data-aos-duration","1000");
  */
  var h = document.createElement("h3");
  h.classList.add('text-uppercase', 'mb-4');
  h.innerHTML = "LOCALIZACIÓN";
  var p1 = document.createElement("p");
  p1.classList.add('lead', 'mb-0');
  p1.innerHTML = "Palma de Mallorca";

  var div3 = document.createElement("div");
  div3.classList.add('col-lg-4', 'mb-5', 'mb-lg-0');
  /*
  div3.setAttribute("data-aos","fade-up");
  div3.setAttribute("data-aos-duration","1000");
  */
  var div4 = document.createElement("div");
  div4.className = "container";
  div4.innerHTML = "<br> Copyright © Mallorca Sports";

  var div5 = document.createElement("div");
  div5.classList.add('col-lg-4', 'mb-5', 'mb-lg-0');
  /*
  div5.setAttribute("data-aos","fade-up");
  div5.setAttribute("data-aos-duration","1000");
  */

  var h4 = document.createElement("h3");
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

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}





