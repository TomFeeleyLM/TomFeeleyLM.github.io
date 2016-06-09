/*! grunt-grunticon Stylesheet Loader - v2.1.6 | https://github.com/filamentgroup/grunticon | (c) 2015 Scott Jehl, Filament Group, Inc. | MIT license. */

!function(){function e(e,n,t){"use strict";var o=window.document.createElement("link"),r=n||window.document.getElementsByTagName("script")[0],a=window.document.styleSheets;return o.rel="stylesheet",o.href=e,o.media="only x",r.parentNode.insertBefore(o,r),o.onloadcssdefined=function(e){for(var n,t=0;t<a.length;t++)a[t].href&&a[t].href===o.href&&(n=!0);n?e():setTimeout(function(){o.onloadcssdefined(e)})},o.onloadcssdefined(function(){o.media=t||"all"}),o}function n(e,n){e.onload=function(){e.onload=null,n&&n.call(e)},"isApplicationInstalled"in navigator&&"onloadcssdefined"in e&&e.onloadcssdefined(n)}!function(t){var o=function(r,a){"use strict";if(r&&3===r.length){var i=t.navigator,c=t.document,s=t.Image,d=!(!c.createElementNS||!c.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect||!c.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")||t.opera&&-1===i.userAgent.indexOf("Chrome")||-1!==i.userAgent.indexOf("Series40")),l=new s;l.onerror=function(){o.method="png",o.href=r[2],e(r[2])},l.onload=function(){var t=1===l.width&&1===l.height,i=r[t&&d?0:t?1:2];t&&d?o.method="svg":t?o.method="datapng":o.method="png",o.href=i,n(e(i),a)},l.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",c.documentElement.className+=" grunticon"}};o.loadCSS=e,o.onloadCSS=n,t.grunticon=o}(this),function(e,n){"use strict";var t=n.document,o="grunticon:",r=function(e){if(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)e();else{var n=!1;t.addEventListener("readystatechange",function(){n||(n=!0,e())},!1)}},a=function(e){return n.document.querySelector('link[href$="'+e+'"]')},i=function(e){var n,t,r,a,i,c,s={};if(n=e.sheet,!n)return s;t=n.cssRules?n.cssRules:n.rules;for(var d=0;d<t.length;d++)r=t[d].cssText,a=o+t[d].selectorText,i=r.split(");")[0].match(/US\-ASCII\,([^"']+)/),i&&i[1]&&(c=decodeURIComponent(i[1]),s[a]=c);return s},c=function(e){var n,r,a,i;a="data-grunticon-embed";for(var c in e){i=c.slice(o.length);try{n=t.querySelectorAll(i)}catch(s){continue}r=[];for(var d=0;d<n.length;d++)null!==n[d].getAttribute(a)&&r.push(n[d]);if(r.length)for(d=0;d<r.length;d++)r[d].innerHTML=e[c],r[d].style.backgroundImage="none",r[d].removeAttribute(a)}return r},s=function(n){"svg"===e.method&&r(function(){c(i(a(e.href))),"function"==typeof n&&n()})};e.embedIcons=c,e.getCSS=a,e.getIcons=i,e.ready=r,e.svgLoadedCallback=s,e.embedSVG=s}(grunticon,this)}();
/*! Shoestring - v1.0.3 - 2015-09-10
* http://github.com/filamentgroup/shoestring/
* Copyright (c) 2015 Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */ 
(function( w, undefined ){
	/**
	 * The shoestring object constructor.
	 *
	 * @param {string,object} prim The selector to find or element to wrap.
	 * @param {object} sec The context in which to match the `prim` selector.
	 * @returns shoestring
	 * @this window
	 */
	function shoestring( prim, sec ){
		var pType = typeof( prim ),
				ret = [],
				sel;

		// return an empty shoestring object
		if( !prim ){
			return new Shoestring( ret );
		}

		// ready calls
		if( prim.call ){
			return shoestring.ready( prim );
		}

		// handle re-wrapping shoestring objects
		if( prim.constructor === Shoestring && !sec ){
			return prim;
		}

		// if string starting with <, make html
		if( pType === "string" && prim.indexOf( "<" ) === 0 ){
			var dfrag = document.createElement( "div" );

			dfrag.innerHTML = prim;

			// TODO depends on children (circular)
			return shoestring( dfrag ).children().each(function(){
				dfrag.removeChild( this );
			});
		}

		// if string, it's a selector, use qsa
		if( pType === "string" ){
			if( sec ){
				return shoestring( sec ).find( prim );
			}

			try {
				sel = document.querySelectorAll( prim );
			} catch( e ) {
				shoestring.error( 'queryselector', prim );
			}

			return new Shoestring( sel, prim );
		}

		// array like objects or node lists
		if( Object.prototype.toString.call( pType ) === '[object Array]' ||
				(window.NodeList && prim instanceof window.NodeList) ){

			return new Shoestring( prim, prim );
		}

		// if it's an array, use all the elements
		if( prim.constructor === Array ){
			return new Shoestring( prim, prim );
		}

		// otherwise assume it's an object the we want at an index
		return new Shoestring( [prim], prim );
	}

	var Shoestring = function( ret, prim ) {
		this.length = 0;
		this.selector = prim;
		shoestring.merge(this, ret);
	};

	// TODO only required for tests
	Shoestring.prototype.reverse = [].reverse;

	// For adding element set methods
	shoestring.fn = Shoestring.prototype;

	// expose for testing purposes only
	shoestring.Shoestring = Shoestring;

	// For extending objects
	// TODO move to separate module when we use prototypes
	shoestring.extend = function( first, second ){
		for( var i in second ){
			if( second.hasOwnProperty( i ) ){
				first[ i ] = second[ i ];
			}
		}

		return first;
	};

	// taken directly from jQuery
	shoestring.merge = function( first, second ) {
		var len, j, i;

		len = +second.length,
		j = 0,
		i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	};

	// expose
	window.shoestring = shoestring;



	shoestring.enUS = {
		errors: {
			"prefix": "Shoestring does not support",

			"ajax-url-query": "data with urls that have existing query params",
			"click": "the click method. Try using trigger( 'click' ) instead.",
			"css-get" : "getting computed attributes from the DOM.",
			"data-attr-alias": "the data method aliased to `data-` DOM attributes.",
			"has-class" : "the hasClass method. Try using .is( '.klassname' ) instead.",
			"html-function" : "passing a function into .html. Try generating the html you're passing in an outside function",
			"live-delegate" : "the .live or .delegate methods. Use .bind or .on instead.",
			"map": "the map method. Try using .each to make a new object.",
			"next-selector" : "passing selectors into .next, try .next().filter( selector )",
			"off-delegate" : ".off( events, selector, handler ) or .off( events, selector ). Use .off( eventName, callback ) instead.",
			"next-until" : "the .nextUntil method. Use .next in a loop until you reach the selector, don't include the selector",
			"on-delegate" : "the .on method with three or more arguments. Using .on( eventName, callback ) instead.",
			"outer-width": "the outerWidth method. Try combining .width() with .css for padding-left, padding-right, and the border of the left and right side.",
			"prev-selector" : "passing selectors into .prev, try .prev().filter( selector )",
			"prevall-selector" : "passing selectors into .prevAll, try .prevAll().filter( selector )",
			"queryselector": "all CSS selectors on querySelector (varies per browser support). Specifically, this failed: ",
			"siblings-selector": "passing selector into siblings not supported, try .siblings().find( ... )",
			"show-hide": "the show or hide methods. Use display: block (or whatever you'd like it to be) or none instead",
			"text-setter": "setting text via the .text method.",
			"toggle-class" : "the toggleClass method. Try using addClass or removeClass instead.",
			"trim": "the trim method. Try using replace(/^\\s+|\\s+$/g, ''), or just String.prototype.trim if you don't need to support IE8"
		}
	};

	shoestring.error = function( id, str ) {
		var errors = shoestring.enUS.errors;
		throw new Error( errors.prefix + " " + errors[id] + ( str ? " " + str : "" ) );
	};



	var xmlHttp = function() {
		try {
			return new XMLHttpRequest();
		}
		catch( e ){
			return new ActiveXObject( "Microsoft.XMLHTTP" );
		}
	};

	/**
	 * Make an HTTP request to a url.
	 *
	 * **NOTE** the following options are supported:
	 *
	 * - *method* - The HTTP method used with the request. Default: `GET`.
	 * - *data* - Raw object with keys and values to pass with request as query params. Default `null`.
	 * - *headers* - Set of request headers to add. Default `{}`.
	 * - *async* - Whether the opened request is asynchronouse. Default `true`.
	 * - *success* - Callback for successful request and response. Passed the response data.
	 * - *error* - Callback for failed request and response.
	 * - *cancel* - Callback for cancelled request and response.
	 *
	 * @param {string} url The url to request.
	 * @param {object} options The options object, see Notes.
	 * @return shoestring
	 * @this shoestring
	 */

	shoestring.ajax = function( url, options ) {
		var params = "", req = xmlHttp(), settings, key;

		settings = shoestring.extend( {}, shoestring.ajax.settings );

		if( options ){
			shoestring.extend( settings, options );
		}

		if( !url ){
			url = settings.url;
		}

		if( !req || !url ){
			return;
		}

		// create parameter string from data object
		if( settings.data ){
			for( key in settings.data ){
				if( settings.data.hasOwnProperty( key ) ){
					if( params !== "" ){
						params += "&";
					}
					params += encodeURIComponent( key ) + "=" +
						encodeURIComponent( settings.data[key] );
				}
			}
		}

		// append params to url for GET requests
		if( settings.method === "GET" && params ){
						if( url.indexOf("?") >= 0 ){
				shoestring.error( 'ajax-url-query' );
			}
			
			url += "?" + params;
		}

		req.open( settings.method, url, settings.async );

		if( req.setRequestHeader ){
			req.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );

			// Set 'Content-type' header for POST requests
			if( settings.method === "POST" && params ){
				req.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
			}

			for( key in settings.headers ){
				if( settings.headers.hasOwnProperty( key ) ){
					req.setRequestHeader(key, settings.headers[ key ]);
				}
			}
		}

		req.onreadystatechange = function () {
			if( req.readyState === 4 ){
				// Trim the whitespace so shoestring('<div>') works
				var res = (req.responseText || '').replace(/^\s+|\s+$/g, '');
				if( req.status.toString().indexOf( "0" ) === 0 ){
					return settings.cancel( res, req.status, req );
				}
				else if ( req.status.toString().match( /^(4|5)/ ) && RegExp.$1 ){
					return settings.error( res, req.status, req );
				}
				else if (settings.success) {
					return settings.success( res, req.status, req );
				}
			}
		};

		if( req.readyState === 4 ){
			return req;
		}

		// Send request
		if( settings.method === "POST" && params ){
			req.send( params );
		} else {
			req.send();
		}

		return req;
	};

	shoestring.ajax.settings = {
		success: function(){},
		error: function(){},
		cancel: function(){},
		method: "GET",
		async: true,
		data: null,
		headers: {}
	};



	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `GET` method.
	 *
	 * @param {string} url The url to GET from.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.get = function( url, callback ){
		return shoestring.ajax( url, { success: callback } );
	};



  /**
	 * Load the HTML response from `url` into the current set of elements.
	 *
	 * @param {string} url The url to GET from.
	 * @param {function} callback Callback to invoke after HTML is inserted.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.load = function( url, callback ){
		var self = this,
			args = arguments,
			intCB = function( data ){
				self.each(function(){
					shoestring( this ).html( data );
				});

				if( callback ){
					callback.apply( self, args );
				}
		  };

		shoestring.ajax( url, { success: intCB } );
		return this;
	};



	/**
	 * Helper function wrapping a call to [ajax](ajax.js.html) using the `POST` method.
	 *
	 * @param {string} url The url to POST to.
	 * @param {object} data The data to send.
	 * @param {function} callback Callback to invoke on success.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.post = function( url, data, callback ){
		return shoestring.ajax( url, { data: data, method: "POST", success: callback } );
	};



	/**
	 * Iterates over `shoestring` collections.
	 *
	 * @param {function} callback The callback to be invoked on each element and index
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.each = function( callback ){
		return shoestring.each( this, callback );
	};

	shoestring.each = function( collection, callback ) {
		var val;
		for( var i = 0, il = collection.length; i < il; i++ ){
			val = callback.call( collection[i], i, collection[i] );
			if( val === false ){
				break;
			}
		}

		return collection;
	};



  /**
	 * Check for array membership.
	 *
	 * @param {object} needle The thing to find.
	 * @param {object} haystack The thing to find the needle in.
	 * @return {boolean}
	 * @this window
	 */
	shoestring.inArray = function( needle, haystack ){
		var isin = -1;
		for( var i = 0, il = haystack.length; i < il; i++ ){
			if( haystack.hasOwnProperty( i ) && haystack[ i ] === needle ){
				isin = i;
			}
		}
		return isin;
	};



  /**
	 * Bind callbacks to be run when the DOM is "ready".
	 *
	 * @param {function} fn The callback to be run
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.ready = function( fn ){
		if( ready && fn ){
			fn.call( document );
		}
		else if( fn ){
			readyQueue.push( fn );
		}
		else {
			runReady();
		}

		return [document];
	};

	// TODO necessary?
	shoestring.fn.ready = function( fn ){
		shoestring.ready( fn );
		return this;
	};

	// Empty and exec the ready queue
	var ready = false,
		readyQueue = [],
		runReady = function(){
			if( !ready ){
				while( readyQueue.length ){
					readyQueue.shift().call( document );
				}
				ready = true;
			}
		};

	// Quick IE8 shiv
	if( !window.addEventListener ){
		window.addEventListener = function( evt, cb ){
			return window.attachEvent( "on" + evt, cb );
		};
	}

	// If DOM is already ready at exec time, depends on the browser.
	// From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
		runReady();
	}	else {
		if( !document.addEventListener ){
			document.attachEvent( "DOMContentLoaded", runReady );
			document.attachEvent( "onreadystatechange", runReady );
		} else {
			document.addEventListener( "DOMContentLoaded", runReady, false );
			document.addEventListener( "readystatechange", runReady, false );
		}
		window.addEventListener( "load", runReady, false );
	}



  /**
	 * Checks the current set of elements against the selector, if one matches return `true`.
	 *
	 * @param {string} selector The selector to check.
	 * @return {boolean}
	 * @this {shoestring}
	 */
	shoestring.fn.is = function( selector ){
		var ret = false, self = this, parents, check;

		// assume a dom element
		if( typeof selector !== "string" ){
			// array-like, ie shoestring objects or element arrays
			if( selector.length && selector[0] ){
				check = selector;
			} else {
				check = [selector];
			}

			return _checkElements(this, check);
		}

		parents = this.parent();

		if( !parents.length ){
			parents = shoestring( document );
		}

		parents.each(function( i, e ) {
			var children;

				try {
					children = e.querySelectorAll( selector );
				} catch( e ) {
					shoestring.error( 'queryselector', selector );
				}

			ret = _checkElements( self, children );
		});

		return ret;
	};

	function _checkElements(needles, haystack){
		var ret = false;

		needles.each(function() {
			var j = 0;

			while( j < haystack.length ){
				if( this === haystack[j] ){
					ret = true;
				}

				j++;
			}
		});

		return ret;
	}



	/**
	 * Get data attached to the first element or set data values on all elements in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @param {any} value The value assigned to the data attribute.
	 * @return {any|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.data = function( name, value ){
		if( name !== undefined ){
			if( value !== undefined ){
				return this.each(function(){
					if( !this.shoestringData ){
						this.shoestringData = {};
					}

					this.shoestringData[ name ] = value;
				});
			}
			else {
				if( this[ 0 ] ) {
					if( this[ 0 ].shoestringData ) {
						return this[ 0 ].shoestringData[ name ];
					}
					if( shoestring( this[ 0 ] ).is( "[data-" + name + "]" ) ){
						shoestring.error( 'data-attr-alias' );
					}
				}
			}
		}
		else {
			return this[ 0 ] ? this[ 0 ].shoestringData || {} : undefined;
		}
	};


	/**
	 * Remove data associated with `name` or all the data, for each element in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeData = function( name ){
		return this.each(function(){
			if( name !== undefined && this.shoestringData ){
				this.shoestringData[ name ] = undefined;
				delete this.shoestringData[ name ];
			}	else {
				this[ 0 ].shoestringData = {};
			}
		});
	};



	/**
	 * An alias for the `shoestring` constructor.
	 */
	window.$ = shoestring;



	/**
	 * Add a class to each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be added.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.addClass = function( className ){
		var classes = className.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined &&
						(this.className === "" ||
						!this.className.match( new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)"))) ){
					this.className += " " + classes[ i ];
				}
			}
		});
	};



  /**
	 * Add elements matching the selector to the current set.
	 *
	 * @param {string} selector The selector for the elements to add from the DOM
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.add = function( selector ){
		var ret = [];
		this.each(function(){
			ret.push( this );
		});

		shoestring( selector ).each(function(){
			ret.push( this );
		});

		return shoestring( ret );
	};



	/**
	 * Insert an element or HTML string after each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.after = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		if( fragment.length > 1 ){
			fragment = fragment.reverse();
		}
		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				var insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
				this.parentNode.insertBefore( insertEl, this.nextSibling );
			}
		});
	};



	/**
	 * Insert an element or HTML string as the last child of each element in the set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.append = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.appendChild( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ] );
			}
		});
	};



	/**
	 * Insert the current set as the last child of the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to append the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.appendTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).append( this );
		});
	};



  /**
	 * Get the value of the first element of the set or set the value of all the elements in the set.
	 *
	 * @param {string} name The attribute name.
	 * @param {string} value The new value for the attribute.
	 * @return {shoestring|string|undefined}
	 * @this {shoestring}
	 */
	shoestring.fn.attr = function( name, value ){
		var nameStr = typeof( name ) === "string";

		if( value !== undefined || !nameStr ){
			return this.each(function(){
				if( nameStr ){
					this.setAttribute( name, value );
				}	else {
					for( var i in name ){
						if( name.hasOwnProperty( i ) ){
							this.setAttribute( i, name[ i ] );
						}
					}
				}
			});
		} else {
			return this[ 0 ] ? this[ 0 ].getAttribute( name ) : undefined;
		}
	};



	/**
	 * Insert an element or HTML string before each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.before = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){
			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				this.parentNode.insertBefore( i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ], this );
			}
		});
	};



	/**
	 * Get the children of the current collection.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.children = function(){
		var ret = [],
			childs,
			j;
		this.each(function(){
			childs = this.children;
			j = -1;

			while( j++ < childs.length-1 ){
				if( shoestring.inArray(  childs[ j ], ret ) === -1 ){
					ret.push( childs[ j ] );
				}
			}
		});
		return shoestring(ret);
	};



	/**
	 * Clone and return the current set of nodes into a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.clone = function() {
		var ret = [];

		this.each(function() {
			ret.push( this.cloneNode( true ) );
		});

		return shoestring( ret );
	};



	/**
	 * Find an element matching the selector in the set of the current element and its parents.
	 *
	 * @param {string} selector The selector used to identify the target element.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.closest = function( selector ){
		var ret = [];

		if( !selector ){
			return shoestring( ret );
		}

		this.each(function(){
			var element, $self = shoestring( element = this );

			if( $self.is(selector) ){
				ret.push( this );
				return;
			}

			while( element.parentElement ) {
				if( shoestring(element.parentElement).is(selector) ){
					ret.push( element.parentElement );
					break;
				}

				element = element.parentElement;
			}
		});

		return shoestring( ret );
	};



  shoestring.cssExceptions = {
		'float': [ 'cssFloat', 'styleFloat' ] // styleFloat is IE8
	};



	/**
	 * A polyfill to support computed styles in IE < 9
	 *
	 * NOTE this is taken directly from https://github.com/jonathantneal/polyfill
	 */
	(function () {
		function getComputedStylePixel(element, property, fontSize) {
			element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

			var
			value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[1],
			suffix = value[2],
			rootSize;

			fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
			rootSize = property === 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

			return suffix === '%' ? size / 100 * rootSize :
				suffix === 'cm' ? size * 0.3937 * 96 :
				suffix === 'em' ? size * fontSize :
				suffix === 'in' ? size * 96 :
				suffix === 'mm' ? size * 0.3937 * 96 / 10 :
				suffix === 'pc' ? size * 12 * 96 / 72 :
				suffix === 'pt' ? size * 96 / 72 :
				size;
		}

		function setShortStyleProperty(style, property) {
			var
			borderSuffix = property === 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

			style[property] = (style[t] === style[r] && style[t] === style[b] && style[t] === style[l] ? [ style[t] ] :
												 style[t] === style[b] && style[l] === style[r] ? [ style[t], style[r] ] :
												 style[l] === style[r] ? [ style[t], style[r], style[b] ] :
												 [ style[t], style[r], style[b], style[l] ]).join(' ');
		}

		// <CSSStyleDeclaration>
		function CSSStyleDeclaration(element) {
			var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function (match) {
				return '-' + match.toLowerCase();
			},
			property;

			for (property in currentStyle) {
				Array.prototype.push.call(style, property === 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

				if (property === 'width') {
					style[property] = element.offsetWidth + 'px';
				} else if (property === 'height') {
					style[property] = element.offsetHeight + 'px';
				} else if (property === 'styleFloat') {
					style.float = currentStyle[property];
				} else if (/margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
					style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
				} else if (/^outline/.test(property)) {
					// errors on checking outline
					try {
						style[property] = currentStyle[property];
					} catch (error) {
						style.outlineColor = currentStyle.color;
						style.outlineStyle = style.outlineStyle || 'none';
						style.outlineWidth = style.outlineWidth || '0px';
						style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
					}
				} else {
					style[property] = currentStyle[property];
				}
			}

			setShortStyleProperty(style, 'margin');
			setShortStyleProperty(style, 'padding');
			setShortStyleProperty(style, 'border');

			style.fontSize = Math.round(fontSize) + 'px';
		}

		CSSStyleDeclaration.prototype = {
			constructor: CSSStyleDeclaration,
			// <CSSStyleDeclaration>.getPropertyPriority
			getPropertyPriority: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			},
			// <CSSStyleDeclaration>.getPropertyValue
			getPropertyValue: function (property) {
				return this[property.replace(/-\w/g, function (match) {
					return match[1].toUpperCase();
				})];
			},
			// <CSSStyleDeclaration>.item
			item: function (index) {
				return this[index];
			},
			// <CSSStyleDeclaration>.removeProperty
			removeProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.setProperty
			setProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.getPropertyCSSValue
			getPropertyCSSValue: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			}
		};

		if( !window.getComputedStyle ) {
			// <window>.getComputedStyle
			// NOTE Window is not defined in all browsers
			window.getComputedStyle = function (element) {
				return new CSSStyleDeclaration(element);
			};

			if ( window.Window ) {
				window.Window.prototype.getComputedStyle = window.getComputedStyle;
			}
		}
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		function _getStyle( element, property ) {
			// polyfilled in getComputedStyle module
			return window.getComputedStyle( element, null ).getPropertyValue( property );
		}

		var vendorPrefixes = [ '', '-webkit-', '-ms-', '-moz-', '-o-', '-khtml-' ];

		/**
		 * Private function for getting the computed style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _getStyle
		 * @param {HTMLElement} element The element we want the style property for.
		 * @param {string} property The css property we want the style for.
		 */
		shoestring._getStyle = function( element, property ) {
			var convert, value, j, k;

			if( cssExceptions[ property ] ) {
				for( j = 0, k = cssExceptions[ property ].length; j < k; j++ ) {
					value = _getStyle( element, cssExceptions[ property ][ j ] );

					if( value ) {
						return value;
					}
				}
			}

			for( j = 0, k = vendorPrefixes.length; j < k; j++ ) {
				convert = convertPropertyName( vendorPrefixes[ j ] + property );

				// VendorprefixKeyName || key-name
				value = _getStyle( element, convert );

				if( convert !== property ) {
					value = value || _getStyle( element, property );
				}

				if( vendorPrefixes[ j ] ) {
					// -vendorprefix-key-name
					value = value || _getStyle( element, vendorPrefixes[ j ] + property );
				}

				if( value ) {
					return value;
				}
			}

			return undefined;
		};
	})();



	(function() {
		var cssExceptions = shoestring.cssExceptions;

		// IE8 uses marginRight instead of margin-right
		function convertPropertyName( str ) {
			return str.replace( /\-([A-Za-z])/g, function ( match, character ) {
				return character.toUpperCase();
			});
		}

		/**
		 * Private function for setting the style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _setStyle
		 * @param {HTMLElement} element The element we want to style.
		 * @param {string} property The property being used to style the element.
		 * @param {string} value The css value for the style property.
		 */
		shoestring._setStyle = function( element, property, value ) {
			var convertedProperty = convertPropertyName(property);

			element.style[ property ] = value;

			if( convertedProperty !== property ) {
				element.style[ convertedProperty ] = value;
			}

			if( cssExceptions[ property ] ) {
				for( var j = 0, k = cssExceptions[ property ].length; j<k; j++ ) {
					element.style[ cssExceptions[ property ][ j ] ] = value;
				}
			}
		};
	})();



	/**
	 * Get the compute style property of the first element or set the value of a style property
	 * on all elements in the set.
	 *
	 * @method _setStyle
	 * @param {string} property The property being used to style the element.
	 * @param {string|undefined} value The css value for the style property.
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.css = function( property, value ){
		if( !this[0] ){
			return;
		}

		if( typeof property === "object" ) {
			return this.each(function() {
				for( var key in property ) {
					if( property.hasOwnProperty( key ) ) {
						shoestring._setStyle( this, key, property[key] );
					}
				}
			});
		}	else {
			// assignment else retrieve first
			if( value !== undefined ){
				return this.each(function(){
					shoestring._setStyle( this, property, value );
				});
			}

			return shoestring._getStyle( this[0], property );
		}
	};



	/**
	 * Returns the indexed element wrapped in a new `shoestring` object.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.eq = function( index ){
		if( this[index] ){
			return shoestring( this[index] );
		}

		return shoestring([]);
	};



	/**
	 * Filter out the current set if they do *not* match the passed selector or
	 * the supplied callback returns false
	 *
	 * @param {string,function} selector The selector or boolean return value callback used to filter the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.filter = function( selector ){
		var ret = [];

		this.each(function( index ){
			var wsel;

			if( typeof selector === 'function' ) {
				if( selector.call( this, index ) !== false ) {
					ret.push( this );
				}
			} else {
				if( !this.parentNode ){
					var context = shoestring( document.createDocumentFragment() );

					context[ 0 ].appendChild( this );
					wsel = shoestring( selector, context );
				} else {
					wsel = shoestring( selector, this.parentNode );
				}

				if( shoestring.inArray( this, wsel ) > -1 ){
					ret.push( this );
				}
			}
		});

		return shoestring( ret );
	};



	/**
	 * Find descendant elements of the current collection.
	 *
	 * @param {string} selector The selector used to find the children
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.find = function( selector ){
		var ret = [],
			finds;
		this.each(function(){
			try {
				finds = this.querySelectorAll( selector );
			} catch( e ) {
				shoestring.error( 'queryselector', selector );
			}

			for( var i = 0, il = finds.length; i < il; i++ ){
				ret = ret.concat( finds[i] );
			}
		});
		return shoestring( ret );
	};



	/**
	 * Returns the first element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.first = function(){
		return this.eq( 0 );
	};



	/**
	 * Returns the raw DOM node at the passed index.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return HTMLElement
	 * @this shoestring
	 */
	shoestring.fn.get = function( index ){
		return this[ index ];
	};



	/**
	 * Private function for setting/getting the offset property for height/width.
	 *
	 * **NOTE** Please use the [width](width.js.html) or [height](height.js.html) methods instead.
	 *
	 * @param {shoestring} set The set of elements.
	 * @param {string} name The string "height" or "width".
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this window
	 */
	shoestring._dimension = function( set, name, value ){
		var offsetName;

		if( value === undefined ){
			offsetName = name.replace(/^[a-z]/, function( letter ) {
				return letter.toUpperCase();
			});

			return set[ 0 ][ "offset" + offsetName ];
		} else {
			// support integer values as pixels
			value = typeof value === "string" ? value : value + "px";

			return set.each(function(){
				this.style[ name ] = value;
			});
		}
	};



	/**
	 * Gets the height value of the first element or sets the height for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.height = function( value ){
		return shoestring._dimension( this, "height", value );
	};



	var set = function( html ){
		if( typeof html === "string" ){
			return this.each(function(){
				this.innerHTML = html;
			});
		} else {
			var h = "";
			if( typeof html.length !== "undefined" ){
				for( var i = 0, l = html.length; i < l; i++ ){
					h += html[i].outerHTML;
				}
			} else {
				h = html.outerHTML;
			}
			return this.each(function(){
				this.innerHTML = h;
			});
		}
	};
	/**
	 * Gets or sets the `innerHTML` from all the elements in the set.
	 *
	 * @param {string|undefined} html The html to assign
	 * @return {string|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.html = function( html ){
				if( !!html && typeof html === "function" ){
			shoestring.error( 'html-function' );
		}
				if( typeof html !== "undefined" ){
			return set.call( this, html );
		} else { // get
			var pile = "";

			this.each(function(){
				pile += this.innerHTML;
			});

			return pile;
		}
	};



	(function() {
		function _getIndex( set, test ) {
			var i, result, element;

			for( i = result = 0; i < set.length; i++ ) {
				element = set.item ? set.item(i) : set[i];

				if( test(element) ){
					return result;
				}

				// ignore text nodes, etc
				// NOTE may need to be more permissive
				if( element.nodeType === 1 ){
					result++;
				}
			}

			return -1;
		}

		/**
		 * Find the index in the current set for the passed selector.
		 * Without a selector it returns the index of the first node within the array of its siblings.
		 *
		 * @param {string|undefined} selector The selector used to search for the index.
		 * @return {integer}
		 * @this {shoestring}
		 */
		shoestring.fn.index = function( selector ){
			var self, children;

			self = this;

			// no arg? check the children, otherwise check each element that matches
			if( selector === undefined ){
				children = ( ( this[ 0 ] && this[0].parentNode ) || document.documentElement).childNodes;

				// check if the element matches the first of the set
				return _getIndex(children, function( element ) {
					return self[0] === element;
				});
			} else {

				// check if the element matches the first selected node from the parent
				return _getIndex(self, function( element ) {
					return element === (shoestring( selector, element.parentNode )[ 0 ]);
				});
			}
		};
	})();



	/**
	 * Insert the current set after the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertAfter = function( selector ){
		return this.each(function(){
			shoestring( selector ).after( this );
		});
	};



	/**
	 * Insert the current set before the elements matching the selector.
	 *
	 * @param {string} selector The selector before which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.insertBefore = function( selector ){
		return this.each(function(){
			shoestring( selector ).before( this );
		});
	};



	/**
	 * Returns the last element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.last = function(){
		return this.eq( this.length - 1 );
	};



	/**
	 * Returns a `shoestring` object with the set of siblings of each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.next = function(){
				if( arguments.length > 0 ){
			shoestring.error( 'next-selector' );
		}
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = 0; i < children.length; i++ ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Removes elements from the current set.
	 *
	 * @param {string} selector The selector to use when removing the elements.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.not = function( selector ){
		var ret = [];

		this.each(function(){
			var found = shoestring( selector, this.parentNode );

			if( shoestring.inArray(this, found) === -1 ){
				ret.push( this );
			}
		});

		return shoestring( ret );
	};



	/**
	 * Returns an object with the `top` and `left` properties corresponging to the first elements offsets.
	 *
	 * @return object
	 * @this shoestring
	 */
	shoestring.fn.offset = function(){
		return {
			top: this[ 0 ].offsetTop,
			left: this[ 0 ].offsetLeft
		};
	};



	/**
	 * Returns the set of first parents for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.parent = function(){
		var ret = [],
			parent;

		this.each(function(){
			// no parent node, assume top level
			// jQuery parent: return the document object for <html> or the parent node if it exists
			parent = (this === document.documentElement ? document : this.parentNode);

			// if there is a parent and it's not a document fragment
			if( parent && parent.nodeType !== 11 ){
				ret.push( parent );
			}
		});

		return shoestring(ret);
	};



	/**
	 * Returns the set of all parents matching the selector if provided for each element in the current set.
	 *
	 * @param {string} selector The selector to check the parents with.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.parents = function( selector ){
		var ret = [];

		this.each(function(){
			var curr = this, match;

			while( curr.parentElement && !match ){
				curr = curr.parentElement;

				if( selector ){
					if( curr === shoestring( selector )[0] ){
						match = true;

						if( shoestring.inArray( curr, ret ) === -1 ){
							ret.push( curr );
						}
					}
				} else {
					if( shoestring.inArray( curr, ret ) === -1 ){
						ret.push( curr );
					}
				}
			}
		});

		return shoestring(ret);
	};



	/**
	 * Add an HTML string or element before the children of each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML string or element to add.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prepend = function( fragment ){
		if( typeof( fragment ) === "string" || fragment.nodeType !== undefined ){
			fragment = shoestring( fragment );
		}

		return this.each(function( i ){

			for( var j = 0, jl = fragment.length; j < jl; j++ ){
				var insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
				if ( this.firstChild ){
					this.insertBefore( insertEl, this.firstChild );
				} else {
					this.appendChild( insertEl );
				}
			}
		});
	};



	/**
	 * Add each element of the current set before the children of the selected elements.
	 *
	 * @param {string} selector The selector for the elements to add the current set to..
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prependTo = function( selector ){
		return this.each(function(){
			shoestring( selector ).prepend( this );
		});
	};



	/**
	 * Returns a `shoestring` object with the set of *one* siblingx before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prev = function(){
				if( arguments.length > 0 ){
			shoestring.error( 'prev-selector' );
		}
		
		var result = [];

		// TODO need to implement map
		this.each(function() {
			var children, item, found;

			// get the child nodes for this member of the set
			children = shoestring( this.parentNode )[0].childNodes;

			for( var i = children.length -1; i >= 0; i-- ){
				item = children.item( i );

				// found the item we needed (found) which means current item value is
				// the next node in the list, as long as it's viable grab it
				// NOTE may need to be more permissive
				if( found && item.nodeType === 1 ){
					result.push( item );
					break;
				}

				// find the current item and mark it as found
				if( item === this ){
					found = true;
				}
			}
		});

		return shoestring( result );
	};



	/**
	 * Returns a `shoestring` object with the set of *all* siblings before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.prevAll = function(){
				if( arguments.length > 0 ){
			shoestring.error( 'prevall-selector' );
		}
		
		var result = [];

		this.each(function() {
			var $previous = shoestring( this ).prev();

			while( $previous.length ){
				result.push( $previous[0] );
				$previous = $previous.prev();
			}
		});

		return shoestring( result );
	};



	// Property normalization, a subset taken from jQuery src
	shoestring.propFix = {
		"class": "className",
		contenteditable: "contentEditable",
		"for": "htmlFor",
		readonly: "readOnly",
		tabindex: "tabIndex"
	};



	/**
	 * Gets the property value from the first element or sets the property value on all elements of the currrent set.
   *
	 * @param {string} name The property name.
   * @param {any} value The property value.
	 * @return {any|shoestring}
	 * @this shoestring
	 */
	shoestring.fn.prop = function( name, value ){
		if( !this[0] ){
			return;
		}

		name = shoestring.propFix[ name ] || name;

		if( value !== undefined ){
			return this.each(function(){
				this[ name ] = value;
			});
		}	else {
			return this[ 0 ][ name ];
		}
	};



	/**
	 * Remove an attribute from each element in the current set.
	 *
	 * @param {string} name The name of the attribute.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeAttr = function( name ){
		return this.each(function(){
			this.removeAttribute( name );
		});
	};



	/**
	 * Remove a class from each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be removed.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeClass = function( cname ){
		var classes = cname.replace(/^\s+|\s+$/g, '').split( " " );

		return this.each(function(){
			var newClassName, regex;

			for( var i = 0, il = classes.length; i < il; i++ ){
				if( this.className !== undefined ){
					regex = new RegExp( "(^|\\s)" + classes[ i ] + "($|\\s)", "gmi" );
					newClassName = this.className.replace( regex, " " );

					this.className = newClassName.replace(/^\s+|\s+$/g, '');
				}
			}
		});
	};



	/**
	 * Remove the current set of elements from the DOM.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.remove = function(){
		return this.each(function(){
			if( this.parentNode ) {
				this.parentNode.removeChild( this );
			}
		});
	};



	/**
	 * Remove a proprety from each element in the current set.
	 *
	 * @param {string} name The name of the property.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.removeProp = function( property ){
		var name = shoestring.propFix[ property ] || property;

		return this.each(function(){
			this[ name ] = undefined;
			delete this[ name ];
		});
	};



	/**
	 * Replace each element in the current set with that argument HTML string or HTMLElement.
	 *
	 * @param {string|HTMLElement} fragment The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.replaceWith = function( fragment ){
		if( typeof( fragment ) === "string" ){
			fragment = shoestring( fragment );
		}

		var ret = [];

		if( fragment.length > 1 ){
			fragment = fragment.reverse();
		}
		this.each(function( i ){
			var clone = this.cloneNode( true ),
				insertEl;
			ret.push( clone );

			// If there is no parentNode, this is pointless, drop it.
			if( !this.parentNode ){ return; }

			if( fragment.length === 1 ){
				insertEl = i > 0 ? fragment[ 0 ].cloneNode( true ) : fragment[ 0 ];
				this.parentNode.replaceChild( insertEl, this );
			} else {
				for( var j = 0, jl = fragment.length; j < jl; j++ ){
					insertEl = i > 0 ? fragment[ j ].cloneNode( true ) : fragment[ j ];
					this.parentNode.insertBefore( insertEl, this.nextSibling );
				}
				this.parentNode.removeChild( this );
			}
		});

		return shoestring( ret );
	};



	shoestring.inputTypes = [
		"text",
		"hidden",
		"password",
		"color",
		"date",
		"datetime",
		// "datetime\-local" matched by datetime
		"email",
		"month",
		"number",
		"range",
		"search",
		"tel",
		"time",
		"url",
		"week"
	];

	shoestring.inputTypeTest = new RegExp( shoestring.inputTypes.join( "|" ) );


	/**
	 * Serialize child input element values into an object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.serialize = function(){
		var data = {};

		shoestring( "input, select", this ).each(function(){
			var type = this.type, name = this.name,	value = this.value;

			if( shoestring.inputTypeTest.test( type ) ||
					( type === "checkbox" || type === "radio" ) &&
					this.checked ){

				data[ name ] = value;
			}	else if( this.nodeName === "SELECT" ){
				data[ name ] = this.options[ this.selectedIndex ].nodeValue;
			}
		});

		return data;
	};



  /**
	 * Get all of the sibling elements for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.siblings = function(){
				if( arguments.length > 0 ) {
			shoestring.error( 'siblings-selector' );
		}
		
		if( !this.length ) {
			return shoestring( [] );
		}

		var sibs = [], el = this[ 0 ].parentNode.firstChild;

		do {
			if( el.nodeType === 1 && el !== this[ 0 ] ) {
				sibs.push( el );
			}

      el = el.nextSibling;
		} while( el );

		return shoestring( sibs );
	};



	var getText = function( elem ){
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

  /**
	 * Recursively retrieve the text content of the each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.text = function() {
				if( arguments.length > 0 ){
			shoestring.error( 'text-setter' );
		}
		
		return getText( this );
	};




	/**
	 * Get the value of the first element or set the value of all elements in the current set.
	 *
	 * @param {string} value The value to set.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.val = function( value ){
		var el;
		if( value !== undefined ){
			return this.each(function(){
				if( this.tagName === "SELECT" ){
					var optionSet, option,
						options = this.options,
						values = [],
						i = options.length,
						newIndex;

					values[0] = value;
					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = shoestring.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
							newIndex = i;
						}
					}
					// force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						this.selectedIndex = -1;
					} else {
						this.selectedIndex = newIndex;
					}
				} else {
					this.value = value;
				}
			});
		} else {
			el = this[0];

			if( el.tagName === "SELECT" ){
				if( el.selectedIndex < 0 ){ return ""; }
				return el.options[ el.selectedIndex ].value;
			} else {
				return el.value;
			}
		}
	};



	/**
	 * Gets the width value of the first element or sets the width for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.width = function( value ){
		return shoestring._dimension( this, "width", value );
	};



	/**
	 * Wraps the child elements in the provided HTML.
	 *
	 * @param {string} html The wrapping HTML.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.wrapInner = function( html ){
		return this.each(function(){
			var inH = this.innerHTML;

			this.innerHTML = "";
			shoestring( this ).append( shoestring( html ).html( inH ) );
		});
	};



	function initEventCache( el, evt ) {
		if ( !el.shoestringData ) {
			el.shoestringData = {};
		}
		if ( !el.shoestringData.events ) {
			el.shoestringData.events = {};
		}
		if ( !el.shoestringData.loop ) {
			el.shoestringData.loop = {};
		}
		if ( !el.shoestringData.events[ evt ] ) {
			el.shoestringData.events[ evt ] = [];
		}
	}

	function addToEventCache( el, evt, eventInfo ) {
		var obj = {};
		obj.isCustomEvent = eventInfo.isCustomEvent;
		obj.callback = eventInfo.callfunc;
		obj.originalCallback = eventInfo.originalCallback;
		obj.namespace = eventInfo.namespace;

		el.shoestringData.events[ evt ].push( obj );

		if( eventInfo.customEventLoop ) {
			el.shoestringData.loop[ evt ] = eventInfo.customEventLoop;
		}
	}

	// In IE8 the events trigger in a reverse order (LIFO). This code
	// unbinds and rebinds all callbacks on an element in the a FIFO order.
	function reorderEvents( node, eventName ) {
		if( node.addEventListener || !node.shoestringData || !node.shoestringData.events ) {
			// add event listner obviates the need for all the callback order juggling
			return;
		}

		var otherEvents = node.shoestringData.events[ eventName ] || [];
		for( var j = otherEvents.length - 1; j >= 0; j-- ) {
			// DOM Events only, Custom events maintain their own order internally.
			if( !otherEvents[ j ].isCustomEvent ) {
				node.detachEvent( "on" + eventName, otherEvents[ j ].callback );
				node.attachEvent( "on" + eventName, otherEvents[ j ].callback );
			}
		}
	}

	/**
	 * Bind a callback to an event for the currrent set of elements.
	 *
	 * @param {string} evt The event(s) to watch for.
	 * @param {object,function} data Data to be included with each event or the callback.
	 * @param {function} originalCallback Callback to be invoked when data is define.d.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.bind = function( evt, data, originalCallback ){

				if( arguments.length > 3 ){
			shoestring.error( 'on-delegate' );
		}
		if( typeof data === "string" ){
			shoestring.error( 'on-delegate' );
		}
				if( typeof data === "function" ){
			originalCallback = data;
			data = null;
		}

		var evts = evt.split( " " ),
			docEl = document.documentElement;

		// NOTE the `triggeredElement` is purely for custom events from IE
		function encasedCallback( e, namespace, triggeredElement ){
			var result;

			if( e._namespace && e._namespace !== namespace ) {
				return;
			}

			e.data = data;
			e.namespace = e._namespace;

			var returnTrue = function(){
				return true;
			};

			e.isDefaultPrevented = function(){
				return false;
			};

			var originalPreventDefault = e.preventDefault;
			var preventDefaultConstructor = function(){
				if( originalPreventDefault ) {
					return function(){
						e.isDefaultPrevented = returnTrue;
						originalPreventDefault.call(e);
					};
				} else {
					return function(){
						e.isDefaultPrevented = returnTrue;
						e.returnValue = false;
					};
				}
			};

			// thanks https://github.com/jonathantneal/EventListener
			e.target = triggeredElement || e.target || e.srcElement;
			e.preventDefault = preventDefaultConstructor();
			e.stopPropagation = e.stopPropagation || function () {
				e.cancelBubble = true;
			};

			result = originalCallback.apply(this, [ e ].concat( e._args ) );

			if( result === false ){
				e.preventDefault();
				e.stopPropagation();
			}

			return result;
		}

		// This is exclusively for custom events on browsers without addEventListener (IE8)
		function propChange( originalEvent, boundElement, namespace ) {
			var lastEventInfo = document.documentElement[ originalEvent.propertyName ],
				triggeredElement = lastEventInfo.el;

			var boundCheckElement = boundElement;

			if( boundElement === document && triggeredElement !== document ) {
				boundCheckElement = document.documentElement;
			}

			if( triggeredElement !== undefined &&
				shoestring( triggeredElement ).closest( boundCheckElement ).length ) {

				originalEvent._namespace = lastEventInfo._namespace;
				originalEvent._args = lastEventInfo._args;
				encasedCallback.call( boundElement, originalEvent, namespace, triggeredElement );
			}
		}

		return this.each(function(){
			var domEventCallback,
				customEventCallback,
				customEventLoop,
				oEl = this;

			for( var i = 0, il = evts.length; i < il; i++ ){
				var split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

				domEventCallback = function( originalEvent ) {
					if( oEl.ssEventTrigger ) {
						originalEvent._namespace = oEl.ssEventTrigger._namespace;
						originalEvent._args = oEl.ssEventTrigger._args;

						oEl.ssEventTrigger = null;
					}
					return encasedCallback.call( oEl, originalEvent, namespace );
				};
				customEventCallback = null;
				customEventLoop = null;

				initEventCache( this, evt );

				if( "addEventListener" in this ){
					this.addEventListener( evt, domEventCallback, false );
				} else if( this.attachEvent ){
					if( this[ "on" + evt ] !== undefined ) {
						this.attachEvent( "on" + evt, domEventCallback );
					} else {
						customEventCallback = (function() {
							var eventName = evt;
							return function( e ) {
								if( e.propertyName === eventName ) {
									propChange( e, oEl, namespace );
								}
							};
						})();

						// only assign one onpropertychange per element
						if( this.shoestringData.events[ evt ].length === 0 ) {
							customEventLoop = (function() {
								var eventName = evt;
								return function( e ) {
									if( !oEl.shoestringData || !oEl.shoestringData.events ) {
										return;
									}
									var events = oEl.shoestringData.events[ eventName ];
									if( !events ) {
										return;
									}

									// TODO stopImmediatePropagation
									for( var j = 0, k = events.length; j < k; j++ ) {
										events[ j ].callback( e );
									}
								};
							})();

							docEl.attachEvent( "onpropertychange", customEventLoop );
						}
					}
				}

				addToEventCache( this, evt, {
					callfunc: customEventCallback || domEventCallback,
					isCustomEvent: !!customEventCallback,
					customEventLoop: customEventLoop,
					originalCallback: originalCallback,
					namespace: namespace
				});

				// Don’t reorder custom events, only DOM Events.
				if( !customEventCallback ) {
					reorderEvents( oEl, evt );
				}
			}
		});
	};

	shoestring.fn.on = shoestring.fn.bind;

		shoestring.fn.live = function(){
		shoestring.error( 'live-delegate' );
	};

	shoestring.fn.delegate = function(){
		shoestring.error( 'live-delegate' );
	};
	


	/**
	 * Unbind a previous bound callback for an event.
	 *
	 * @param {string} event The event(s) the callback was bound to..
	 * @param {function} callback Callback to unbind.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.unbind = function( event, callback ){

				if( arguments.length >= 3 || typeof callback === "string" ){
			shoestring.error( 'off-delegate' );
		}
		
		var evts = event ? event.split( " " ) : [];

		return this.each(function(){
			if( !this.shoestringData || !this.shoestringData.events ) {
				return;
			}

			if( !evts.length ) {
				unbindAll.call( this );
			} else {
				var split, evt, namespace;
				for( var i = 0, il = evts.length; i < il; i++ ){
					split = evts[ i ].split( "." ),
					evt = split[ 0 ],
					namespace = split.length > 0 ? split[ 1 ] : null;

					if( evt ) {
						unbind.call( this, evt, namespace, callback );
					} else {
						unbindAll.call( this, namespace, callback );
					}
				}
			}
		});
	};

	function unbind( evt, namespace, callback ) {
		var bound = this.shoestringData.events[ evt ];
		if( !(bound && bound.length) ) {
			return;
		}

		var matched = [], j, jl;
		for( j = 0, jl = bound.length; j < jl; j++ ) {
			if( !namespace || namespace === bound[ j ].namespace ) {
				if( callback === undefined || callback === bound[ j ].originalCallback ) {
					if( "removeEventListener" in window ){
						this.removeEventListener( evt, bound[ j ].callback, false );
					} else if( this.detachEvent ){
						// dom event
						this.detachEvent( "on" + evt, bound[ j ].callback );

						// only unbind custom events if its the last one on the element
						if( bound.length === 1 && this.shoestringData.loop && this.shoestringData.loop[ evt ] ) {
							document.documentElement.detachEvent( "onpropertychange", this.shoestringData.loop[ evt ] );
						}
					}
					matched.push( j );
				}
			}
		}

		for( j = 0, jl = matched.length; j < jl; j++ ) {
			this.shoestringData.events[ evt ].splice( j, 1 );
		}
	}

	function unbindAll( namespace, callback ) {
		for( var evtKey in this.shoestringData.events ) {
			unbind.call( this, evtKey, namespace, callback );
		}
	}

	shoestring.fn.off = shoestring.fn.unbind;


	/**
	 * Bind a callback to an event for the currrent set of elements, unbind after one occurence.
	 *
	 * @param {string} event The event(s) to watch for.
	 * @param {function} callback Callback to invoke on the event.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.one = function( event, callback ){
		var evts = event.split( " " );

		return this.each(function(){
			var thisevt, cbs = {},	$t = shoestring( this );

			for( var i = 0, il = evts.length; i < il; i++ ){
				thisevt = evts[ i ];

				cbs[ thisevt ] = function( e ){
					var $t = shoestring( this );

					for( var j in cbs ) {
						$t.unbind( j, cbs[ j ] );
					}

					return callback.apply( this, [ e ].concat( e._args ) );
				};

				$t.bind( thisevt, cbs[ thisevt ] );
			}
		});
	};



	/**
	 * Trigger an event on the first element in the set, no bubbling, no defaults.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.triggerHandler = function( event, args ){
		var e = event.split( " " )[ 0 ],
			el = this[ 0 ],
			ret;

		// TODO needs IE8 support
		// See this.fireEvent( 'on' + evts[ i ], document.createEventObject() ); instead of click() etc in trigger.
		if( document.createEvent && el.shoestringData && el.shoestringData.events && el.shoestringData.events[ e ] ){
			var bindings = el.shoestringData.events[ e ];
			for (var i in bindings ){
				if( bindings.hasOwnProperty( i ) ){
					event = document.createEvent( "Event" );
					event.initEvent( e, true, true );
					event._args = args;
					args.unshift( event );

					ret = bindings[ i ].originalCallback.apply( event.target, args );
				}
			}
		}

		return ret;
	};



	/**
	 * Trigger an event on each of the DOM elements in the current set.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
	shoestring.fn.trigger = function( event, args ){
		var evts = event.split( " " );

		return this.each(function(){
			var split, evt, namespace;
			for( var i = 0, il = evts.length; i < il; i++ ){
				split = evts[ i ].split( "." ),
				evt = split[ 0 ],
				namespace = split.length > 0 ? split[ 1 ] : null;

				if( evt === "click" ){
					if( this.tagName === "INPUT" && this.type === "checkbox" && this.click ){
						this.click();
						return false;
					}
				}

				if( document.createEvent ){
					var event = document.createEvent( "Event" );
					event.initEvent( evt, true, true );
					event._args = args;
					event._namespace = namespace;

					this.dispatchEvent( event );
				} else if ( document.createEventObject ) {
					if( ( "" + this[ evt ] ).indexOf( "function" ) > -1 ) {
						this.ssEventTrigger = {
							_namespace: namespace,
							_args: args
						};

						this[ evt ]();
					} else {
						document.documentElement[ evt ] = {
							"el": this,
							_namespace: namespace,
							_args: args
						};
					}
				}
			}
		});
	};




		shoestring.fn.hasClass = function(){
		shoestring.error( 'has-class' );
	};
	


		shoestring.fn.hide = function(){
		shoestring.error( 'show-hide' );
	};
	


		shoestring.fn.outerWidth = function(){
		shoestring.error( 'outer-width' );
	};
	


		shoestring.fn.show = function(){
		shoestring.error( 'show-hide' );
	};
	


		shoestring.fn.click = function(){
		shoestring.error( 'click' );
	};
	


		shoestring.map = function(){
		shoestring.error( 'map' );
	};
	


		shoestring.fn.map = function(){
		shoestring.error( 'map' );
	};
	


		shoestring.trim = function(){
		shoestring.error( 'trim' );
	};
	


	(function() {
		shoestring.trackedMethodsKey = "shoestringMethods";

		// simple check for localStorage from Modernizr - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
		function supportsStorage() {
			var mod = "modernizr";
			try {
				localStorage.setItem(mod, mod);
				localStorage.removeItem(mod);
				return true;
			} catch(e) {
				return false;
			}
		}

		// return a new function closed over the old implementation
		function recordProxy( old, name ) {
			return function() {
				var tracked;
				try {
					tracked = JSON.parse(window.localStorage.getItem( shoestring.trackedMethodsKey ) || "{}");
				} catch (e) {
					if( e instanceof SyntaxError) {
						tracked = {};
					}
				}

				tracked[ name ] = true;
				window.localStorage.setItem( shoestring.trackedMethodsKey, JSON.stringify(tracked) );

				return old.apply(this, arguments);
			};
		}

		// proxy each of the methods defined on fn
		if( supportsStorage() ){
			for( var method in shoestring.fn ){
				if( shoestring.fn.hasOwnProperty(method) ) {
					shoestring.fn[ method ] = recordProxy(shoestring.fn[ method ], method);
				}
			}
		}
	})();



})( this );
if( !window.jQuery ){
	window.jQuery = window.shoestring;
	window.$ = window.shoestring;
}
/*! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
	"use strict";

	// For browsers that support matchMedium api such as IE 9 and webkit
	var styleMedia = (window.styleMedia || window.media);

	// For those that don't support matchMedium
	if (!styleMedia) {
		var style       = document.createElement('style'),
			script      = document.getElementsByTagName('script')[0],
			info        = null;

		style.type  = 'text/css';
		style.id    = 'matchmediajs-test';

		script.parentNode.insertBefore(style, script);

		// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

		styleMedia = {
			matchMedium: function(media) {
				var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

				// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.textContent = text;
				}

				// Test if media query is true or false
				return info.width === '1px';
			}
		};
	}

	return function(media) {
		return {
			matches: styleMedia.matchMedium(media || 'all'),
			media: media || 'all'
		};
	};
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( w, doc, image ) {
	// Enable strict mode
	"use strict";

	function expose(picturefill) {
		/* expose picturefill */
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// CommonJS, just export
			module.exports = picturefill;
		} else if ( typeof define === "function" && define.amd ) {
			// AMD support
			define( "picturefill", function() { return picturefill; } );
		}
		if ( typeof w === "object" ) {
			// If no AMD and we are in the browser, attach to window
			w.picturefill = picturefill;
		}
	}

	// If picture is supported, well, that's awesome. Let's get outta here...
	if ( w.HTMLPictureElement ) {
		expose(function() { });
		return;
	}

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	doc.createElement( "picture" );

	// local object for method references and testing exposure
	var pf = w.picturefill || {};

	var regWDesc = /\s+\+?\d+(e\d+)?w/;

	// namespace
	pf.ns = "picturefill";

	// srcset support test
	(function() {
		pf.srcsetSupported = "srcset" in image;
		pf.sizesSupported = "sizes" in image;
		pf.curSrcSupported = "currentSrc" in image;
	})();

	// just a string trim workaround
	pf.trim = function( str ) {
		return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
	};

	/**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */
	pf.makeUrl = (function() {
		var anchor = doc.createElement( "a" );
		return function(src) {
			anchor.href = src;
			return anchor.href;
		};
	})();

	/**
	 * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	pf.restrictsMixedContent = function() {
		return w.location.protocol === "https:";
	};
	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 */

	pf.matchesMedia = function( media ) {
		return w.matchMedia && w.matchMedia( media ).matches;
	};

	// Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
	pf.getDpr = function() {
		return ( w.devicePixelRatio || 1 );
	};

	/**
	 * Get width in css pixel value from a "length" value
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 */
	pf.getWidthFromLength = function( length ) {
		var cssValue;
		// If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, abort.
        if ( !(length && length.indexOf( "%" ) > -1 === false && ( parseFloat( length ) > 0 || length.indexOf( "calc(" ) > -1 )) ) {
            return false;
        }

		/**
		 * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
		 * is injected at the top of the document.
		 *
		 * TODO: maybe we should put this behind a feature test for `vw`? The risk of doing this is possible browser inconsistancies with vw vs %
		 */
		length = length.replace( "vw", "%" );

		// Create a cached element for getting length value widths
		if ( !pf.lengthEl ) {
			pf.lengthEl = doc.createElement( "div" );

			// Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
			pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";

			// Add a class, so that everyone knows where this element comes from
			pf.lengthEl.className = "helper-from-picturefill-js";
		}

		pf.lengthEl.style.width = "0px";

        try {
		    pf.lengthEl.style.width = length;
        } catch ( e ) {}

		doc.body.appendChild(pf.lengthEl);

		cssValue = pf.lengthEl.offsetWidth;

		if ( cssValue <= 0 ) {
			cssValue = false;
		}

		doc.body.removeChild( pf.lengthEl );

		return cssValue;
	};

    pf.detectTypeSupport = function( type, typeUri ) {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var image = new w.Image();
        image.onerror = function() {
            pf.types[ type ] = false;
            picturefill();
        };
        image.onload = function() {
            pf.types[ type ] = image.width === 1;
            picturefill();
        };
        image.src = typeUri;

        return "pending";
    };
	// container of supported mime types that one might need to qualify before using
	pf.types = pf.types || {};

	pf.initTypeDetects = function() {
        // Add support for standard mime types
        pf.types[ "image/jpeg" ] = true;
        pf.types[ "image/gif" ] = true;
        pf.types[ "image/png" ] = true;
        pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        pf.types[ "image/webp" ] = pf.detectTypeSupport("image/webp", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=");
    };

	pf.verifyTypeSupport = function( source ) {
		var type = source.getAttribute( "type" );
		// if type attribute exists, return test result, otherwise return true
		if ( type === null || type === "" ) {
			return true;
		} else {
				var pfType = pf.types[ type ];
			// if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
			if ( typeof pfType === "string" && pfType !== "pending") {
				pf.types[ type ] = pf.detectTypeSupport( type, pfType );
				return "pending";
			} else if ( typeof pfType === "function" ) {
				pfType();
				return "pending";
			} else {
				return pfType;
			}
		}
	};

	// Parses an individual `size` and returns the length, and optional media query
	pf.parseSize = function( sourceSizeStr ) {
		var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
		return {
			media: match && match[1],
			length: match && match[2]
		};
	};

	// Takes a string of sizes and returns the width in pixels as a number
	pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//                            or (min-width:30em) calc(30% - 15px)
		var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
			winningLength;

		for ( var i = 0, len = sourceSizeList.length; i < len; i++ ) {
			// Match <media-condition>? length, ie ( min-width: 50em ) 100%
			var sourceSize = sourceSizeList[ i ],
				// Split "( min-width: 50em ) 100%" into separate strings
				parsedSize = pf.parseSize( sourceSize ),
				length = parsedSize.length,
				media = parsedSize.media;

			if ( !length ) {
				continue;
			}
			// if there is no media query or it matches, choose this as our winning length
			if ( (!media || pf.matchesMedia( media )) &&
				// pass the length to a method that can properly determine length
				// in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
				(winningLength = pf.getWidthFromLength( length )) ) {
				break;
			}
		}

		//if we have no winningLength fallback to 100vw
		return winningLength || Math.max(w.innerWidth || 0, doc.documentElement.clientWidth);
	};

	pf.parseSrcset = function( srcset ) {
		/**
		 * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
		 * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
		 *
		 * 1. Let input (`srcset`) be the value passed to this algorithm.
		 * 2. Let position be a pointer into input, initially pointing at the start of the string.
		 * 3. Let raw candidates be an initially empty ordered list of URLs with associated
		 *    unparsed descriptors. The order of entries in the list is the order in which entries
		 *    are added to the list.
		 */
		var candidates = [];

		while ( srcset !== "" ) {
			srcset = srcset.replace( /^\s+/g, "" );

			// 5. Collect a sequence of characters that are not space characters, and let that be url.
			var pos = srcset.search(/\s/g),
				url, descriptor = null;

			if ( pos !== -1 ) {
				url = srcset.slice( 0, pos );

				var last = url.slice(-1);

				// 6. If url ends with a U+002C COMMA character (,), remove that character from url
				// and let descriptors be the empty string. Otherwise, follow these substeps
				// 6.1. If url is empty, then jump to the step labeled descriptor parser.

				if ( last === "," || url === "" ) {
					url = url.replace( /,+$/, "" );
					descriptor = "";
				}
				srcset = srcset.slice( pos + 1 );

				// 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
				// let that be descriptors.
				if ( descriptor === null ) {
					var descpos = srcset.indexOf( "," );
					if ( descpos !== -1 ) {
						descriptor = srcset.slice( 0, descpos );
						srcset = srcset.slice( descpos + 1 );
					} else {
						descriptor = srcset;
						srcset = "";
					}
				}
			} else {
				url = srcset;
				srcset = "";
			}

			// 7. Add url to raw candidates, associated with descriptors.
			if ( url || descriptor ) {
				candidates.push({
					url: url,
					descriptor: descriptor
				});
			}
		}
		return candidates;
	};

	pf.parseDescriptor = function( descriptor, sizesattr ) {
		// 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
		// is the order in which entries are added to the list.
		var sizes = sizesattr || "100vw",
			sizeDescriptor = descriptor && descriptor.replace( /(^\s+|\s+$)/g, "" ),
			widthInCssPixels = pf.findWidthFromSourceSize( sizes ),
			resCandidate;

			if ( sizeDescriptor ) {
				var splitDescriptor = sizeDescriptor.split(" ");

				for (var i = splitDescriptor.length - 1; i >= 0; i--) {
					var curr = splitDescriptor[ i ],
						lastchar = curr && curr.slice( curr.length - 1 );

					if ( ( lastchar === "h" || lastchar === "w" ) && !pf.sizesSupported ) {
						resCandidate = parseFloat( ( parseInt( curr, 10 ) / widthInCssPixels ) );
					} else if ( lastchar === "x" ) {
						var res = curr && parseFloat( curr, 10 );
						resCandidate = res && !isNaN( res ) ? res : 1;
					}
				}
			}
		return resCandidate || 1;
	};

	/**
	 * Takes a srcset in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, resolution is calculated
	 */
	pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
		var candidates = pf.parseSrcset( srcset ),
			formattedCandidates = [];

		for ( var i = 0, len = candidates.length; i < len; i++ ) {
			var candidate = candidates[ i ];

			formattedCandidates.push({
				url: candidate.url,
				resolution: pf.parseDescriptor( candidate.descriptor, sizes )
			});
		}
		return formattedCandidates;
	};

	/**
	 * if it's an img element and it has a srcset property,
	 * we need to remove the attribute so we can manipulate src
	 * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
	 * this moves srcset's value to memory for later use and removes the attr
	 */
	pf.dodgeSrcset = function( img ) {
		if ( img.srcset ) {
			img[ pf.ns ].srcset = img.srcset;
			img.srcset = "";
			img.setAttribute( "data-pfsrcset", img[ pf.ns ].srcset );
		}
	};

	// Accept a source or img element and process its srcset and sizes attrs
	pf.processSourceSet = function( el ) {
		var srcset = el.getAttribute( "srcset" ),
			sizes = el.getAttribute( "sizes" ),
			candidates = [];

		// if it's an img element, use the cached srcset property (defined or not)
		if ( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ) {
			srcset = el[ pf.ns ].srcset;
		}

		if ( srcset ) {
			candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
		}
		return candidates;
	};

	pf.backfaceVisibilityFix = function( picImg ) {
		// See: https://github.com/scottjehl/picturefill/issues/332
		var style = picImg.style || {},
			WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
			currentZoom = style.zoom;

		if (WebkitBackfaceVisibility) {
			style.zoom = ".999";

			WebkitBackfaceVisibility = picImg.offsetWidth;

			style.zoom = currentZoom;
		}
	};

	pf.setIntrinsicSize = (function() {
		var urlCache = {};
		var setSize = function( picImg, width, res ) {
            if ( width ) {
			    picImg.setAttribute( "width", parseInt(width / res, 10) );
            }
		};
		return function( picImg, bestCandidate ) {
			var img;
			if ( !picImg[ pf.ns ] || w.pfStopIntrinsicSize ) {
				return;
			}
			if ( picImg[ pf.ns ].dims === undefined ) {
				picImg[ pf.ns].dims = picImg.getAttribute("width") || picImg.getAttribute("height");
			}
			if ( picImg[ pf.ns].dims ) { return; }

			if ( bestCandidate.url in urlCache ) {
				setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
			} else {
				img = doc.createElement( "img" );
				img.onload = function() {
					urlCache[bestCandidate.url] = img.width;

                    //IE 10/11 don't calculate width for svg outside document
                    if ( !urlCache[bestCandidate.url] ) {
                        try {
                            doc.body.appendChild( img );
                            urlCache[bestCandidate.url] = img.width || img.offsetWidth;
                            doc.body.removeChild( img );
                        } catch(e){}
                    }

					if ( picImg.src === bestCandidate.url ) {
						setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
					}
					picImg = null;
					img.onload = null;
					img = null;
				};
				img.src = bestCandidate.url;
			}
		};
	})();

	pf.applyBestCandidate = function( candidates, picImg ) {
		var candidate,
			length,
			bestCandidate;

		candidates.sort( pf.ascendingSort );

		length = candidates.length;
		bestCandidate = candidates[ length - 1 ];

		for ( var i = 0; i < length; i++ ) {
			candidate = candidates[ i ];
			if ( candidate.resolution >= pf.getDpr() ) {
				bestCandidate = candidate;
				break;
			}
		}

		if ( bestCandidate ) {

			bestCandidate.url = pf.makeUrl( bestCandidate.url );

			if ( picImg.src !== bestCandidate.url ) {
				if ( pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:" ) {
					if ( window.console !== undefined ) {
						console.warn( "Blocked mixed content image " + bestCandidate.url );
					}
				} else {
					picImg.src = bestCandidate.url;
					// currentSrc attribute and property to match
					// http://picture.responsiveimages.org/#the-img-element
					if ( !pf.curSrcSupported ) {
						picImg.currentSrc = picImg.src;
					}

					pf.backfaceVisibilityFix( picImg );
				}
			}

			pf.setIntrinsicSize(picImg, bestCandidate);
		}
	};

	pf.ascendingSort = function( a, b ) {
		return a.resolution - b.resolution;
	};

	/**
	 * In IE9, <source> elements get removed if they aren't children of
	 * video elements. Thus, we conditionally wrap source elements
	 * using <!--[if IE 9]><video style="display: none;"><![endif]-->
	 * and must account for that here by moving those source elements
	 * back into the picture element.
	 */
	pf.removeVideoShim = function( picture ) {
		var videos = picture.getElementsByTagName( "video" );
		if ( videos.length ) {
			var video = videos[ 0 ],
				vsources = video.getElementsByTagName( "source" );
			while ( vsources.length ) {
				picture.insertBefore( vsources[ 0 ], video );
			}
			// Remove the video element once we're finished removing its children
			video.parentNode.removeChild( video );
		}
	};

	/**
	 * Find all `img` elements, and add them to the candidate list if they have
	 * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
	 * a `srcset` attribute at all, and they haven’t been evaluated already.
	 */
	pf.getAllElements = function() {
		var elems = [],
			imgs = doc.getElementsByTagName( "img" );

		for ( var h = 0, len = imgs.length; h < len; h++ ) {
			var currImg = imgs[ h ];

			if ( currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
			( currImg.getAttribute( "srcset" ) !== null ) || currImg[ pf.ns ] && currImg[ pf.ns ].srcset !== null ) {
				elems.push( currImg );
			}
		}
		return elems;
	};

	pf.getMatch = function( img, picture ) {
		var sources = picture.childNodes,
			match;

		// Go through each child, and if they have media queries, evaluate them
		for ( var j = 0, slen = sources.length; j < slen; j++ ) {
			var source = sources[ j ];

			// ignore non-element nodes
			if ( source.nodeType !== 1 ) {
				continue;
			}

			// Hitting the `img` element that started everything stops the search for `sources`.
			// If no previous `source` matches, the `img` itself is evaluated later.
			if ( source === img ) {
				return match;
			}

			// ignore non-`source` nodes
			if ( source.nodeName.toUpperCase() !== "SOURCE" ) {
				continue;
			}
			// if it's a source element that has the `src` property set, throw a warning in the console
			if ( source.getAttribute( "src" ) !== null && typeof console !== undefined ) {
				console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
			}

			var media = source.getAttribute( "media" );

			// if source does not have a srcset attribute, skip
			if ( !source.getAttribute( "srcset" ) ) {
				continue;
			}

			// if there's no media specified, OR w.matchMedia is supported
			if ( ( !media || pf.matchesMedia( media ) ) ) {
				var typeSupported = pf.verifyTypeSupport( source );

				if ( typeSupported === true ) {
					match = source;
					break;
				} else if ( typeSupported === "pending" ) {
					return false;
				}
			}
		}

		return match;
	};

	function picturefill( opt ) {
		var elements,
			element,
			parent,
			firstMatch,
			candidates,
			options = opt || {};

		elements = options.elements || pf.getAllElements();

		// Loop through all elements
		for ( var i = 0, plen = elements.length; i < plen; i++ ) {
			element = elements[ i ];
			parent = element.parentNode;
			firstMatch = undefined;
			candidates = undefined;

			// immediately skip non-`img` nodes
			if ( element.nodeName.toUpperCase() !== "IMG" ) {
				continue;
			}

			// expando for caching data on the img
			if ( !element[ pf.ns ] ) {
				element[ pf.ns ] = {};
			}

			// if the element has already been evaluated, skip it unless
			// `options.reevaluate` is set to true ( this, for example,
			// is set to true when running `picturefill` on `resize` ).
			if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
				continue;
			}

			// if `img` is in a `picture` element
			if ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) {

				// IE9 video workaround
				pf.removeVideoShim( parent );

				// return the first match which might undefined
				// returns false if there is a pending source
				// TODO the return type here is brutal, cleanup
				firstMatch = pf.getMatch( element, parent );

				// if any sources are pending in this picture due to async type test(s)
				// remove the evaluated attr and skip for now ( the pending test will
				// rerun picturefill on this element when complete)
				if ( firstMatch === false ) {
					continue;
				}
			} else {
				firstMatch = undefined;
			}

			// Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
			if ( ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) ||
			( !pf.sizesSupported && ( element.srcset && regWDesc.test( element.srcset ) ) ) ) {
				pf.dodgeSrcset( element );
			}

			if ( firstMatch ) {
				candidates = pf.processSourceSet( firstMatch );
				pf.applyBestCandidate( candidates, element );
			} else {
				// No sources matched, so we’re down to processing the inner `img` as a source.
				candidates = pf.processSourceSet( element );

				if ( element.srcset === undefined || element[ pf.ns ].srcset ) {
					// Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
					pf.applyBestCandidate( candidates, element );
				} // Else, resolution-only `srcset` is supported natively.
			}

			// set evaluated to true to avoid unnecessary reparsing
			element[ pf.ns ].evaluated = true;
		}
	}

	/**
	 * Sets up picture polyfill by polling the document and running
	 * the polyfill every 250ms until the document is ready.
	 * Also attaches picturefill on resize
	 */
	function runPicturefill() {
		pf.initTypeDetects();
		picturefill();
		var intervalId = setInterval( function() {
			// When the document has finished loading, stop checking for new images
			// https://github.com/ded/domready/blob/master/ready.js#L15
			picturefill();

			if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
				clearInterval( intervalId );
				return;
			}
		}, 250 );

		var resizeTimer;
		var handleResize = function() {
	        picturefill({ reevaluate: true });
	    };
		function checkResize() {
		    clearTimeout(resizeTimer);
		    resizeTimer = setTimeout( handleResize, 60 );
		}

		if ( w.addEventListener ) {
			w.addEventListener( "resize", checkResize, false );
		} else if ( w.attachEvent ) {
			w.attachEvent( "onresize", checkResize );
		}
	}

	runPicturefill();

	/* expose methods for testing */
	picturefill._ = pf;

	expose( picturefill );

} )( window, window.document, new window.Image() );

