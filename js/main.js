"use strict";
//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function($){

var $body = $('body');
var $window = $(window);

//hidding menu elements that do not fit in menu width
//processing center logo
function menuHideExtraElements() {
    
    //cleaneng changed elements
    $('.sf-more-li, .sf-logo-li').remove();
    var windowWidth = $('body').innerWidth();
    
    $('.sf-menu').each(function(){
        var $thisMenu = $(this);
        var $menuWraper = $thisMenu.closest('.top-nav');
        $menuWraper.attr('style', '');
        if (windowWidth > 1199) {
            //grab all main menu first level items 
            var $menuLis = $menuWraper.find('.sf-menu > li');
            $menuLis.removeClass('sf-xl-hidden');

            var $headerLogoCenter = $thisMenu.closest('.header_logo_center');
            var logoWidth = 0;
            var summaryLiWidth = 0;
            
            if ( $headerLogoCenter.length ) {
                var $logo = $headerLogoCenter.find('.logo');
                // 30/2 - left and right margins
                logoWidth = $logo.outerWidth(true) + 70;
            }

            // var wrapperWidth = $('.sf-menu').width();
            var wrapperWidth = $menuWraper.outerWidth(true);
            $menuLis.each(function(index) {
                //4 - 4px additional width for inline-block LI element
                var elementWidth = $(this).outerWidth() +4;
                summaryLiWidth += elementWidth;
                if(summaryLiWidth >= (wrapperWidth-logoWidth)) {
                    var $newLi = $('<li class="sf-more-li"><a>...</a><ul></ul></li>');
                    $($menuLis[index - 1 ]).before($newLi);
                    var newLiWidth = $($newLi).outerWidth(true);
                    var $extraLiElements = $menuLis.filter(':gt('+ ( index - 2 ) +')');
                    $extraLiElements.clone().appendTo($newLi.find('ul'));
                    $extraLiElements.addClass('sf-xl-hidden');
                    return false;
                }
            });

            //processing center logo
            if ( $headerLogoCenter.length ) {
                var $menuLisVisible = $headerLogoCenter.find('.sf-menu > li:not(.sf-xl-hidden)');
                var menuLength = $menuLisVisible.length;
                var summaryLiVisibleWidth = 0;
                $menuLisVisible.each(function(){
                    summaryLiVisibleWidth += $(this).outerWidth();
                });

                var centerLi = Math.floor( menuLength / 2 );
                if ( (menuLength % 2 === 0) ) {
                    centerLi--;
                }
                var $liLeftFromLogo = $menuLisVisible.eq(centerLi);
                $liLeftFromLogo.after('<li class="sf-logo-li"><a href="#">&nbsp;</a></li>');
                $headerLogoCenter.find('.sf-logo-li').width(logoWidth);
                var liLeftRightDotX = $liLeftFromLogo.offset().left + $liLeftFromLogo.outerWidth();
                var logoLeftDotX = windowWidth/2 - logoWidth/2;
                var menuLeftOffset = liLeftRightDotX - logoLeftDotX;
                $menuWraper.css({'left': -menuLeftOffset})
            }
            
        }// > 991
    }); //sf-menu each
} //menuHideExtraElements

function initMegaMenu(timeOut) {
    var $megaMenu = $('.top-nav .mega-menu');
    if($megaMenu.length) {
        setTimeout(function () {

            var windowWidth = $('body').innerWidth();
            if (windowWidth > 991) {
                $megaMenu.each(function(){
                    var $thisMegaMenu = $(this);
                    //temporary showing mega menu to proper size calc
                    $thisMegaMenu.css({'display': 'block', 'left': 'auto'});

                    //checking for sticked side header
                    var stickedSideHeaderWidth = 0;
                    var $stickedSideHeader = $('.header_side_sticked');
                    if($stickedSideHeader.length && $stickedSideHeader.hasClass('active-slide-side-header')) {
                        stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
                        if($stickedSideHeader.hasClass('header_side_right')) {
                            stickedSideHeaderWidth = -stickedSideHeaderWidth;
                        }
                        windowWidth = windowWidth - stickedSideHeaderWidth;
                    }
                    var thisWidth = $thisMegaMenu.outerWidth();
                    var thisOffset = $thisMegaMenu.offset().left - stickedSideHeaderWidth;
                    var thisLeft = (thisOffset + (thisWidth/2)) - windowWidth/2;
                    $thisMegaMenu.css({'left' : -thisLeft, 'display': 'none'});
                    if(!$thisMegaMenu.closest('ul').hasClass('nav')) {
                        $thisMegaMenu.css('left', '');
                    }
                });
            }
        }, timeOut);

    }
}

//NOTE: affixed sidebar works bad with side headers
function initAffixSidebar() {
    var $affixAside = $('.affix-aside');
    if ($affixAside.length) {

            $window = $(window);
        
            //on stick and unstick event
            $affixAside.on('affix.bs.affix', function(e) {
                var affixWidth = $affixAside.width() - 1;
                var affixLeft = $affixAside.offset().left;
                $affixAside
                    .width(affixWidth)
                    .css("left", affixLeft);

            }).on('affix-bottom.bs.affix', function(e) {
                var affixWidth = $affixAside.width() - 1;
                //if sticked left header
                var stickedSideHeaderWidth = 0;
                var $stickedSideHeader = $('.header_side_sticked');
                if($stickedSideHeader.length && $stickedSideHeader.hasClass('active-slide-side-header') && !$stickedSideHeader.hasClass('header_side_right')) {
                    stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
                }
                var affixLeft = $affixAside.offset().left - stickedSideHeaderWidth - $('#box_wrapper').offset().left;;

                $affixAside
                    .width(affixWidth)
                    .css("left", affixLeft);
            }).on('affix-top.bs.affix', function(e) {
                $affixAside.css({"width": "", "left": ""});
            });

            //counting offset
            var offsetTopAdd = 10;
            var offsetBottomAdd = 150;
            var offsetTop = $affixAside.offset().top - $('.page_header').height();
            //note that page_footer and page_copyright sections must exists - else this will cause error in last jQuery versions
            var offsetBottom = $('.page_footer').outerHeight(true) + $('.page_copyright').outerHeight(true);

            $affixAside.affix({
                offset: {
                    top: offsetTop - offsetTopAdd,
                    bottom: offsetBottom + offsetBottomAdd
                },
            });

            $window.on('resize', function() {
                //returning sidebar in top position if it is sticked because of unexpected behavior
                $affixAside.removeClass("affix affix-bottom").addClass("affix-top").trigger('affix-top.bs.affix');

                var offsetTopSectionsArray = [
                    '.page_topline',
                    '.page_toplogo',
                    '.page_header',
                    '.page_title',
                    '.blog_slider',
                    '.blog-featured-posts'
                ];
                var offsetTop = 0;

                offsetTopSectionsArray.map(function (val) {
                    offsetTop += $(val).outerHeight(true) || 0;
                });
                //note that page_footer and page_copyright sections must exists - else this will cause error in last jQuery versions
                var offsetBottom = $('.page_footer').outerHeight(true)
                                + $('.page_copyright').outerHeight(true);

                $affixAside.data('bs.affix').options.offset.top = offsetTop - offsetTopAdd;
                $affixAside.data('bs.affix').options.offset.bottom = offsetBottom + offsetBottomAdd;
                
                $affixAside.affix('checkPosition');

            });

            $affixAside.affix('checkPosition');

    }//eof checking of affix sidebar existing
}

