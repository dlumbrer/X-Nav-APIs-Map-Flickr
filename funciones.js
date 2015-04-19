function addr_search() {
      var inp = document.getElementById("addr");

      $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {         
            var items = [];
            $.each(data, function(key, val) {
              items.push(
                "<li><a href='#' onclick='chooseAddr(" +
                val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
                '</a></li>'
              );
            });
            $('#results').empty();
            if (items.length != 0) {
                $('<p>', { html: "Search results:" }).appendTo('#results');
                $('<ul/>', {
                    'class': 'my-new-list',
                html: items.join('')
                }).appendTo('#results');
            } else {
                $('<p>', { html: "No results found" }).appendTo('#results');
            }
            
            addimages();
      });
      
      
};

function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);
  map.panTo(location);

  if (type == 'city' || type == 'administrative') {
    map.setZoom(11);
  } else {
    map.setZoom(13);
  }
};


//APPI DE FLICKER, EJERCICIO DE ENTREGA
function addimages(){
    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?&tagmode=any&format=json&jsoncallback=?";
    $("<hr>").appendTo("#results");
    $("<h4>", {text: "Imágenes:"}).appendTo("#results");
	$.getJSON(flickerAPI, {
			tags: $('#addr').val(),
		  }).done(function( data ) {
			  $.each( data.items, function(i, item) {
				 $("<img>").attr("src", item.media.m).appendTo("#results");
                  if ( i === 4 ) {
                    return false;
                  }
              });
		  });
		  
	$('#boton').click(function(){
	    location.reload()
	});
    
    
    
}

$(document).ready(function() {
    map = L.map('map').setView([40.2838, -3.8215], 16);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //para mapquest: http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    //Añado marcador del aulario II
    var marker = L.marker([40.2838, -3.8215]).addTo(map);
    marker.bindPopup("<b>Aulario III</b><br>I am a popup.").openPopup();
    //Añadir marcador cuando pulsas, ejercicio 5.9.2
    map.on('click', function(e) {
        var marker2 = L.marker(e.latlng).addTo(map);
        marker2.bindPopup("<b>Marker custom</b><br>" + e.latlng).openPopup();
        //alert(e.latlng);
    });
    ////////////////////////////////////////////////
    
    
    /*/Geolocalizacion, ejercicio 5.9.3
    map.locate({setView: true, maxZoom: 16});
    
    map.on('locationfound', function(e) {
        alert(e.latlng)
    });
    
    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);
    ///////////////////////////////////////*/
    
    
    // GeoJSON ejercicio 5.9.4
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.Name) {
            layer.bindPopup(feature.properties.Name);
        }
    }
    
    
    $.getJSON("buildings-urjc.json").done(function( data ) {
        console.log("PEDIDO Y RECIBIDO")
        L.geoJson(data, {
            onEachFeature: onEachFeature //PARA PODER PINCHAR Y QUE SALGA EL NOMBRE
        }).addTo(map);
    });
    /////////////////////////////////////////
    
    
    
    // Nominating ejercicio 5.9.5
    $("#buscar").click(addr_search);   
    




















});
