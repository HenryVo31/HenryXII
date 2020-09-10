// Track when media query condition is triggered
if (matchMedia) {
	const mq = window.matchMedia("(max-width: 800px)");
	mq.addListener(WidthChange);
	WidthChange(mq);
}

var mobile;

function WidthChange(mq) {
	// If media query is triggered:
	if (mq.matches) {
		mobile = true;
	}

	// If media query is NOT triggered
	else {
		mobile = false;
	}
}

// Functions to open and close nav bar
function open_navbar() {

	if (mobile === false) {
		document.querySelector(".nav-bar-outerdiv").style.width = "30rem";
		document.querySelector("#nav-bar-icon-close").style.display = "inline-block";
		document.querySelector("#nav-bar-icon-open").style.display = "none";
	}

	else {
		document.querySelector(".nav-bar-outerdiv").style.width = "100%";
		document.querySelector("#nav-bar-icon-close").style.display = "inline-block";
		document.querySelector("#nav-bar-icon-open").style.display = "none";
	}
};

function close_navbar() {
	document.querySelector(".nav-bar-outerdiv").style.width = "0";
	document.querySelector("#nav-bar-icon-close").style.display = "none";
	document.querySelector("#nav-bar-icon-open").style.display = "inline-block";
};