//photoSwipe gallery plugin
function initPhotoSwipe() {
    if(typeof PhotoSwipe !== 'undefined') {

        //adding prettyPhoto for backward compatibility. Deprecated.
        //will leave only .photoswipe-link later
        var gallerySelectors = '.photoswipe-link, a[data-gal^="prettyPhoto"], [data-thumb] a';
        var $galleryLinks = $(gallerySelectors);
        if ($galleryLinks.length) {

            //adding photoswipe gallery markup
            if (!($('.pswp').length)) {
                $body.append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><a class="pswp__button pswp__button--close" title="Close (Esc)"></a><a class="pswp__button pswp__button--share" title="Share"></a><a class="pswp__button pswp__button--fs" title="Toggle fullscreen"></a><a class="pswp__button pswp__button--zoom" title="Zoom in/out"></a><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><a class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></a><a class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></a><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
            //if function already was called - return (all listeners was setted and .pswp gallery container was added)
            } else {
                return;
            }
            //adding prettyPhoto for backward compatibility. Deprecated.
            $('body').on('click', gallerySelectors, function (e) {
                e.preventDefault();

                var $link = $(this);
                var $linksParentContainer = $link.closest('.photoswipe-container, .isotope-wrapper, .owl-carousel, .flickr_ul, .images');
                var $links = $linksParentContainer.find(gallerySelectors);
                //for cloned owl-carousel items - continue to prevent duplicating - moved to EACH loop
                //start index does not work with owl-carousel loop enabled
                // if ($linksParentContainer.is('.owl-carousel')) {
                //  $links = $links.filter(function (index) {
                //      return !($(this).closest('.cloned').length);
                //  });
                // }
                //if no container only adding this link
                if(!$links.length) {
                    $links.push($link);
                }
                var items = [];
                var options = {
                    bgOpacity       : 0.7,
                    showHideOpacity : true,
                    history: false,
                    shareEl: false,
                    //data index is set in owl carousel init
                    index: $link.data('index') ? $link.data('index') : 0
                };
                var gallery = $('.pswp')[0];
                //building items array
                $links.each(function (i) {
                    var $this = $(this);
                    //if cloned element (owl or flexslider thumbs) - continue
                    if ($this.closest('.clone, .cloned').length) {
                        return;
                    }
                    //TODO think about hide items that are not showing after filtering and renew indexes for them
                    // if ($linksParentContainer.hasClass('isotope-wrapper') && !$this.is(':visible')) {
                    //  return;
                    // }
                    var item = {};
                    //if not owl carousel
                    if (($link[0] === $this[0]) && !($link.data('index'))) {
                        //start from 0
                        if($linksParentContainer.hasClass('owl-carousel') || $linksParentContainer.hasClass('images')) {
                            options.index = i-1;
                        } else {
                            options.index = i;
                        }
                    }
                    //video or image
                    if ($this.data('iframe')) {
                        //for wordpress - iframe tag is escaped
                        //item.html = $this.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"');
                        //for html - building iframe manually
                        //autoplay only if 1 iframe in gallery
                        var autoplay = ( $links.length > 1 ) ? '' : '&autoplay=1';
                        item.html = '<div class="embed-responsive embed-responsive-16by9">';
                        // item.html += '<iframe class="embed-responsive-item" src="'+ $(this).data('iframe') + '?rel=0&autoplay=1'+ '"></iframe>';
                        item.html += '<iframe class="embed-responsive-item" src="' + $(this).data('iframe') + '?rel=0' + autoplay + '&enablejsapi=1&api=1"></iframe>';
                        item.html += '</div>';
                    } else {
                        item.src = $this.attr('href');
                        //default values
                        var width = 1170;
                        var height = 780;
                        //template data on A element
                        var data = $this.data();
                        //image data in Woo
                        var dataImage = $this.find('img').first().data();
                        if (data.width) {
                            width = data.width;
                        }
                        if (data.height) {
                            height = data.height;
                        }
                        if(typeof  dataImage !== 'undefined') {
                            if (dataImage.large_image_width) {
                                width = dataImage.large_image_width;
                            }
                            if (dataImage.large_image_height) {
                                height = dataImage.large_image_height;
                            }
                        }
                        item.w = width;
                        item.h = height;
                    }
                    items.push(item);
                });

                var pswpGallery = new PhotoSwipe(gallery, PhotoSwipeUI_Default, items, options);
                pswpGallery.init();

                //pausing video on close and on slide change
                pswpGallery.listen('afterChange', function() {
                    $(pswpGallery.container).find('iframe').each(function() {
                        //"method":"pause" - form Vimeo, other - for YouTube
                        $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                    });
                });
                pswpGallery.listen('close', function() {
                    $(pswpGallery.container).find('iframe').each(function() {
                        //"method":"pause" - form Vimeo, other - for YouTube
                        $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                    });
                });

            });
        }

    }
}

//helper functions to init elements only when they appears in viewport (jQUery.appear plugin)
function initAnimateElement(self, index) {
    var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
    var animationDelay = !self.data('delay') ? 150 : self.data('delay');
    setTimeout(function(){
        self.addClass("animated " + animationClass);
    }, index * animationDelay);
}
function initCounter(self) {
    if (self.hasClass('counted')) {
        return;
    } else {
        self.countTo().addClass('counted');
    }
}
function initProgressbar(el) {
    el.progressbar({
        transition_delay: 300
    });
}
function initChart(el) {
    var data = el.data();
    var size = data.size ? data.size : 270;
    var line = data.line ? data.line : 20;
    var bgcolor = data.bgcolor ? data.bgcolor : '#ffffff';
    var trackcolor = data.trackcolor ? data.trackcolor : '#c14240';
    var speed = data.speed ? data.speed : 3000;

    el.easyPieChart({
        barColor: trackcolor,
        trackColor: bgcolor,
        scaleColor: false,
        scaleLength: false,
        lineCap: 'butt',
        lineWidth: line,
        size: size,
        rotate: 0,
        animate: speed,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });
}

