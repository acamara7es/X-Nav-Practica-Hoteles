var alojamientos = [];

function cargarAlojamientos() {
    $.getJSON("alojamientos.json")
        .done(function(data) {
            procesaAlojamientos(data["serviceList"]["service"]);
            alojamientos.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1
                } else if (a.name < b.name) {
                    return -1
                } else {
                    return 0
                }
            });
            lista_alojamientos_html = createPlacesList(alojamientos);
            $("#hoteles_list").html(lista_alojamientos_html);
            addPlacesListeners();
            $("#navbar-buttons li[class=disabled]").removeClass("disabled");
            lista_colecciones_html = procesaColecciones(alojamientos);
            lista_colecciones_html.appendTo($("#colecciones"));
            addColectionListeners()
        })
};

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
            "usuarios": [],
            "fotos": []
        }
        if (lugar.extradata.categorias.categoria !== undefined) {
            alojamientos[i].categorias = [lugar.extradata.categorias.categoria.item[1]["#text"]];
        }
        if (lugar.extradata.categorias.categoria.subcategorias !== undefined) {
            alojamientos[i].categorias.push(lugar.extradata.categorias.categoria.subcategorias.subcategoria.item[1]["#text"]);
        }
        alojamientos[i].colecciones = alojamientos[i].categorias.slice()
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
}

function createPlacesList(data) {
    var lista_hoteles = $("<ul id=hoteles class=list-group>")
    $.each(data, function(i, lugar) {
        lista_hoteles.append($("<li class='place list-group-item' tag=" + i + ">").html(lugar.name));
    })
    return lista_hoteles
}

function showInfo(id) {
    $("#infoTitle").html(alojamientos[id].name);
    $("#infoDescription").html(alojamientos[id].description);
    $("#infoAddress").html(alojamientos[id].address);
    $("#infoEmail").html($("<a href='mailto:" + alojamientos[id].email + "'>").html(alojamientos[id].email));
    $("#infoPhone").html(alojamientos[id].phone);
    $("#infoWeb").html($("<a href='" + alojamientos[id].web + "'>").html(alojamientos[id].web));
    if (alojamientos[id].fotos.length === 0) {
        $("#carousel-info").addClass("invisible");
    } else {
        $("#carousel-info").removeClass("invisible");
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
    }
    $("#popupInfo").modal("show")
}
