/*function createCarousel(){
    var divC = document.createElement("div");
    divC.classList.add('carousel');

    var divR = document.createElement("div");
    divC.classList.add('reel');

    // Primera iteración del bucle del JSON
    var article = document.createElement("div");
    var a = document.createElement("a");
    a.href="";
    a.classList.add('image','featured');
    var img = document.createElement("img");
    img.src= instalaciones[0].imatges[0];
    //img.alt="";

    var header = document.createElement("header");
    var h3 = document.createElement("h3");
    var ah = document.createElement("a");
    ah.href="";
    ah.textContent= instalaciones[0].nom;

    var p = document.createElement("p");
    p.textContent= instalaciones[0].geo1.address;

    h3.appendChild(ah);
    header.appendChild(h3);
    a.appendChild(img);
    article.appendChild(a);
    article.appendChild(header);
    article.appendChild(p);
    divR.appendChild(article);

    // Siguientes iteraciones
    for(var i=0; i<10; i++){
        var clnArticle = article.cloneNode(false);
        var clnA = a.cloneNode(false);
        var clnImg = img.cloneNode(false);
        var clnHeader = header.cloneNode(false);
        var clnH3 = h3.cloneNode(false);
        var clnAh = ah.cloneNode(false);
        var clnP = p.cloneNode(false);
    
        clnH3.appendChild(clnAh);
        clnHeader.appendChild(clnH3);
        clnA.appendChild(clnImg);
        clnArticle.appendChild(clnA);
        clnArticle.appendChild(clnHeader);
        clnArticle.appendChild(clnP);
        divR.appendChild(clnArticle);
    }

    divC.appendChild(divR);
    document.getElementById('Carousel').appendChild(divC);
}*/