function initGoogleMap() {
        //Google Map script
        var $googleMaps = $('#map, .page_map');
        if ( $googleMaps.length ) {
            $googleMaps.each(function() {
                var $map = $(this);

                var lat;
                var lng;
                var map;

                //map styles. You can grab different styles on https://snazzymaps.com/

                //dark style
                //var styles = [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#c4c4c4"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#707070"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#be2026"},{"lightness":"0"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"hue":"#ff000a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#575757"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"saturation":"-52"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

                // light style
                var styles = [{"featureType": "water","elementType": "geometry","stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 17}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#dedede"},{"lightness": 21}]},{"elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}];

                //markers
                var $markers = $map.find('.marker');

                //map settings
                var address = $markers.first().find('.marker-address').text() ? $markers.first().find('.marker-address').text() : 'london, baker street, 221b';
                var geocoder = new google.maps.Geocoder();


                var draggable = $map.data('draggable') ? $map.data('draggable') : false;
                var scrollwheel = $map.data('scrollwheel') ? $map.data('scrollwheel') : false;

                //type your address after "address="
                geocoder.geocode({
                    address: address
                }, function(data){

                    lat = data[0].geometry.location.lat();
                    lng = data[0].geometry.location.lng();

                    var center = new google.maps.LatLng(lat, lng);
                    var settings = {
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        zoom: 16,
                        draggable: draggable,
                        scrollwheel: scrollwheel,
                        center: center,
                        styles: styles
                    };
                    map = new google.maps.Map($map[0], settings);

                    var infoWindows = [];

                    $($markers).each(function(index) {

                        var $marker = $(this);
                        var markerTitle = $marker.find('.marker-title').text();

                        //building info widnow HTML code
                        var markerDescription = '';
                        markerDescription += markerTitle ? '<h3 class="makret-title">' + markerTitle + '</h3>' : '';
                        markerDescription += $marker.find('.marker-description').html() ? '<div class="marker-description">' + $marker.find('.marker-description').html() + '</div>' : '';
                        if(markerDescription) {
                            markerDescription = '<div class="map_marker_description">' + markerDescription + '</div>';
                        }

                        geocoder.geocode({
                            address: $marker.find('.marker-address').text()
                        }, function(data){
                            var iconSrc = $marker.find('.marker-icon').attr('src');

                            var lat = data[0].geometry.location.lat();
                            var lng = data[0].geometry.location.lng();

                            var center = new google.maps.LatLng(lat, lng);

                            var marker = new google.maps.Marker({
                                position: center,
                                title: markerTitle,
                                map: map,
                                icon: iconSrc
                            });

                            var infowindow = new google.maps.InfoWindow({
                                content: markerDescription
                            });

                            infoWindows.push(infowindow);

                            google.maps.event.addListener(marker, 'click', function() {
                                for (var i=0;i<infoWindows.length;i++) {
                                    infoWindows[i].close();
                                }
                                infowindow.open(map,marker);
                            });
                        });
                    });
                });
            }); //each Google map
        }//google map length
    }
    window.initGoogleMap=initGoogleMap;