/*! Tappy! - a lightweight normalized tap event. Copyright 2013 @scottjehl, Filament Group, Inc. Licensed MIT */
(function( w, $, undefined ){

	// handling flag is true when an event sequence is in progress (thx androood)
	w.tapHandling = false;
	w.tappy = true;

	var tap = function( $els ){
		return $els.each(function(){

			var $el = $( this ),
				resetTimer,
				startY,
				startX,
				cancel,
				scrollTolerance = 10;

			function trigger( e ){
				$( e.target ).trigger( "tap", [ e, $( e.target ).attr( "href" ) ] );
			}

			function getCoords( e ){
				var ev = e.originalEvent || e,
					touches = ev.touches || ev.targetTouches;

				if( touches ){
					return [ touches[ 0 ].pageX, touches[ 0 ].pageY ];
				}
				else {
					return null;
				}
			}

			function start( e ){
				if( e.touches && e.touches.length > 1 || e.targetTouches && e.targetTouches.length > 1 ){
					return false;
				}

				var coords = getCoords( e );
				startX = coords[ 0 ];
				startY = coords[ 1 ];
			}

			// any touchscroll that results in > tolerance should cancel the tap
			function move( e ){
				if( !cancel ){
					var coords = getCoords( e );
					if( coords && ( Math.abs( startY - coords[ 1 ] ) > scrollTolerance || Math.abs( startX - coords[ 0 ] ) > scrollTolerance ) ){
						cancel = true;
					}
				}
			}

			function end( e ){
				clearTimeout( resetTimer );
				resetTimer = setTimeout( function(){
					w.tapHandling = false;
					cancel = false;
				}, 1000 );

				// make sure no modifiers are present. thx http://www.jacklmoore.com/notes/click-events/
				if( ( e.which && e.which > 1 ) || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey ){
					return;
				}

				e.preventDefault();

				// this part prevents a double callback from touch and mouse on the same tap

				// if a scroll happened between touchstart and touchend
				if( cancel || w.tapHandling && w.tapHandling !== e.type ){
					cancel = false;
					return;
				}

				w.tapHandling = e.type;
				trigger( e );
			}

			$el
				.bind( "touchstart.tappy MSPointerDown.tappy", start )
				.bind( "touchmove.tappy MSPointerMove.tappy", move )
				.bind( "touchend.tappy MSPointerUp.tappy", end )
				.bind( "click.tappy", end );
		});
	};

	var untap = function( $els ){
		return $els.unbind( ".tappy" );
	};

	// use special events api
	if( $.event && $.event.special ){
		$.event.special.tap = {
			add: function( handleObj ) {
				tap( $( this ) );
			},
			remove: function( handleObj ) {
				untap( $( this ) );
			}
		};
	}
	else{
		// monkeybind
		var oldBind = $.fn.bind,
			oldUnbind = $.fn.unbind;
		$.fn.bind = function( evt ){
			if( /(^| )tap( |$)/.test( evt ) ){
				tap( this );
			}
			return oldBind.apply( this, arguments );
		};
		$.fn.unbind = function( evt ){
			if( /(^| )tap( |$)/.test( evt ) ){
				untap( this );
			}
			return oldUnbind.apply( this, arguments );
		};
	}

}( this, jQuery ));

