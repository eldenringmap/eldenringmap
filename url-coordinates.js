let hash = new L.Hash(map);

// URL Function
function getUrlVars() {
	let  vars = {};
	let  parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});

	let  urlCoordinates = getUrlVars()["marker"];
	if (urlCoordinates != undefined) {
		let  markFound = false;
		sidebar.close();
		if (getUrlVars()["zoom"]>=1 && getUrlVars()["zoom"]<=4) {
			let  urlZoom = getUrlVars()["zoom"];
		} else {
			let  urlZoom = 4;
		};

		for (let  l in globalMarkers){
			let  markerX = globalMarkers[l]._latlng.lat;
			let  markerY = globalMarkers[l]._latlng.lng;
			let  markerdata = (markerY+','+markerX);    

			if (markerdata == urlCoordinates){
				$('#'+globalMarkers[l].options.title).prop('checked', true);
				map.addLayer(layerGroups[globalMarkers[l].options.title]);
				map.flyTo(globalMarkers[l].getLatLng(),urlZoom);
				if (getUrlVars()["popup"]!="false") globalMarkers[l].openPopup();
				markFound = true;
			};
		};

		if (markFound==false) {
			let  aux_y = urlCoordinates.split(",")[1];
			let  aux_x = urlCoordinates.split(",")[0];
			if ((aux_y <= mapBounds && aux_y>0) && (aux_x<=mapBounds && aux_x>0)) {
				let  aux_marker = L.marker([aux_y, aux_x]);        
				map.flyTo(aux_marker.getLatLng(), urlZoom);
				aux_marker = null;
			};
			aux_y = null;
			aux_x = null;
		};
	};
}