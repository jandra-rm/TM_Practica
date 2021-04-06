//const catalogo = document.getElementById('catalogo');
var request = new XMLHttpRequest();
var url = "js/datos.json";

request.open("GET", url, true);
request.responseType = 'text';
request.send();

request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const deportesText = request.response; //cogemos la cadena de response
    //const deportes = JSON.parse(deportesText); //la convertimos a objeto
    const array =  JSON.parse(deportesText); 
    showSports(array[0]);
  }
}

function showSports(d) {
  const sports = d['dadesPropies']['esports'];
  const imatges = d['imatges'];
  var i=0;

  //Primera iteración
  var a = document.createElement("div");
  a.classList.add('col-md-6', 'col-lg-4', 'mb-5');

  var b = document.createElement("div");
  b.classList.add('portfolio-item', 'mx-auto');
  
  var im = document.createElement("img");
  im.className = 'img-fluid';
  im.src = imatges[i];
  
  var c = document.createElement("div");
  c.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');

  var d = document.createElement("div");
  d.classList.add('portfolio-item-caption-content', 'text-center', 'text-white', 'sport');
  d.innerHTML = sports[i];

  c.appendChild(d);
  b.appendChild(c);
  b.appendChild(im);
  a.appendChild(b);
  document.getElementById('catalogo').appendChild(a);

  //Siguientes iteraciones --> Al clonar a, se clonan también sus hijos con parámetro [i] que va cambiando a lo largo del bucle for
  for (i=1; i < sports.length; i++) {
    var clna = a.cloneNode(false);
    document.getElementById('catalogo').appendChild(clna);
  }
  
}