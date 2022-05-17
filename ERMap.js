// Initial Variable Setup
let maxNativeZoom = 7;
let mapMinZoom = 2;
let mapMaxZoom = 8;

let mapSize = 19280;
let mapWidth = 19280;
let mapHeight = 18238;
let tileSize = 256;
let mapScale = mapSize / tileSize;
let mapOffset = mapSize / mapScale / 2;
let halfTile = tileSize / 2;
let mapBounds = 2410;
let myBounds = [[0, 0],[2279, 2410]];
let mapOutside = [2412, 2412];

// Resize to set origin to bottom left
L.CRS.MySimple = L.extend({}, L.CRS.Simple, {
	transformation: new L.Transformation(1/16, 0, -1/16, 142.5)
});

// Map config
let config = {
	noWrap: true,
	zoom: 8,
	maxNativeZoom: maxNativeZoom,	
	minZoom: mapMinZoom,
	maxZoom: mapMaxZoom,
	zoomOffset: 0, // offsets the zoom LEVEL
	zoomSnap: 1,
	tileSize: tileSize,
	bounds: myBounds,
	width: mapWidth,
	height: mapHeight,
	crs: L.CRS.MySimple,
	attribution: 'Cowsox',
};

// Map tile locations
let overworld = L.tileLayer('tiles/overworld/{z}/tile_{x}_{y}.png', config);
let underground = L.tileLayer('tiles/underground/{z}/tile_{x}_{y}.png', config);
let baseLayers = {"Overworld": overworld,};
let overlayLayers = {"Underground": underground,};

let map = L.map('map', {crs: L.CRS.MySimple,
	layers: [overworld],
	zoomControl: false,
	scrollWheelZoom: false, // disable original zoom function
	smoothWheelZoom: true,  // enable smooth zoom 
	smoothSensitivity: 1.5,   // zoom speed. default is 1
	doubleClickZoom: false,
}).setView([1300,1300],3);




// Add map layers and controller
L.control.layers(baseLayers, overlayLayers).addTo(map);
// Set bounds for panning
map.setMaxBounds([[-2000, -4000], [4000, 6000]]);

// Copy function
function copy(element) {
  let  $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
$(document).on('click', '.copymarkerurl', function() {
  let  copy = $(this).parent().find('.markerlink');
  let  $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(copy).text()).select();
  document.execCommand("copy");
  $('.copiedmsg').fadeIn({queue: false, duration: '300'});
  $('.copiedmsg').delay(1000).fadeOut(300);
  $temp.remove();
})

let popup = L.popup();

function getAObj(obj,name) {
	for (e in obj) {
		if (obj[e].name == name)
		return obj[e].value;
	};
	return 0;
};

// Add sidebar
let  sidebar = L.control.sidebar('sidebar').addTo(map);

// Open default sidebar
sidebar.open('home');

// Marker Toggle
function toggle(element, layer) {
	if (layerGroups[layer] != undefined) {
		if (element.checked) {
			map.addLayer(layerGroups[layer]);
		} else {
			//$('#allmarkers').prop('checked', false);
			map.removeLayer(layerGroups[layer]);
		}
	}
}

$('.markers-list input').each(function() {
	this.onchange = function() {
		toggle(this, this.id);
		if (this.id == "textmarkers") {
			if ($(this.id).is(':checked')) {
				$('.leaflet-tooltip-top').css('visibility', 'hidden');
				//$('.leaflet-tooltip-top.secondary').css('visibility', 'hidden');
			} else {
				$('.leaflet-tooltip-top').css('visibility', 'visible');
				$('.leaflet-tooltip-top').css('font-size', '24px');
				//$('.leaflet-tooltip-top.secondary').css('visibility', 'hidden');
			}
		}
	};
});

// CHANGE CSS ON ZOOM
map.on('zoomend', function(e) {
	let  size = map.getZoom();
	// Scale opacity on zoom
	/*
	if (size >= 5) {
		$('.region').css('opacity', 1 - ((size - 5) / 2));
		//$('path').css('fill-opacity', 1 - ((size - 5) / 2));
		$('.leaflet-tooltip-bottom').css('opacity', 1);
	}
	else if (size < 5) {
		$('.region').css('opacity', '1');
		$('.leaflet-tooltip-bottom').css('opacity', 0);
	}
	*/
	if (size >= 2.5) {
		$('.whole').css('opacity', 0);
	}
	else {
		$('.whole').css('opacity', 1);
	}
	if (size < 2.5 || size >= 4.4) {
		$('.region').css('opacity', 0);
	}
	else {
		$('.region').css('opacity', 1);
	}
	if (size > 4.4) {
		$('.subregion').css('opacity', 1);
	}
	else {
		$('.subregion').css('opacity', 0);
	}
		
	
	// Scale image size on zoom
	let iconPxSize = 110;
	let minSize = 10;
	let maxSize = 100;
	let originalWidth = $('.leaflet-marker-pane img').css('width', '').width();
	let originalHeight = $('.leaflet-marker-pane img').css('height', '').height();
	
	//$('.leaflet-marker-pane img').css('width', (iconPxSize - originalWidth / size));
	//$('.leaflet-marker-pane img').css('height', 100 - originalHeight / size);
	//$('.leaflet-marker-pane img').css('margin-left', -(iconPxSize - originalWidth / size) / 2);
	//$('.leaflet-marker-pane img').css('margin-top', -(iconPxSize - originalHeight / size) / 2);
});


