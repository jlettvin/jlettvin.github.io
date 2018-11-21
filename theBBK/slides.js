"use strict";
(function() {

	var display = document.getElementsByTagName("article")[0];
	var buttons = document.getElementsByTagName("nav")[0];

	document.panes = [];
	document.pane = "Slide1";
	document.display = function (event) {
		document.pane = this.innerHTML;
		document.go(0);
	};
	document.go = function(dir) {
		if (-1 <= dir && dir <= 1) {
			var slide = 'Slide' + (parseInt(document.pane.substr(5)) + dir);
			if (document.panes.includes(slide)) {
				document.pane = slide;
				var target = document.getElementsByTagName("article")[0];
				var source = document.getElementById(document.pane);
				target.innerHTML = '<summary>' + slide + '</summary>' +
					source.innerHTML;
			}
		}
	};

	for (var pane of document.getElementsByTagName("section")) {
		if (pane.id === "display") continue;
		document.panes.push(pane.id);
		var help = pane.getElementsByTagName("summary")[0];
		var button = document.createElement("button");
		var abbr = document.createElement("abbr");
		abbr.setAttribute("title", help.innerHTML);
		button.innerHTML = pane.id;
		button.onclick = document.display;
		abbr.appendChild(button);
		buttons.appendChild(abbr);
	}

	document.addEventListener('keyup', function(event) {
		var key = event.code;
		switch(key) {
			case 'PageUp': case 'ArrowLeft': // case 'ArrowUp':
				document.go(-1); break;
			case 'PageDown': case 'ArrowRight': // case 'ArrowDown':
				document.go(+1); break;
		}
	});

	document.go(0);
}
)();
