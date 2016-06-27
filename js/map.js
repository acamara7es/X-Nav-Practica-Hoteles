var center = [40.4168355, -3.7041825];
var markerDict = {};
//Añadimos el mapa
var mymap = L.map("mapa", {
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
    } else if (mode == "hover" && markerDict[tag].mode === "hover"){
        mymap.removeLayer(markerDict[tag].marker);
        delete markerDict[tag];
    } else if (mode == "click") {
        $.each(markerDict, function(i, marker) {
            if (marker.mode == "click" && i !== tag) {
                removeMarker(i);
            }
        })
        if (markerDict[tag] == undefined) {
            return false;
        } else if (markerDict[tag].mode === "click") {
            removeMarker(tag);
            markerDict[tag]={"marker":L.marker(),"mode":"hover"};

            $("li[tag=" + tag + "]").removeClass("item-active");
            mymap.setView(center, 11);
            return false;
        } else {
            markerDict[tag].mode = "click";
            markerDict[tag].marker.setOpacity(1.0);
            markerDict[tag].marker.bindPopup("<p>" + lugar.name + "</p>\
                    <a href='javascript:showInfo(" + tag + ")'>Info</a> " +
                "<a href='javascript:removeMarker(" + tag + ")'>Cerrar</a>").openPopup();
            mymap.setView(markerDict[tag].marker.getLatLng(), 15);
            return true;
        }
    }
}

function removeMarker(id) {
    markerDict[id].marker.closePopup();
    mymap.removeLayer(markerDict[id].marker);
    if($("#col_subtab").hasClass("active")){
        id = colecciones[col_array[active_colection]].indexOf(parseInt(id));
    }
    $("li[tag=" + id + "]").removeClass("item-selected");
    delete markerDict[id];
}
