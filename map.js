var center = [40.4168355, -3.7041825];
var markerDict = {};
//Añadimos el mapa
var mymap = L.map("map", {
    zoomControl: false
}).setView(center, 11);

//Añade control de zoom.
L.control.zoom({
    position: "topright"
}).addTo(mymap);

//Añadimos la capa.
var token = "pk.eyJ1IjoiYWNhbWFyYTdlcyIsImEiOiJjaW5xaTZodHgwMGYydmZtMnlpeW1mdjVoIn0.pjOqfKDVv9cL6jVkv4wVFA";
L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + token, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

// Actualiza el estado del marcador del establecimiento "lugar"
// El "tag" es el identificador dentro de la lista de establecimientos.
// El "mode" indica si se llama a la función por un "hover" o un "click"
function updateMarker(lugar, tag, mode = "hover") {
    // Si el establecimiento no está en el mapa solo se ha podido hacer un "hover"
    // sobre él así que lo añadimos en ese modo.
    if (markerDict[tag] == undefined) {
        markerDict[tag] = {
            "marker": L.marker([lugar.lat, lugar.lon], {
                opacity: 0.3
            }),
            "mode": "hover"
        }
        markerDict[tag].marker.addTo(mymap);
    } else if (markerDict[tag].mode === "dettached") {
        if (mode === "hover") {
            markerDict[tag] = undefined;
        } else {
            markerDict[tag].mode = "click";
            markerDict[tag].marker.addTo(mymap);
            markerDict[tag].marker.openPopup();
            mymap.setView(markerDict[tag].marker.getLatLng(), 15);
            return true;
        }
    } else if (mode === markerDict[tag].mode) {
        mymap.removeLayer(markerDict[tag].marker);
        if (mode === "click") {
            markerDict[tag].mode = "dettached"
            mymap.setView(center, 11);
            return false;
        } else {
            markerDict[tag] = undefined;
        }
        // El evento "click" es más fuerte que el "hover" por tanto se actualiza
        // el modo en el que está guardado el establecimiento.
    } else if (mode == "click") {
        markerDict[tag].mode = "click";
        markerDict[tag].marker.setOpacity(1.0);
        markerDict[tag].marker.bindPopup("<p>" + lugar.name + "</p>\
            <a href='javascript:showInfo(" + tag + ")'>Info</a> " +
            "<a href='javascript:removeMarker(" + tag + ")'>Cerrar</a>").openPopup();
        mymap.setView(markerDict[tag].marker.getLatLng(), 15);
        return true;
    }
}

function removeMarker(id) {
    markerDict[id].marker.closePopup();
    mymap.removeLayer(markerDict[id].marker);
    $("li.place[tag='" + id + "']").css("background-color", "transparent")
    markerDict[id] = undefined;
}

function addListeners() {
    $(".places").hover(function() {
        var id = $(this).attr("id").charAt(5);
        markerArray[id].setOpacity(1.0);
        $(this).addClass("selected");

    }, function() {
        var id = $(this).attr("id").charAt(5);
        markerArray[id].setOpacity(0.3);
        $(this).removeClass("selected");
    });

    $(".places").click(function() {
        var id = $(this).attr("id").charAt(5);
        mymap.setView(markerArray[id].getLatLng(), 15);
        //mostrarFotos($(this).html())
    })
}
