var colecciones = {}
var col_array = [] //Para mantener las categorías ordenadas

function procesaColecciones(data) {
    $.each(data, function(i, lugar) {
        $.each(lugar["colecciones"], function(j, cat) {
            if (cat in colecciones) {
                colecciones[cat].push(i);
            } else {
                col_array.push(cat)
                colecciones[cat] = [i];
            }
        })
    })
    return createColectionList();
}

function createColectionList() {
    var colection_list = $("<ul class=list-group>")
    $.each(col_array.sort(), function(i, coleccion) {
        colection_list.append($("<li class='colection list-group-item' tag=" +
            col_array.indexOf(coleccion) + ">").html(coleccion));

    })
    return colection_list;
}

function createHotelCollectionList(coleccion){
    var lista = $("<ul id=selected_list class=list-group>");
    $("#hoteles li").removeClass("invisible");
    $.each(colecciones[coleccion], function(i, hotel) {
        lista.append($("<li class='in_colection list-group-item' tag='" + i + "'>").html(alojamientos[hotel].name));
        $("#hoteles li[tag=" + hotel + "]").addClass("invisible")
    })
    return lista;
}

function addHotel(id) {
    var coleccion = col_array[active_colection];
    alojamientos[id]["colecciones"].push(coleccion)
    colecciones[coleccion].push(parseInt(id));
    colecciones[coleccion].sort(function(a, b) {
        return a - b
    });
    $("#colecciones li[tag=" + active_colection + "]").trigger("click");
}

function removeHotel(id) {
    var coleccion = col_array[active_colection];
    var hotel_id = colecciones[coleccion][id]
    colecciones[coleccion].splice(id, 1);
    alojamientos[hotel_id].colecciones.splice(alojamientos[hotel_id].colecciones.indexOf(coleccion), 1)
    $("#colecciones li[tag=" + active_colection + "]").trigger("click");
    return hotel_id;
}

function agrega_coleccion(name) {
    if (!(name in colecciones)) {
        colecciones[name] = [];
        col_array.push(name);
        $("#colecciones ul").remove();
        lista_colecciones_html = createColectionList();
        lista_colecciones_html.appendTo($("#colecciones"));
        addColectionListeners()
        $("#new_name").val("")
    } else {
        alert("La colección " + name + " ya existe.")
    }
}

function delete_colection(){
    var coleccion = colecciones[col_array[active_colection]]
    $.each(coleccion, function(i,hotel){
        alojamientos[hotel].colecciones.splice(alojamientos[hotel].colecciones.indexOf(coleccion), 1)
    })
    delete colecciones[col_array[active_colection]];
    col_array.splice(active_colection,1);
    $("#colecciones li[tag=" + active_colection +"]").remove();
    $("#selected_hotels ul").remove();
    $("#del_btn").addClass("invisible");
}

function show_delete_btn(col_id) {
    $("#del_btn").html('Eliminar Colección "' + col_array[col_id] + '"')
    if ($("#del_btn").hasClass("invisible")) {
        $("#del_btn").removeClass("invisible")
    }
}
