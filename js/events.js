jQuery(document).ready(function() {
    $("#del_btn").click(function() {
        delete_colection();
    });

    $("#hoteles_colec").droppable({
        accept: ".in_colection",
        drop: function(event, ui) {
            var id = removeHotel(ui.draggable.attr("tag"));
            $("#hoteles li[tag=" + id + "]").removeClass("invisible");
        }
    });

    $("#new_col").click(function() {
        $("#popupNewCol").modal("show");
    });

    $("#new_user-btn").click(function() {
        $("#userId").val("")
        $("#popupNewUser").modal("show");
    });

    $("#navbar-buttons li").click(function() {
        if (!$(this).hasClass("disabled")) {
            switch ($(this).attr("id")) {
                case "nav-principal":
                    change_tab("tab-principal");
                    break;
                case "nav-colecciones":
                    change_tab("tab-colecciones");
                    break;
                case "nav-personas":
                    change_tab("tab-personas");
                    break;
                case "save-data":
                    show_modal('export');
                    break;
                case "load-data":
                    show_modal('import');
                    break;
                default:
                    break;
            }
        }
    });
});

function addPlacesListeners() {
    $(".place").hover(function() {
        if (active_tab === "tab-principal") {
            var tag = $(this).attr("tag")
            updateMarker(alojamientos[tag], tag)
        }
        $(this).addClass("item-active")
    }, function() {
        if (active_tab === "tab-principal") {
            var tag = $(this).attr("tag")
            updateMarker(alojamientos[tag], tag)
        }
        $(this).removeClass("item-active")
    });

    $(".place").click(function() {
        if (active_tab === "tab-principal") {
            var tag = $(this).attr("tag")
            var state = updateMarker(alojamientos[tag], tag, "click")
            if (state) {
                showInfo(tag);
                $(this).addClass("item-selected")
            } else {
                $(this).removeClass("item-selected")
            }
        }
    })
}

function addInColectionListeners() {
    $(".in_colection").hover(function() {
        if (active_tab === "tab-principal") {
            var tag = (colecciones[col_array[active_colection]][$(this).attr("tag")]).toString();
            updateMarker(alojamientos[tag], tag)
        }
        $(this).addClass("item-active")
    }, function() {
        if (active_tab === "tab-principal") {
            var tag = (colecciones[col_array[active_colection]][$(this).attr("tag")]).toString()
            updateMarker(alojamientos[tag], tag)
        }
        $(this).removeClass("item-active")
    });

    $(".in_colection").click(function() {
        if (active_tab === "tab-principal") {
            var tag = (colecciones[col_array[active_colection]][$(this).attr("tag")]).toString()
            var state = updateMarker(alojamientos[tag], tag, "click")
            if (state) {
                showInfo(tag);
                $(this).addClass("item-selected")
            } else {
                $(this).removeClass("item-selected")
            }
        }
    })

    $(".in_colection").draggable({
        "revert": "invalid",
        "scroll": false,
        "helper": 'clone',
        "zIndex": 5
    });
}

function addColectionListeners() {
    $(".colection").click(function() {
        if(!$(this).hasClass("item-selected")){
            $(".colection").removeClass("item-selected")
            $(this).addClass("item-selected")
        }
        active_colection = $(this).attr("tag");
        $("#col_subtab").removeClass("invisible")
        show_delete_btn(active_colection);
        var coleccion = col_array[active_colection];
        $("#selected_list").remove()
        var lista = createHotelCollectionList(coleccion)
        lista.appendTo($("#selected_hotels"))
        $("#selected_hotels .badge").html(colecciones[coleccion].length)
        $("#hoteles_colec .badge").html(alojamientos.length - colecciones[coleccion].length)
        addInColectionListeners();
    });

    $(".colection").hover(function() {
        $(this).addClass("item-active")
    }, function() {
        $(this).removeClass("item-active")
    });

}
