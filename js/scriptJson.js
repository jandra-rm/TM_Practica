/* Funciona - probado con imágenes y texto de datos propios de prueba
  var request = new XMLHttpRequest();
  var url = "js/datos.json";
  request.open("GET", url, true);
  request.responseType = 'text';
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const deportesText = request.response; //cogemos la cadena de response
      const deportes = JSON.parse(deportesText); //la convertimos a objeto
    }
  }
  */
