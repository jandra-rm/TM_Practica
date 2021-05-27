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
      createJSONLD(instGym);
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
      createJSONLD(instFutbol);
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
      createJSONLD(instalaciones);
    }
  };
  request.open("GET", url, true);
  request.send();

  //JSON comentarios
  var cmts = new XMLHttpRequest();
  var url = "JSON/comentarios.json";
  cmts.responseType = 'text';
  cmts.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const cs = JSON.parse(this.responseText);
      setJsonComentario(cs);
    }
  };
  cmts.open("GET", url, true);
  cmts.send();

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

  var img = document.createElement("img");
  img.className = "logo";
  img.src = "assets/img/mallorca_sports_svg.svg";

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
    document.getElementById("menuFiltros").innerHTML = "";
    document.getElementById("resultados").innerHTML = "";
    document.getElementById("orden").innerHTML = "";
    show('SportPage', 'HomePage');

    if (b.id.localeCompare("GIMNASIO") == 0) {
      while(gimnasios == null);
      if (gimnasios.length > 0) {
        inicializarPagina(gimnasios);
      } else {
        alert("No hay instalaciones de GIMNASIO");
      }
    } else if (b.id.localeCompare("FÚTBOL") == 0) {
      while(campos == null);
      if (campos.length > 0) {
        inicializarPagina(campos);
      } else {
        alert("No hay instalaciones de FÚTBOL");
      }

    } else {
      const instBySport = getInstalacionesBySport(datosJson, b.id);
      if (instBySport.length > 0) {
        inicializarPagina(instBySport);
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
      document.getElementById("menuFiltros").innerHTML = "";
      document.getElementById("resultados").innerHTML = "";
      document.getElementById("orden").innerHTML = "";
      show('SportPage', 'HomePage');

      if (dep.id.localeCompare("GIMNASIO") == 0) {
        if (gimnasios.length > 0) {
          inicializarPagina(gimnasios);
        } else {
          alert("No hay instalaciones de GIMNASIO");
        }
      } else if (dep.id.localeCompare("FÚTBOL") == 0) {
        if (campos.length > 0) {
          inicializarPagina(campos);
        } else {
          alert("No hay instalaciones de FÚTBOL");
        }

      } else {
        const instBySport = getInstalacionesBySport(datosJson, dep.id);
        if (instBySport.length > 0) {
          inicializarPagina(instBySport);
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
  nav.classList.add('navbar-nav', '.navbar-nav-scroll', 'navbar-expand-lg', 'navbar-expand-md', 'navbar-expand-sm', 'bg-secondary', 'text-uppercase', 'fixed-top');
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
      document.getElementById("menuFiltros").innerHTML = "";
      document.getElementById("resultados").innerHTML = "";
      document.getElementById("orden").innerHTML = "";
      show('SportPage', 'HomePage');

      if (adep.innerText.localeCompare("GIMNASIO") == 0) {
        if (gimnasios.length > 0) {
          inicializarPagina(gimnasios);
        } else {
          alert("No hay instalaciones de GIMNASIO");
        }
      } else if (adep.innerText.localeCompare("FÚTBOL") == 0) {
        if (campos.length > 0) {
          inicializarPagina(campos);
        } else {
          alert("No hay instalaciones de FÚTBOL");
        }

      } else {
        const instBySport = getInstalacionesBySport(datosJson, adep.innerText);
        if (instBySport.length > 0) {
          inicializarPagina(instBySport);
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
        b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
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





