//switcher
/////////////////////////////////////////////
//DELETE FOLLOWING CODE TO DISABLE SWITCHER//
/////////////////////////////////////////////
jQuery(document).ready(function(){

	window.patternClasses = [];

	var deleteAllCookiesHTML = '';
	if (jQuery.cookie) {
	if(!jQuery.isEmptyObject( jQuery.cookie() )) {
		deleteAllCookiesHTML = '<span class="fa fa-trash-o" data-toggle="tooltip" data-placement="top" title="Clear All Styles (Page will be reloaded)"></span>';
	}
	}

	var switcherHTML = '<div id="switcher">';
		switcherHTML +=    '<div class="color_switcher_header">';
		switcherHTML +=    		'<span class="fa fa-cog"></span>';
		switcherHTML +=    		deleteAllCookiesHTML;
		switcherHTML +=    '<h4>Styles Selector</h4></div>';
		switcherHTML +=    '<div id="switcher_accent_color">';
		switcherHTML +=    		'<p>Accent color:</p>';
		switcherHTML +=    		'<ul id="switcher-colors" class="list-inline">';
		switcherHTML +=        		'<li>';
		switcherHTML +=            		'<a href="#" data-color="" class="color1"></a>';
		switcherHTML +=        		'</li>';
		switcherHTML +=        		'<li>';
		switcherHTML +=            		'<a href="#" data-color="2" class="color2"></a>';
		switcherHTML +=        		'</li>';
		switcherHTML +=        		'<li>';
		switcherHTML +=            		'<a href="#" data-color="3" class="color3"></a>';
		switcherHTML +=        		'</li>';
		switcherHTML +=    		'</ul>';
		switcherHTML +=    	'</div>';

		/*

		switcherHTML +=    '<div id="switcher_color_scheme">';
		switcherHTML +=    		'<p>Color scheme:</p>';
		switcherHTML +=    		'<ul id="switcher-version" class="list-inline">';
		switcherHTML +=        		'<li class="active">';
		switcherHTML +=            		'<a href="#" class="light">Light</a>';
		switcherHTML +=        		'</li>';
		switcherHTML +=        		'<li>';
		switcherHTML +=            		'<a href="#" class="dark">Dark</a>';
		switcherHTML +=        		'</li>';
		switcherHTML +=    		'</ul>';
		switcherHTML +=    '</div>';
			*/
		

		switcherHTML +=    		'</ul>';



		switcherHTML +=    '</div>';
		switcherHTML +='</div>';

		jQuery('body').append(switcherHTML);

		//switcher toggle
		jQuery('#switcher span[class="fa fa-cog"]').on('click', function(){
			jQuery('#switcher').toggleClass('active');
		});
		jQuery('body').on('click', function( e ) {
			if ( !jQuery(e.target).closest('#switcher').length ) {
				jQuery('#switcher').removeClass('active');
			}
		});

		//switcher reset all styles
		jQuery('#switcher span[class="fa fa-trash-o"]').on('click', function(){
			cookieClass.deleteAllCookies();
		});


		//boxed or wide
		jQuery('#layout').on('click', {patterns: patternClasses}, switcherClass.switchBoxedWide);

		//boxed with top and bottom margins (enable only whet "boxed" is active)
		jQuery('#boxed_margin').find("input").on('change', switcherClass.switchBoxedMargins);

		//pattern switcher
		jQuery('#switcher-patterns a').on('click', {patterns: patternClasses}, function( e ) {
			switcherClass.switchPatterns( e, jQuery(this).data('pattern'));
		});

		//color switcher
		jQuery('#switcher-colors a').on('click', switcherClass.switchColorScheme);

		//version switcher
		jQuery('#switcher-version a').on('click', switcherClass.switchDarkLight);


		//if cookie set - changing color scheme
		if (cookieClass.returnTrueOrFalseCookie('colorScheme')) {
			jQuery('#switcher-colors a[data-color="' + cookieClass.getCookieValue('colorScheme') + '"]').trigger('click');
		}


		//if cookie set - changing to dark version
		if (cookieClass.returnTrueOrFalseCookie('dark')) {
			cookieClass.toggleTrueOrFalseCookie('dark');
			jQuery('#switcher-version .dark').trigger('click');
		}


		//if cookies set - changing layout
		if (cookieClass.returnTrueOrFalseCookie('boxed')) {
			if (cookieClass.returnTrueOrFalseCookie('topBottomMargins')) {
				var topBottomMarginsCookie = cookieClass.getCookieValue('topBottomMargins');
			}
			if (cookieClass.returnTrueOrFalseCookie('pattern')) {
				var patternCookie = cookieClass.getCookieValue('pattern');
			}
			switcherClass.switchBoxedWide();
			cookieClass.toggleTrueOrFalseCookie("boxed");
			jQuery('#layout').prop('checked', true);

			if (topBottomMarginsCookie) {
				jQuery('#boxed_margin').find('input').prop('checked', true).trigger('change');
			}
			if (patternCookie) {
				jQuery('#switcher-patterns').find('a[data-pattern="' + patternCookie + '"]').trigger('click');
			}

		}
	});

	var cookieClass = {
	deleteAllCookies: function () {
		if (jQuery.cookie) {
			jQuery.each(jQuery.cookie(), function(key, value) {
				jQuery.removeCookie(key);
				location.reload();
			});
		} else {
			return false;
		}
	},
	deleteCookie: function (cookieName) {
		if (jQuery.cookie) {
			jQuery.removeCookie(cookieName);
		} else {
			return false;
		}
	},
	setCookieValue: function (cookieName, cookieValue) {
		if (jQuery.cookie) {
			jQuery.cookie(cookieName, cookieValue);
		} else {
			return false;
		}
	},
	getCookieValue: function (cookieName) {
		if (jQuery.cookie) {
			return jQuery.cookie(cookieName);
		} else {
			return false;
		}
	},
	toggleTrueOrFalseCookie: function(cookieName) {
		if (jQuery.cookie) {
			if(!jQuery.cookie(cookieName) || jQuery.cookie(cookieName) == '0') {
				jQuery.cookie(cookieName, '1');
				return true;

			} else {
				jQuery.cookie(cookieName, '0');
				return true;
			}
		} else {
			return false;
		}

	},
	returnTrueOrFalseCookie: function( cookieName ) {
		if (jQuery.cookie) {
			cookieName = jQuery.cookie( cookieName );
			switch ( cookieName ) {
				case '0':
					return false;
					break;
				case 0:
					return false;
					break;
				case false:
					return false;
					break;
				case undefined:
					return false;
					break;
				case null:
					return false;
					break;
				default:
					return true;
					break;
			}
		} else {
			return false;
		}
	},
	setCookieToFalse: function(cookieName) {
		if (jQuery.cookie) {
				jQuery.cookie(cookieName, '0');
		} else {
			return false;
		}

	}
	}

	var switcherClass = {
	switchBoxedWide : function  ( e ) {
		//wide boxed changing
		jQuery("#boxed_margin").toggleClass("hidden").find("input").prop("checked", false);
		jQuery(".for-toggle").toggleClass("hidden");
		jQuery("#canvas").toggleClass("boxed").removeClass(patternClasses.join(' '));;
		jQuery("#box_wrapper").toggleClass("container").removeClass('top-bottom-margins');
		jQuery(".page_header_wrapper").attr('style', '');
		if (jQuery().isotope) {
			var $isotopeContainers = jQuery('.isotope-wrapper');
			if ($isotopeContainers.length) {
				jQuery(".isotope-wrapper").isotope("reLayout");
			}
		}
		jQuery(window).trigger("resize");
		cookieClass.toggleTrueOrFalseCookie("boxed");
		cookieClass.setCookieToFalse("topBottomMargins");
		cookieClass.setCookieToFalse("pattern");

	},
	switchBoxedMargins : function  ( e ) {
		if(jQuery('#layout').prop('checked')) {
			jQuery('#box_wrapper').toggleClass('top-bottom-margins');
			cookieClass.toggleTrueOrFalseCookie('topBottomMargins');
		}
	},
	switchPatterns: function  ( e, newPattern ) {
		e.preventDefault();
		e.stopPropagation();
		jQuery('#canvas').removeClass(e.data.patterns.join(' '));
		jQuery('#canvas').addClass(newPattern);
		cookieClass.setCookieValue('pattern', newPattern);
	},

	switchColorScheme: function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		var color = jQuery(this).data('color');
		jQuery('.color-switcher-link').each(function(){
			var $thisLink = jQuery(this);
			var newHref = $thisLink.attr('href').replace(/[1-9]*(\.css)/, color + '.css');
			$thisLink.attr('href', newHref);
		});
		cookieClass.setCookieValue('colorScheme', color);
	},

	switchDarkLight: function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		if (jQuery(this).parent().hasClass("active")) {
			return;
		}
		jQuery("#switcher-version").find("li").toggleClass("active");

		jQuery("#box_wrapper > *").each(function() {
			//sections to ignore light-dark switch
			var $thisSection = jQuery(this);
			// if (
			// 	   $thisSection.hasClass('page_header_side')
			// 	|| $thisSection.hasClass('page_header_wrapper')
			// 	|| $thisSection.hasClass('page_topline')
			// 	|| $thisSection.hasClass('page_footer')
			// 	|| $thisSection.hasClass('page_subscribe')
			// 	|| $thisSection.hasClass('page_partners_carousel')
			// 	|| $thisSection.hasClass('page_title')
			// 	|| $thisSection.hasClass('page_copyright')
			// 	|| $thisSection.hasClass('page_slider')
			// 	|| $thisSection.hasClass("gradient")
			// 	|| $thisSection.hasClass("cs")
			// 	|| ($thisSection.attr("id") == "featured")
			// ) {
			// 	return;
			// }
			//skip parallax section
			if($thisSection.hasClass('s-parallax')) {
				return;
			}

			if($thisSection.hasClass("ls")) {
				$thisSection.toggleClass("ls ds");
			} else if($thisSection.hasClass("ds")) {
				$thisSection.toggleClass("ds ls");
			}


		});
		jQuery(".page_header, .page_header_wrapper").each(function() {
			//sections to ignore light-dark switch
			var $thisHeader = jQuery(this);
			if (
				//for dashboard
				$thisHeader.hasClass('header_darkblue')
			) {
				return;
			}
			if($thisHeader.hasClass("header_white")) {
				$thisHeader.toggleClass("header_white header_darkgrey");
			} else if($thisHeader.hasClass("header_darkgrey")) {
				$thisHeader.toggleClass("header_white header_darkgrey");
			}
		});

		cookieClass.toggleTrueOrFalseCookie('dark');
	}
}