// Change marker image on map
function iconpref(value) {
	document.getElementById("iconprev").style.backgroundImage = "url("+markerIconTypes[value].options.iconUrl+")";
};
// Change marker image and group in popup
function titlepref(value) {
	document.getElementById("titleprev").value = value.replace(/_/gi, " ");
	document.getElementById("grouptype").value = value.replace(/_/gi, " ");
};

// Limit input of coordinates range
function numonly(e){
	$("#mlat,#mlon").keyup(function() {
		let  val = $(this).val().replace(/-?\d+[^0-9]+/,"");
		if ($(this).val() == $("#mlon").val()) {console.log("SAM");} //then it's the longtitude, if not, it's latirude
		$(this).val(val);
	});
};

// New marker popup
function addMarkerText(lat,long) {
	let  message = '\
		<div class="chooseIcon">Choose Icon:</div>\
		<div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
		<form id="addmark" method="post" action="#">\
			<select id="select_icon" name="icon" onchange="iconpref(this.value); titlepref(this.options[this.selectedIndex].innerHTML);">';
	for (let  i in mapMarkers) {
			message +='<option value="'+i+'">'+mapMarkers[i].icon.replace(/_/gi, " ")+'</option>';
	};
	message = message+'\
			</select>\
			<div class="markertitle">Marker Name:</div>\
			<input type="text" id="titleprev" name="name" value="grace">\
			<div class="chooseRegion">Marker Region:</div>\
			<select id="select_region" name="region">\
				<option value="limgrave">Limgrave</option>\
				<option value="weeping">Weeping Peninsula</option>\
				<option value="liurnia">Liurnia of the Lakes</option>\
			</select>\
			<div class="markerdesc">Marker Description:</div>\
			<textarea name="desc" onclick="this.value=\'\'; this.onclick = function(){}"></textarea>\
			<table class="coordsinputs">\
				<tr>\
					<td>X:<input type="text" name="mlon" id="mlon" maxlength="5" value="'+long+'" onKeyPress="return numonly(this,event)"></td>\
					<td>Y:<input type="text" name="mlat" id="mlat" maxlength="5" value="'+lat+'" onKeyPress="return numonly(this,event)"></td>\
				</tr>\
			</table>\
			<input type="hidden" id="grouptype" name="group" value="grace"\
			<input type="hidden" name="submit" value="true">\
			<button type="submit" class="send">Add</button>\
		</form>';
	
	let  ltn = {};
	ltn.lat = lat;
	ltn.lng = long;
	popup.setLatLng(ltn).setContent(message).openOn(map);
  
	// Add the mark
	$('#addmark').submit(function(e){
		let  selectedIcon = $(this).find("#select_icon option:selected").text();
		let  postData = $(this).serializeArray();
		let  lat = Math.round(getAObj(postData,"mlat"));
		let  lon = Math.round(getAObj(postData,"mlon"));
		postData.push({"name": "lat","value":lat});
		postData.push({"name": "lon","value":lon});
		
		let  storageMarkers = [];
		let  markersUser = [];

		if (localStorage.mapUserMarkers !== undefined) {
			storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		}
		storageMarkers.push({
			"coords": {
				"x": lat,
				"y": lon
			},
			"name": getAObj(postData,"name"),
			"region": getAObj(postData,"region"),
			"icon": markerIconTypes[getAObj(postData,"icon")],
			"iconvalue": getAObj(postData,"icon"),
			"desc": getAObj(postData,"desc"),
			"group": getAObj(postData,"group")
		});
		popup.close();
		
		let  markerlink = (url+"?m="+lon+","+lat+"&name="+getAObj(postData,"name")+"&desc="+getAObj(postData,"desc")+"&icon="+getAObj(postData,"icon")+"&");
		markerlink = encodeURI(markerlink);

		let  popupcontent = '\
		<div class="popcontent">\
			<p class="mname">'+getAObj(postData,'name')+'</p>\
			<p class="mregion">'+getAObj(postData, 'region')+'</p>\
			<p class="mdesc">'+getAObj(postData,'desc')+'</p>\
			<p class=mgroup">'+getAObj(postData,'group')+'</p>\
			<span class="mcoords">[ '+getAObj(postData,'mlon')+' , '+getAObj(postData,'mlat')+']</span>\
		</div>\
		<span class="markerlink hide">'+markerlink+'</span>\
		<button class="copymarkerurl"><span class="sharetext">Copy link</span>\
		<span class="copiedmsg hide">Copied</span></button>\
		<button class="edit-marker">Edit marker</button>\
		<div id="edit-dialog" class="hide">\
			<div class="chooseIcon">Choose Icon:</div>\
			<div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
			<select id="select_icon" name="icon" onchange="iconpref(this.value);">';
		for (let  i in mapMarkers) {
			popupcontent +='<option value="'+i+'">'+mapMarkers[i].icon.replace(/_/gi, " ")+'</option>';
		};
		popupcontent = popupcontent+'\
			</select>\
			<input type="text" id="editedtitle" name="name" value="'+getAObj(postData,'name')+'">\
			<textarea id="editeddesc" name="desc">'+getAObj(postData,'desc')+'</textarea>\
			<button class="cancel">Cancel</button>\
			<button class="save-marker">Save</button>\
		</div>\
		<button class="remove-marker">Remove marker</button>\
		<div id="remove-dialog" class="hide">\
			<span class="remove-text">Are you sure?</span>\
			<button class="yes">Yes</button>\
			<button class="no">No</button>\
		</div>'
		
		let  newMarker = new L.marker({lat: lat, lng: lon},{draggable: false,icon: markerIconTypes[getAObj(postData,"icon")]});
		newMarker.bindPopup(popupcontent);
		newMarker.addTo(map);
		newMarker.bindTooltip(getAObj(postData, 'name'), {permanent: true, direction: 'bottom', offset: L.point(0,0)}).openTooltip();
		newMarker.on("popupopen", onPopupOpen);
		markersUser.push(newMarker);
			console.log(newMarker);
		groupUser.addLayer(newMarker);
		localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
		if (layerGroups[getAObj(postData,'group')] == undefined) {
			layerGroups[getAObj(postData,'group')] = new L.layerGroup();
		}
		map.addLayer(layerGroups[getAObj(postData,'group')]);
		e.preventDefault();
	});
}