/*
 * Collapsible widget
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	// Defaults
	var pluginName = "collapsible";
	var idInt = 0;
	// overrideable defaults
	var defaults = {
		pluginClass: pluginName,
		collapsedClass: pluginName + "-collapsed",
		headerClass: pluginName + "-header",
		contentClass: pluginName + "-content",
		enhancedClass: pluginName + "-enhanced",
		instructions: false,
		collapsed: false
	};

	// plugin constructor
	function Plugin(element, options) {
		this.element = $( element );
		var self = this,
			dataOptions = {};

		// Allow data-attr option setting
		if( this.element.is( "[data-config]" ) ){
			for( var option in defaults ){
					if( defaults.hasOwnProperty( option) ){
					var value = self.element.attr( "data-" + option.replace( /[A-Z]/g, function( c ) {
									return "-" + c.toLowerCase();
								}));

					if ( value !== undefined ) {
						if( value === "true" || value === "false" ){
							dataOptions[ option ] = value === "true";
						}
						else {
							dataOptions[ option ] = value;
						}
					}
				}
			}
		}



		this.options = $.extend( {}, defaults, dataOptions, options );

		// allow the collapsedClass to set the option if specified
		if( this.element.is( "." + this.options.collapsedClass ) ){
			this.options.collapsed= true;
		}

		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this.header = this.element.children().filter( "." + this.options.headerClass );
			if( !this.header.length ){
				this.header = this.element.children().eq( 0 );
			}
			this.content = this.element.children().filter( "." + this.options.contentClass );
			if( !this.content.length ){
				this.content = this.header.next();
			}
			this._addAttributes();
			this._bindEvents();
			idInt++;
			this.element.data( pluginName, this );
			this.element.trigger( "init" );
		},

		_addAttributes: function(){
			this.element
				.addClass( this.options.pluginClass )
				.addClass( this.options.enhancedClass );

			this.header.addClass( this.options.headerClass );

			if( this.options.instructions ){
				this.header.attr( "title", this.options.instructions );
			}

			var id = "collapsible-" + idInt;

			this.header.attr( "role", "button" );

			this.header.attr( "aria-haspopup", "true" );

			this.header.attr( "aria-controls", id );

			this.header.attr( "tabindex", "0" );

			this.content.attr( "role", "menu" );

			this.content.addClass( this.options.contentClass );

			this.content.attr( "id", id );
		},

		_bindEvents: function(){
			var self = this;

			this.header
				// use the tappy plugin if it's available
				// tap can't be namespaced yet without special events api: https://github.com/filamentgroup/tappy/issues/22
				.bind( ( window.tappy ? "tap" : "click" ), function( e ){
					self.toggle( e.target );
					e.preventDefault();
				})
				.bind( "keydown." + pluginName, function( e ){
					if( e.which === 13 || e.which === 32 ){
						self.toggle( e.target );
						e.preventDefault();
					}
				});

			if( this.options.collapsed ){
				this._collapse();
			}
			else {
				this._expand();
			}
		},

		collapsed: false,

		// used internally to expand without triggering events (for init)
		_expand: function() {
			this.element.removeClass( this.options.collapsedClass );
			this.collapsed = false;
			this.header.attr( "aria-expanded", "true" );
			this.content.attr( "aria-hidden", "false" );
		},

		expand: function () {
			var self = $( this ).data( pluginName ) || this;
			self._expand();
			self.element.trigger( "expand" );
		},

		// used internally to expand without triggering events (for init)
		_collapse: function() {
			this.element.addClass( this.options.collapsedClass );
			this.collapsed = true;
			this.header.attr( "aria-expanded", "false" );
			this.content.attr( "aria-hidden", "true" );
		},

		collapse: function() {
			var self = $( this ).data( pluginName ) || this;
			self._collapse();
			self.element.trigger( "collapse" );
		},

		toggle: function(){
			if(  this.collapsed ){
				this.expand();
			} else {
				this.collapse();
			}
		},

		focusable: "a, input, textarea, select, button, [tabindex='0']"



	};

	// lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if ( !$( this ).data( pluginName ) ) {
				new Plugin( this, options );
			}
		});
	};

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "enhance", function( e ){
		var selector = "." + pluginName;
		$( $( e.target ).is( selector ) && e.target ).add( selector, e.target ).filter( selector )[ pluginName ]();
	});

})(jQuery, window, document);

/*
 * Collapsible widget extension: set
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {
	var pluginName = "collapsible";

	// Simple auto-init by selector that runs when the dom is ready. Trigger "enhance" if desirable.
	$( document ).bind( "expand." + pluginName, function( e ){
		var setAttr = "data-" + pluginName + "-set";
		var selector = "." + pluginName + "[" + setAttr + "]";
		var $collapsible = $( e.target );
		if( $collapsible.is( selector ) ){
			var value = $collapsible.attr( setAttr );
			var $set = $( "." + pluginName + "-enhanced[" + setAttr + "='" + value + "']" ).filter(function() {
				return this !== $collapsible[0];
			});

			$set.each(function(){
				var thisData = $( this ).data( pluginName );
				if( thisData ){
					thisData.collapse();
				}
			});
			var openItemTop = e.target.getBoundingClientRect().top + ( document.body.scrollY || document.body.scrollTop || document.documentElement.scrollTop );
			// from jquery...
			var scroll =  (function() {
				var prop = 'pageYOffset',
					method = 'scrollTop';
				return window ? (prop in window) ? window[ prop ] :
					window.document.documentElement[ method ] :
					window.document.body[ method ];
			}());

			if( scroll > openItemTop ){
				window.scrollTo( 0, openItemTop );
			}
		}
	});

})(jQuery, window, document);

/*
 * Collapsible widget extension: menu behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName ) ){
			var $collapsible = $( e.target );
			var self = $collapsible.data( pluginName );
			var $trigger = $collapsible.prev().filter( "." + pluginName + "-trigger" );
			var triggerExpand = pluginName + "-trigger-expand";

			var isMenu = function(){
				return $collapsible.find( "." + pluginName + "-content" ).css( "position" ) === "absolute";
			};

			// tapout/clickout behavior
			var targetTop;
			var touchCancel = false;
			$( "body" )
				.bind( "gesturestart." + pluginName, function(){
					touchCancel = true;
				})
				.bind( "touchstart." + pluginName, function( a ){
					targetTop = a.target.getBoundingClientRect().top;
				})
				.bind( "touchend." + pluginName + " click." + pluginName, function( a ){
					if( a.type === "touchend" ){
						if( targetTop && Math.abs( targetTop - a.target.getBoundingClientRect().top ) > 5 ){
							touchCancel = true;
						}
					}

					// if the event target is not in the collapsible, and the collapsible is expanded, and it's a menu presentation... collapse it!
					if( !$( a.target ).closest( e.target ).length &&
						!$( a.target ).closest( $trigger ).length &&
						!$collapsible.data( pluginName ).collapsed &&
						isMenu()  &&
						touchCancel === false ){

						setTimeout(function(){
							$collapsible.data( pluginName ).collapse();
						});
						a.preventDefault();
					}
					setTimeout( function(){
						targetTop = null;
						touchCancel = false;
					}, 200 );
				} );

			// hover behavior for collapsibles and triggers relies on the presence of data-collapsible-hover attr
			if( $collapsible.is( "[data-collapsible-hover]" ) ){

				$collapsible
					.add( $trigger )
					.bind( "mouseenter." + pluginName, function(){
						if( isMenu() ){
							$collapsible.data( pluginName ).expand();
						}
					} )
					.bind( "mouseleave." + pluginName, function(){
						if( isMenu() ){
							$collapsible.data( pluginName ).collapse();
						}
					} );

				$collapsible
					.bind( "expand", function(){
						$trigger.addClass( triggerExpand );
					} )
					.bind( "collapse", function(){
						$trigger.removeClass( triggerExpand );
					} );
			}


			// add keyboard/arrow handling
			// arrow method handles the arrow key navigation, which largely maps to the tab key within the component
			self.arrow = function( target, back ){

				// find all focusables in this collapsible content area
				var $focusables = this.content.find( this.focusable );
				// nextTab will be the next element receiving focus from this arrow keydown
				var nextTab;

				// if the keydown target is the header and it's down or right, focus on the first focusable
				if( $( target ).is( this.header ) && !back ){
					nextTab = $focusables[ 0 ];
				}
				else {
					// if it's a backward arrow, reverse the array
					if( back ){
						// this if can go away once https://github.com/filamentgroup/shoestring/issues/80 is fixed
						// check if already an array (shoestring with bug above)
						if( $focusables.reverse ){
							$focusables = $focusables.reverse();
						}
						// otherwisejquery will need a get()
						else {
							$focusables = $( $focusables.get().reverse() );
						}
					}
					// afterTarget becomes true once the target has been passed in the each loop
					var afterTarget = false;
					// loop focusables
					$focusables.each(function(){
						// if nextTab isn't defined yet, we're after the target in the loop, and the target appears to be displayed
						// NOTE: the offset checks replaced the following, which tied keyboard behavior to aria state:
							// !$( this ).closest( ".collapsible-collapsed .collapsible-content" ).length
							// unfortunately, we sometimes display visually elements that are still aria-hidden.
							// The current check caters to sighted keyboard users over non-sighted keyboard users. TODO: figure this out.
						if( !nextTab && afterTarget && this.offsetHeight > 0 && this.offsetLeft > -1 ){
							nextTab = this;
						}
						// try to set afterTarget if not already set
						if( !afterTarget ) {
							afterTarget = $( this ).is( target );
						}
					});
				}

				// if we have a next element to send focus to at this point, do that. Otherwise, focus back on header
				if( nextTab ){
					nextTab.focus();
				}
				else {
					// no nextTab? focus back to header
					this.header[ 0 ].focus();
				}
			};

			// bind keydown handlers.
			// arrow key handling applies to the entire collapsible
			self.element
				.bind( "keydown." + pluginName, function( e ){
					// arrow key behavior: collapsible must be expanded to accept arrow navigation
					if( !self.collapsed ){
						if( e.which === 39 || e.which === 40 ){
							self.arrow( e.target );
							e.preventDefault();
						}
						else if( e.which === 37 || e.which === 38 ){
							self.arrow( e.target, true );
							e.preventDefault();
						}
					}

				});


		}
	} );

})(jQuery, window, document);

/*
 * Collapsible widget extension: menu overlay
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document, undefined) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		if( $( e.target ).is( "." + pluginName + "[data-collapsible-underlay]" ) ){
			var $collapsible = $( e.target );
			var unClass = "collapsible-underlay";
			var htmlClass = "collapsible-underlay-contain";
			var hideClass = unClass + "-hidden";
			var $underlay = $( "<div class='"+ unClass +"'></div>" );

			$( document.documentElement ).addClass( htmlClass );

			if( $collapsible.is( "." + pluginName + "-collapsed" ) ){
				$underlay.addClass( hideClass );
			}

			$collapsible
				.bind( "expand", function(){
					$underlay.removeClass( hideClass );
				} )
				.bind( "collapse", function(){
					$underlay.addClass( hideClass );
				} );

			$underlay.prependTo( $collapsible.parent() );
		}
	} );

})(jQuery, window, document);

/*
 * Collapsible widget extension: tabs behavior
 * https://github.com/filamentgroup/collapsible
 * Copyright (c) 2014 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

;(function ($, window, document) {

	$( document ).bind( "init", function( e ){
		var pluginName = "collapsible";
		var activeTabClass = "tab-active";
		var $collapsible = $( e.target ).closest( "." + pluginName );
		var $tabContainer = $collapsible.parent();
		var $tabNav = $tabContainer.find( ".tabnav" );
		var self;
		var id;

		if( $collapsible.is( "." + pluginName ) && $tabContainer.is( ".tabs" ) ){
			self = $collapsible.data( pluginName );
			id = self.content.attr( "id" );
			$tabNav.find( "[aria-controls=" + id + "]" ).remove();

			self.$tabHeader = $( "<a href='#'>" + self.header[0].innerHTML + "</a>" ).attr( "aria-controls", id );
			self.header.css( 'display', 'none' );

			self.$tabHeader.bind( window.tappy ? "tap" : "click", function( e ){
				e.preventDefault();
				e.stopPropagation();

				if( self.$tabHeader.is( '.' + activeTabClass ) ) {
					self.$tabHeader.removeClass( activeTabClass );
				} else {
					$tabContainer.find( '.' + activeTabClass ).removeClass( activeTabClass );
					self.$tabHeader.addClass( activeTabClass );
				}

				self.toggle();
			});

			if( !$tabNav.length ) {
				$tabNav = $( "<nav class='tabnav'></nav>" );
				$tabContainer.prepend( $tabNav );
			}

			if( !self.collapsed ) {
				self.$tabHeader.addClass( activeTabClass );
				self._expand();
			}

			$tabNav.append( self.$tabHeader );
		}
	});

})(jQuery, window, document);

/*! nouislider - 8.3.0 - 2016-02-14 17:37:19 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// Shorthand for stopPropagation so we don't have to create a dynamic method
	function stopPropagation ( e ) {
		e.stopPropagation();
	}

	// todo
	function addCssPrefix(cssPrefix) {
		return function(className) {
			return cssPrefix + className;
		};
	}


	var
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	defaultCssPrefix = 'noUi-';


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0,
			hover = entry.indexOf('hover') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		var i;

		if ( entry === false ) {
			return;
		} else if ( entry === true ) {

			parsed.tooltips = [];

			for ( i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}

		} else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider: must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' ) {
			throw new Error( "noUiSlider: 'cssPrefix' must be a string.");
		}

		parsed.cssPrefix = entry;
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		};

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options ){

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {},
		scope_Self;

  var cssClasses = [
    /*  0 */  'target'
    /*  1 */ ,'base'
    /*  2 */ ,'origin'
    /*  3 */ ,'handle'
    /*  4 */ ,'horizontal'
    /*  5 */ ,'vertical'
    /*  6 */ ,'background'
    /*  7 */ ,'connect'
    /*  8 */ ,'ltr'
    /*  9 */ ,'rtl'
    /* 10 */ ,'draggable'
    /* 11 */ ,''
    /* 12 */ ,'state-drag'
    /* 13 */ ,''
    /* 14 */ ,'state-tap'
    /* 15 */ ,'active'
    /* 16 */ ,''
    /* 17 */ ,'stacking'
    /* 18 */ ,'tooltip'
    /* 19 */ ,''
    /* 20 */ ,'pips'
    /* 21 */ ,'marker'
    /* 22 */ ,'value'
  ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		addClass(handle, cssClasses[3]);
		addClass(handle, cssClasses[3] + additions[index]);

		addClass(origin, cssClasses[2]);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, cssClasses[7]);
					addClass(handles[0], cssClasses[6]);
					break;
			case 3: addClass(handles[1], cssClasses[6]);
					/* falls through */
			case 2: addClass(handles[0], cssClasses[7]);
					/* falls through */
			case 0: addClass(target, cssClasses[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, cssClasses[0]);
		addClass(target, cssClasses[8 + direction]);
		addClass(target, cssClasses[4 + orientation]);

		var div = document.createElement('div');
		addClass(div, cssClasses[1]);
		target.appendChild(div);
		return div;
	}


	function addTooltip ( handle, index ) {

		if ( !options.tooltips[index] ) {
			return false;
		}

		var element = document.createElement('div');
		element.className = cssClasses[18];
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		if ( options.dir ) {
			options.tooltips.reverse();
		}

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		if ( options.dir ) {
			tips.reverse();
			options.tooltips.reverse();
		}

		bindEvent('update', function(f, o, r) {
			if ( tips[o] ) {
				tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
			}
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][options.ort],
			element = document.createElement('div'),
			out = '';

		addClass(element, cssClasses[20]);
		addClass(element, cssClasses[20] + '-' + style);

		function getSize( type ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1]) +
				'" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			out += '<div ' + getTags(offset, cssClasses[21], values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				out += '<div '+getTags(offset, cssClasses[22], values)+'>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});
		element.innerHTML = out;

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
		return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
	}

	// External event handling
	function fireEvent ( event, handleNumber, tap ) {

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {

					callback.call(
						// Use the slider public API as the scope ('this')
						scope_Self,
						// Return values as array, so arg_1[arg_2] is always valid.
						asArray(valueGet()),
						// Handle index, 0 or 1
						handleNumber,
						// Unformatted slider values
						asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))),
						// Event is fired by tap, true or false
						tap || false,
						// Left offset of the handle, in relation to the slider
						scope_Locations
					);
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, cssClasses[14]) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + cssClasses[15] ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, cssClasses[15]);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, cssClasses[12]);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		// If this is a standard handle movement, fire the end event.
		if ( data.handleNumber !== undefined ) {
			fireEvent('end', data.handleNumber);
		}
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			end ( event, data );
		}
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			addClass(data.handles[0].children[0], cssClasses[15]);

			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}
		}

		// Fix #551, where a handle gets selected instead of dragged.
		event.preventDefault();

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			handleNumber: data.handleNumber,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		var outEvent = attach("mouseout", d, documentLeave, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		d.noUiListeners = moveEvent.concat(endEvent, outEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, cssClasses[12]);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}

		if ( data.handleNumber !== undefined ) {
			fireEvent('start', data.handleNumber);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;
		
		// Check if handler is not disablet if yes set number to the next handler
		if (scope_Handles[handleNumber].hasAttribute('disabled')) {
			handleNumber = handleNumber ? 0 : 1;
		}

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber, true);
		fireEvent('set', handleNumber, true);
		fireEvent('change', handleNumber, true);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function hover ( event ) {

		var location = event.calcPoint - offset(scope_Base)[ options.style ],
			to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
			value = scope_Spectrum.fromStepping( to );

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < scope_Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, scope_Handles[i].children[0], start, {
					handles: [ scope_Handles[i] ],
					handleNumber: i
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attach ( actions.move, scope_Base, hover, { hover: true } );
			for ( i = 0; i < scope_Handles.length; i += 1 ) {
				['mousemove MSPointerMove pointermove'].forEach(function( eventName ){
					scope_Handles[i].children[0].addEventListener(eventName, stopPropagation, false);
				});
			}
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			drag = [scope_Base.querySelector( '.' + cssClasses[7] )];
			addClass(drag[0], cssClasses[10]);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move
		if ( to === scope_Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, cssClasses[17]);
			if ( to > 50 ) {
				addClass(handle, cssClasses[17]);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		var count, values = asArray( input ), i;

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {

			// Fire the event only for handles that received a new value, as per #579
			if ( values[i] !== null ) {
				fireEvent('set', i);
			}
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {

		cssClasses.forEach(function(cls){
			if ( !cls ) { return; } // Ignore empty classes
			removeClass(scope_Target, cls);
		});

		while (scope_Target.firstChild) {
			scope_Target.removeChild(scope_Target.firstChild);
		}

		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent.split('.')[0],
			namespace = namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, step, range, animate, snap
	function updateOptions ( optionsToUpdate ) {

		var v = valueGet(), i, newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate,
			snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
		});

		['margin', 'limit', 'step', 'range', 'animate'].forEach(function(name){
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = optionsToUpdate[name];
			}
		});

		// Save current spectrum direction as testOptions in testRange call
		// doesn't rely on current direction
		newOptions.spectrum.direction = scope_Spectrum.direction;
		scope_Spectrum = newOptions.spectrum;

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [-1, -1];
		valueSet(v);

		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('update', i);
		}
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions,
		options: options, // Issue #600
		target: scope_Target, // Issue #597
		pips: pips // Issue #594
	};

	// Attach user events.
	events( options.events );

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));
(function( $, w ) {
	"use strict";

	function Slider( e ) {
		var self, $element;
		self = this;

		var prefix = "data-slider-";

		/* Input can be a select or radio buttons */
		this.$el = (this.$element = $(e));
		this.el = e;
		this.isSelect = this.$el.is( "select" );
		this.id = this.isSelect ? this.$el.attr( "id" ) : this.$el.find( ":first-child input[type=radio]" ).attr( "name" );
		this.$opts = this.$el.find( this.isSelect ? "option" : "input[type=radio]" );
		this.optsLength = this.$opts.length;
		this.hasMin = this.$el.attr( prefix + "min" );
		this.hasMax = this.$el.attr( prefix + "max" );
		/* The slider is hidden from assistive technology; those browsers will use the original element */
		this.$slider = $( "<div aria-hidden='true' class='slider' id='slider-"+ this.id +"'></div>" );
		this.slider = this.$slider[0];
		this.hideEl = this.$el.is( "[" + prefix + "hide-element]" );
		this.handleAnimClass = "anim-size-up";

		var getSelectedOpt = function(){
			return self.isSelect ? $( self.el.options[ self.el.selectedIndex ] ) : self.$el.find( "input[type=radio]:checked" );
		};

		/* Slider config values - assumes that select-based sliders have numeric values, and radio button sliders have text values */
		this.min = parseFloat( this.hasMin ) || ( this.isSelect ? 0 : 1 );
		this.max = this.hasMax ? parseFloat( this.hasMax ) : this.optsLength;
		this.step = parseFloat( this.$el.attr( prefix + "step" ) ) || 1;
		this.start = parseFloat( getSelectedOpt().attr( prefix + "val" ) ) || this.min;
		this.pipsLength = this.optsLength;
		this.tooltip = this.$el.is( "[" + prefix + "tooltip]" );
		this.labelStart = this.$el.attr( prefix + "label-start" ) || null;
		this.labelEnd = this.$el.attr( prefix + "label-end" ) || null;
		this.showValue = this.$el.is( "[" + prefix + "show-value]" );

		/* API for slider script at: https://refreshless.com/nouislider/ */
		noUiSlider.create( this.slider, {
			start: this.start,
			range: {
				'min': this.min,
				'max': this.max
			},
			step: this.step,
			tooltips: this.tooltip,
			format: {
				to: function( value ) {
					var val = value || self.min;
					return val.toFixed();
				},
				from: function( value ) {
					var val = value || self.min;
					return parseFloat( val ).toFixed();
				}
			},
			pips: {
				mode: 'count',
				values: this.pipsLength,
				density: 4
			},
			connect: "lower"
		});

		/* Add custom first/last labels */
		if ( this.labelStart ){
			this.$slider.find( ".noUi-marker:first-child + .noUi-value" ).html( this.labelStart );
		}
		if ( this.labelEnd ){
			this.$slider.find( ".noUi-value:last-child" ).html( this.labelEnd );
		}

		/* Append value container */
		if ( this.showValue ) {
			var currentText = self.isSelect ? getSelectedOpt().html() : getSelectedOpt().next().html();
			this.$displayVal = $( "<div class='slider-value'><span class='val'>Your current selection:</span>"+ currentText +"</div>" );
			this.$el.after( this.$displayVal );
		};

		/* Update input when slider changes */
		this.slider.noUiSlider.on( "set", function( values, handle ){
			var value = values[ handle ];
			var pull = self.$slider.find( ".noUi-handle" );

			pull.removeClass( self.handleAnimClass );

			self.$opts.each( function(){
				if ( this.getAttribute( prefix + "val" ) == value ) {
					this[ self.isSelect ? "selected" : "checked" ] = true;

					$(this).trigger( "noui-slider:set" );

					/* Show values in their own container */
					if ( self.$displayVal ) {
						self.$displayVal.html( self.isSelect ? $( this ).html() : $( this ).next().html() );
					}
				}
			});
		});

		/* Update slider when input changes */
		var $input = self.isSelect ? self.$el : self.$opts;
		$input.bind( "change", function(){
			self.slider.noUiSlider.set([ getSelectedOpt().attr( prefix + "val" ), null ]);
		});

		/* Animate handle */
		this.slider.noUiSlider.on( "slide", function(){
			var pull = self.$slider.find( ".noUi-handle" );
			if ( !pull.is( self.handleAnimClass ) ){
				pull.addClass( self.handleAnimClass );
			}
		});

		/* Hide the select or radio button set */
		if ( this.hideEl ) {
			this.$el.addClass( "hidden" );
		};

		/* Append new slider */
		this.$el.after( this.$slider );
	};


	$( document ).bind( "enhance", function( e ) {
		$( "[data-slider]" ).filterUnenhanced( "data-slider" ).each(function( i, e ){
			$(e).data( "slider", new Slider(e));
		});
	});

}( shoestring, window ));

