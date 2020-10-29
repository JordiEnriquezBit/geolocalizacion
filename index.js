fetch("https://restcountries.eu/rest/v2/all")
.then(response => response.json())
.then(data => {
    let select = document.getElementById("countries");
    select.addEventListener("change", function(){
        changeSelect(this);
    });
    data.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value",JSON.stringify(element));
        option.innerHTML=element.name;
        select.appendChild(option);
    });
});
var mymap = L.map('mapid').setView([51.505, -0.09], 5);
var params;
var arrayMarkers = [];
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZW5tbyIsImEiOiJja2d1cGRkMGUwbnJlMnlwMGcxNjliZ3VmIn0.CJF3KoYPgB7iMd8yb7fCyg'
}).addTo(mymap);




function changeSelect(param) {
    let countries = document.getElementById("countries2");

    param = JSON.parse(param.value);
    params = param;
    mapa(param);
    calculatePosition(param);
    countries.innerHTML="";
    fetch("https://api.geodatasource.com/neighboring-countries?key=5YOYI2UHVODPGMJT7HWM3CE89YUKDKWY&country_code="+param.alpha2Code)
    .then(response => response.json())
    .then(data => {
        data.forEach(element=>{
            countries.innerHTML+=element.country_name +"\n";
        });
    });
}


function mapa(params) {
    mymap.setView(params.latlng, 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZW5tbyIsImEiOiJja2d1cGRkMGUwbnJlMnlwMGcxNjliZ3VmIn0.CJF3KoYPgB7iMd8yb7fCyg'
}).addTo(mymap);

}

function calculatePosition(params) {
    navigator.geolocation.getCurrentPosition(updateLocation);

  
}


function updateLocation(position) {
    for (let i = 0; i < arrayMarkers.length; i++) {
        mymap.removeLayer(arrayMarkers[i]);
    }
    
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let pre = position.coords.accuracy;
   // marker = new L.Marker(e.latlng, {draggable:true});

   var customIcon = new L.Icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/854/854866.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });


var customIcon2 = new L.Icon({
    iconUrl: 'https://www.flaticon.es/svg/static/icons/svg/3537/3537910.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });


  
    let first =  L.marker([lat,lon],{icon: customIcon}).addTo(mymap);
    let second = L.marker(params.latlng,{icon: customIcon2}).addTo(mymap);
    
    arrayMarkers.push(first);
    arrayMarkers.push(second);


    


    // Dibujamos una línea entre los dos puntos
    line = L.polyline([[lat,lon], params.latlng], {
        color: 'red'
      }).addTo(mymap);
      arrayMarkers.push(line);
      medirDistancia([lat,lon],params.latlng);
      var bounds = new L.LatLngBounds([[lat,lon],params.latlng]);

      mymap.fitBounds(bounds);
}




function medirDistancia(firstLatLng,secondLatLng) {
    var distance = mymap.distance(firstLatLng ,secondLatLng);
  document.getElementById('distance').innerHTML = (distance/1000).toFixed(2) + "  Km";
}

//latlng




//document.getElementById("mapid").appendChild(mymap);