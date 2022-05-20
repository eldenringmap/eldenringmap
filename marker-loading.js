var layerGroups = [];
let iconsUrl = 'icons/Locations/';
let iconWidth = 100;
let iconHeight = 100;
let iconAnchorWidth = 100;
let iconAnchorHeight = 100;
let url = ('https://' + window.location.hostname + '/');

// Marker icons
let mapMarkers = [
	{icon:"grace",			width: "130", height: "130"},
	{icon:"cave",			width: "199", height: "162"},
	{icon:"church",			width: "140", height: "187"},
	{icon:"mine",			width: "182", height: "154"},
	{icon:"evergaol",		width: "128", height: "126"},
	{icon:"minortree",		width: "202", height: "248"},
	{icon:"catacomb",		width: "157", height: "137"},
	{icon:"well",			width: "199", height: "129"},
	{icon:"windmill",		width: "153", height: "171"},
	{icon:"ruins",			width: "261", height: "159"},
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
	{icon:"weapons",		width: "80", height: "80"},
	{icon:"merchant",		width: "80", height: "80"},
	{icon:"boss",			width: "80", height: "80"},
	{icon:"armour",			width: "80", height: "80"},
	{icon:"ashofwar",		width: "80", height: "80"},
	{icon:"cookbook",		width: "80", height: "80"},
	{icon:"npc",			width: "80", height: "80"},
];

// Change marker image on map
function iconpref(value) {
	document.getElementById("iconprev").style.backgroundImage = "url("+markerIconTypes[value].options.iconUrl+")";
};
// Change marker image and group in popup
function titlepref(value) {
	document.getElementById("titleprev").value = value.replace(/_/gi, " ");
	document.getElementById("grouptype").value = value.replace(/_/gi, " ");
};

var  markerIconTypes = [];
for (let  i in mapMarkers) {
	let  icon = mapMarkers[i].icon;
	let  iWidth = mapMarkers[i].width;
	let  iHeight = mapMarkers[i].height;
	
	// make the icon while we are here
	markerIconTypes[i] = L.icon({
		className: "",
		iconUrl: iconsUrl + icon.replace(/ /g, "") + '.png',
		iconSize: [iWidth / 2, iHeight / 2],
		iconAnchor: [iWidth / 4, iHeight / 4,],
		popupAnchor: [0, -iHeight / 4],
		tooltipAnchor: [0, -11 + iHeight / 4]
	});
};

