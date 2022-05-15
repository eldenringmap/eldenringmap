// Context Menu Content
const contextmenuItems = [{
	text: "Add Marker",
	callback: addMarkerText,
},{
	text: "Zoom in",
	callback: zoomIn,
},{
	text: "Zoom out",
	callback: zoomOut,
},];

// Create Context Menu
function createMenu() {
	const menu = document.createElement("ul");
	menu.classList.add("context-menu");
	menu.setAttribute("data-contextmenu", "0");
	contextmenuItems.forEach((item) => {
		const li = document.createElement("li");
		li.innerText = item.text;
		li.addEventListener("click", item.callback);
		menu.appendChild(li);
	});
	return menu;
}

// Zoom in
function zoomIn() {
	map.zoomIn();
	hideMenu();
}

// Zoom out
function zoomOut() {
	map.zoomOut();
	hideMenu();
}

// Global var for coords
let latlngObj = {
	lat: 0,
	lng: 0,
};

// Add context menu to body
document.body.appendChild(createMenu());

// Add context menu to map
var menu = document.querySelector("#map");
document.addEventListener("contextmenu", function (e) {
	e.preventDefault()
	show(e);
});

function show(e) {
	const ul = document.querySelector("ul.context-menu");
	ul.style.display = "block";
	ul.style.left = `${e.pageX}px`;
	ul.style.top = `${e.pageY}px`;
	ul.classList.add("is-open");
	
	ul.focus();
	
	const point = L.point(e.pageX, e.pageY);
	const coordinates = map.containerPointToLatLng(point);
	
	latlngObj = { ...latlngObj, ...coordinates };
	
	e.preventDefault();
}

// Hide Context Menu
function hideMenu() {
	const ul = document.querySelector(".context-menu");
	ul.removeAttribute("style");
	ul.classList.remove("is-open");
}

// Hide on different action
window.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("wheel", hideMenu);
	["zoomstart", "resize", "click", "move"].forEach((eventType) => {
		map.on(eventType, hideMenu);
	});
});