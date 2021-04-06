const catalogo = document.getElementById('catalogo');
var request = new XMLHttpRequest();
var url = "js/datos.json";

request.open("GET", url, true);
request.responseType = 'text';
request.send();

request.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const deportesText = request.response; //cogemos la cadena de response
    const deportes = JSON.parse(deportesText); //la convertimos a objeto
    showSports(deportes);
  }
}

function showSports(d) {
  const sports = d['dadesPropies']['esports'];
  var a,b,c,d;
  /*for (var i = 0; i < sports.length; i++) {
    
    a = document.createElement("div");
    a.classList.add('col-md-6', 'col-lg-4', 'mb-5');

    b = document.createElement("div");
    b.classList.add('portfolio-item', 'mx-auto');
    //b.attr("data-toggle", "modal");
    //b.attr("data-target", "#portfolioModal1");
    
    var im = document.createElement("img");
    im.className = 'img-fluid';
    im.src = d['imatges'][i];
    //catalogo.appendChild(im);
    
    c = document.createElement("div");
    c.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');

    d = document.createElement("div");
    d.classList.add('portfolio-item-caption-content', 'text-center', 'text-white', 'sport');
    d.innerHTML = sports[i];

    c.appendChild(d);
    b.appendChild(c);
    b.appendChild(im);
    a.appendChild(b);
    catalogo.appendChild(a);
    
  }*/

    /*a = document.createElement("div");
    a.classList.add('col-md-6', 'col-lg-4', 'mb-5');

    b = document.createElement("div");
    b.classList.add('portfolio-item', 'mx-auto');
    //b.attr("data-toggle", "modal");
    //b.attr("data-target", "#portfolioModal1");
    
    var im = document.createElement("img");
    im.className = 'img-fluid';
    im.src = d['imatges'][0];
    //catalogo.appendChild(im);
    
    c = document.createElement("div");
    c.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');

    d = document.createElement("div");
    d.classList.add('portfolio-item-caption-content', 'text-center', 'text-white', 'sport');
    d.innerHTML = sports[0];

    c.appendChild(d);
    b.appendChild(c);
    b.appendChild(im);
    a.appendChild(b);
    catalogo.appendChild(a);*/
  

    var e = document.createElement("div");
    e.classList.add('col-md-6', 'col-lg-4', 'mb-5');

    var f = document.createElement("div");
    f.classList.add('portfolio-item', 'mx-auto');
    //b.attr("data-toggle", "modal");
    //b.attr("data-target", "#portfolioModal1");
    
    var im2 = document.createElement("img");
    im2.className = 'img-fluid';
    im2.src = d['imatges'][1];
    //catalogo.appendChild(im);
    
    var g = document.createElement("div");
    g.classList.add('portfolio-item-caption', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100', 'w-100');

    var h = document.createElement("div");
    h.classList.add('portfolio-item-caption-content', 'text-center', 'text-white', 'sport');
    h.innerHTML = sports[1];

    g.appendChild(h);
    f.appendChild(g);
    f.appendChild(im2);
    e.appendChild(f);
    catalogo.appendChild(e);
  
}