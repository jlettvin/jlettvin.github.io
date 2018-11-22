"use strict";

(function() {

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.slides = document.jlettvin.slides || {
		version: [0, 0, 6],
		article: document.getElementsByTagName("article")[0],
		buttons: document.getElementsByTagName("nav")[0],
		section: document.getElementsByTagName("section"),
		button: [],
		style: {
			section: [
				"display:  none; visibility: hidden;",
				"display: grid; visibility: visible;",
			],
			button: [
				"background-color: white; color: black;",
				"background-color: black; color: white;",
			],
		},
		show: 0,

		// Function to hide/show previous/next slide
		exchange: function() {
			var slides = document.jlettvin.slides;  // Needed for context
			var hide   = slides.hide;
			var show   = slides.show;
			var style  = slides.style;

			slides. button[hide].setAttribute("style", style.button[0]);
			slides. button[show].setAttribute("style", style.button[1]);
			slides.section[hide].setAttribute("style", style.section[0]);
			slides.section[show].setAttribute("style", style.section[1]);
		},

		// Function to show current slide
		jump: function (event) {
			var slides = document.jlettvin.slides;  // Needed for context
			slides.hide = slides.show;
			slides.show = parseInt(this.innerHTML.substr(5)) - 1;
			slides.exchange();
		},

		// Function to fill the article with the currently chosen section
		step: function(dir) {
			var slides = document.jlettvin.slides;  // Needed for context
			if (-1 <= dir && dir <= 1) {
				var change = slides.show + dir;
				if (0 <= change && change < slides.counted) {
					slides.hide = slides.show;
					slides.show = change;
					slides.exchange();
				}
			}
		},

		// Entrypoint function
		main: function() {
			// Count the sections
			this.counted = this.section.length;
			var version = document.createElement("span");
			version.innerHTML = "Slides Version: " +
				this.version[0] + '.' +
				this.version[1] + '.' +
				this.version[2];
			version.setAttribute("style", "font-size: 10px; padding: 0px 20px 0px 0px");
			this.buttons.appendChild(version);

			// Accumulate the slides for display
			for (var N = this.counted, n = 0; n < N; ++n) {
				var section = this.section[n];
				var help    = section.getElementsByTagName("summary")[0];
				var button  = document.createElement("button");
				var abbr    = document.createElement("abbr");

				// Hide all sections by default
				section.setAttribute("style", this.style.section[0]);

				abbr.setAttribute("title", help.innerHTML);
				abbr.setAttribute("display", "none");
				abbr.setAttribute("visibility", "hidden");
				button.innerHTML = 'Slide' + (n + 1);
				button.onclick = this.jump;
				buttons.setAttribute("style", this.style.button[0]);
				abbr.appendChild(button);
				this.buttons.appendChild(abbr);
				this.button.push(button);
			}

			// Attach functions to keyboard input
			var slides  = this;  // Needed for context
			document.addEventListener('keyup', function(event) {
				switch(event.code) {
					case 'PageUp'  : case 'ArrowLeft' : slides.step(-1); break;
					case 'PageDown': case 'ArrowRight': slides.step(+1); break;
				}
			});

			this.step(0);
		},
	};

	// Display first page on initial visit or refresh
	document.jlettvin.slides.main();

})();