/*
 * Simple jQuery Dialog
 * https://github.com/filamentgroup/dialog
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Author: @scottjehl
 * Contributors: @johnbender
 * Licensed under the MIT, GPL licenses.
 */

window.jQuery = window.jQuery || window.shoestring;

(function( w, $ ){
	w.componentNamespace = w.componentNamespace || w;

	var pluginName = "dialog", cl, ev,
		doc = w.document,
		docElem = doc.documentElement,
		body = doc.body,
		$html = $( docElem );

	var Dialog = w.componentNamespace.Dialog = function( element ){
		this.$el = $( element );
		this.$background = !this.$el.is( '[data-nobg]' ) ?
			$( doc.createElement('div') ).addClass( cl.bkgd ).appendTo( "body") :
			$( [] );
		this.hash = this.$el.attr( "id" ) + "-dialog";

		this.isOpen = false;
		this.positionMedia = this.$el.attr( 'data-set-position-media' );
		this.isTransparentBackground = this.$el.is( '[data-transbg]' );
	};

	Dialog.events = ev = {
		open: pluginName + "-open",
		opened: pluginName + "-opened",
		close: pluginName + "-close",
		closed: pluginName + "-closed"
	};

	Dialog.classes = cl = {
		open: pluginName + "-open",
		opened: pluginName + "-opened",
		content: pluginName + "-content",
		close: pluginName + "-close",
		closed: pluginName + "-closed",
		bkgd: pluginName + "-background",
		bkgdOpen: pluginName + "-background-open",
		bkgdTrans: pluginName + "-background-trans"
	};

	Dialog.prototype.isSetScrollPosition = function() {
		return !this.positionMedia ||
			( w.matchMedia && w.matchMedia( this.positionMedia ).matches );
	};

	Dialog.prototype.destroy = function() {
		this.$background.remove();
	};

	Dialog.prototype.open = function() {
		if( this.$background.length ) {
			this.$background[ 0 ].style.height = Math.max( docElem.scrollHeight, docElem.clientHeight ) + "px";
		}
		this.$el.addClass( cl.open );
		this.$background.addClass( cl.bkgdOpen );
		this._setBackgroundTransparency();

		if( this.isSetScrollPosition() ) {
			this.scroll = "pageYOffset" in w ? w.pageYOffset : ( docElem.scrollY || docElem.scrollTop || ( body && body.scrollY ) || 0 );
			this.$el[ 0 ].style.top = this.scroll + "px";
		} else {
			this.$el[ 0 ].style.top = '';
		}

		$html.addClass( cl.open );
		this.isOpen = true;

		window.location.hash = this.hash;

		if( doc.activeElement ){
			this.focused = doc.activeElement;
		}
		this.$el[ 0 ].focus();

		this.$el.trigger( ev.opened );
	};

	Dialog.prototype._setBackgroundTransparency = function() {
		if( this.isTransparentBackground ){
			this.$background.addClass( cl.bkgdTrans );
		}
	};

	Dialog.prototype.close = function(){
		if( !this.isOpen ){
			return;
		}

		this.$el.removeClass( cl.open );

		this.$background.removeClass( cl.bkgdOpen );
		$html.removeClass( cl.open );

		if( this.focused ){
			this.focused.focus();
		}

		if( this.isSetScrollPosition() ) {
			w.scrollTo( 0, this.scroll );
		}

		this.isOpen = false;

		this.$el.trigger( ev.closed );
	};
}( this, window.jQuery ));

