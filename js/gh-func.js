//bc0bd592bb4514d72916b33a71de71bec9722a88
function export_data(token, user, repo) {
    var gh = new Github({
        token: token,
        auth: 'oauth'
    });
    var repo = gh.getRepo(user, repo);
    var aux = {
        "alojamientos": {},
        "usuarios": usuarios
    };
    $.each(alojamientos, function(i, hotel) {
        aux["alojamientos"][i] = {
            "colecciones": hotel.colecciones,
            "usuarios": hotel.usuarios
        };
    });
    repo.write("master", "prueba.json", JSON.stringify(aux), "Prueba de hoteles.", function(err) {
        console.log(err);
    })
}

function import_data(token, user, repo) {
    var gh = new Github({
        token: token,
        auth: 'oauth'
    });
    var repo = gh.getRepo(user, repo);
    repo.read("master", "prueba.json", function(err, obj) {
        if (err === null) {
            var aux = JSON.parse(obj)
            usuarios = aux["usuarios"];
            $.each(aux["alojamientos"], function(i, hotel) {
                alojamientos[i]["colecciones"] = hotel["colecciones"];
                alojamientos[i]["usuarios"] = hotel["usuarios"];
            });
            lista_colecciones_html.detach();
            lista_colecciones_html = procesaColecciones(alojamientos);
            lista_colecciones_html.appendTo($("#colecciones"));
            addColectionListeners();
        } else {
            alert("Error al cargar: ", err);
        }

    })
}

function show_modal(mode) {
    if (mode === "export") {
        $("#popupGitHub h3").html("Guardar Datos");
        $("#popupGitHub button").html("Guardar");
        $("#popupGitHub button").attr({
            "onclick": "export_data(ghToken.value,ghUser.value,ghRepo.value)"
        })
    } else {
        $("#popupGitHub h3").html("Cargar Datos");
        $("#popupGitHub button").html("Cargar");
        $("#popupGitHub button").attr({
            "onclick": "import_data(ghToken.value,ghUser.value,ghRepo.value)"
        })
    }
    $("#popupGitHub").modal("show");
}