//function that initiating template plugins on window.load event
function documentReadyInit() {
    ////////////
    //mainmenu//
    ////////////
    if ($().scrollbar) {
        $('[class*="scrollbar-"]').scrollbar();
    }
    if ($().superfish) {
        $('ul.sf-menu').superfish({
            popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
            delay:       700,
            animation:   {opacity:'show', marginTop: 10},
            animationOut: {opacity: 'hide',  marginTop: 20},
            speed:       200,
            speedOut:    200,
            disableHI:   false,
            cssArrows:   true,
            autoArrows:  true,
            onInit: function () {
                var $thisMenu = $(this);
                $thisMenu.find('.sf-with-ul').after('<span class="sf-menu-item-mobile-toggler"/>');
                $thisMenu.find('.sf-menu-item-mobile-toggler').on('click', function (e) {
                    var $parentLi = $(this).parent();
                    if($parentLi.hasClass('sfHover')) {
                        $parentLi.superfish('hide');
                    } else {
                        $parentLi.superfish('show');
                    }
                });
            }

        });
        $('ul.sf-menu-side').superfish({
            popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
            delay:       500,
            animation:   {opacity:'show', height: 100 +'%'},
            animationOut: {opacity: 'hide',  height: 0},
            speed:       400,
            speedOut:    300,
            disableHI:   false,
            cssArrows:   true,
            autoArrows:  true
        });
    }


    //toggle mobile menu
    $('.page_header .toggle_menu, .page_toplogo .toggle_menu').on('click', function(){
        $(this)
            .toggleClass('mobile-active')
            .closest('.page_header')
            .toggleClass('mobile-active')
            .end()
            .closest('.page_toplogo')
            .next()
            .find('.page_header')
            .toggleClass('mobile-active');
    });

    $('.sf-menu a').on('click', function(){
        var $this = $(this);
        //If this is a local link or item with sumbenu - not toggling menu
        if (($this.hasClass('sf-with-ul')) || !($this.attr('href').charAt(0) === '#')) {
            return;
        }
        $this
            .closest('.page_header')
            .toggleClass('mobile-active')
            .find('.toggle_menu')
            .toggleClass('mobile-active');
    });

    //side header processing
    var $sideHeader = $('.page_header_side');
    // toggle sub-menus visibility on menu-click
    $('ul.menu-click').find('li').each(function(){
        var $thisLi = $(this);
        //toggle submenu only for menu items with submenu
        if ($thisLi.find('ul').length)  {
            $thisLi
                .append('<span class="toggle_submenu color-darkgrey"></span>')
                //adding anchor
                .find('.toggle_submenu, > a')
                .on('click', function(e) {
                    var $thisSpanOrA = $(this);
                    //if this is a link and it is already opened - going to link
                    if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
                        e.preventDefault();
                    }
                    if ($thisSpanOrA.parent().hasClass('active-submenu')) {
                        $thisSpanOrA.parent().removeClass('active-submenu');
                        return;
                    }
                    $thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
                });
        } //eof sumbenu check
    });
    if ($sideHeader.length) {
        $('.toggle_menu_side').on('click', function(){
            var $thisToggler = $(this);
            $thisToggler.toggleClass('active');
            if ($thisToggler.hasClass('header-slide')) {
                $sideHeader.toggleClass('active-slide-side-header');
            } else {
                if($thisToggler.parent().hasClass('header_side_right')) {
                    $body.toggleClass('active-side-header slide-right');
                } else {
                    $body.toggleClass('active-side-header');
                }
                $body.parent().toggleClass('html-active-push-header');
            }
            //fixing mega menu and aside affix on toggling side sticked header
            if($thisToggler.closest('.header_side_sticked').length) {
                initMegaMenu(600);
                var $affixAside = $('.affix-aside');
                if($affixAside.length) {
                    $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({"width": "", "left": ""}).trigger('affix-top.bs.affix');
                    setTimeout(function () {
                        $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({"width": "", "left": ""}).trigger('affix-top.bs.affix');
                    }, 10);
                }
            }
        });
        //hidding side header on click outside header
        $body.on('mousedown touchstart', function( e ) {
            if ( !($(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('header_side_sticked')) ) {
                $sideHeader.removeClass('active-slide-side-header');
                $body.removeClass('active-side-header slide-right');
                $body.parent().removeClass('html-active-push-header');
                var $toggler = $('.toggle_menu_side');
                if(($toggler).hasClass('active')) {
                    $toggler.removeClass('active');
                }
            }
        });
    } //sideHeader check

    //1 and 2/3/4th level offscreen fix
    var MainWindowWidth = $window.width();
    $window.on('resize', function(){
        MainWindowWidth = $(window).width();
    });
    //2/3/4 levels
    $('.top-nav .sf-menu').on('mouseover', 'ul li', function(){
        // $('.mainmenu').on('mouseover', 'ul li', function(){
        if(MainWindowWidth > 991) {
            var $this = $(this);
            // checks if third level menu exist
            var subMenuExist = $this.find('ul').length;
            if( subMenuExist > 0){
                var subMenuWidth = $this.find('ul, div').first().width();
                var subMenuOffset = $this.find('ul, div').first().parent().offset().left + subMenuWidth;
                // if sub menu is off screen, give new position
                if((subMenuOffset + subMenuWidth) > MainWindowWidth){
                    var newSubMenuPosition = subMenuWidth + 0;
                    $this.find('ul, div').first().css({
                        left: -newSubMenuPosition,
                    });
                } else {
                    $this.find('ul, div').first().css({
                        left: '145%',
                    });
                }
            }
        }
        //1st level
    }).on('mouseover', '> li', function(){
        if(MainWindowWidth > 991) {
            var $this = $(this);
            var subMenuExist = $this.find('ul').length;
            if( subMenuExist > 0){
                var subMenuWidth = $this.find('ul').width();
                var subMenuOffset = $this.find('ul').parent().offset().left;
                // if sub menu is off screen, give new position
                if((subMenuOffset + subMenuWidth) > MainWindowWidth){
                    var newSubMenuPosition = MainWindowWidth - (subMenuOffset + subMenuWidth);
                    $this.find('ul').first().css({
                        left: newSubMenuPosition,
                    });
                }
            }
        }
    });

    /////////////////////////////////////////
    //single page localscroll and scrollspy//
    /////////////////////////////////////////
    var navHeight = $('.page_header').outerHeight(true);
    //if sidebar nav exists - binding to it. Else - to main horizontal nav
    if ($('.mainmenu_side_wrapper').length) {
        $body.scrollspy({
            target: '.mainmenu_side_wrapper',
            offset: navHeight
        });
    } else if ($('.top-nav').length) {
        $body.scrollspy({
            target: '.top-nav',
            offset: navHeight
        })
    }
    if ($().localScroll) {
        $('.top-nav > ul, .mainmenu_side_wrapper > ul, #land,  .comments-link').localScroll({
            duration:900,
            easing:'easeInOutQuart',
            offset: -navHeight+40
        });
    }

    //background image teaser and sections with half image bg
    //put this before prettyPhoto init because image may be wrapped in prettyPhoto link
    $(".bg_teaser, .cover-image").each(function(){
        var $element = $(this);
        var $image = $element.find("img").first();
        if (!$image.length) {
            $image = $element.parent().find("img").first();
        }
        if (!$image.length) {
            return;
        }
        var imagePath = $image.attr("src");
        $element.css("background-image", "url(" + imagePath + ")");
        var $imageParent = $image.parent();
        //if image inside link - adding this link, removing gallery to preserve duplicating gallery items
        if ($imageParent.is('a')) {
            $element.prepend($image.parent().clone().html(''));
            $imageParent.attr('data-gal', '');
        }
    });

    //video images preview - from WP
    $('.embed-placeholder').each(function(){
        $(this).on('click', function(e) {
            var $thisLink = $(this);
            // if prettyPhoto popup with YouTube - return
            if ($thisLink.attr('data-gal')) {
                return;
            }
            e.preventDefault();
            if ($thisLink.attr('href') === '' || $thisLink.attr('href') === '#') {
                $thisLink.replaceWith($thisLink.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"')).trigger('click');
            } else {
                $thisLink.replaceWith('<iframe class="embed-responsive-item" src="'+ $thisLink.attr('href') + '?rel=0&autoplay=1'+ '"></iframe>');
            }
        });
    });

    //toTop
    if ($().UItoTop) {
        $().UItoTop({ easingType: 'easeInOutQuart' });
    }

    //parallax
    if ($().parallax) {
        $('.s-parallax').parallax("50%", 0.01);
    }

    //prettyPhoto
    if ($().prettyPhoto) {
        $("a[data-gal^='prettyPhoto']").prettyPhoto({
            hook: 'data-gal',
            theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
        });
    }
    initPhotoSwipe();

    ////////////////////////////////////////
    //init Bootstrap JS components//
    ////////////////////////////////////////
    //adding .form-control class for search widgets
    $('[type="search"]').addClass('form-control');


    //bootstrap carousel
    if ($().carousel) {
        $('.carousel').carousel();
    }
    //bootstrap tab - show first tab
    $('.nav-tabs').each(function() {
        $(this).find('a').first().tab('show');
    });
    //video in bootstrap tabs
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var iframe = $(e.relatedTarget.hash).find('iframe');
        var src = iframe.attr('src');
        iframe.attr('src', '');
        iframe.attr('src', src);
    });

    $('.tab-content').each(function() {
        $(this).find('.tab-pane').first().addClass('fade in');
    });
    //bootstrap collapse - show first tab
    $('.panel-group').each(function() {
        $(this).find('a').first().filter('.collapsed').trigger('click');
    });
    //tooltip
    if ($().tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    //comingsoon counter
    if ($().countdown) {
        var $counter = $('#comingsoon-countdown');
        //today date plus month for demo purpose
        var date = ($counter.data('date') !== 'undefined') ? $counter.data('date') : false;
        if(date) {
            date = new Date(date);
        } else {
            date = new Date();
            date.setMonth(date.getMonth()+1);
        }
        $counter.countdown({until: date});
    }

    /////////////////////////////////////////////////
    //PHP widgets - contact form, search, MailChimp//
    /////////////////////////////////////////////////

    //contact form processing
    $('form.contact-form').on('submit', function( e ){
        e.preventDefault();
        var $form = $(this);
        $($form).find('.contact-form-respond').remove();

        //checking on empty values
        $($form).find('[aria-required="true"], [required]').each(function(index) {
            var $thisRequired = $(this);
            if (!$thisRequired.val().length) {
                $thisRequired
                    .addClass('invalid')
                    .on('focus', function(){
                        $thisRequired
                            .removeClass('invalid');
                    });
            }
        });
        //if one of form fields is empty - exit
        if ($form.find('[aria-required="true"], [required]').hasClass('invalid')) {
            return;
        }

        //sending form data to PHP server if fields are not empty
        var request = $form.serialize();
        var ajax = jQuery.post( "contact-form.php", request )
            .done(function( data ) {
                $($form).find('[type="submit"]').attr('disabled', false).parent().append('<div class="contact-form-respond color-main mt-20">'+data+'</div>');
                //cleaning form
                var $formErrors = $form.find('.form-errors');
                if ( !$formErrors.length ) {
                    $form[0].reset();
                }
            })
            .fail(function( data ) {
                $($form).find('[type="submit"]').attr('disabled', false).blur().parent().append('<div class="contact-form-respond color-main mt-20">Mail cannot be sent. You need PHP server to send mail.</div>');
            })
    });


    //search modal
    $(".search_modal_button").on('click', function(e){
        e.preventDefault();
        $('#search_modal').modal('show').find('input').first().focus();
    });
    //search form processing - not need in WP
    $('form.searchform, form.search-form').on('submit', function( e ){

        e.preventDefault();
        var $form = $(this);
        var $searchModal = $('#search_modal');
        $searchModal.find('div.searchform-respond').remove();

        //checking on empty values
        $($form).find('[type="text"], [type="search"]').each(function(index) {
            var $thisField = $(this);
            if (!$thisField.val().length) {
                $thisField
                    .addClass('invalid')
                    .on('focus', function(){
                        $thisField.removeClass('invalid')
                    });
            }
        });
        //if one of form fields is empty - exit
        if ($form.find('[type="text"]').hasClass('invalid')) {
            return;
        }

        $searchModal.modal('show');
        //sending form data to PHP server if fields are not empty
        var request = $form.serialize();
        var ajax = jQuery.post( "search.php", request )
            .done(function( data ) {
                $searchModal.append('<div class="searchform-respond">'+data+'</div>');
            })
            .fail(function( data ) {
                $searchModal.append('<div class="searchform-respond">Search cannot be done. You need PHP server to search.</div>');

            })
    });

    //MailChimp subscribe form processing
    $('.signup').on('submit', function( e ) {
        e.preventDefault();
        var $form = $(this);
        // update user interface
        $form.find('.response').html('Adding email address...');
        // Prepare query string and send AJAX request
        jQuery.ajax({
            url: 'mailchimp/store-address.php',
            data: 'ajax=true&email=' + escape($form.find('.mailchimp_email').val()),
            success: function(msg) {
                $form.find('.response').html(msg);
            }
        });
    });

    //twitter
    if ($().tweet) {
        $('.twitter').tweet({
            modpath: "./twitter/",
            count: 2,
            avatar_size: 48,
            loading_text: 'loading twitter feed...',
            join_text: 'auto',
            username: 'michaeljackson',
            template: "{avatar}<div class=\"tweet_right\">{join}<span class=\"tweet_text links-maincolor\">{tweet_text}</span>{time}</div>"
        });
    }

    // init timetable
    var $timetable = $('#timetable');
    if ($timetable.length) {
        // bind filter click
        $('#timetable_filter').on( 'click', 'a', function( e ) {
            e.preventDefault();
            e.stopPropagation();
            var $thisA = $(this);
            if ( $thisA.hasClass('selected') ) {
                // return false;
                return;
            }
            var selector = $thisA.attr('data-filter');
            $timetable
                .find('tbody td')
                .removeClass('current')
                .end()
                .find(selector)
                .closest('td')
                .addClass('current');
            $thisA.closest('ul').find('a').removeClass('selected');
            $thisA.addClass('selected');
        });
    }

}

