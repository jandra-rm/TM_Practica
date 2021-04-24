
/*
  var request = new XMLHttpRequest();
  var url = "JSON/datos.json";
  var instalacionesText;
  var instalaciones;
  request.open("GET", url, true);
  request.responseType = 'text';
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      instalacionesText = request.response; //cogemos la cadena de response
      instalaciones = JSON.parse(instalacionesText); //la convertimos a objeto
    }
  }
*/
  function getInstalacionesBySport(instalaciones, sport){
    var instSport = [];
    for(var i = 0; i < instalaciones.length; i++){
      if (instalaciones[i].detall.localeCompare(sport) == 0){
        instSport.push(instalaciones[i]);
      }
    }
    return instSport;
  }