// On map click
map.on('dblclick', function (e) {
	let  lat = Math.round(e.latlng.lat);
	let  long = Math.round(e.latlng.lng);
	if (long < 0 || long > 4095 || lat < 0 || lat > 4095) {
		console.log("lat: "+lat+ "long: "+long);
	} else {
		message = '\
			<span class="coordsinfo">X: ' +long+ ' ' + 'Y: ' +lat+ '</span><br>\
			<button class="add-marker" onclick="addMarkerText('+lat+','+long+')">Add marker</button>';
		popup.setLatLng(e.latlng).setContent(message).openOn(map);
	}
});

map.on('overlayadd', function (e) {
	if (e.name === 'Underground') {
		map.removeLayer(layerGroups.textmarkers);
	}
});

/*
map.on('overlayremove', funciton (e) {
	$('.markers-list input').each(function() {
		toggle(this, this.id);
		if (this.id == "textmarkers") {
			if ($(this.id).is(':checked')) {
				$('.text-label').css('visibility', 'hidden');
				$('.text-label.secondary').css('visibility', 'hidden');
			} else {
				$('.text-label').css('visibility', 'visible');
				$('.text-label').css('font-size', '24px');
				$('.text-label.secondary').css('visibility', 'hidden');
			}
		}
	};
});
*/

// POLYGON TOOLS
// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawPluginOptions = {
  position: 'topright',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: true,
    },
  edit: {
    featureGroup: drawnItems, //REQUIRED!!
    remove: true
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

map.on('draw:created', function(e) {
	var type = e.layerType,
		layer = e.layer;
	
	// Draw Type code
	if (type === 'polygon') {
		layer.bindPopup('This is a poly');
		
	}
	drawnItems.addLayer(layer);
	
	// Add all drawn items to clipboard
	var copyText = drawnItems.toGeoJSON()
	var more = JSON.stringify(copyText, null, 2);
	console.log(more);
	navigator.clipboard.writeText(more);
});

// Drag end functionality
/*
function dragedMarker() {
	demo = JSON.parse(localStorage.mapUserMarkers);
	let clickedMarkerCoords = this.getLatLng();
	for(i = demo.length; i > 0; i--) {
		i2 = i-1;
		console.log(demo[i2].name);
		if (/*typeof demo[i] != 'undefined' && *//*demo[i2].name === "Arrow") {
			console.log(demo);
			demo[i2].coords.x = clickedMarkerCoords.lat;
			demo[i2].coords.y = clickedMarkerCoords.lng;
			console.log(demo);
			localStorage.mapUserMarkers = JSON.stringify(demo);
		}
    }
}
*/