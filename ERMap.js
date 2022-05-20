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
	// Make sure the group exists
	if (layerGroups[layer] != undefined) {
		// Add state to local storage
		let storageState = [];
		let match = false;
		// Read local storage json
		if (localStorage.markerState !== undefined) {
			storageState = JSON.parse(localStorage.markerState);
		}
		// Loop through state length
		for (let i = 0; i < storageState.length; i++) {
			if (storageState[i].stateName == layer) {
				// Change stateValue
				storageState[i].stateValue = element.checked;
				// Confirm matching name
				match = true;
				// Break loop
				i = storageState.length;
			}
		}
		// Save data to local storage
		if (match == false) {
			storageState.push({
				"stateName": layer,
				"stateValue": element.checked
			});
		}
		localStorage.markerState = JSON.stringify(storageState);
		
		// Check if element is ticked
		if (element.checked) {			
			map.addLayer(layerGroups[layer]);
			if (map.hasLayer(underground)) {
				map.eachLayer(function (e) {
					$(e._icon).addClass(e.options.level);
					if (e.options.level == "overworld") {
						$('.overworld').css('visibility', 'hidden');
					} else if (e.options.level == "underground") {
						$('.underground').css('visibility', 'visible');
					}
				});
			} else {
				map.eachLayer(function (e) {
					$(e._icon).addClass(e.options.level);
					if (e.options.level == "overworld") {
						$('.overworld').css('visibility', 'visible');
					} else if (e.options.level == "underground") {
						$('.underground').css('visibility', 'hidden');
					}
				});
			}
		} else {
			//$('#allmarkers').prop('checked', false);
			map.removeLayer(layerGroups[layer]);
		}
	}
}

// Run after page load
$(document).ready (function() {
	// Cycle through each marker-list input
	$('.markers-list input').each(function() {toggle(this, this.id);});
});

$('.markers-list input').each(function() {
	this.onchange = function() {
		toggle(this, this.id);
		if (this.id == "textmarkers") {
			if ($(this.id).is(':checked')) {
				//$('.leaflet-tooltip-top').css('visibility', 'hidden');
				//$('.leaflet-tooltip-top.secondary').css('visibility', 'hidden');
			} else {
				//$('.leaflet-tooltip-top').css('visibility', 'visible');
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
	let j = 0;
	
	if (j != 0) {
		map.eachLayer(function(e) {
			if (e._source != undefined) {
				let currentTitle = e._source.options.title;
				let originalWidth = $('.leaflet-marker-pane img[title='+currentTitle+']').css('width', '').width();
				let originalHeight = $('.leaflet-marker-pane img[title='+currentTitle+']').css('height', '').height();
				console.log(currentTitle + ': ' + originalWidth + 'x' + originalHeight);
				
				$('.leaflet-marker-pane img[title='+currentTitle+']').css('width', originalWidth / 2);
			}
		});
	}
	j = 1;
});

// Limit input of coordinates range
function numonly(e){
	$("#mlat,#mlon").keyup(function() {
		let  val = $(this).val().replace(/-?\d+[^0-9]+/,"");
		if ($(this).val() == $("#mlon").val()) {console.log("SAM");} //then it's the longtitude, if not, it's latirude
		$(this).val(val);
	});
};

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
	toggleVisibility(e, 1);
});

map.on('overlayremove', function (e) {
	toggleVisibility(e, 2);
});

function toggleVisibility (e, num) {
	if (e.name === 'Underground') {
		//map.removeLayer(layerGroups.textmarkers);
		
		if (num == 1) {
			$('.overworld').css('visibility', 'hidden');
			$('.underground').css('visibility', 'visible');
		} else {
			$('.overworld').css('visibility', 'visible');
			$('.underground').css('visibility', 'hidden');
		}
	}
}

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