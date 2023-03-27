// import data from './obrazky.json' assert { type: 'json' };
// console.log(data)
var arr = [];
var maps = [];
var current;
var slidesNum;
var play = false;

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
    addPics();
    slidesNum = arr.length - 1;
    addFunctionality();
    initMap();
}
var i = 0;

function addPics() {
    var pics = document.getElementById("pictures");
    arr = Object.entries(arr);
    arr.forEach(element => {
        var pic = document.createElement("div");

        pic.classList.add("picture");
        pic.classList.add("slide-" + i);
        pic.setAttribute("id", "picture" + i)
        // console.log(pic.className.split(" ")[1]);
        pic.style.background = "url(" + element[1].path + ") 30% 50% no-repeat";
        pics.appendChild(pic);
        // console.log("element" + i + ": " + element[0]);
        addSlides(element[1]);
        pic.addEventListener("click", (event) => {
            console.log(event)
            showSlide(event);
        })

    })

}

function initMap() {
    var num = 0;

    maps.forEach(element => {
        var options = {
            zoom: 11,
            center: { lat: parseFloat(arr[num][1].GPS.width), lng: parseFloat(arr[num][1].GPS.height) }
        }
        var map = new google.maps.Map(element, options);
        addMarker(map, num);
        num++;
    })

}

function addMarker(map, num) {
    var mapMarker = new google.maps.Marker({
        position: {
            lat: parseFloat(arr[num][1].GPS.width),
            lng: parseFloat(arr[num][1].GPS.height)
        },
        map: map
    })


}

function addSlides(element) {
    var slideshow = document.getElementById("slideshow-container");
    var slide = document.createElement("div");
    var map = document.createElement("div")
    map.setAttribute("id", "map" + i);
    map.classList.add("map");
    maps.push(map);
    slide.classList.add("mySlides");
    slide.setAttribute("id", "slide-" + i);
    i++;
    // var newline = document.createElement("br")
    var name = document.createElement("p");
    name.innerHTML = "Názov: " + element.name;
    var description = document.createElement("p");
    description.innerHTML = "Popis: " + element.description;
    var date = document.createElement("p");
    date.innerHTML = "Dátum: " + element.date + " " + element.time;
    name.style.color = "white";
    // name.style.marginTop = "50px";
    description.style.color = "white";
    // description.style.marginTop = "50px";
    date.style.color = "white";
    // date.style.marginTop = "50px";
    var img = document.createElement("img");
    img.setAttribute("src", element.path);
    slide.appendChild(name);
    slide.appendChild(description);
    slide.appendChild(date);
    slide.appendChild(img);
    slide.appendChild(map)
    slideshow.appendChild(slide);

}

function showSlide(event) {
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    var slideshow = document.getElementById("slideshow");

    var id = event.srcElement.classList[1];
    current = parseInt(id.split("-")[1]);
    var slide = document.getElementById(id);
    slide.style.display = "block";
    slideshow.style.display = "block"
    slideshow.style.height = pageHeight + "px"
    slideshow.style.width = pageWidth + "px"


}

function plusSlides() {
    var newSlide;
    var id = "slide-" + current;
    var currentSlide = document.getElementById(id);
    if (current == slidesNum && currentSlide != null) {
        currentSlide.style.display = "none";
        current = 0;
        newSlide = document.getElementById("slide-0");
        newSlide.style.display = "block";
    }
    else if (currentSlide != null) {
        currentSlide.style.display = "none";
        current = current + 1;
        id = "slide-" + current;
        newSlide = document.getElementById(id);
        newSlide.style.display = "block";
    }

    if (play) {
        setTimeout(plusSlides, 3000);
    }

}

function minusSlides() {
    var newSlide;
    var currentSlide = document.getElementById("slide-" + current);
    if (current == 0 && currentSlide != null) {
        currentSlide.style.display = "none";
        current = slidesNum;
        newSlide = document.getElementById("slide-" + slidesNum);
        newSlide.style.display = "block";
    }
    else if (currentSlide != null) {
        currentSlide.style.display = "none";
        current = current - 1;

        newSlide = document.getElementById("slide-" + current);
        newSlide.style.display = "block";
    }

}

function search() {
    var pictures = document.getElementsByClassName("picture");
    var searchText = document.getElementById("search");
    var picturesArr = Array.from(pictures);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][1].name.indexOf(searchText.value) >= 0 || arr[i][1].description.indexOf(searchText.value) >= 0) {
            picturesArr[i].style.display = "block"
        }
        else {
            picturesArr[i].style.display = "none"
        }
    }
}

function addFunctionality() {
    var next = document.getElementById("next");
    next.addEventListener("click", plusSlides);
    var prev = document.getElementById("prev");
    prev.addEventListener("click", minusSlides);
    var close = document.getElementById("close");
    close.addEventListener("click", () => {
        var slideshow = document.getElementById("slideshow");
        slideshow.style.display = "none";
        var currentSlide = document.getElementById("slide-" + current);
        currentSlide.style.display = "none";
        play = false;
        getCoords = true;
    });
    var playBtn = document.getElementById("play");
    playBtn.addEventListener("click", () => {
        play = true;
        setTimeout(plusSlides, 3000);
    })

    var stopBtn = document.getElementById("stop");
    stopBtn.addEventListener("click", () => {
        play = false;
    })

    window.addEventListener("click", (event) => {
        var element = event.target.classList[0];
        if (element == "picture") {
            var slideCont = document.getElementById("slideshow-container")
            // console.log(event.clientY);
            slideCont.style.top = event.pageY - 150 + "px";
        }

    })

    var searchBar = document.getElementById("search");
    // console.log(searchBar);
    searchBar.addEventListener("input", search)

    window.addEventListener("resize", () => {
        var pageHeight = document.documentElement.scrollHeight;
        var pageWidth = window.innerWidth
        var slideshow = document.getElementById("slideshow");
        slideshow.style.height = pageHeight + "px"
        slideshow.style.width = pageWidth + "px"
    })
}

