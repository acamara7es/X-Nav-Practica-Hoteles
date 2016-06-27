var apiKey = 'AIzaSyCmLE0CXrcYwlIEfF1nT2PwWWW76c-85_w';
usuarios = {}

function initPersonsTab(id) {
    $("#tab-personas h2").html(alojamientos[id].name);
    $("#hotel_description").html(alojamientos[id].description);
    if (alojamientos[id].fotos.length === 0) {
        $("#carousel-tab-personas").addClass("invisible");
    } else {
        $("#carousel-tab-personas").removeClass("invisible");
        $("#carousel-tab-personas .carousel-inner").html("");
        $.each(alojamientos[id].fotos, function(i, foto) {
            var img = $("<img>").attr("src", foto);
            var div = $("<div>").html(img);
            if (i === 0) {
                div.attr("class", "item active")
            } else {
                div.attr("class", "item")
            }
            div.appendTo($("#carousel-tab-personas .carousel-inner"));
        })
    }
    $("#users_list").empty()
    if (alojamientos[id].usuarios.length > 0) {
        $.each(alojamientos[id].usuarios, function(i, user) {
            appendUser(usuarios[user],user);
        })
    }
}


// Use a button to handle authentication the first time.
function handleClientLoad(userId) {
    gapi.client.setApiKey(apiKey);
    makeApiCall(userId);
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall(userId) {
    gapi.client.load('plus', 'v1', function() {
        var user_request = gapi.client.plus.people.get({
            'userId': userId
        });
        user_request.execute(function(resp) {
            add_user(resp);
        });
    });
}

function add_user(user) {
    if (user.code !== undefined) {
        alert('El usuario introducido no existe, asegúrese de que ha introducido ' +
            'el número de identificador completo o que ha puesto el "+" antes del ' +
            'nombre de usuario (Ejemplo: "+SundarPichai" es correcto, pero no "SundarPichai")')
    } else {
        usuarios[user.id] = {
            "foto": user.image.url,
            "nombre": user.displayName,
            "url": user.url
        }
        if (!(user.id in alojamientos[active_hotel].usuarios)) {
            alojamientos[active_hotel].usuarios.push(user.id);
        }
        appendUser(usuarios[user.id], user.id);
    }
}

function appendUser(user, id) {
    var aux_div = $("<div>");
    aux_div.append($("<img class='img-responsive img-circle avatar'>").attr({
        "src": user.foto
    }));
    aux_div.append(user.nombre);
    var user_html = $("<li class=list-group-item>").attr({
        "tag": id
    })
    user_html.append(aux_div)
    user_html.appendTo($("#users_list"))
    user_html.click(function() {
        window.open(user.url)
    });
}
