"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 18,};

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.slides = document.jlettvin.slides || {
		version: version,  // this javascript code version
		show: 0,           // default first section
		bullet: 0,         // default first bullet item in section

		body:    document.getElementsByTagName("body")   [0],
		nav:     document.getElementsByTagName("nav")    [0],

		section: document.getElementsByTagName("section"),

		bullets: null,
		details: null,

		button: [],

		style: {
			section: [
				"display:  none; visibility: hidden;",
				"display: grid; visibility: visible;",
			],
			button: [
				"background-color: #aaaaaa; color: black;",
				"background-color: black; color: white;",
			],
		},

		// Function to hide/show previous/next slide
		swap: function() {
			var slides = document.jlettvin.slides;  // Needed for context
			var hide   = slides.hide;
			var show   = slides.show;
			var style  = slides.style;

			slides. button[hide].setAttribute("style", style.button[0]);
			slides. button[show].setAttribute("style", style.button[1]);
			slides.section[hide].setAttribute("style", style.section[0]);
			slides.section[show].setAttribute("style", style.section[1]);
			slides.bullets = slides.section[show].getElementsByTagName("li");
			//console.log(slides.bullets);
			for (var bullet of slides.bullets) {
				// TODO make "Details" visible only when hovering over bullet
				/*
				bullet.setAttribute("onmouseover", function(event) {
					console.log('over:', event);
				});
				bullet.setAttribute("onmouseout", function(event) {
					console.log('out:', event);
				});
				*/
				var detail = bullet.getElementsByTagName("details");
				console.log(detail);
				if (detail === undefined) {
				}
				if (detail && detail[0]) {
					detail[0].setAttribute(
						"style",
						"visibility: hidden; display: none;");
				}
				slides.bullet = 0;
			}
			//slides.details = slides.section[show].getElementsByTagName("details");
			//slides.bullet = 0;
		},

		// Function to show current slide
		jump: function (event) {
			var slides = document.jlettvin.slides;  // Needed for context
			slides.hide = slides.show;
			slides.show = parseInt(this.innerHTML.substr(5)) - 1;
			slides.swap();
		},

		// Function to fill the article with the currently chosen section
		step: function(dir) {
			var slides = document.jlettvin.slides;  // Needed for context
			if (-1 <= dir && dir <= 1) {
				var change = slides.show + dir;
				if (0 <= change && change < slides.counted) {
					slides.hide = slides.show;
					slides.show = change;
					slides.swap();
				}
			}
		},

		// Entrypoint function
		main: function() {
			var slides = document.jlettvin.slides;
			// Count the sections
			slides.counted = slides.section.length;
			var version = document.createElement("span");
			version.innerHTML = "Slides Version: " +
				slides.version.major + '.' +
				slides.version.minor + '.' +
				slides.version.build + '<br />';
			version.setAttribute("style", "font-size: 10px; padding: 0px 20px 0px 0px");
			slides.nav.appendChild(version);

			// Accumulate the slides for display
			for (var N = slides.counted, n = 0; n < N; ++n) {
				var section = slides.section[n];
				var details = section.getElementsByTagName("details");
				var summary = section.getElementsByTagName("summary")[0];
				var aside   = section.getElementsByTagName("aside"  )[0];

				// Hide all sections and details by default
				section.setAttribute("style", slides.style.section[0]);
				if (details.length != 0) {
					for (var detail of details) {
						detail.setAttribute("style",
							slides.style.section[0] +
							"display: none;");
					}
					//console.log(slides.bullet, details, details[slides.bullet]);
					details[slides.bullet].setAttribute("style",
						slides.style.section[1] +
						"display: inline;");
				}

				var button  = document.createElement("button");
				button.innerHTML = 'Slide' + (n + 1);
				button.onclick   = slides.jump;

				var abbr    = document.createElement("abbr");
				abbr.setAttribute("title", summary.innerHTML + '\n' + aside.innerHTML);
				abbr.setAttribute("display", "none");
				abbr.setAttribute("visibility", "hidden");
				abbr.appendChild(button);

				slides.nav.setAttribute("style", slides.style.button[0]);
				slides.nav.appendChild(abbr);
				slides.button.push(button);
			}

			// Do initial choice and swap
			slides.step(0);

			// Attach function to keyboard input
			var slides  = document.jlettvin.slides;  // Needed for context
			document.addEventListener('keyup', function(event) {
				switch(event.code) {
					case 'PageUp'  :
					case 'ArrowLeft':  case 'ArrowUp':   slides.step(-1); break;
					case 'PageDown':
					case 'ArrowRight': case 'ArrowDown': slides.step(+1); break;
				}
				event.preventDefault() // prevent scrolling
			}, false);

			// Attach function to swipe actions
			document.jlettvin.swipe.swipe(slides.body,function(swipedir) {
				switch(swipedir) {
					case  'SwipeLeft': case   'SwipeUp': slides.step(+1); break;
					case 'SwipeRight': case 'SwipeDown': slides.step(-1); break;
				};
			});

		},
	};

	// Display first page on initial visit or refresh
	document.jlettvin.slides.main();

})();
