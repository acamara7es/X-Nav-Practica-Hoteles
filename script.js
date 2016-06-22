var categorias = [];
var alojamientos = [];

jQuery(document).ready(function() {
    $.getJSON("alojamientos.json")
        .done(function(data) {
            procesaAlojamientos(data["serviceList"]["service"]);
        })
})

function procesaAlojamientos(datos) {
    $.each(datos, function(i, lugar) {
        alojamientos[i] = {
            "name": lugar.basicData.title,
            "description": lugar.basicData.body,
            "phone": lugar.basicData.phone,
            "email": lugar.basicData.email,
            "web": lugar.basicData.web,
            "address": lugar.geoData.address,
            "lat": lugar.geoData.latitude,
            "lon": lugar.geoData.longitude,
            "cod_postal": lugar.geoData.zipcode,
            "fotos": []
        }
        if (lugar.extradata.categorias.categoria !== undefined) {
            alojamientos[i].categorias = [lugar.extradata.categorias.categoria.item[1]["#text"]];
        }
        if (lugar.extradata.categorias.categoria.subcategorias !== undefined) {
            alojamientos[i].categorias.push(lugar.extradata.categorias.categoria.subcategorias.subcategoria.item[1]["#text"]);
        }
        if (lugar.multimedia) {
            if (lugar.multimedia.media instanceof Array) {
                $.each(lugar.multimedia.media, function(j, foto) {
                    alojamientos[i].fotos[j] = foto.url;
                })
            } else {
                alojamientos[i].fotos[0] = lugar.multimedia.media.url;
            }
        }
    });
    alojamientos.sort(function(a, b) {
        if (a.name > b.name) {
            return 1
        } else if (a.name < b.name) {
            return -1
        } else {
            return 0
        }
    });
    createPlacesList(alojamientos);
}

function createPlacesList(data) {
    $("#hoteles").append($("<ul>"));
    $.each(data, function(i, lugar) {
        $("#hoteles ul").append($("<li class=place tag=" + i + ">").html(lugar.name));
    })
    addListeners();
}

function showInfo(id) {
    $("#infoTitle").html(alojamientos[id].name);
    $("#infoDescription").html(alojamientos[id].description);
    $("#infoAddress").html(alojamientos[id].address);
    $("#infoEmail").html($("<a href='mailto:" + alojamientos[id].email + "'>").html(alojamientos[id].email));
    $("#infoPhone").html(alojamientos[id].phone);
    $("#infoWeb").html($("<a href='" + alojamientos[id].web + "'>").html(alojamientos[id].web));
    $(".carousel-inner").html("");
    $.each(alojamientos[id].fotos, function(i, foto) {
        var img = $("<img>").attr("src", foto);
        var div = $("<div>").html(img);
        if (i === 0) {
            div.attr("class", "item active")
        } else {
            div.attr("class", "item")
        }
        div.appendTo($(".carousel-inner"));
    })
    $("#popupInfo").modal("show")
}

function addListeners() {
    $(".place").hover(function() {
        var tag = $(this).attr("tag")
        updateMarker(alojamientos[tag], tag)
        if ($(this).css("background-color") !== "rgb(0, 128, 0)") {
            $(this).css("background-color", "grey")
        }
    }, function() {
        var tag = $(this).attr("tag")
        updateMarker(alojamientos[tag], tag)
        if ($(this).css("background-color") === "rgb(128, 128, 128)") {
            $(this).css("background-color", "transparent")
        }
    });

    $(".place").click(function() {
        var tag = $(this).attr("tag")
        var state = updateMarker(alojamientos[tag], tag, "click")
        if (state) {
            $(this).css("background-color", "green")
        } else {
            $(this).css("background-color", "transparent")

        }
    })
}
