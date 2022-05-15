// Initial Variable Setup
let url = ('https://' + window.location.hostname + '/');
let iconsUrl = 'icons/Locations/';
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

let iconWidth = 100;
let iconHeight = 100;
let iconAnchorWidth = 100;
let iconAnchorHeight = 100;

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

// Marker icons
let mapMarkers = [
	{icon:"grace",			width: "156", height: "155"},
	{icon:"cave",			width: "199", height: "162"},
	{icon:"church",			width: "140", height: "187"},
	{icon:"mine",			width: "182", height: "154"},
	{icon:"evergaol",		width: "128", height: "126"},
	{icon:"minortree",		width: "202", height: "248"},
	{icon:"catacomb",		width: "157", height: "137"},
	{icon:"well",			width: "199", height: "129"},
	{icon:"windmill",		width: "153", height: "171"},
	{icon:"ruins",			width: "261", height: "158"},
	{icon:"sunkentown",		width: "229", height: "129"},
	{icon:"town",			width: "224", height: "109"},
	{icon:"cathedral",		width: "276", height: "210"},
	{icon:"cityruins",		width: "250", height: "172"},
	{icon:"divinetower",	width: "115", height: "235"},
	{icon:"puzzletower",	width: "110", height: "223"},
	{icon:"shack",			width: "233", height: "135"},
	{icon:"precipice",		width: "110", height: "223"},
	{icon:"gesture",		width: "110", height: "223"},
	{icon:"talisman",		width: "80", height: "80"},
	{icon:"spell",			width: "80", height: "80"},
	{icon:"weapon",			width: "80", height: "80"},
	{icon:"merchant",		width: "80", height: "80"},
	{icon:"boss",			width: "80", height: "80"},
	{icon:"armour",			width: "80", height: "80"},
	{icon:"ashofwar",		width: "80", height: "80"},
	{icon:"cookbook",		width: "80", height: "80"},
	{icon:"npc",			width: "80", height: "80"},
];

let  markerIconTypes = [];
for (let  i in mapMarkers) {
	let  icon = mapMarkers[i].icon;
	let  iWidth = mapMarkers[i].width;
	let  iHeight = mapMarkers[i].height;
	// make the icon while we are here
	markerIconTypes[i] = L.icon({
		className: "",
		iconUrl: iconsUrl + icon.replace(/ /g, "") + '.png',
		iconSize: [iWidth, iHeight],
		iconAnchor: [iWidth / 2, iHeight / 2,],
		popupAnchor: [0, -iHeight / 2],
		tooltipAnchor: [0, iHeight / 10]
	});
};

let layerGroups = [];

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

// Serach Dropdown
/*
$(document).ready(function () {
	$('select').selectize({
		sortField: 'text'
	});
});
*/

// Text Markers
let  transparentMarker = L.icon({
	iconUrl: iconsUrl+'',
	iconSize: [1, 1],
	iconAnchor: [iconAnchorWidth, iconAnchorHeight],
	popupAnchor: [0, -18]
});

for (let  i = 0; i < textMarkers.length; i++) {
	// If the group doesn't exists
	if (layerGroups.textmarkers == undefined) {
		// Create the group
		layerGroups.textmarkers = new L.LayerGroup();
	}
	// Add the marker
	let  textMarker = new L.marker(textMarkers[i].coords, { opacity: 1.0, icon: transparentMarker }); //opacity may be set to zero
	//textMarker.bindTooltip(textMarkers[i].name, {permanent: true, direction: "top", className: "text-label", offset: [0, 0] });
	textMarker.bindTooltip(textMarkers[i].name, {permanent: true, direction: "top", className: textMarkers[i].zoom, offset: [0, 0] });
	textMarker.addTo(layerGroups.textmarkers); // Adds the text markers to map.
	
	// Set ID for zoom levels
	layerGroups.textmarkers.eachLayer (function (e) {
		e.layerID = textMarkers[i].zoom;
		console.log(textMarkers[i].zoom);
	});
}
// End Text Markers

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



// ??
function getIcon(index) {
	let  icon = markers[index].icon;
	let  markerIcon = L.icon({
		iconUrl: iconsUrl+icon+'.png',
		iconSize: [72,72],
		iconAnchor:   [36, 54],
		popupAnchor:  [0, -18],
		tooltipAnchor: [0, markerIconTypes[index].options.tooltipAnchor],
	});
	return markerIcon;
}

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