(function( w, $ ){
  var Dialog = w.componentNamespace.Dialog, doc = document;

	$.fn.dialog = function(){
		return this.each(function(){
			var $el = $( this ), dialog = new Dialog( this );

			$el.data( "instance", dialog );

			$el.addClass( Dialog.classes.content )
				.attr( "role", "dialog" )
				.attr( "tabindex", 0 )
				.bind( Dialog.events.open, function(){
					dialog.open();
				})
				.bind( Dialog.events.close, function(){
					dialog.close();
				})
				.bind( "click", function( e ){
					if( $( e.target ).is( "." + Dialog.classes.close ) ){
						w.history.back();
						e.preventDefault();
					}
				});

			dialog.$background.bind( "click", function() {
				w.history.back();
			});

			// close on hashchange if open (supports back button closure)
			$( w ).bind( "hashchange", function(){
				var hash = w.location.hash.replace( "#", "" );

				if( hash !== dialog.hash ){
					dialog.close();
				}
			});

			// open on matching a[href=#id] click
			$( doc ).bind( "click", function( e ){
        var $matchingDialog, $a;

        $a = $( e.target ).closest( "a" );

				if( !dialog.isOpen && $a.length && $a.attr( "href" ) ){

					// catch invalid selector exceptions
					try {
						$matchingDialog = $( $a.attr( "href" ) );
					} catch ( error ) {
						// TODO should check the type of exception, it's not clear how well
						//      the error name "SynatxError" is supported
						return;
					}

					if( $matchingDialog.length && $matchingDialog.is( $el ) ){
						$matchingDialog.trigger( Dialog.events.open );
						e.preventDefault();
					}
				}
			});

			// close on escape key
			$( doc ).bind( "keyup", function( e ){
				if( e.which === 27 ){
					dialog.close();
				}
			});
		});
	};

	// auto-init
	$(function(){
		$( ".dialog" ).dialog();
	});
}( this, window.jQuery ));

