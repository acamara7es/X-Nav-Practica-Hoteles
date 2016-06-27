var active_tab = "tab-principal"
var active_colection;
var active_hotel=[];
var coleccion_seleccionada_html;
var lista_alojamientos_html;
var lista_colecciones_html;

function change_tab(new_tab) {
    if (new_tab === "tab-principal") {
        $("#tab-principal").removeClass("invisible");
        $("#tab-colecciones").addClass("invisible");
        $("#tab-personas").addClass("invisible");
        $("#nav-colecciones").removeClass("active");
        $("#nav-personas").removeClass("active");
        $("#nav-principal").addClass("active");
        lista_alojamientos_html.detach()
        $("#hoteles_list").append(lista_alojamientos_html)
        lista_alojamientos_html.find($("li")).removeClass("invisible")
        coleccion_seleccionada_html = $("#selected_list");
        coleccion_seleccionada_html.detach();
        coleccion_seleccionada_html.appendTo($("#col_hoteles_list"))
        // $(".place").draggable("disable");
        // $(".in_colection").draggable("disable");
    } else if (new_tab === "tab-colecciones") {
        $("#tab-colecciones").removeClass("invisible");
        $("#tab-principal").addClass("invisible");
        $("#tab-personas").addClass("invisible");
        $("#nav-principal").removeClass("active");
        $("#nav-personas").removeClass("active");
        $("#nav-colecciones").addClass("active");
        lista_colecciones_html.appendTo($("#colecciones"));
        lista_alojamientos_html.detach()
        lista_alojamientos_html.appendTo($("#hoteles_colec"))
        if (coleccion_seleccionada_html) {
            coleccion_seleccionada_html.detach();
            coleccion_seleccionada_html.appendTo($("#selected_hotels"))
        }
        $("#hoteles_colec .badge").html(alojamientos.length);
        $("#colecciones .badge").html(col_array.length);

        $(".place").draggable({
            "revert": "invalid",
            "scroll": false,
            "helper": 'clone',
            "zIndex": 5
        });

        $("#selected_hotels").droppable({
            accept: ".place",
            drop: function(event, ui) {
                addHotel(ui.helper.attr("tag"));
                ui.draggable.addClass("invisible");
            }
        })
    }else{
        active_hotel = $("#tab-principal li.place.item-selected").attr("tag");
        new_tab = active_tab;
        if(active_hotel === undefined || active_hotel.length === 0){
            alert("Debe seleccionar un hotel de la lista de Hoteles en la pestaña principal")
        }else{
            active_hotel = parseInt(active_hotel);
            $("#tab-colecciones").addClass("invisible");
            $("#tab-principal").addClass("invisible");
            $("#tab-personas").removeClass("invisible");
            $("#nav-principal").removeClass("active");
            $("#nav-colecciones").removeClass("active");
            $("#nav-personas").addClass("active");
            initPersonsTab(active_hotel);
        }
    }
    active_tab = new_tab;
}