// Markers loaded from code
for (let  i = 0; i < markers.length; i++) {
	console.log("Added Code Markers");
	// If the group doesn't exists in layergroups, create group
	if (layerGroups[markers[i].group] == undefined) {
		layerGroups[markers[i].group] = new L.LayerGroup();
	}
	// Undefined variables are hidden from popups
	if (markers[i].desc == undefined) {markers[i].desc = "";}
	if (markers[i].img == undefined) {markers[i].img = "";}
	
	let  x = (markers[i].coords[1]).toFixed(0);
	let  y = (markers[i].coords[0]).toFixed(0);
  
	let  origin_x = (markers[i].coords[1]).toFixed(0);
	let  origin_y = (markers[i].coords[0]).toFixed(0);
	
	let  markerUrl = (url+"?marker="+y+","+x);
	markerUrl = encodeURI(markerUrl);

	// Add the marker
	let  marker = L.marker([x, y], {icon: getIcon(i),title: markers[i].group}).bindPopup("\
		<p class='mname'>"+markers[i].name + "</p>\
		<p class='mimg'>"+markers[i].img + "</p>\
		<span class='mdesc'>"+ markers[i].desc +"</span>\
		<p class='original_coords'>"+origin_y+","+origin_x+"</p>\
		<p class='markerlink hide'>"+markerUrl+"</p>\
		<button class='copymarkerurl'>\
			<span class='sharetext'>Copy link</span>\
			<span class='copiedmsg hide'>Copied</span>\
		</button>").addTo(layerGroups[markers[i].group]);
	L.layerGroup(layerGroups).addTo(map);
}

// Markers loaded from browser storage
let  groupUser = [];
initUserLayerGroup();
function initUserLayerGroup() {
	let  markersUser = [];
	if (localStorage.mapUserMarkers == "undefined") {
		localStorage.mapUserMarkers = "[]";
	}
	if (localStorage.mapUserMarkers !== undefined) {
		let  storageMarkers = [];
		storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		for (let  i = 0; i < storageMarkers.length; i++) {
			console.log("Added local markers");
			let  x = storageMarkers[i].coords.x;
			let  y = storageMarkers[i].coords.y;
			let  name = storageMarkers[i].name;
			let  icon = storageMarkers[i].icon;
			let  iconvalue = storageMarkers[i].iconvalue;
			let  iconUrl = storageMarkers[i].icon.options.iconUrl;
			let  desc = storageMarkers[i].desc;
			let  region = storageMarkers[i].region;
			let  group = storageMarkers[i].group;
				
			let  markerlink = (url+"?m="+y+","+x+"&name="+name+"&desc="+desc+"&icon="+iconvalue+"&");
				markerlink = encodeURI(markerlink);
				
			// User markers defaults
			let  customIcon = L.icon({
				iconUrl: storageMarkers[i].icon.options.iconUrl,
				iconSize: storageMarkers[i].icon.options.iconSize,
				iconAnchor: storageMarkers[i].icon.options.iconAnchor,
				popupAnchor:  storageMarkers[i].icon.options.popupAnchor,
				//tooltipAnchor: markerIconTypes[i].options.tooltipAnchor,
				className: storageMarkers[i].icon.options.className,
			});
			
			// User marker content
			let  popupcontent = '\
				<div class="popcontent">\
					<p class="mname">'+name+'</p>\
					<p class="mdesc">'+desc+'</p>\
					<p class="mregion">'+region+'</p>\
					<p class="mgroup">'+group+'</p>\
					<span class="mcoords">X: '+y+' Y: '+x+'</span>\
				</div>\
				<span class="markerlink hide">'+markerlink+'</span>\
				<button class="copymarkerurl">\
					<span class="sharetext">Copy link</span>\
					<span class="copiedmsg hide">Copied</span>\
				</button>\
				<button class="edit-marker">Edit marker</button>\
				<div id="edit-dialog" class="hide">\
				<div class="chooseIcon">Choose Icon:</div>\
				<div id="iconprev" style="background-image:url(\''+iconUrl+'\')"></div>\
				<select id="select_icon" name="icon" onchange="iconpref(this.value);">';
			for (let  j in mapMarkers) {
				popupcontent +='<option value="'+j+'">'+mapMarkers[j].icon.replace(/_/gi, " ")+'</option>';
			};
			popupcontent = popupcontent+'</select>\
				<input type="text" id="editedtitle" name="name" value="'+name+'">\
				<textarea id="editeddesc" name="desc">'+desc+'</textarea>\
				<button class="cancel">Cancel</button>\
				<button class="save-marker">Save</button>\
				</div>\
				<button class="remove-marker">Remove marker</button>\
				<div id="remove-dialog" class="hide">\
					<span class="remove-text">Are you sure?</span>\
					<button class="yes">Yes</button>\
					<button class="no">No</button>\
				</div>';
			
			let  marker = new L.marker([x, y], {draggable: true,icon: customIcon,title: customIcon}).bindPopup(popupcontent);
			//marker.on("dragend", dragedMarker);
			marker.bindTooltip((name), {permanent: true, direction: 'bottom', offset: L.point(0,0)}).openTooltip();
			marker.on("popupopen", onPopupOpen);
			marker.addTo(layerGroups[group]);
			markersUser.push(marker);
			
			if (layerGroups[group] == undefined) {
				layerGroups[group] = new L.LayerGroup();
			}
		}
	} else {
		localStorage.mapUserMarkers = "[]";
	}
	groupUser = L.layerGroup(markersUser);
}


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
		/*
	let  val = $(this).val().replace(/-?\d+[^0-9]+/,"");
    if (val => 2934){
      !/^\s*$/.test(val);
      if (val > 0) {
        val = (parseInt(val) > 2934) ? 2934 : val;
      }else{
        val = (parseInt(val) > -2394) ? val : -2394;
      }
    }
    else {
      (!/^\s*$/.test(val));
      if (val > 0) {
        val = (parseInt(val) > 2934) ? 2934 : val;
      }else{
        val = (parseInt(val) > -2394) ? val : -2394;
      }
    }
	*/
		$(this).val(val);
	});
};
// End limit input of coordinates range

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
		popup._close();
		
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

