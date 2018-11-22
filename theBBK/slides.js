"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 18,};

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.slides = document.jlettvin.slides || {
		version: version,  // javascript code version
		show: 0,           // default first page

		body:    document.getElementsByTagName("body")   [0],
		nav:     document.getElementsByTagName("nav")    [0],

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

		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			const threshold    = 150; // required min distance considered swipe
			const restraint    = 100; // maximum perpendicular distance
			const allowedTime  = 300; // maximum time for swipe

			var swipedir;
			var x0;
			var y0;
			var dx;
			var dy;
			var elapsedTime;
			var startTime;

			touchsurface.addEventListener('touchstart', function(event) {
				var touchobj = e.changedTouches[0]
				swipedir = 'none'
				dist = 0
				x0 = touchobj.pageX
				y0 = touchobj.pageY
				startTime = new Date().getTime() // time of first contact
				event.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function(event) {
				event.preventDefault() // prevent scrolling while swiping
			}, false);

			touchsurface.addEventListener('touchend', function(event) {
				var touchobj = event.changedTouches[0]
				dx = touchobj.pageX - x0 // horizontal swipe displacement
				dy = touchobj.pageY - y0 // vertical   swipe displacement
				elapsedTime = new Date().getTime() - startTime // elapsed time
				// meet first condition for awipe
				if (elapsedTime <= allowedTime) {
					var adx = Math.abs(dx);
					var ady = Math.abs(dy);
					// meet 2nd condition for horizontal swipe
					if (adx >= threshold && ady <= restraint) {
						// if dist traveled is negative, it indicates left swipe
						swipedir = (dx < 0)? 'SwipeLeft' : 'SwipeRight'
					}
					// meet 2nd condition for vertical swipe
					else if (ady >= threshold && adx <= restraint) {
						// if dist traveled is negative, it indicates up swipe
						swipedir = (dy < 0)? 'SwipeUp' : 'SwipeDown';
					}
				}
				handleswipe(swipedir)
				event.preventDefault()
			}, false);
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
			// Count the sections
			this.counted = this.section.length;
			var version = document.createElement("span");
			version.innerHTML = "Slides Version: " +
				this.version.major + '.' +
				this.version.minor + '.' +
				this.version.build + '<br />';
			version.setAttribute("style", "font-size: 10px; padding: 0px 20px 0px 0px");
			this.nav.appendChild(version);

			// Accumulate the slides for display
			for (var N = this.counted, n = 0; n < N; ++n) {
				var section = this.section[n];
				var summary = section.getElementsByTagName("summary")[0];
				var aside   = section.getElementsByTagName("aside"  )[0];

				// Hide all sections by default
				section.setAttribute("style", this.style.section[0]);

				var button  = document.createElement("button");
				button.innerHTML = 'Slide' + (n + 1);
				button.onclick   = this.jump;

				var abbr    = document.createElement("abbr");
				abbr.setAttribute("title", summary.innerHTML + '\n' + aside.innerHTML);
				abbr.setAttribute("display", "none");
				abbr.setAttribute("visibility", "hidden");
				abbr.appendChild(button);

				this.nav.setAttribute("style", this.style.button[0]);
				this.nav.appendChild(abbr);
				this.button.push(button);
			}

			// Do initial choice and swap
			this.step(0);

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
			this.swipe(slides.body,function(swipedir) {
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