/*! politespace - v0.1.6b - 2015-07-15
Politely add spaces to input values to increase readability (credit card numbers, phone numbers, etc).
 * https://github.com/filamentgroup/politespace
 * Copyright (c) 2015 Filament Group (@filamentgroup)
 * MIT License */

(function( w, $ ){
	"use strict";

	var Politespace = function( element ) {
		if( !element ) {
			throw new Error( "Politespace requires an element argument." );
		}

		if( !element.getAttribute ) {
			// Cut the mustard
			return;
		}

		this.element = element;
		this.$element = $( element );
		this.delimiter = this.$element.attr( "data-delimiter" ) || " ";
		// https://en.wikipedia.org/wiki/Decimal_mark
		this.decimalMark = this.$element.attr( "data-decimal-mark" ) || "";
		this.reverse = this.$element.is( "[data-reverse]" );
		this.groupLength = this.$element.attr( "data-grouplength" ) || 3;

		var proxyAnchorSelector = this.$element.attr( "data-proxy-anchor" );
		this.$proxyAnchor = this.$element;
		this.$proxy = null;

		if( proxyAnchorSelector ) {
			this.$proxyAnchor = this.$element.closest( proxyAnchorSelector );
		}
	};

	Politespace.prototype._divideIntoArray = function( value ) {
		var split = ( '' + this.groupLength ).split( ',' ),
			isUniformSplit = split.length === 1,
			dividedValue = [],
			loopIndex = 0,
			groupLength,
			substrStart,
			useCharCount;

		while( split.length && loopIndex < value.length ) {
			if( isUniformSplit ) {
				groupLength = split[ 0 ];
			} else {
				// use the next split or the rest of the string if open ended, ala "3,3,"
				groupLength = split.shift() || value.length - loopIndex;
			}

			// Use min if we’re at the end of a reversed string
			// (substrStart below grows larger than the string length)
			useCharCount = Math.min( parseInt( groupLength, 10 ), value.length - loopIndex );

			if( this.reverse ) {
				substrStart = -1 * (useCharCount + loopIndex);
			} else {
				substrStart = loopIndex;
			}
			dividedValue.push( value.substr( substrStart, useCharCount ) );
			loopIndex += useCharCount;
		}

		if( this.reverse ) {
			dividedValue.reverse();
		}

		return dividedValue;
	};

	Politespace.prototype.format = function( value ) {
		var split;
		var val = this.unformat( value );
		var suffix = '';

		if( this.decimalMark ) {
			split = val.split( this.decimalMark );
			suffix = split.length > 1 ? this.decimalMark + split[ 1 ] : '';
			val = split[ 0 ];
		}

		return this._divideIntoArray( val ).join( this.delimiter ) + suffix;
	};

	Politespace.prototype.trimMaxlength = function( value ) {
		var maxlength = this.element.getAttribute( "maxlength" );
		// Note input type="number" maxlength does nothing
		if( maxlength ) {
			value = value.substr( 0, maxlength );
		}
		return value;
	};

	Politespace.prototype.getValue = function() {
		return this.trimMaxlength( this.element.value );
	};

	Politespace.prototype.update = function() {
		this.element.value = this.useProxy() || this.$element.attr( "type" ) === "password" ?
			this.getValue() :
			this.format( this.getValue() );
	};

	Politespace.prototype.unformat = function( value ) {
		return value.replace( new RegExp(  this.delimiter, 'g' ), '' );
	};

	Politespace.prototype.reset = function() {
		this.element.value = this.unformat( this.element.value );
	};

	Politespace.prototype.useProxy = function() {
		// this needs to be an attr check and not a prop for `type` toggling (like password)
		return this.$element.attr( "type" ) === "number";
	};

	Politespace.prototype.updateProxy = function() {
		if( this.useProxy() && this.$proxy.length ) {
			this.$proxy.html( this.format( this.getValue() ) );
			this.$proxy.css( "width", this.element.offsetWidth + "px" );
		}
	};

	Politespace.prototype.createProxy = function() {
		if( !this.useProxy() ) {
			return;
		}

		var self = this;
		function sumStyles( el, props ) {
			var total = 0;
			for( var j=0, k=props.length; j<k; j++ ) {
				total += parseFloat( self.$element.css( props[ j ] ) );
			}
			return total;
		}

		var $el = $( "<div>" ).addClass( "politespace-proxy active" );
		var $parent = this.$proxyAnchor.parent();

		this.$proxy = $( "<div>" ).css({
			font: this.$element.css( "font" ),
			"padding-left": sumStyles( this.element, [ "padding-left", "border-left-width" ] ) + "px",
			"padding-right": sumStyles( this.element, [ "padding-right", "border-right-width" ] ) + "px",
			top: sumStyles( this.element, [ "padding-top", "border-top-width", "margin-top" ] ) + "px"
		});
		$el.append( this.$proxy );
		$el.append( this.$proxyAnchor );
		$parent.append( $el );

		this.updateProxy();
	};

	w.Politespace = Politespace;

}( this, jQuery ));

(function( $ ) {
	"use strict";

	// jQuery Plugin

	var componentName = "politespace",
		initSelector = "[data-" + componentName + "]";

	$.fn[ componentName ] = function(){
		return this.each( function(){
			var $t = $( this );
			if( $t.data( componentName ) ) {
				return;
			}

			var polite = new Politespace( this );
			if( polite.useProxy() ) {
				polite.createProxy();
			}


			$( this )
				.bind( "politespace-hide-proxy", function() {
					$( this ).closest( ".politespace-proxy" ).removeClass( "active" );
				})
				.bind( "politespace-show-proxy", function() {
					$( this ).closest( ".politespace-proxy" ).addClass( "active" );

					if( polite.useProxy() ) {
						polite.update();
						polite.updateProxy();
					}
				})
				.bind( "input keydown", function() {
					polite.updateProxy();
				})
				.bind( "blur", function() {
					polite.update();

					if( polite.useProxy() ){
						$( this ).closest( ".politespace-proxy" ).addClass( "active" );
						polite.updateProxy();
					}
				})
				.bind( "focus", function() {
					$( this ).closest( ".politespace-proxy" ).removeClass( "active" );
					polite.reset();
				})
				.data( componentName, polite );

			polite.update();
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ) {
		var $sel = $( e.target ).is( initSelector ) ? $( e.target ) : $( initSelector, e.target );
		$sel[ componentName ]();
	});

}( jQuery ));

/*! Menu - v0.1.3 - 2016-03-07
* https://github.com/filamentgroup/menu
* Copyright (c) 2016 Scott Jehl; Licensed MIT */
/*! Menu - v0.1.3 - 2016-03-07
* https://github.com/filamentgroup/menu
* Copyright (c) 2016 Scott Jehl; Licensed MIT */
window.jQuery = window.jQuery || window.shoestring;

(function( $, w ) {
	"use strict";

	var componentName = "Menu",
		at = {
			ariaHidden: "aria-hidden"
		},
		selectClass = "menu-selected",
		focusables = "a,input,[tabindex]";

	var menu = function( element ){
		if( !element ){
			throw new Error( "Element required to initialize object" );
		}

		this.element = element;
		this.$element = $( element );
		this.opened = true;
	};

	menu.prototype.fill = function( items, selectedText ) {
		var html = "";

		$.each( items, function( i, item ){
			html += "<li" +
				( item === selectedText ? " class='" + selectClass + "'" : "" ) +
				">" + item + "</li>";
		});

		this.$element.find( "ol,ul" ).html( html );
	};

	menu.prototype.moveSelected = function( placement, focus ){
		var $items = this.$element.find( "li" ),
			$selected = $items.filter( "." + selectClass ),
			$nextSelected,
			topOffset,
			listElementHeight;

		if( !$selected.length || placement === "start" ){
			$nextSelected = $items.eq( 0 );
		}
		else if( placement === "next" ){
			$nextSelected = $selected.next();
			if( !$nextSelected.length ){
				$nextSelected = $items.eq( 0 );
			}
		}
		else {
			$nextSelected = $selected.prev();
			if( !$nextSelected.length ){
				$nextSelected = $items.eq( $items.length - 1 );
			}
		}
		$selected.removeClass( selectClass );
		$nextSelected.addClass( selectClass );

		// if the menu has overflow, make sure the menu item is shown.
		if( $nextSelected.length && "scrollIntoView" in $nextSelected[ 0 ] ) {
			topOffset = $nextSelected.offset().top;
			listElementHeight = $nextSelected.height();

			// only scroll into view if selected list element is not visible
			if( topOffset + listElementHeight > this.$element.height() ||
				topOffset < this.$element.find( "ol,ul" ).get(0).scrollTop ) {
				$nextSelected[ 0 ].scrollIntoView();
			}
		}

		if( focus || $( w.document.activeElement ).closest( $selected ).length ){
			if( $nextSelected.is( focusables ) ){
				$nextSelected[ 0 ].focus();
			}
			else{
				var $focusChild = $nextSelected.find( focusables );
				if( $focusChild.length ){
					$focusChild[ 0 ].focus();
				}
			}
		}
	};

	menu.prototype.getSelectedElement = function(){
		return this.$element.find( "li." + selectClass );
	};

	menu.prototype.selectActive = function(){
		var trigger = this.$element.data( componentName + "-trigger" );
		var $selected = this.getSelectedElement();

		if( trigger && $( trigger ).is( "input" ) ){
			trigger.value = $selected.text();
		}
		$selected.trigger( componentName + ":select" );
		this.close();
		return $selected.text();
	};

	menu.prototype.keycodes = {
		38 : function(e) {
			this.moveSelected( "prev" );
			e.preventDefault();
		},

		40 : function(e){
			this.moveSelected( "next" );
			e.preventDefault();
		},

		13 : function(){
			// return the selected value
			return this.selectActive();
		},

		9 : function(e){
			this.moveSelected( e.shiftKey ? "prev" : "next" );
			e.preventDefault();
		},

		27 : function(){
			this.close();
		}
	};

	menu.prototype.keyDown = function( e ){
		var fn = this.keycodes[e.keyCode] || function(){};
		return fn.call( this, e );
	};

	menu.prototype._bindKeyHandling = function(){
		var self = this;
		this.$element
			.bind( "keydown", function( e ){
				self.keyDown( e );
			} )
			.bind( "mouseover", function( e ){
				self.$element.find( "." + selectClass ).removeClass( selectClass );
				$( e.target ).closest( "li" ).addClass( selectClass );
			})
			.bind( "mouseleave", function( e ){
				$( e.target ).closest( "li" ).removeClass( selectClass );
			})
			.bind( "click", function(){
				self.selectActive();
			});
	};

	menu.prototype.open = function( trigger, sendFocus ){
		if( this.opened ){
			return;
		}

		this.$element.attr( at.ariaHidden, false );

		this.$element.data( componentName + "-trigger", trigger );
		this.opened = true;
		this.moveSelected( "start", sendFocus );
		this.$element.trigger( componentName + ":open" );
	};

	menu.prototype.close = function(){
		if( !this.opened ){
			return;
		}
		this.$element.attr( at.ariaHidden, true );
		this.opened = false;
		var $trigger = this.$element.data( componentName + "-trigger" );
		if( $trigger ){
			$trigger.focus();
		}
		this.$element.trigger( componentName + ":close" );
	};

	menu.prototype.toggle = function( trigger, sendFocus ){
		this[ this.opened ? "close" : "open" ]( trigger, sendFocus );
	};

	menu.prototype.init = function(){
		// prevent re-init
		if( this.$element.data( componentName + "-data") ) {
			return;
		}
		this.$element.data( componentName + "-data", this );

		this.$element.attr( "role", "menu" );
		this.close();
		var self = this;

		// close on any click, even on the menu
		$( document ).bind( "mouseup", function(){
			self.close();
		});

		this._bindKeyHandling();

		this.$element.trigger( componentName + ":init" );

		$( "body" ).bind( "Menu:open", function(event){
			self.mutex(event);
		});
	};

	menu.prototype.isOpen = function(){
		return this.opened;
	};

	menu.prototype.mutex = function( event ){
		if( this.element !== event.target ){
			this.close();
		}
	};

	(w.componentNamespace = w.componentNamespace || w)[ componentName ] = menu;
}( jQuery, this ));

/*! auto-complete - v0.2.1 - 2015-06-23
* https://github.com/filamentgroup/auto-complete
* Copyright (c) 2015 John Bender  The Filament Group;  Licensed MIT */
(function( w, $ ){
  "use strict";

  var name = "autocomplete";

  w.componentNamespace = w.componentNamespace || {};

  $.proxy = $.proxy || function(fn, context) {
    return function() {
      return fn.apply(context, arguments);
    };
  };

  var AutoComplete = function( element, menu ){
    // assign element for method events
    this.$element = this.$input = $( element );

    if( this.$input.data("autocomplete-component") ){
      return;
    }

    this.menu = menu;
    this.ignoreKeycodes = [];

    // TODO it might be better to push this into the constructor of the menu to
    //      reduce dependency on the structure of the menu's keybinding reresentation
    for( var key in menu.keycodes ) {
      this.ignoreKeycodes.push( parseInt( key, 10 ) );
    }

    this.url = this.$element.attr( "data-autocomplete" );

    this.$input.data( "autocomplete-component", this );
    this.$input.attr( "autocomplete", "off" );

    // TODO move to options object
    this.isFiltered = !this.$input.is( "[data-unfiltered]" );
    this.isCaseSensitive = this.$input.is( "[data-case-sensitive]" );
    this.isBestMatch = this.$input.is( "[data-best-match]" );
    this.isEmptyNoMatch = this.$input.is( "[data-empty-no-match]" );

    this.$form = this.$input.parents( "form" );

    this._requestId = 0;

    this.matches = [];
  };

  w.componentNamespace.AutoComplete = AutoComplete;

  AutoComplete.preventSubmitTimeout = 200;

  AutoComplete.prototype.blur = function() {
    // use the best match when there is one
    if( this.isBestMatch && this.matches[0] ){
      this.$input.val( this.matches[0] );
    }

    // empty the field when there are no matches
    if( this.isEmptyNoMatch && !this.matches[0] ){
      this.$input.val("");
    }
  };

  // TODO tightly coupled to the notion of keypresses
  AutoComplete.prototype.navigate = function( event ){
    var value;

    if( this.menu.isOpen() ){
      // Prevent the submit after a keydown for 200ms to avoid submission after hitting
      // enter to select a autocomplete menu item
      this.preventSubmit();
      value = this.menu.keyDown(event);

      if( value ){
        this.val( this.strip(value) );
      }
    }
  };

  AutoComplete.prototype.select = function() {
    this.val( this.strip(this.menu.selectActive() || "") );
  };

  AutoComplete.prototype.filterData = function(data){
    if( !data.length ) {
      return;
    }
    var val = this.val();
    var compare;
    if( !this.isCaseSensitive ) {
      val = val.toLowerCase();
    }
    var filtered = [];
    for( var j = 0, k = data.length; j < k; j++ ) {
      compare = !this.isCaseSensitive ? data[ j ].toLowerCase() : data[ j ];
      if( compare.indexOf( val ) === 0 ) {
        filtered.push( data[ j ] );
      }
    }
    return filtered;
  };

  AutoComplete.prototype.suggest = function( e ){
    if( e && e.keyCode && this.ignoreKeycodes.indexOf(e.keyCode) !== -1 ){
      return;
    }

    // if at any point the suggest is requested with an empty input val
    // stop everything and hide the suggestions.
    if( !this.$input.val() ){
      this.abortFetch();
      this.hideSuggest();
      return;
    }

    this.abortFetch();

    var request = this._requestId += 1;

    this.fetch($.proxy(function( data ) {
      // we have made another request, ignore this one
      if( request !== this._requestId ) {
        return;
      }

      this.render(typeof data === "string" ? JSON.parse(data): data);
    }, this));
  };

  AutoComplete.prototype.abortFetch = function() {
    // invalidate the current request value by incrementing the counter
    this._requestId += 1;

    this.$input.trigger( name + ":aborted" );
  };

  AutoComplete.prototype.fetch = function( success ) {
    $.ajax(this.url, {
      dataType: "json",

      data: {
        q: this.val().toLowerCase()
      },

      success: success
    });
  };

  // TODO this whole method is project specific due to returned json
  //      set this up so that render can be replaced or at least
  //      the data manip can be parameterized
  AutoComplete.prototype.render = function( data ) {
    data = data.location || data;

    this.matches = data;

    if( data.length ) {
      this.menu.fill(this.filterData(data), this.menu.getSelectedElement().text());
      this.showSuggest();
    } else {
      this.hideSuggest();
    }

    this.$input.trigger( name + ":suggested" );
  };

  AutoComplete.prototype.showSuggest = function() {
    this._isSuggestShown = true;
    this.menu.open();
    this.$input.trigger( name + ":shown" );
  };

  AutoComplete.prototype.hideSuggest = function() {
    this._isSuggestShown = false;
    this.menu.close();
    this.$input.trigger( name + ":hidden" );
  };

  // TODO remove
  AutoComplete.prototype.strip = function( string ) {
    return string.replace(/^\s+|\s+$/g, '');
  };

  AutoComplete.prototype.val = function( str ) {
    var value;
    if( str ) {
      value = this.strip(str);
      this.$input.trigger( name + ":set", { value: value } );
      this.$input.val( value );
    } else {
      return this.$input.val();
    }
  };

  AutoComplete.prototype.preventSubmit = function(){
    this.$form.one( "submit.autocomplete", function( event ){
      event.preventDefault();
    });

    clearTimeout(this.preventedSubmitTimeout);

    this.preventedSubmitTimout = setTimeout($.proxy(function() {
      this.$form.off( "submit.autocomplete" );
    }, this), AutoComplete.submitPreventTimeout);
  };
})( this, this.jQuery );

(function( w, $ ){
  "use strict";

  var AutoCompleteDom = function( element, menu ){
    w.componentNamespace.AutoComplete.call( this, element, menu );
    this.$domSource = $( this.$input.attr("data-autocomplete-dom") );
  };

  w.componentNamespace.AutoCompleteDom = AutoCompleteDom;
  $.extend(AutoCompleteDom.prototype, w.componentNamespace.AutoComplete.prototype);

  AutoCompleteDom.prototype.fetch = function( callback ){
    var value = this.$input.val().toLowerCase(), keep = [];

    this.$domSource.children().each($.proxy(function( i, elem ){
      var text = $(elem).text();

      // simple substring match
      if( text.toLowerCase().indexOf( value ) !== -1 ){
        keep.push(this.strip(text));
      }
    }, this));

    callback( keep );
  };
})(this, this.jQuery);

(function( w, $ ){
  "use strict";

  $.fn.autocomplete = function(){
    return this.each(function(){
      var $this, autocomplete, menu, $menu;

      $this = $(this);

      if( $this.data( "autocomplete-component" ) ){
        return;
      }

      $menu = $this.parent().find( "[data-menu]" ).eq( 0 );

      menu = $menu.data( 'Menu-data' );

      if( !menu ) {
        menu = new w.componentNamespace.Menu( $menu[0] );
      }

      if( $this.is("[data-autocomplete]") ){
        autocomplete = new w.componentNamespace.AutoComplete( this, menu );
      } else {
        autocomplete = new w.componentNamespace.AutoCompleteDom( this, menu );

        autocomplete.$domSource.on( "change", function() {
          var $this, text;

          $this = $(this);
          text = $this.find( "[value='" + $this.val() + "']" ).text();
          autocomplete.val( text );
        });
      }

      $this.on( "keyup", $.proxy(autocomplete.suggest, autocomplete) );
      $this.on( "keydown", $.proxy(autocomplete.navigate, autocomplete) );
      $this.on( "blur", $.proxy(autocomplete.blur, autocomplete) );
      menu.$element.on( "mouseup", $.proxy(autocomplete.select, autocomplete) );
      menu.init();
    });
  };

  $( w.document ).on( "enhance", function(){
    $( "[data-autocomplete], [data-autocomplete-dom]" ).autocomplete();
  });
})( this, this.jQuery);

/*used to determine the css height of the help center panel*/
var pageHeight = function(){
    var doc = window.document;
    var docElem = doc.documentElement;
    return Math.max( doc.body.scrollHeight, docElem.scrollHeight, docElem.clientHeight );
};

function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}