// Popup code
function onPopupOpen(e) {
	let  _this = this;
	let  clickedMarkerCoords = _this.getLatLng();
	let  clickedMarkerCoordsNew = e.target.getLatLng();
	let  popup = _this.getPopup();
	
	// Marker Log data
	console.log(layerGroups);
	
	// Delete Marker
	$(document).off('click', '.remove-marker')
	$(document).on('click', '.remove-marker', function() {
		$(this).addClass('hide');
		$(this).next('#remove-dialog').removeClass('hide');
		$(this).parent().parent().find('.popcontent').addClass('hide');
		$(this).parent().parent().find('.edit-marker').addClass('hide');
		$(this).parent().parent().find('.copymarkerurl').addClass('hide');
	});
	$(document).off('click', '.no')
	$(document).on('click', '.no', function() {
		$(this).parent('#remove-dialog').addClass('hide');
		$(this).parent().parent().find('.popcontent').removeClass('hide');
		$(this).parent().parent().find('.edit-marker').removeClass('hide');
		$(this).parent().parent().find('.remove-marker').removeClass('hide');
		$(this).parent().parent().find('.copymarkerurl').removeClass('hide');
	});
	
	$(document).off('click', '.yes')
	$(document).on('click', '.yes', function() {
		storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		for(i = storageMarkers.length; i > -1; i--) {
			if (typeof storageMarkers[i] != 'undefined' && 
			(clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
			clickedMarkerCoords.lng == storageMarkers[i].coords.y)
			) {
				storageMarkers.splice(i, 1);
				localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
			}
		}
		//localStorage.removeItem('userMarkers');
		map.removeLayer(_this);
		groupUser.removeLayer(_this);
	});
	
	//Edit Marker
	$(document).off('click', '.edit-marker')
	$(document).on('click', '.edit-marker', function() {
		storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		for(i = storageMarkers.length; i > -1; i--) {
			if (typeof storageMarkers[i] != 'undefined' && 
			(clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
			clickedMarkerCoords.lng == storageMarkers[i].coords.y)
			) {
				$(this).parent().find('#iconprev').css("background-image", "url("+storageMarkers[i].icon.options.iconUrl+")");
				$(this).parent().find('#select_icon').val(storageMarkers[i].iconvalue);
			}
		}
		// HERE
		$(this).addClass('hide');
		$(this).next('#edit-dialog').removeClass('hide');
		$(this).parent().parent().find('.popcontent').addClass('hide');
		$(this).parent().parent().find('.remove-marker').addClass('hide');
		$(this).parent().parent().find('.copymarkerurl').addClass('hide');
	});
	$(document).off('click', '.cancel')
	$(document).on('click', '.cancel', function() {
		$(this).parent().parent().find('#edit-dialog').addClass('hide');
		$(this).parent().parent().find('.popcontent').removeClass('hide');
		$(this).parent().parent().find('.edit-marker').removeClass('hide');
		$(this).parent().parent().find('.remove-marker').removeClass('hide');
		$(this).parent().parent().find('.copymarkerurl').removeClass('hide');
		popup._close();
	});
	$(document).off('click', '.save-marker')
	$(document).on('click', '.save-marker', function() {
		storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		for(i = storageMarkers.length; i > -1; i--) {
			if (typeof storageMarkers[i] != 'undefined' && 
			(clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
			clickedMarkerCoords.lng == storageMarkers[i].coords.y)
			) {
				let  editedicon = $(this).parent().find('select[name=icon]').val();
				let  editedtitle = $(this).parent().find('#editedtitle').val();
				let  editeddesc = $(this).parent().find('#editeddesc').val();
				
				let  markerlink = (url+"?m="+clickedMarkerCoords.lng+","+clickedMarkerCoords.lat+"&title="+editedtitle+"&desc="+editeddesc+"&icon="+editedicon+"&");
				markerlink = encodeURI(markerlink);
        
			let  editedpopup ='\
			<div class="popcontent">\
				<p class="mname">'+editedtitle+'</p>\
				<p class="mdesc">'+editeddesc+'</p>\
				<span class="mcoords">[ '+clickedMarkerCoords.lng+' , '+clickedMarkerCoords.lat+']</span>\
			</div>\
			<span class="markerlink hide">'+markerlink+'</span>\
			<button class="copymarkerurl">\
				<span class="sharetext">Copy link</span>\
				<span class="copiedmsg hide">Copied</span>\
			</button>\
			<button class="edit-marker">Edit marker</button>\
			<div id="edit-dialog" class="hide">\
				<div class="chooseIcon">Choose Icon:</div>\
				<div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
				<select id="select_icon" name="icon" onchange="iconpref(this.value);">';
			for (let  j in mapMarkers) {
				editedpopup +='<option value="'+j+'">'+mapMarkers[j].icon.replace(/_/gi, " ")+'</option>';
			};
			editedpopup = editedpopup+'\
				</select>\
				<input type="text" id="editedtitle" name="title" value="'+editedtitle+'">\
				<textarea id="editeddesc" name="desc">'+editeddesc+'</textarea>\
				<button class="cancel">Cancel</button>\
				<button class="save-marker">Save</button>\
			</div>\
			<button class="remove-marker">Remove marker</button>\
			<div id="remove-dialog" class="hide">\
				<span class="remove-text">Are you sure?</span>\
				<button class="yes">Yes</button><button class="no">No</button>\
			</div>';
			popup.setContent(editedpopup);

			_this.setIcon(markerIconTypes[editedicon]);
			storageMarkers[i].name = editedtitle;
			storageMarkers[i].desc = editeddesc;
			storageMarkers[i].icon = (markerIconTypes[editedicon]);
			storageMarkers[i].iconvalue = editedicon;
			localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
			}
		}
		popup._close();
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
	// Programmed Markers
	console.log("Programmed Markers: ");
	console.log(markers);
	// User Markers
	console.log("User Markers: ");
	console.log(groupUser);
	// layerGroups
	console.log("layerGroups: ");
	console.log(layerGroups);
	//for (let i = 0; i < mapMarkers.length; i++) {
		//map.removeLayer(layerGroups.mapMarkers[i].group);
		//console.log(i);
	//};
	console.log(e.name);
	if (e.name === 'Underground') {
		map.removeLayer(layerGroups.grace);
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

// GEO-JSON LOAD
/*
$.getJSON("drawn_polygons.geojson",function(data){
	L.geoJson(data).addTo(map);
});

fetch("drawn_polygons.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // use geoJSON
    L.geoJSON(data, {
      onEachFeature: onEachFeature,
    }).addTo(map);
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