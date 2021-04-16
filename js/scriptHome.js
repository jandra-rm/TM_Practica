//Cuando la página esté cargada, ejecuta myInitCode
if( document.readyState !== 'loading' ) {
    console.log( 'document is already ready, just execute code here' );
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log( 'document was not ready, place code here' );
        myInitCode();
    });
}


// FUNCIONES

//Código inicial, crea la página principal
function myInitCode() {
  console.log('Contenido cargado');
  createNavBar();
  createPortada();
  createPortfolio();
  createFooter();
}

function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
  return false;
}

//VIDEO CON LOGO
function createPortada() { 
  console.log('Entra dentro de createPortada');
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
function createPortfolio() {
  console.log('Entra dentro de createPortfolio');
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

  var c = document.createElement("div");
  c.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');
  var d = document.createElement("div");
  d.classList.add('portfolio-item-caption-content', 'text-center', 'text-white', 'sport');
  d.innerHTML = sports[i];
  c.onclick = show('SportPage', 'HomePage');

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
    var clnc = c.cloneNode(false);
    var clnd = d.cloneNode(false);
    clnd.innerHTML = sports[i];
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
  console.log('Entra dentro de createNavBar');
  var nav = document.createElement("nav");
  nav.classList.add('navbar', 'navbar-expand-lg', 'bg-secondary', 'text-uppercase', 'fixed-top');
  nav.id = "mainNav";

  var div1 = document.createElement("div");
  div1.className = "container";

  var a = document.createElement("a");
  a.classList.add('navbar-brand', 'js-scroll-trigger');
  a.href = "#page-top";

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