// Text Markers
let  transparentMarker = L.icon({
	iconUrl: 'icons/ui/Untitled-1.png',
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
	let  textMarker = new L.marker(textMarkers[i].coords, {opacity: 1.0, icon: transparentMarker, level: textMarkers[i].level}); //opacity may be set to zero
	textMarker.bindTooltip(textMarkers[i].name, {permanent: true, direction: "top", className: textMarkers[i].zoom + " " + textMarkers[i].level, offset: [0, 0] });
	textMarker.addTo(layerGroups.textmarkers); // Adds the text markers to layerGroups.
}
/*
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
	//L.layerGroup(layerGroups).addTo(map);
}
*/

// Markers loaded from browser storage
let  groupUser = [];
initUserLayerGroup();
function initUserLayerGroup() {
	let markersUser = [];
	// Create mapUserMarkers if undefined
	if (localStorage.mapUserMarkers == "undefined") {
		localStorage.mapUserMarkers = "[]";
	}
	if (localStorage.markerState == "undefined") {
		localStorage.markerState = "[]";
	}
	
	if (localStorage.markerState !== undefined) {
		let storageState = [];
		storageState = JSON.parse(localStorage.markerState);
		for (let i = 0; i < storageState.length; i++) {
			console.log("storageState:");
			console.log(storageState);
			$('#'+storageState[i].stateName).prop('checked', storageState[i].stateValue);
		}
	} else {
		localStorage.markerState = "[]";
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
			let  level = storageMarkers[i].level;
			var  group = storageMarkers[i].group;
				
			let  markerlink = (url+"?m="+y+","+x+"&name="+name+"&desc="+desc+"&icon="+iconvalue+"&");
				markerlink = encodeURI(markerlink);
				
			// User markers defaults
			let  customIcon = L.icon({
				iconUrl: storageMarkers[i].icon.options.iconUrl,
				iconSize: storageMarkers[i].icon.options.iconSize,
				iconAnchor: storageMarkers[i].icon.options.iconAnchor,
				popupAnchor:  storageMarkers[i].icon.options.popupAnchor,
				tooltipAnchor: storageMarkers[i].icon.options.tooltipAnchor,
				//className: storageMarkers[i].icon.options.className,
			});
			
			// User marker content
			let  popupcontent = '\
				<div class="popcontent">\
					<p class="mname">'+name+'</p>\
					<p class="mdesc">'+desc+'</p>\
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
			if (layerGroups[group] == undefined) {
				layerGroups[group] = new L.LayerGroup();
			}
			let  marker = new L.marker([x, y], {draggable: false, icon: customIcon, title: group, level: level});
			marker.bindPopup(popupcontent);
			marker.bindTooltip((name), {permanent: true, direction: 'bottom', offset: L.point(0,0), className: level});
			marker.on("popupopen", onPopupOpen);
			marker.addTo(layerGroups[group]);
			markersUser.push(marker);
		}
	} else {
		localStorage.mapUserMarkers = "[]";
	}
	groupUser = L.layerGroup(layerGroups[group]);
}
/*
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
*/

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
		popup.close();
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
			let oldGroup = storageMarkers[i].group;
			storageMarkers[i].group = mapMarkers[$(this).parent().find('select[name=icon]').val()].icon
			
			// User markers defaults
			let  customIcon = L.icon({
				iconUrl: storageMarkers[i].icon.options.iconUrl,
				iconSize: storageMarkers[i].icon.options.iconSize,
				iconAnchor: storageMarkers[i].icon.options.iconAnchor,
				popupAnchor:  storageMarkers[i].icon.options.popupAnchor,
				//tooltipAnchor: markerIconTypes[i].options.tooltipAnchor,
				className: storageMarkers[i].icon.options.className,
			});
			let  editedMarker = new L.marker([storageMarkers[i].coords.x, storageMarkers[i].coords.y], {draggable: false,icon: customIcon,title: customIcon}).bindPopup(editedpopup);
			editedMarker.bindTooltip((editedtitle), {permanent: true, direction: 'bottom', offset: L.point(0,0)}).openTooltip();
			editedMarker.on("popupopen", onPopupOpen);
			
			let newGroup = storageMarkers[i].group;
			if (layerGroups[newGroup] == undefined) {
				layerGroups[newGroup] = new L.LayerGroup();
			}
			// Add edited marker to layerGroups.group
			editedMarker.addTo(layerGroups[newGroup]);
			groupUser.clearLayers();
			L.layerGroup(layerGroups[oldGroup]).removeLayer(_this);
			// Remove old marker from map
			map.removeLayer(_this);
			// Add edited marker to map
			map.addLayer(editedMarker);
			localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
			}
		}
		popup.close();
	});
}

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
			<div class="markerdesc">Marker Description:</div>\
			<textarea name="desc" onclick="this.value=\'\'; this.onclick = function(){}"></textarea>\
			<table class="coordsinputs">\
				<tr>\
					<td>X:<input type="text" name="mlon" id="mlon" maxlength="5" value="'+long+'" onKeyPress="return numonly(this,event)"></td>\
					<td>Y:<input type="text" name="mlat" id="mlat" maxlength="5" value="'+lat+'" onKeyPress="return numonly(this,event)"></td>\
				</tr>\
			</table>\
			<input type="hidden" id="grouptype" name="group" value="grace">\
			<input type="hidden" id="className" name="level" value="overworld">\
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

		let level = "overworld";
		if (map.hasLayer(underground) == true) {
			level = "underground";
		};

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
			"group": getAObj(postData,"group"),
			"level": level
		});
		popup.close();
		
		let  markerlink = (url+"?m="+lon+","+lat+"&name="+getAObj(postData,"name")+"&desc="+getAObj(postData,"desc")+"&icon="+getAObj(postData,"icon")+"&");
		markerlink = encodeURI(markerlink);

		let  popupcontent = '\
		<div class="popcontent">\
			<p class="mname">'+getAObj(postData,'name')+'</p>\
			<p class="mdesc">'+getAObj(postData,'desc')+'</p>\
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
		
		let  newMarker = new L.marker({lat: lat, lng: lon},{draggable: false,icon: markerIconTypes[getAObj(postData,"icon")], title: getAObj(postData,'group'), level: level});
		newMarker.bindPopup(popupcontent);
		newMarker.bindTooltip(getAObj(postData, 'name'), {permanent: true, direction: 'bottom', offset: L.point(0,0), className: level}).openTooltip();
		newMarker.addTo(map);
		newMarker.on("popupopen", onPopupOpen);
		markersUser.push(newMarker);
			console.log(groupUser);
		L.layerGroup(layerGroups[getAObj(postData,'group')]).addLayer(newMarker);
		localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
		if (layerGroups[getAObj(postData,'group')] == undefined) {
			layerGroups[getAObj(postData,'group')] = new L.layerGroup();
		}
		map.addLayer(layerGroups[getAObj(postData,'group')]);
		$(newMarker._icon).addClass(level);
		console.log(storageMarkers);
		e.preventDefault();
	});
}