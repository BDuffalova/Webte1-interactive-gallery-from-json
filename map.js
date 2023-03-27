var arr = [];
var current;
var slidesNum;
var map;

function afterLoad() {

    fetch("./obrazky.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => jsonToArray(jsondata.imgs));


}

function jsonToArray(json) {
    json.forEach(element => {
        arr.push(element);
    });
    slidesNum = arr.length-1;
    arr = Object.entries(arr);
    console.log(arr);
    sortArray();
    initMap();
    addPics();

}
function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    var options = {
        zoom: 12,
        center: {lat: 48.148598, lng: 17.107748}
    }

    map = new google.maps.Map(document.getElementById("map"),options);
    directionsRenderer.setMap(map);

    var toggle = document.getElementById("toggle");

    toggle.addEventListener("click", () => {
        if(toggle.checked){
            directionsRenderer.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsRenderer);
        }
        else{
            directionsRenderer.setMap(null);
            const summaryPanel = document.getElementById("directions-panel");
  
        summaryPanel.innerHTML = "";
        }
        
      });
      addMarkers(map);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const waypts = [];
  
    for (let i = 1; i < arr.length-1; i++) {
        var src = new google.maps.LatLng(arr[i][1].GPS.width,arr[i][1].GPS.height);
        waypts.push({
          location: src,
          stopover: true,
        });
      }

    var origin = new google.maps.LatLng(arr[0][1].GPS.width,arr[0][1].GPS.height);
    var destination = new google.maps.LatLng(arr[arr.length-1][1].GPS.width,arr[arr.length-1][1].GPS.height);
    directionsService
      .route({
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
  
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
  
        summaryPanel.innerHTML = "";

        var length = 0;
        for (let i = 0; i < route.legs.length; i++) {
            length += parseFloat(route.legs[i].distance.text)
  
        }
        summaryPanel.innerHTML += "Dĺžka prejdenej trasy: " + length + "km" + "<br><br>";
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }


function addMarkers(map){
    arr.forEach(marker => {
        var mapMarker = new google.maps.Marker({
            position: {
                lat: parseFloat(marker[1].GPS.width),
                lng: parseFloat(marker[1].GPS.height)
            },
            map: map 
        })

        mapMarker.addListener("click", (mapsMouseEvent) => {
            var marker = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
            search(JSON.parse(marker));
        });
    }
)}

function addPics() {
    var pics = document.getElementById("pictures");
    arr.forEach(element => {
        var pic = document.createElement("div");
        pic.style.display = "none"
        pic.classList.add("picture");
        pic.setAttribute("id", "picture" + element[0])
        pic.style.background = "url(" + element[1].path + ") 30% 50% no-repeat";
        pics.appendChild(pic)
    })

}

function search(marker) {
    var pictures = document.getElementsByClassName("picture");
    var picturesArr = Array.from(pictures);
    var num = 0;
    for (var i = 0; i < arr.length; i++) {
        console.log(marker.lat);
        if (parseFloat(arr[i][1].GPS.width) == marker.lat && parseFloat(arr[i][1].GPS.height) == marker.lng) {
            picturesArr[i].style.display = "block"
            num++;
        }
        else {
            picturesArr[i].style.display = "none"
        }
    }
    if(num == 1){

    }
}


function sortArray(){
    arr.sort(function (a, b) {
        var dateA = a[1].date.split(".")
        var dateB = b[1].date.split(".")
        console.log(dateA);
        console.log(dateB);
        console.log("\n");
        if (dateA[2] < dateB[2]) {
            return 1;
        }
        if (dateA[1] < dateB[1] && dateA[2] == dateB[2]){
            return 1;
        }
        if (dateA[0] < dateB[0] && dateA[1] == dateB[1] && dateA[2] == dateB[2]){
            return 1;
        }
        if (dateA[2] > dateB[2]) {
            return -1;
        }
        if (dateA[1] > dateB[1] && dateA[2] == dateB[2]){
            return -1;
        }
        if (dateA[0] > dateB[0] && dateA[1] == dateB[1] && dateA[2] == dateB[2]){
            return -1;
        }
        return 0;
    });
    console.log(arr)
}
