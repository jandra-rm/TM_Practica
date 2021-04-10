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

//Código inicial, crea la página principal
function myInitCode() {
  console.log('Contenido cargado');
  createNavBar();
  
  createPortada();
  createPortfolio();
  createFooter();
}

//VIDEO CON LOGO
function createPortada(d) { // F
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

function createPortfolio(d) {
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
  const imatges = ["jandra-rm/TM_Practica/blob/main/assets/img/portfolio/gym.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/padel.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/natacion.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/tenis.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/golf.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/futbol.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/basket.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/volleyball.png",
                    "jandra-rm/TM_Practica/blob/main/assets/img/portfolio/balonmano.png"];
  
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
  
  button.setAttribute("data-toggle", "collapse");
  button.setAttribute("data-target", "navbarResponsive");
  button.setAttribute("aria-controls", "navbarResponsive");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Toggle navigation");
  
  button.innerHTML = "Menu";
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
  li.appendChild(a2);
  ul.appendChild(li);
  div2.appendChild(ul);
  div2.appendChild(form);

  button.appendChild(ib);
  a.appendChild(i);

  div1.appendChild(a);
  div1.appendChild(button);
  div1.appendChild(div2);

  nav.appendChild(div1);

  //document.querySelector("#BarraNavegacion").appendChild(nav);
  document.getElementById('BarraNavegacion').appendChild(nav);

  /*<nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand js-scroll-trigger" href="#page-top"><i class="fas fa-home fa-1x"></i></a> 
                <button class="navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-primary text-white rounded" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#portfolio">Cátalogo</a></li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2 rounded" type="search" placeholder="Búsqueda">
                        <button class="nav-item btn btn-outline-success my-2 my-sm-0 rounded" type="submit"><i class="fas fa-search"></i></button>
                      </form>
                </div>
            </div>
  </nav> */

}


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

  /*
  <footer class="footer text-center">
            <div class="container">
                <div class="row">
                    <!-- Footer Location-->
                    <div class="col-lg-4 mb-5 mb-lg-0">
                        <h4 class="text-uppercase mb-4">LOCALIZACIÓN</h4>
                        <p class="lead mb-0">
                            Palma de Mallorca
                            
                        </p>
                    </div>
                    <!-- Footer Copyright-->
                    <div class="col-lg-4 mb-5 mb-lg-0">
                        <br>
                        <div class="container">Copyright © Mallorca Sports</div>
                    </div>
                    <!-- Footer About Text-->
                    <div class="col-lg-4">
                        <h4 class="text-uppercase mb-4">Creadoras</h4>
                        <p class="lead mb-0">
                            Alejandra Ribas Marí
                            <br>
                            Andrea Morey Sánchez
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        */
}