//function that initiating template plugins on window.load event
function windowLoadInit() {
    //////////////
    //flexslider//
    //////////////
    if ($().flexslider) {
        var $introSlider = $(".page_slider .flexslider");
        $introSlider.each(function(index){
            var $currentSlider = $(this);
            var data = $currentSlider.data();
            var nav = (data.nav !== 'undefined') ? data.nav : true;
            var dots = (data.dots !== 'undefined') ? data.dots : true;
            var speed = (data.speed !== 'undefined') ? data.speed : 7000;

            $currentSlider.flexslider({
                animation: "fade",
                pauseOnHover: true, 
                useCSS: true,
                controlNav: dots,   
                directionNav: nav,
                prevText: "",
                nextText: "",
                smoothHeight: false,
                slideshowSpeed:speed,
                animationSpeed:600,
                start: function( slider ) {
                    slider.find('.intro_layers').children().css({'visibility': 'hidden'});
                    slider.find('.flex-active-slide .intro_layers').children().each(function(index){
                        var self = $(this);
                        var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                        setTimeout(function(){
                            self.addClass("animated "+animationClass);
                        }, index*250);
                    });
                },
                after :function( slider ){
                    slider.find('.flex-active-slide .intro_layers').children().each(function(index){
                        var self = $(this);
                        var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                        setTimeout(function(){
                            self.addClass("animated "+animationClass);
                        }, index*250);
                    });
                },
                end :function( slider ){
                    slider.find('.intro_layers').children().each(function() {
                        var self = $(this);
                        var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                        self.removeClass('animated ' + animationClass).css({'visibility': 'hidden'});
                            // $(this).attr('class', '');
                    });
                },

            })
            //wrapping nav with container - uncomment if need
            // .find('.flex-control-nav')
            // .wrap('<div class="container nav-container"/>')
        }); //.page_slider flex slider

        $(".flexslider").each(function(index){
            var $currentSlider = $(this);
            //exit if intro slider already activated 
            if ($currentSlider.find('.flex-active-slide').length) {
                return;
            }
            $currentSlider.flexslider({
                animation: "fade",
                useCSS: true,
                controlNav: true,   
                directionNav: false,
                prevText: "",
                nextText: "",
                smoothHeight: false,
                slideshowSpeed:5000,
                animationSpeed:800,
            })
        });
    }

    ////////////////
    //owl carousel//
    ////////////////
    if ($().owlCarousel) {
        $('.owl-carousel').each(function() {
            var $carousel = $(this);
            $carousel.find('> *').each(function (i) {
                $(this).attr('data-index', i);
            });
            var data = $carousel.data();

            var loop = data.loop ? data.loop : false,
                margin = (data.margin || data.margin === 0) ? data.margin : 30,
                nav = data.nav ? data.nav : false,
                navPrev = data.navPrev ? data.navPrev : '<i class="ico-back">',
                navNext = data.navNext ? data.navNext : '<i class="ico-next">',
                dots = data.dots ? data.dots : false,
                themeClass = data.themeclass ? data.themeclass : 'owl-theme',
                center = data.center ? data.center : false,
                items = data.items ? data.items : 4,
                autoplay = data.autoplay ? data.autoplay : false,
                responsiveXs = data.responsiveXs ? data.responsiveXs : 1,
                responsiveSm = data.responsiveSm ? data.responsiveSm : 2,
                responsiveMd = data.responsiveMd ? data.responsiveMd : 3,
                responsiveLg = data.responsiveLg ? data.responsiveLg : 4,
                draggable = (data.draggable === false) ? data.draggable : true,
                syncedClass = (data.syncedClass) ? data.syncedClass : false,
                filters = data.filters ? data.filters : false;

            if (filters) {
                $carousel.after($carousel.clone().addClass('owl-carousel-filter-cloned'));
                $(filters).on('click', 'a', function( e ) {
                    //processing filter link
                    e.preventDefault();
                    if ($(this).hasClass('selected')) {
                        return;
                    }
                    var filterValue = $( this ).attr('data-filter');
                    $(this).siblings().removeClass('selected active');
                    $(this).addClass('selected active');
                    
                    //removing old items
                    for (var i = $carousel.find('.owl-item').length - 1; i >= 0; i--) {
                        $carousel.trigger('remove.owl.carousel', [1]);
                    };

                    //adding new items
                    var $filteredItems = $($carousel.next().find(' > ' +filterValue).clone());
                    $filteredItems.each(function() {
                        $carousel.trigger('add.owl.carousel', $(this));
                        $(this).addClass('scaleAppear');
                    });
                    
                    $carousel.trigger('refresh.owl.carousel');

                    //reinit prettyPhoto in filtered OWL carousel
                    if ($().prettyPhoto) {
                        $carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
                            hook: 'data-gal',
                            theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
                        });
                    }
                });
                
            } //filters

            $carousel.owlCarousel({
                loop: loop,
                margin: margin,
                nav: nav,
                autoplay: autoplay,
                dots: dots,
                themeClass: themeClass,
                center: center,
                navText: [navPrev,navNext],
                mouseDrag: draggable,
                touchDrag: draggable,
                items: items,
                responsive: {
                    0:{
                        items: responsiveXs
                    },
                    767:{
                        items: responsiveSm
                    },
                    992:{
                        items: responsiveMd
                    },
                    1200:{
                        items: responsiveLg
                    }
                },
            })
            .addClass(themeClass);
            if(center) {
                $carousel.addClass('owl-center');
            }

            $window.on('resize', function() {
                $carousel.trigger('refresh.owl.carousel');
            });

            //topline two synced carousels
            if($carousel.hasClass('owl-news-slider-items') && syncedClass) {
                $carousel.on('changed.owl.carousel', function(e) {
                    var indexTo = loop ? e.item.index+1 : e.item.index;
                    $(syncedClass).trigger('to.owl.carousel', [indexTo]);
                })
            }


        });


    } //eof owl-carousel

    ////////////////////
    //header processing/
    ////////////////////
    //stick header to top
    //wrap header with div for smooth sticking
    var $header = $('.page_header').first();
    var boxed = $header.closest('.boxed').length;
    var headerSticked = $('.header_side_sticked').length;
    if ($header.length) {
        //hiding main menu 1st levele elements that do not fit width
        menuHideExtraElements();
        //mega menu
        initMegaMenu(1);
        //wrap header for smooth stick and unstick
        var headerHeight = $header.outerHeight();
        $header.wrap('<div class="page_header_wrapper"></div>');
        var $headerWrapper = $('.page_header_wrapper');
        if (!boxed) {
            $headerWrapper.css({height: headerHeight});
        }

        //headerWrapper background - same as header
        if( $header.hasClass('ls') ) {
            $headerWrapper.addClass('ls');
            if ( $header.hasClass('ms') ) {
                $headerWrapper.addClass('ms');
            }
        } else if ( $header.hasClass('ds') ) {
            $headerWrapper.addClass('ds');
            if ( $header.hasClass('bs') ) {
                $headerWrapper.addClass('bs');
            }
            if ( $header.hasClass('ms') ) {
                $headerWrapper.addClass('ms');
            }

        } else if ( $header.hasClass('cs') ) {
            $headerWrapper.addClass('cs');
            if ( $header.hasClass('cs2') ) {
                $headerWrapper.addClass('cs2');
            }
            if ( $header.hasClass('cs3') ) {
                $headerWrapper.addClass('cs3');
            }
        } else if ( $header.hasClass('gradient-background') ) {
            $headerWrapper.addClass('gradient-background');
        }

        //get offset
        var headerOffset = 0;
        //check for sticked template headers
        if (!boxed && !($headerWrapper.css('position') === 'fixed')) {
            headerOffset = $header.offset().top;
        }

        //for boxed layout - show or hide main menu elements if width has been changed on affix
        $header.on('affixed-top.bs.affix affixed.bs.affix affixed-bottom.bs.affix', function ( e ) {
            if( $header.hasClass('affix-top') ) {
                $headerWrapper.removeClass('affix-wrapper affix-bottom-wrapper').addClass('affix-top-wrapper');
                //cs to ls when affixed
                // if($header.hasClass('cs')) {
                //  $header.removeClass('ls');
                // }
            } else if ( $header.hasClass('affix') ) {
                $headerWrapper.removeClass('affix-top-wrapper affix-bottom-wrapper').addClass('affix-wrapper');
                //cs to ls when affixed
                // if($header.hasClass('cs')) {
                //  $header.addClass('ls');
                // }
            } else if ( $header.hasClass('affix-bottom') ) {
                $headerWrapper.removeClass('affix-wrapper affix-top-wrapper').addClass('affix-bottom-wrapper');
            } else {
                $headerWrapper.removeClass('affix-wrapper affix-top-wrapper affix-bottom-wrapper');
            }

            //calling this functions disable menu items animation when going from affix to affix-top with centered logo inside
            //in boxed layouts header is always fixed
            if (boxed && !($header.css('position') === 'fixed')) {
                menuHideExtraElements();
                initMegaMenu(1);
            }
            if(headerSticked) {
                initMegaMenu(1);
            }

        });

        //if header has different height on afixed and affixed-top positions - correcting wrapper height
        $header.on('affixed-top.bs.affix', function () {
            // $headerWrapper.css({height: $header.outerHeight()});
        });

        //fixing auto affix bug - toggle affix on click when page is at the top
        $header.on('affix.bs.affix', function(){
            if( !$window.scrollTop() ) return false;
        });

        $header.affix({
            offset: {
                top: headerOffset,
                bottom: -10
            }
        });
    }

    //aside affix
    initAffixSidebar();

    $body.scrollspy('refresh');

    //appear plugin is used to elements animation, counter, pieChart, bootstrap progressbar
    if ($().appear) {
        //animation to elements on scroll
        var $animate = $('.animate');
        $animate.appear();

        $animate.filter(':appeared').each(function(index){
            initAnimateElement($(this), index);
        });

        $body.on('appear', '.animate', function(e, $affected ) {
            $($affected).each(function(index){
                initAnimateElement($(this), index);
            });
        });

        //counters init on scroll
        if ($().countTo) {
            var $counter = $('.counter');
            $counter.appear();
            
            $counter.filter(':appeared').each(function(){
                initCounter($(this));
            });
            $body.on('appear', '.counter', function(e, $affected ) {
                $($affected).each(function(){
                    initCounter($(this));
                });
            });
        }
    
        //bootstrap animated progressbar
        if ($().progressbar) {
            var $progressbar = $('.progress .progress-bar');
            $progressbar.appear();

            $progressbar.filter(':appeared').each(function(){
                initProgressbar($(this));
            });
            $body.on('appear', '.progress .progress-bar', function(e, $affected ) {
                $($affected).each(function(){
                    initProgressbar($(this));
                });
            });
            //animate progress bar inside bootstrap tab
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                initProgressbar($($(e.target).attr('href')).find('.progress .progress-bar'));
            });
            //animate progress bar inside bootstrap dropdown
            $('.dropdown').on('shown.bs.dropdown', function(e) {
                initProgressbar($(this).find('.progress .progress-bar'));
            });
        }

         //dropdown animation
        $('.dropdown-toggle').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var item = $(this);
            $('.dropdown-menu').not(item.next()).slideUp(300);
            item.next().slideToggle(300);
        });

        //circle progress bar
        if ($().easyPieChart) {
            var $chart = $('.chart');

            $chart.appear();

            $chart.filter(':appeared').each(function(){
                initChart($(this));
            });
            $body.on('appear', '.chart', function(e, $affected ) {
                $($affected).each(function(){
                    initChart($(this));
                });
            });

        }

    } //appear check

    //Flickr widget
    // use http://idgettr.com/ to find your ID
    if ($().jflickrfeed) {
        var $flickr = $("#flickr, .flickr_ul");
        if ( $flickr.length ) {
            if ( ! ( $flickr.hasClass('flickr_loaded') ) ) {
                $flickr.jflickrfeed({
                    flickrbase: "http://api.flickr.com/services/feeds/",
                    limit: 4,
                    qstrings: {
                        id: "131791558@N04"
                    },
                    itemTemplate: '<a href="{{image_b}}" class="photoswipe-link"><li><img alt="{{title}}" src="{{image_m}}" /></li></a>'
                //complete
                }, function(data) {
                    initPhotoSwipe();
                }).addClass('flickr_loaded');
            }
        }
    }

    // Instagram widget
    if(jQuery().spectragram) {
        var Spectra = {
            instaToken: '3905738328.5104743.42b91d10580042e3aeeab90c926666a4',

            init: function () {
                jQuery.fn.spectragram.accessData = {
                    accessToken: this.instaToken
                };

                //available methods: getUserFeed, getRecentTagged
                jQuery('.instafeed').each(function(){
                    var $this = jQuery(this);
                    if ($this.find('img').length) {
                        return;
                    }
                    $this.spectragram('getUserFeed',{
                        max: 4,
                        wrapEachWith: '<div class="photo" />'
                    });
                });

            }
        }


        Spectra.init();
    }

    // init Isotope
    $('.isotope-wrapper').each(function(index) {
        var $container = $(this);
        var layoutMode = ($container.hasClass('masonry-layout')) ? 'masonry' : 'fitRows';
        var columnWidth = ($container.children('.col-md-4').length) ? '.col-md-4' : false;
        $container.isotope({
            percentPosition: true,
            layoutMode: layoutMode,
            masonry: {
                //TODO for big first element in grid - giving smaller element to use as grid
                // columnWidth: '.isotope-wrapper > .col-md-4'
                columnWidth: columnWidth
            }
        });

        var $filters = $container.attr('data-filters') ? $($container.attr('data-filters')) : $container.prev().find('.filters');
        // bind filter click
        if ($filters.length) {
            $filters.on( 'click', 'a', function( e ) {
                e.preventDefault();
                var $thisA = $(this);
                var filterValue = $thisA.attr('data-filter');
                $container.isotope({ filter: filterValue });
                $thisA.siblings().removeClass('selected active');
                $thisA.addClass('selected active');
            });
            //for works on select
            $filters.on( 'change', 'select', function( e ) {
                e.preventDefault();
                var filterValue = $(this).val();
                $container.isotope({ filter: filterValue });
            });
        }
    });

    //wrap select fields
        jQuery('select').each(function() {
            var s = jQuery(this);
            s.wrap('<div class="select_container"></div>');
        });


    /////////
    //SHOP///
    /////////


        $('#toggle_shop_view').on('click', function( e ) {
            e.preventDefault();
            $(this).toggleClass('grid-view');
            $('#products').toggleClass('grid-view list-view');
        });


        //checkout collapse forms - only for HTML
        $('a.showlogin, a.showcoupon').on('click', function( e ) {
            e.preventDefault();
            var $form = $(this).parent().next();

            if($form.css('display') === 'none') {
                $form.show(150);
            } else {
                $form.hide(150);
            }
        });


        //remove product from cart - only for HTML
        $('a.remove').on('click', function( e ) {
            e.preventDefault();
            $(this).closest('tr, .media, li').remove();
        });


        //flexslider - only for HTML
        $('.images').flexslider({
            animation: "slide",
            controlNav: "thumbnails",
            selector: "figure > div",
            directionNav: false,
        });

        //tabs - only for HTML
        $( '.wc-tab, .woocommerce-tabs .panel:not(.panel .panel)' ).hide();

        $('.wc-tabs li a, ul.tabs li a').on( 'click', function( e ) {
            e.preventDefault();
            var $tab          = $( this );
            var $tabs_wrapper = $tab.closest( '.wc-tabs-wrapper, .woocommerce-tabs' );
            var $tabs         = $tabs_wrapper.find( '.wc-tabs, ul.tabs' );

            $tabs.find( 'li' ).removeClass( 'active' );
            $tabs_wrapper.find( '.wc-tab, .panel:not(.panel .panel)' ).hide();

            $tab.closest( 'li' ).addClass( 'active' );
            $tabs_wrapper.find( $tab.attr( 'href' ) ).show();
        } );
        // Review link
        $('a.woocommerce-review-link').on( 'click', function() {
            $( '.reviews_tab a' ).trigger('click');
            return true;
        });

        //parsing URL hash
        var hash  = window.location.hash;
        var url   = window.location.href;
        var $tabs = $( '.wc-tabs, ul.tabs' ).first();

        if ( hash.toLowerCase().indexOf( 'comment-' ) >= 0 || hash === '#reviews' || hash === '#tab-reviews' ) {
            $tabs.find( 'li.reviews_tab a' ).trigger('click');
        } else if ( url.indexOf( 'comment-page-' ) > 0 || url.indexOf( 'cpage=' ) > 0 ) {
            $tabs.find( 'li.reviews_tab a' ).trigger('click');
        } else if ( hash === '#tab-additional_information' ) {
            $tabs.find( 'li.additional_information_tab a' ).trigger('click');
        } else {
            $tabs.find( 'li:first a' ).trigger('click');
        }


        //price filter - only for HTML
        if ($().slider) {
            var $rangeSlider = $(".slider-range-price");
            if ($rangeSlider.length) {
                var $priceMin = $(".slider_price_min");
                var $priceMax = $(".slider_price_max");
                $rangeSlider.slider({
                    range: true,
                    min: 0,
                    max: 100000,
                    values: [ 1500, 30000 ],
                    slide: function( event, ui ) {
                        $priceMin.val( ui.values[ 0 ] );
                        $priceMax.val( ui.values[ 1 ] );
                    }
                });
                $priceMin.val($rangeSlider.slider("values", 0));
                $priceMax.val($rangeSlider.slider("values", 1));
            }
        }


        //woocommerce related products, upsells products
        $('.related.products ul.products, .upsells.products ul.products, .cross-sells ul.products')
            .addClass('owl-carousel top-right-nav')
            .owlCarousel({
                loop: true,
                autoplay: true,
                margin: 30,
                nav: false,
                dots: false,
                items: 3,
                navText: ['<i class="ico-back"></i>', '<i class="ico-next"></i>'],
                responsive: {
                    0: {
                        items: 1
                    },
                    767: {
                        items: 2
                    },
                    992: {
                        items: 2
                    },
                    1200: {
                        items: 3
                    }
                }
            });

        //color filter
        $(".color-filters").find("a[data-background-color]").each(function() {
            $(this).css({"background-color" : $(this).data("background-color")});
        });
    ////////////////
    // end of SHOP//
    ////////////////

    //Unyson or other messages modal
    var $messagesModal = $('#messages_modal');
    if ($messagesModal.find('ul').length) {
        $messagesModal.modal('show');
    }

    //page preloader
    $(".preloaderimg").fadeOut(150);
    $(".preloader").fadeOut(150).delay(50, function(){
        $(this).remove();
    });
}//eof windowLoadInit