(function ($) {
    /* Close notifications, e.g. Recall Quote banner */
    var initRemoveOnce = function () {
        // simple function for hiding an element
        $("[data-remove-once]")
            .filterUnenhanced("remove-once")
            .bind("click", function (e) {
                e.preventDefault();
                var $all = $("." + $(this).attr("data-remove-once"));
                $all.removeClass("notification-active");
                //$all.remove();
            });
    };

    $(document).bind("enhance", initRemoveOnce);

    //Image Picker Top 5
    var imagePickerExpand = function(){
        $(".img-picker-set .show-all-link")
            .bind("click", function (e) {
                e.preventDefault();
                console.log("yo");
                $(".img-picker-set").removeClass("collapsed");
                $(this).parent().parent().attr("style","display:none");
            });
    }

    $(document).bind("enhance", imagePickerExpand);
    //Make this support multiple themes

    var enableThemer = function(){
        var themerBox = '<div class="themer"><h3>&oplus; <span>Pick a Theme</span></h3><div class="choices"></div></div></div>',
            libertyCheckbox = '<label><input type="radio" value="" name="themes"  /> liberty</label>',
            geicoCheckbox = '<label><input type="radio" value="geico" name="themes"  /> geico</label>',
            safecoCheckbox = '<label><input type="radio" value="safeco" name="themes"  /> safeco</label>',
        themerCss = '<link rel="stylesheet" href="../docs/css/themer/themer.css">';

        $(themerCss).appendTo("head");

        $(themerBox)
            .prependTo("body")
            .find(".choices")
            .append(libertyCheckbox)
            .append(geicoCheckbox)
            .append(safecoCheckbox);

        //check the radio matching the current cookie theme
        var currentTheme = getCookie("theme"),
            elem = '.themer [value="'+currentTheme+'"]';
        $(elem).prop("checked",true);

        $(".themer input")
            .bind( "click", function( e ){
                var thisTheme = $(this).val();
                var thisCss = thisTheme != "" && thisTheme != null ? '<link rel="stylesheet" href="../assets/css/themes/'+thisTheme+'/main.css" data-isTheme>': "";
                //remove any others first
                $("link[data-isTheme]").remove();

                if ($(this).is(':checked')) {

                    $(thisCss).appendTo("head");
                    $("body").attr("class",thisTheme);
                    setCookie("theme",thisTheme,10);

                } else {
                    $("body").removeClass(thisTheme);
                    setCookie("theme","",10);
                }
            }
        );
    };

    //$( document ).bind( "enhance", enableThemer );

    var setCurrentThemeByCookie= function(){
        var thisTheme = getCookie("theme");
        if(thisTheme != "" && thisTheme != null){
            var thisCss = '<link rel="stylesheet" href="../assets/css/themes/'+thisTheme+'/main.css" data-isTheme>';
            $(thisCss).appendTo("head");
            $("body").addClass(thisTheme);
        }
    }

    //$( document ).bind( "enhance", setCurrentThemeByCookie );


    var progressiveDisclosureGroup= function() {
        // progressive disclosure group -- unfinished function only opens. works with checkboxes and radios
        $("[data-disclosure-group]") .bind( "click", function( e ){
            var $t = $( this );
            var id = $t.attr( "data-disclosure-group" );
            var $content = $( "#" + id );
           $content.removeClass("hidden");
        });

    }

    $( document ).bind( "enhance", progressiveDisclosureGroup );




}(jQuery));

(function( $, window ){

	/* Form interactions */
	var initForm = function(){

		// simple function for showing "other" option when its paired input is checked
		$( ".opt-other" ).filterUnenhanced( "opt-other" ).each( function(){
			var $other = $( this );
			var $input = $other.parent().find( "input[type=radio], input[type=checkbox]" );
			var $form = $other.closest( "form" );

			$form.bind( "change", function(){
				$other[ $input[0].checked ? "removeClass" : "addClass" ]( "hidden" );
			});			
		});

		// edit/change masked inputs
		$( ".mask-edit" ).filterUnenhanced( "mask-edit" ).each( function(){
			var $btn = $( this );
			var $parent = $btn.closest( ".textinput" );
			var $mask = $parent.find( ".mask-value" );
			var $input = $parent.find( ".mask-input" );
			var hideClass = "hidden";

			$btn.bind( ( window.tappy ? "tap" : "click" ), function( e ){
				$mask.addClass( hideClass );
				$input.removeClass( hideClass );
				e.preventDefault();
			});

		});

		// progressive disclosure -- works with checks, radios, selects
		$( "[data-disclosure-content]" ).filterUnenhanced( "disclosure-content" ).each(function(){
			var $content = $( this );
			var id = $content.attr( "data-disclosure-content" );
			var $t = $( "[data-disclosure="+ id +"]")
			var isReversed = $t.is( "[data-disclosure-reverse]" );

			if ( $t.is( "input" ) ){
				var update = function(){
					$content[ $t[0].checked ? ( isReversed ? "addClass" : "removeClass" ) : ( isReversed ? "removeClass" : "addClass" ) ]( "hidden" );
				};

				update();

				if ( $t.is( "[type=radio]" ) ) {
					$( "input[name='"+ $t.attr( "name" ) +"']" ).bind( "change", function(){
						update();
					});
				}
				else {
					$t.bind( "change", function(){
						update();					
					});
				}
			}

			/* select */
			if( $t.is( "option" ) ) {
				var $select = $t.closest( "select" );

				$select.bind( "change", function(){
					var selected = $( $select[0].options[ $select[0].selectedIndex ] );

					if ( $t.is( $select[0].options[ $select[0].selectedIndex ] ) ) {
						$content.removeClass( "hidden" );
					}
					else {
						$content.addClass( "hidden" );
					}			
				});
			};
		});


		$( "[data-disable-question]" ).filterUnenhanced( "disable-question" ).each(function(){
			var $t = $( this );
			var id = $t.attr( "data-disable-question" );
			var $content = $( "#" + id );

			if( $t.is( "input" ) ) {
				$t.closest( "form" ).bind( "change", function(){				
					var checked = false;
					var $fields = $content.find( ".textinput, .select, .check-radio, .checkbox" );
					var $fieldInputs = $content.find( "input, select, textarea" );
					var $disclosure = null;
					var disableClass = "hidden"; /* recommended: disabled */


					$fieldInputs.each( function(){
						if ( $( this ).is( "[data-disclosure]" ) ) {
							$disclosure = $( "#" + $( this ).attr( "data-disclosure" ));
						}
					});

					$( this ).find( "[data-disable-question='" + id + "']" ).each(function() {
						checked = checked || this.checked;
					});

					if ( checked ) {
						$fields.addClass( disableClass );
						$fieldInputs.attr( "disabled", "true" );

						if ( $fieldInputs.is( "input[type=checkbox], input[type=radio]") ) {
							$fieldInputs[0].checked = false;
						}

						if ( $disclosure ) {
							$disclosure.css( "display", "none" );
						}
					}
					else {
						$fields.removeClass( disableClass );
						$fieldInputs.removeAttr( "disabled" );

						if ( $disclosure ) {
							$disclosure.removeAttr( "style" );
						}
					}		
				});
			}		
		});

		// auto-expand textarea height
		$( "textarea" ).bind( "input", function(){
			if( this.scrollHeight > this.clientHeight ){
				$( this ).height( this.scrollHeight + "px" );
			}
		});

	};

	$( document ).bind( "enhance", initForm );

}( shoestring, window ));
(function( $ ) {
	"use strict";

	function QuestionBuilder( e ) {
		var self, $element;
		self = this;
		this.$item = (this.$element = $(e));

		this.$builder = this.$item.closest( ".qbuilder" );
		this.fieldTypes = "input, select, .btn";
		this.$field = this.$item.find( this.fieldTypes ); /* assumes 1 field per question */
		this.$form = this.$item.closest( "form" );
		this.nextId = this.$item.attr( "data-field-enable" );
		this.$nextItem = this.nextId ? $( "#" + this.nextId ) : this.$item.next();
		this.$nextItemField = this.$nextItem.find( this.fieldTypes );

		this.activeClass = "qbuilder_item-active";
		this.completeClass = "qbuilder_item-complete";
		this.disabledClass = "qbuilder_item-disabled";

		this.isText = this.$field.is( "input" );
		this.isSelect = this.$field.is( "select" );
		this.isButton = this.$field.is( ".btn" );
		this.isSentence = this.$builder.is( "[data-sentence]" );

		this.edited = false;

		/* sentence format only */
		if ( this.isSentence ) {
			this.$label = this.$item.find( ".qbuilder_label" );			
			this.$proxy = $( "<div class='qbuilder_proxy'><span></span><i class='icon'></i></div>" );

			/* Any pre-filled/skipped items should appear in completed state */
			this.$builder.find( "[data-field-skip]" ).addClass( this.completeClass );			

			if ( !this.isButton ) {
				this.updateProxy();
				this.$label.append( this.$proxy );
			};

			if ( this.isText ) {
				/* set input width equal to that of the proxy */
				var fieldWidth = parseInt( this.$proxy.css( "width" )) + 8;
				this.$field.attr( "style", "width: " + fieldWidth + "px;" );

				this.$proxy.bind( "click", function(){
					self.$field.trigger( "focus" );						
				});	

				this.$field.bind( "keyup", function( e ){
					var valueLength = self.$field[0].value.length;
					var valueLimit = self.$field.attr( "maxlength" );
					var directionKeys = [ 37, 38, 39, 40 ]; // left, up, right, down
					var noDirectionKeys = directionKeys.indexOf( e.which ) < 0;

					if ( !self.edited && noDirectionKeys && valueLength && valueLength >= valueLimit ) {
						self.$field.trigger( "change" );
					}
				});
			};

			this.$field
				.bind( "focus", function(){
					self.edit();						
				})
				.bind( "blur", function(){
					self.$item.removeClass( self.activeClass );							
				});
		}
		
		/* Add disabled class to disabled fields (all but the first) */
		if ( this.$field.is( "[disabled]" ) ) {
			this.$item.not( ":first-child" ).addClass( this.disabledClass );
		};

		this.$field.bind( "change", function(){
			if ( self.isSentence ) {
				self.updateProxy();
				self.complete();
			}
			self.editNext();
		});
	};

	QuestionBuilder.prototype.updateProxy = function(){
		if ( !this.isButton ) {
			var field = this.$field[0];
			var textvalue = this.isSelect ? $( field.options[ field.selectedIndex ] ).attr( "data-proxy-text" ) || field.value : field.value || this.$field.attr( "placeholder" );

			this.$proxy.find( "span" ).html( textvalue );
		}		
	};

	QuestionBuilder.prototype.editNext = function(){
		if ( this.$nextItem.length > 0 ) {
			var isSkipped = this.$nextItem.is( "[data-field-skip]" );
			var $nextQuestion = this.$nextItem;
			var nextField = this.$nextItemField[0];

			if ( isSkipped ) {
				var $skippedQuestion = this.$nextItem;
				$nextQuestion = $( "#" + $skippedQuestion.attr( "data-field-enable" ) );
				nextField = $nextQuestion.find( this.fieldTypes )[0];
				$skippedQuestion.addClass( this.completeClass ).removeClass( this.disabledClass );
			}			

			/* move focus to next incomplete field */
			if ( !$nextQuestion.is( "." + this.completeClass ) ){
				$nextQuestion.addClass( this.activeClass ).removeClass( this.disabledClass );
				this.$nextItemField.removeAttr( "disabled" );
				nextField.focus();
			}			
		}		
	};

	QuestionBuilder.prototype.edit = function(){
		this.$item.addClass( this.activeClass );
	};

	QuestionBuilder.prototype.complete = function(){
		this.edited = true;
		this.$item.addClass( this.completeClass ).removeClass( this.activeClass );
	};

	$( document ).bind( "enhance", function( e ) {
		$( "[data-field-enable]" ).each(function( i, e ){
			$(e).data( "field-enable", new QuestionBuilder(e));
		});

		/* Focus the first field in the first builder on the page */
		var $allInputs = $( "input, select" );

		for ( var i = 0; i < $allInputs.length; i++ ) {
			if ( $allInputs[ i ].closest( ".qbuilder") ) {
				$allInputs[ i ].focus();
				break;
			}
		}		
	});
}( shoestring ));
(function( $ ){

	/* Help panel in masthead */
	var initHelp = function(){
		var $helpPanel = $( "#help-center" );
		var closeBtnClass = "help-center-close";
		var panelClass = "panel-open";

		function openPanel( e ){
			e.preventDefault();
			$helpPanel.addClass( panelClass )
				.css("min-height",pageHeight()+"px");

		}
		function closePanel( e ){
			var $target = $( e.target );
			if( !$target.closest( '.panel-content' ).length ||
				$target.closest( "." + closeBtnClass ).length ) {

				e.preventDefault();
				$helpPanel.removeClass( panelClass )
					.css("min-height","0px");
			}
		}

		$( '.icon-help-center, .qps-opt-help' )
			.filterUnenhanced( "help-center" )
			.bind( "tap", openPanel );

		$helpPanel
			.filterUnenhanced( "help-center" )
			.bind( "click", closePanel )
			.find( "." + closeBtnClass ).bind( "tap", closePanel );
	};

	$( document ).bind( "enhance", initHelp );


}( shoestring ));
(function( $ ){

	var initImgPicker = function(){
		// simple functions for toggling img descriptions and adding counts

		$( ".img-picker-set" )
			.filterUnenhanced( "img-picker-set" )
			.each( function( e ){

			var $set = $( this );
			var $toggle = $set.find( ".img-picker-toggle" );
			var $tallies = $set.find( ".picker-count" );
			var $totals = $set.find( ".picker-total" );
			var $form = $set.closest( "form" );
			var hideClass = "hide-desc";
			var hideText = "Hide descriptions";
			var showText = "Show descriptions";

			$toggle.bind( ( window.tappy ? "tap" : "click" ), function( e ){
				if ( $set.is( "." + hideClass ) ) {
					$set.removeClass( hideClass );
					$toggle.html( hideText );
				}
				else {
					$set.addClass( hideClass );
					$toggle.html( showText );
				}
				e.preventDefault();
			});

			$form.bind( "change", function(){
				var $inputs = $set.find( "input[type=checkbox], input[type=radio]");
				var checks = 0;

				$inputs.each( function(){
					if ( $( this )[0].checked ) { checks++; }
				});

				$tallies.html( checks.toString() );
				$totals.html( $inputs.length.toString() );
			});

			
			
		});
	};

	$( document ).bind( "enhance", initImgPicker );


}( shoestring ));
(function( $ ){

	/* Help panel in masthead */
	var initExpandAll = function(){
		// simple function for expanding all collapsibles in a group
		$( "[data-expand-all]" )
			.filterUnenhanced( "expand-all" )
			.bind( "click", function( e ){
				e.preventDefault();
				var $all = $( "." + $( this ).attr( "data-expand-all" ) );
				$all.addClass( "collapsible-expand-all" );
				$( this ).remove();
			});
	};

	$( document ).bind( "enhance", initExpandAll );


}( shoestring ));
/*global shoestring*/
(function( $, window ){
	"use strict";

	var document = window.document;

	/* Prototype code: Show related coverages affected when another coverage is edited. */
	var initEditCoverage = function(){
		$( ".impact-coverage" )
			.filterUnenhanced( "impact-coverage" )
			.each(function() {

			var $relInput = $( this );
			var $form = $relInput.closest( "form" );
			var $related = $form.find( ".related-coverage" );
			var $origChkInput = $form.find( "input:checked" );
			var $textInput = $form.find( "input[type=text]", "input[type=number]" );

			var showSubmitBtns = function(checked){
				var values = checked[0].value.split( "-" ),
					perPerson = values[0],
					perAccident = values[1],
					link = $( ".edit-qps-btn" ),
					linkElement, href;

				if( link.length === 0 ){ return; }

				linkElement = link[0];

				href = linkElement.pathname + "?recalc" + "&" +
					"perPerson=" + perPerson + "&" +
					"perAccident=" + perAccident;

				$( ".edit-qps-cancel" ).html( "Cancel" );
				$( ".edit-qps-btn.hidden" ).removeClass( "hidden" ).addClass( "hidden-placeholder" );
				link.attr( "href", href );
			};

			var hideSubmitBtns = function(){
				$( ".edit-qps-cancel" ).html( "<i class='icon icon-arrow-left'></i>Back" );
				$( ".hidden-placeholder" ).addClass( "hidden" );
			};

			$form.bind( "change", function(){
				// When the form is changed, "Back" becomes "Cancel", and the Update and Continue buttons appear
				var checked = $( this ).find( "input:checked" );
				if ( !$origChkInput[0].checked ) {
					showSubmitBtns(checked);
				} else {
					hideSubmitBtns();
				}

				// No longer needed, using disclosure instead:
				// If input with impacted coverages is selected, show impacted (related) coverages
				/*if ( $related ) {
					$related[ $relInput[0].checked ? "removeClass" : "addClass" ]( "related-hidden" );
				}*/
			});
		});
	};

	$( document ).bind( "enhance", initEditCoverage );

}( shoestring, this ));
/*global jQuery:true*/
(function($, window){
	"use strict";

	var NumericInput = function( el ){
		this.el = el;
		this.$el = $( el );
		this.allowFloat = this.$el.is( '[data-float]' );

		var ua, isFirefoxDesktop;
		ua = navigator.userAgent.toLowerCase();

		// Issue #267 and #521
		// https://github.com/filamentgroup/lm-esales/issues/267
		// https://github.com/filamentgroup/lm-esales/issues/521
		// The goal is to target Firefox on Mac OS, Windows, and Linux (desktop)
		// UA ref from MDN for Firefox:
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Gecko_user_agent_string_reference
		// NOTE if they make one for windows mobile it may match "Windonws"
		isFirefoxDesktop = /windows|macintosh|linux/.test(ua) && /firefox/.test(ua);

		if( isFirefoxDesktop ){
			if( this.$el.attr( "type" ) === "number" ) {
				this.$el.attr( "type", "text" );
			}
		}

		// if maxLength isn't defined on `$el` then `parseInt` will return
		// `NaN` which is falsey meaning there is no max length. The max length
		// is then `Infinity`.
		this.maxLength = parseInt(this.$el.attr( "maxlength" ), 10) || Infinity;
		this.$el.on( "keypress", $.proxy(this.onKeypress, this));
	};

	NumericInput.allowedKeys = [
		"Tab",
		"Enter",
		"Escape",
		"Backspace",
		"ArrowRight",
		"ArrowLeft",
		"."
	];

	NumericInput.prototype.onKeypress = function( event ){
		var prevented = false;

		// The key pressed is allowed, no exceptions
		// modifier keys and keys listed in allowedKeys property
		if( this.isKeyAllowed( event ) ){
			return;
		}

		if (event.key !== undefined) {
			var key = event.key;
			// handle anything that's not a number
			prevented = isNaN(parseInt(key, 10));
		} else if (event.keyCode !== undefined) {
			var code = event.keyCode;
			// allow '.', return
			// disallow anything less than 48 or greater than 57
			prevented = (code < 48 || code > 57) &&
				code !== 13 &&
				( !this.allowFloat || code !== 46 );

			if( this.allowFloat && code === 46 && this.el.value.length && this.el.value.indexOf( '.' ) > -1 ) {
				prevented = true;
			}
		}


		// Suppress "double action" if event prevented
		//
		// Kill keypress if the max length has been exceeded and the text
		// in the field isn't selected.
		//
		// Note that numeric inputs are not included in the types that
		// support the `maxlength` attribute. `max` support is failing in
		// our testing
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
		// (see `maxlength`)
		/*if((this.isMaxLengthExceeded() && !this.isInputTextSelected()) || prevented) {
			event.preventDefault();
		}*/
	};

	NumericInput.prototype.isKeyAllowed = function( event ) {
		var isAllowed = false, key = event.key;

		// indexOf not supported everywhere for arrays
		$.each(NumericInput.allowedKeys, function(i, e){
			if( e === key ) { isAllowed = true;	 }
		});

		return event.altKey || event.ctrlKey || event.metaKey || isAllowed;
	};

	NumericInput.prototype.isMaxLengthExceeded = function() {
		return this.maxLength && this.$el.val().length >= this.maxLength;
	};

	NumericInput.prototype.isInputTextSelected = function() {
		var selectionText;

		// if most browsers
		// else if ie8 or lower
		if (window.getSelection) {
			selectionText = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			selectionText = document.selection.createRange().text;
		}

		return selectionText ? this.$el.val().indexOf(selectionText) > -1 : false;
	};

	window.NumericInput = NumericInput;
}(jQuery, this));

