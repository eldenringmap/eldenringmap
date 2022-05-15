// UI map coordinates
L.Control.Coordinates.include({
	_update: function(evt) {
		let  pos = evt.latlng,
		opts = this.options;
		if (pos) {
			this._currentPos = pos;
			this._inputY.value = L.NumberFormatter.round(pos.lat, opts.decimals, opts.decimalSeperator);
			this._inputX.value = L.NumberFormatter.round(pos.lng, opts.decimals, opts.decimalSeperator);
			this._label.innerHTML = this._createCoordinateLabel(pos);
		}
	}
});
L.control.coordinates({
	position: "bottomright",
	decimals: 0, //optional default 4
	decimalSeperator: ".", //optional default "."
	labelTemplateLat: "Y: {y}", //optional default "Lat: {y}"
	labelTemplateLng: "X: {x}", //optional default "Lng: {x}"
	enableUserInput: true, //optional default true
	useDMS: false, //optional default false
	useLatLngOrder: false, //ordering of labels, default false -> lng-lat
	markerType: L.marker, //optional default L.marker
	markerProps: {} //optional default {}
}).addTo(map);