$(document).ready(function() {
    documentReadyInit();
    initGoogleMap();
});

$window.on('load', function(){
    windowLoadInit();
}); //end of "window load" event

$window.on('resize', function(){

    $body.scrollspy('refresh');

    //header processing
    menuHideExtraElements();
    initMegaMenu(1);
    var $header = $('.page_header').first();
        //checking document scrolling position
        if ($header.length && !$(document).scrollTop() && $header.first().data('bs.affix')) {
            $header.first().data('bs.affix').options.offset.top = $header.offset().top;
        }
    if (!$header.closest('.boxed').length) {
        var affixed = false;
        if($header.hasClass('affix')) {
            affixed = true;
            //animation duration
            $header.removeClass('affix');

            //TODO fix header wrapper height from small to large when page is scrolled (not top)
            setTimeout(function () {
                //editing header wrapper height for smooth stick and unstick
                $(".page_header_wrapper").css({height: $header.first().outerHeight()});
                $header.addClass('affix');
            }, 250);
        }

        if(!affixed) {
            //editing header wrapper height for smooth stick and unstick
            $(".page_header_wrapper").css({height: $header.first().outerHeight()});
        }
    }
    
});

// particles.js
if( typeof(particlesJS) !== undefined && $('#particles-js').length ) {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 30, 
                "density": {
                    "enable": true,
                    "value_area": 800 
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
            },
            "opacity": {
                "value": 0.1,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 300,
                "color": "#ffffff",
                "opacity": 0.1,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 240,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

//direction gallery
$(function () {
    $(' #gallery-direction > .gallery-hover').hoverdir();
});
if( typeof(Typed) !== undefined && $('#typed').length ) {

//typed.js
var typed = new Typed("#typed", {
    stringsElement: '#typed-strings',
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 500,
    startDelay: 1000,
    loop: true,
  });
}


//end of IIFE function
})(jQuery);