/*global jQuery:true*/
/*global NumericInput:true*/
/*
 * Create a numeric input that actually works
 *
 * Copyright (c) 2015 Filament Group, Inc.
 * Licensed under MIT
 */
(function( $, NumericInput, window ) {
	"use strict";

	var document = window.document;

	var pluginName = "numeric-input",
			initSelector = "[data-" + pluginName + "]";

	$.fn[ pluginName ] = function(){
		return this.each(function(){
			var input = new NumericInput( this );
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target ).filterUnenhanced( pluginName )[ pluginName ]();
	});

}( jQuery, NumericInput, this ));

/*global jQuery:true*/
/*global NumericInput:true*/
/*
 * Create maked input toggle that works with polite space
 *
 * Copyright (c) 2015 Filament Group, Inc.
 * Licensed under MIT
 */
(function( $, window ) {
	"use strict";

	function MaskedInput( e ) {
		var self, $element;

		self = this;
		$element = (this.$element = $(e));
		this.selector = this.$element.attr( "data-toggle-mask" );
		this.$selectedElement = $( this.selector );


		this.$element.on("click", function(){ self.mask(); });
		this.$element.prop( "checked", false );
		this.mask();
	}

	MaskedInput.prototype.mask = function(){
		var type, newType;

		type = this.$selectedElement.attr( "type" );

		if( this.$element.prop( "checked") ){
			newType = this.$selectedElement.attr( "data-toggle-type" ) || "text";
			this.$selectedElement.attr( "type", newType );

			// make sure politespace knows that the type has changed
			this.$selectedElement.trigger( "politespace-show-proxy" );
		} else {
			this.$selectedElement.attr( "data-toggle-type", type );
			this.$selectedElement.attr( "type", "password" );

			// make sure politespace knows that the type has changed
			this.$selectedElement.trigger( "politespace-hide-proxy" );
		}

	};

	$( document ).bind( "enhance", function( e ) {
		$( "[data-toggle-mask]" ).each(function( i, e ){
			$(e).data( "masked-input", new MaskedInput(e));
		});
	});
}( jQuery, this ));

/*global jQuery:true*/
(function($, window){
	"use strict";

	var btnChecked = "btn-action";

	var RadioButton = function( el ){
		this.el = el;
		this.$el = $( el );
		this.$input = this.$el.find( "input" );		
	};

	RadioButton.prototype.updateState = function(){
		$( "input[type=radio]", $( this ) ).each(function(){
			if( this.checked ){
				$( this ).parent().addClass( btnChecked );
			}
			else {
				$( this ).parent().removeClass( btnChecked );
			}
		});
	};

	RadioButton.prototype.bindEvents = function(){
		this.$el.on( "click", this.updateState );

		var $self = this.$el;
		this.$input.on( "focus", function(){
			$self.addClass( "focus" );
		});
		this.$input.on( "blur", function(){
			$self.removeClass( "focus" );
		});
	};

	RadioButton.prototype.init = function(){
		this.bindEvents();
	};

	window.RadioButton = RadioButton;
}(jQuery, this));

/*global jQuery:true*/
/*global RadioButton:true*/
/*
 * Create a numeric input that actually works
 *
 * Copyright (c) 2015 Filament Group, Inc.
 * Licensed under MIT
 */
(function( $, RadioButton, window ) {
	"use strict";

	var document = window.document;

	var pluginName = "radio-button",
			initSelector = ".check-radio-set.button";

	$.fn[ pluginName ] = function(){
		return this.each(function(){
			var input = new RadioButton( this );
			input.init();
		});
	};

	// auto-init on enhance (which is called on domready)
	$( document ).bind( "enhance", function( e ){
		$( initSelector, e.target ).filterUnenhanced( pluginName )[ pluginName ]();
	});

}( jQuery, RadioButton, this ));

(function( $, window ){

	/* Edit/remove confirmation */
	var initConfirmation = function(){

		function untabbable( $container ) {
			$container.find( ".btn" ).attr( "tabindex", "-1" );
		}

		function tabbable( $container ) {
			$container.find( ".btn" ).removeAttr( "tabindex" );
		}

		$( ".resource-delete" ).filterUnenhanced( "resource-delete" ).each(function(){
			var $del = $( this );
			var $resource = $del.closest( ".resource" );
			var $header = $resource.find( ".resource-header" );
			var $panel = $resource.find( ".resource-edit-confirm" );

			untabbable( $panel );

			var $confirm = $panel.find( ".resource-remove" );
			var $cancel = $panel.find( ".resource-edit-cancel" );
			var hideResourceClass = "hidden";
			var hidePanelClass = "hidden";

			$del.bind( ( window.tappy ? "tap" : "click" ), function(){
				$panel.removeClass( hidePanelClass );
				tabbable( $panel );
			});

			$cancel.bind( ( window.tappy ? "tap" : "click" ), function(){
				$panel.addClass( hidePanelClass );
				untabbable( $panel );
			});

			$confirm.bind( ( window.tappy ? "tap" : "click" ), function(){
				var $siblingsToHide = $header.add( $header.next().filter( ".resource-form" ) );

				var $resource = $header.closest( ".resource" );
				var $ajaxLink = $resource.closest( ".resources" ).find( "[data-ajax-example]" );
				var $children = $resource.children().filter( ".resource-header,.resource-form" );
				var noOtherSiblings = $children.length === $siblingsToHide.length;

				if( noOtherSiblings ) {
					$resource.remove();
				} else {
					$siblingsToHide.remove();
				}

				$ajaxLink.removeClass( "stop-ajax" );
			});
		});
		
	};

	$( document ).bind( "enhance", initConfirmation );

}( shoestring, this ));
/*global shoestring*/
(function( $, window ){
	"use strict";

	var document = window.document;

	/* Prototype code: Demonstrate how page animation flow should appear */
	var initPageAnim = function(){
		var $loader = $( "#ajax-loader" );

		$( "[data-ajax-example]" ).filterUnenhanced( "ajax-example" ).each(function() {
			var $trigger = $( this );
			var nextUrl = $trigger.attr( "href" );
			var target = $trigger.attr( "data-ajax-example-target" );
			var $content = target ? $trigger.closest( target ) : $trigger.parent();
			var $target;
			var isAfter = $trigger.is( "[data-ajax-example-after]" );
			var isBefore = $trigger.is( "[data-ajax-example-before]" );
			var txOut = "anim-fade-out";
			var txIn = "anim-fade-in";

			var loadContent = function(){
				$.get( nextUrl, function( data ){
					if( isBefore ) {
						$content.prev().replaceWith( data );
						$target = $content.prev();
					} else if( isAfter ) {
						$content.next().replaceWith( data );
						$target = $content.next();
					} else {
						$target = $content.html( data );
					}

					$target.removeClass( txOut )
						.addClass( txIn )
						.trigger( "enhance" );
				});
			};

			$trigger.bind( ( window.tappy ? "tap" : "click" ), function( e ){
				
				if ( !$trigger.is( ".stop-ajax" ) ) {
					var $placeholder = $( "<div></div>" )
						.css( "position", "relative" )
						.html( $loader.html() );

					$placeholder
						.find( ".loading-container" )
						.css( "top", "2px" );

					if( isAfter ) {
						$content.after( $placeholder );
					} else if( isBefore ) {
						$content.before( $placeholder );
					} else {
						// scroll up to make sure content appears at the top of the page
						window.scrollTo(0,0);

						// fade out content
						$content.addClass( txOut );
					}

					// make sure it only happens once
					$trigger.addClass( "stop-ajax" );

					setTimeout( loadContent, 250 );
				};

			});
		});
	};

	$( document ).bind( "enhance", initPageAnim );

}( shoestring, this ));
/* collapsible extension for making hover menus that click-through on click (data-collapsible-hover=exclusive attr) */
(function( $ ){

	var collapsibleSelectProxy = function(){

		var pluginName = "collapsible";
		var prefix = "custom_select";
		var attr = "data-" + pluginName + "-selectproxy";
		var activeClass = prefix + "-active";

		$( "[" + attr + "]." + pluginName )
			.filterUnenhanced( prefix )
			.each(function(){
				var $cs = $( this );
				var $link = $cs.find( "." + prefix + "_link" );
				var $header = $cs.find( "." + prefix + "_title" );
				var $select = $( "select[id=" + $cs.attr( attr ) + "]" );

				// set header text to inital value link's text
				var selected = $select[0].options[ $select[0].selectedIndex ].value;
				$cs.find( "[data-value=" + selected + "]" );
				$header.html( $( "[data-value=" + selected + "]" ).html() );

				$cs.bind( "click", function( e ){
					$( "." + activeClass ).removeClass( activeClass );
					$( this ).closest( "." + prefix ).addClass( activeClass );

					if ( $( e.target ).is( $link ) || $( e.target ).parent().is( $link ) ){
						var $a = $( e.target ).closest( $link );
						$header.html( $a.html() );
						$select.val( $a.attr( "data-value" ) );

						// trigger change on the option that was selected
						$select.find("option").each(function(i, e){
							var $opt = $(e);

							if( $opt.val() == $a.attr( "data-value" ) ) {
								e.selected = true;
								$opt.trigger("change");
							}
						});


						$cs.data( pluginName ).collapse();
						e.preventDefault();
					}
				});
			});
	};

	$( document ).bind( "enhance", collapsibleSelectProxy );

}( shoestring ));

/* collapsible extension for making hover menus that click-through on click (data-collapsible-hover=exclusive attr) */
(function( $ ){

	var initSelect = function(){

		var attr = "data-custom-style";
		var prefix = "styled_select";
		
		$( "select["+ attr +"]" )
			.filterUnenhanced( prefix )
			.each(function(){
				var $s = $( this );
				var $proxy = $( "<div class='"+prefix+"_proxy' aria-hidden='true'><span></span><i class='icon icon-arrow-solid-down'></i></div>" );

				var updateSelect = function(){
					var selected = $s[0].options[ $s[0].selectedIndex ].value;
					$proxy.find( "span" ).html( selected );
				};

				$s.addClass( prefix ).after( $proxy );
				updateSelect();

				$s.bind( "change", function(){
					updateSelect();
				});
			});
	};

	$( document ).bind( "enhance", initSelect );

}( shoestring ));

(function( $, w ){

	var initPod = function(){

		/* Details: Swap out primary submit button when user has LM auto policy */
		$( "#auto-ins-lm" ).closest( "form" ).bind( "change", function(){
			var lmCheck = $( "#auto-ins-lm" );
			var quoteBtns = $( "#quote-submit" );
			var esvcBtns = $( "#eservice-account" );
			var hideClass = "hidden";

			if ( lmCheck[0].checked ) {
				quoteBtns.addClass( hideClass );
				esvcBtns.removeClass( hideClass );
			}
			else {
				esvcBtns.addClass( hideClass );
				quoteBtns.removeClass( hideClass );
			}
		});

		/* Show edit panels on wide QPS */
		$( "[data-open-editpanel]" ).each(function(){
			var $q = $( this );
			var $panel = $( "#" + $q.attr( "data-open-editpanel" ) );
			var $panelBox = $panel.closest( ".qps-editpanel-group" )
			var $btn = $q.find( ".qps-edit-policy" );
			var $slider = $q.find( ".slider" );
			var $closeBtn = $panel.find( ".panel-close" );
			var openClass = "qps-editpanel-open";

			/* For positioning: */
			var doc = w.document;
			var docElem = doc.documentElement;
			var body = doc.body;
			var scroll;

			$btn.bind( "click", function( e ){
				/* close all other panels */
				$( "." + openClass).removeClass( openClass );
				
				/* set new min-height on the panel so it fills the container */
				var containerHeight = $('.qps-policy-coverage')[0].clientHeight;
				$panel.attr("style", "min-height: " + containerHeight + "px;");

				/* open the panel */
				$panel.addClass( openClass );

				/* scroll up if needed, and only when the panels are abs positioned within the white box ($panelBox = static positioned) */
				scroll = "pageYOffset" in w ? w.pageYOffset : ( docElem.scrollY || docElem.scrollTop || ( body && body.scrollY ) || 0 );
				if ( scroll > 150 && $panelBox.css( "position" ) == "static" ) {
					w.scrollTo( 0, 150 );
				}

				e.preventDefault();
			});

			$slider.bind( "click", function( e ){
				$( "." + openClass).removeClass( openClass );
				$panel.addClass( openClass );
				e.preventDefault();
			});

			$closeBtn.bind ( "click", function( e ){
				$panel.removeClass( openClass );
				if ( scroll > 150 ) {
					w.scrollTo( 0, scroll );
				}
				e.preventDefault();
			});
		});

		/* Add plm to read-only sliders */
		$( ".slider-read-only" ).each(function(){
			var $inputGroup = $( this ).find( "input[type=radio]");
			var plmIndex;
			var $pips = $( this ).find( ".noUi-marker-large" );

			for ( var i = 0; i < $inputGroup.length; i++ ) {
				if ( $( $inputGroup[ i ] ).is( "[data-slider-plm]" ) ) {
					plmIndex = i;
					break;
				}
			};

			$( $pips[ plmIndex ] ).addClass( "slider-plm" );
		});

		/* View all info - wide QPS */
		$( "[data-view-all]" ).each(function(){			
			var $link = $( this );
			var containerClass = $link.attr( "data-view-all-contain" );
			var $contain = containerClass ? $link.closest( "." + containerClass ) : $( ".page" );
			var showClass = $link.attr( "data-view-all" );
			var isToggle = $link.is( "[data-view-all-toggle]" );

			if ( isToggle ) {
				var origLinkText = $link.html();
				var linkText = $link.attr( "data-view-all-toggle" );
			}

			$link.bind( "click", function( e ){
				if ( !$contain.is( "." + showClass ) ) {
					$contain.addClass( showClass );
					if ( isToggle ) $link.html( linkText );
				}
				else if ( isToggle && $contain.is( "." + showClass ) ){
					$contain.removeClass( showClass );
					$link.html( origLinkText );
				}

				e.preventDefault();
			});
		});
	};

	$( document ).bind( "enhance", initPod );

}( shoestring, window ));

grunticon(["/css/grunticon/icons.data.svg.css", "/css/grunticon/icons.data.png.css", "/css/grunticon/icons.fallback.css"], grunticon.svgLoadedCallback );

(function( $ ){

	/* Help panel in masthead */
	var initPurchaseBtn = function(){
		// simple function for expanding all collapsibles in a group
		$( ".qps-opt-btn-toggle" )
			.bind( "click", function( e ){
				e.preventDefault();
				$( this ).addClass( "hidden" );
				$( '.qps-opt-phone' ).removeClass( "hidden" );
			});
	};

	$( document ).bind( "enhance", initPurchaseBtn );

	/* Help panel in masthead */
	var initPurchaseBtnAlt = function(){
		// simple function for expanding all collapsibles in a group
		$( ".qps-opt-btn-toggle" )
			.bind( "click", function( e ){
				e.preventDefault();
				$( this ).addClass( "hidden" );
				$( '.qps-qq-phone' ).removeClass( "hidden" );
			});
	};

	$( document ).bind( "enhance", initPurchaseBtnAlt );


}( shoestring ));

(function( $ ){

	$( "html" ).addClass( "enhanced" );

	function getEnhancedAttribute( key ) {
		return "data-enhanced" + ( key ? "-" + key : "" );
	}

	$.fn.filterUnenhanced = function( key ) {
		return this.filter( function() {
				return !$( this ). is( "[" + getEnhancedAttribute( key ) + "]" );
			})
			// mark enhanced
			.attr( getEnhancedAttribute( key ), "" );
	};

	$(function(){
		$(document).trigger( "enhance" );
	});

}( jQuery ) );