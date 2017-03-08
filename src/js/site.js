(function ($) {
    "use strict";
	
    /**
     *  Variables
     */	 
    var clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchstart');    
    var calendar = new Object();
    var date = {
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "weeks": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };

    /**
     * Detect Device Type
     */
    var isMobile;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
        $('html').addClass('mobile');
    } else {
        isMobile = false;
        $('html').addClass('desktop');
    }
	
	/**
	 * Detect Site Direction ltr/rtl
	 */
	var rtl = false;
	var direction = $('html').attr('dir');	
	if (typeof direction !== typeof undefined && direction !== false && direction == "rtl" ) {
		rtl = true;
	} 


    /**
     * Functions
     */
    function windowScrollAnimations() {
        var $animate = $('.animate-up, .animate-down, .animate-left, .animate-right');

        if (!isMobile) {
            $animate.appear();

            $animate.on('appear', function (event, affected) {
				for (var i = 0; i < affected.length; i++) {				  
				  $(affected[i]).addClass('animated');
				}
            });

            $.force_appear();
        }
    }

    function fillProgressBars() {
        var $progress_bar = $('.progress-bar');

        if (!isMobile) {
            $progress_bar.appear();
            $progress_bar.on('appear', function (event, $affected) {
                setProgressBarsWidth($affected)
            });

            $.force_appear();
        } else {
            setProgressBarsWidth($progress_bar)
        }
    }
	
	function numberAnimatedCounter (){
		var $section = $('.section-statistics');
				
		if (!isMobile){
            $section.appear();
            $section.on('appear', function (event, $affected) {
               
			   $('.statistic-value').each(function () {					
				    if(!$(this).hasClass('animated')){
						$(this).prop('Counter',0).animate({
							Counter: $(this).text()							
						}, {
							duration: 3000,
							easing: 'swing',
							step: function (now) {
								$(this).text(Math.ceil(now));
							}
						});
					}
					$(this).addClass('animated');					
				});
				
            });			
            $.force_appear();						
		}				
	}

    function setProgressBarsWidth(bars) {
		for (var i = 0; i < bars.length; i++) {
			var $bar_fill = $(bars[i]).find('.bar-fill');

            $bar_fill.width($bar_fill.data('width'));
		}
    }

    function positioningInterestsTooltips() {
		var interests = $(".interests-list");
		var tooltips = $(".interests-list li span");
		
        if (interests.length > 0) {
			for (var i = 0; i < tooltips.length; i++) {
				var width = $(tooltips[i]).outerWidth();
                var parent_width = $(tooltips[i]).parent().outerWidth();
                var left = (parent_width - width) / 2;

                $(tooltips[i]).css('left', left + 'px');
			}            
        }
    }

    function positioningTimelineElements() {
        if ($(window).width() > 600) { // For large devices
            $('.timeline').each(function () {				
                var tlineBar = $(this).find('.timeline-bar');
				var tlineBarH = 0;
				var tlineWrap = $(this).find('.timeline-inner');
				var tlineWrapH = 0;
				var tlineGutter = 25;
											
                var col1Top = 0;
				var col1TopPrev = 0;
				var col1LastElemH = 0;
				var col1Elems = $(this).find('.timeline-box-left');
				
                var col2Top = 50;
                var col2TopPrev = 0;
                var col2LastElemH = 0;		                				
                var col2Elems = $(this).find('.timeline-box-right');
                
				// Switch top params for RTL
				if(rtl){
					col1Top = col2Top;
					col2Top = 0;
				}
				
                // Positioning first column elements
                for (var i = 0; i < col1Elems.length; i++) {
                    $(col1Elems[i]).css({'position': 'absolute', 'left': '0', 'top': col1Top + 'px'});
					col1TopPrev = col1Top;
                    col1Top = col1Top + $(col1Elems[i]).height() + tlineGutter;
                    col1LastElemH = $(col1Elems[i]).height();													
                }

                // Positioning second column elements               
                for (var i = 0; i < col2Elems.length; i++) {
                    $(col2Elems[i]).css({'position': 'absolute', 'right': '0', 'top': col2Top + 'px'});
					col2TopPrev = col2Top;
                    col2Top = col2Top + $(col2Elems[i]).height() + tlineGutter;
                    col2LastElemH = $(col2Elems[i]).height();
                }							
				
                // Set container & bar height's								
                if (col1Top > col2Top) {
                    tlineWrapH = col1Top - tlineGutter;                    
                } else {
                    tlineWrapH = col2Top - tlineGutter;                    
                }
				
				if (col1TopPrev > col2TopPrev) {
					tlineBarH = col1TopPrev;
				} else {
					tlineBarH = col2TopPrev;
				}
				
                tlineWrap.height(tlineWrapH);
                tlineBar.css({'top': '80px', 'height': tlineBarH + 'px'});
            });
        } else { // For small devices
            $('.timeline-bar').attr('style', '');
            $('.timeline-box').attr('style', '');
            $('.timeline-inner').attr('style', '');
        }
    }

    function availabilityCalendar() {
		var calendarHtml = $(".calendar-busy");
		
		var calendarThead = calendarHtml.find('.calendar-thead');
		var calendarTbody = calendarHtml.find('.calendar-tbody');
		
		var calendarTodayDay = calendarHtml.find('.calendar-today .day');
		var calendarTodayMonth = calendarHtml.find('.calendar-today .month');
		var calendarTodayWeekday = calendarHtml.find('.calendar-today .week-day');
		
		var calendarActiveMonth = calendarHtml.find('.active-month');
		var calendarActiveYear = calendarHtml.find('.active-year');		
		var calendarActiveMonthAndYear = calendarActiveMonth.add(calendarActiveYear)
		
		//console.log(date.weeks);
		
        if (calendarHtml.length > 0) {
            calendar = {
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth(),
                currentWeekDay: new Date().getDay(),
                currentDay: new Date().getDate(),
                active: {
                    month: '',
                    year: ''
                },
                limitUp: {
                    month: '',
                    year: ''
                },
                limitDown: {
                    month: '',
                    year: ''
                },
                busyDays: '',
                weekStart: '',
                weekNames: date.weeks, //['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                monthNames: date.months, //['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                init: function () {
                    this.initToday();
                    this.initWeekNames();
                    this.createMonthHtml(this.currentYear, this.currentMonth);
                },
                initToday: function () {
                    calendarTodayDay.html(this.currentDay);
                    calendarTodayMonth.html(this.monthNames[this.currentMonth].substring(0, 3));
                    calendarTodayWeekday.html(this.weekNames[this.currentWeekDay]);
                },
                initWeekNames: function () {
                    if( calendar.weekStart == 'monday' ){
						var weekFirstDay = date.weeks.shift();
						date.weeks.push(weekFirstDay);												
                        calendar.weekNames = date.weeks; //['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    }

                    var html = '<tr>';

                    for (var i = 0; i < this.weekNames.length; ++i) {
                        html += '<th>' + this.weekNames[i].substring(0, 3) + '</th>';
                    }
                    html += '</tr>';

                    calendarThead.append(html);
                },
                getDaysInMonth: function (year, month) {
                    if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
                        return 29;
                    } else {
                        return this.daysInMonth[month];
                    }
                },
                createMonthHtml: function (year, month) {
                    var html = '';
                    var monthFirstDay = new Date(year, month, 1).getDay(); // Returns the day of a Date object (from 0-6. 0=Sunday, 1=Monday, etc.)
                    var monthBusyDays = [];

                    if( calendar.weekStart == 'monday' ){ // If calendar starts from monday
                        if ( monthFirstDay == 0 ){ // Make sunday (0) week last day (6)
                            monthFirstDay = 6;
                        } else {
                            monthFirstDay = monthFirstDay - 1;
                        }
                    }

                    calendarActiveMonth.empty().html(this.monthNames[month]);
                    calendarActiveYear .empty().html(year);

                    // Get busy days array for active month
                    for (var i = 0; i < this.busyDays.length; i++) {
                        if (this.busyDays[i].getFullYear() == year && this.busyDays[i].getMonth() == month) {
                            monthBusyDays[i] = this.busyDays[i].getDate();
                        }
                    }

                    for ( var j = 0; j < 42; j++ ) {
                        var className = '';

                        // Set today class
                        if (year == this.currentYear && month == this.currentMonth && (j - monthFirstDay + 1) == this.currentDay) {
                            className += 'current-day';
                        }

                        // Set busy day class
                        if (arrayContains(monthBusyDays, (j - monthFirstDay + 1))) {
                            className += ' busy-day';
                        }

                        // Create month html
                        if (j % 7 == 0) html += '<tr>';
                        if ((j < monthFirstDay) || (j >= monthFirstDay + this.getDaysInMonth(year, month))) {
                            html += '<td class="calendar-other-month"><span></span></td>';
                        } else {
                            html += '<td class="calendar-current-month"><span class="' + className + '">' + (j - monthFirstDay + 1) + '</span></td>';
                        }
                        if (j % 7 == 6) html += '</tr>';
                    }

                    calendarTbody.empty().append(html);
                },
                nextMonth: function () {
                    if (!(this.active.year == this.limitUp.year && this.active.month == this.limitUp.month)) {
                        calendarActiveMonthAndYear.addClass('moveup');
                        calendarTbody.addClass('moveright');
						
                        setTimeout(function () {
                            calendarActiveMonthAndYear.removeClass('moveup');
                            calendarActiveMonthAndYear.addClass('movedown');

                            calendarTbody.removeClass('moveright');
                            calendarTbody.addClass('moveleft');
                        }, 300);
                        setTimeout(function () {
                            calendarActiveMonthAndYear.removeClass('movedown');
                            calendarTbody.removeClass('moveleft');
                        }, 450);

                        if (this.active.month == 11) {
                            this.active.month = 0;
                            this.active.year = this.active.year + 1;
                        } else {
                            this.active.month = this.active.month + 1;
                        }
                        this.createMonthHtml(this.active.year, this.active.month);
                    } else {
                        console.log('Calendar Limit Up');
                    }
                },
                prevMonth: function () {
                    if (!(this.active.year == this.limitDown.year && this.active.month == this.limitDown.month)) {
                        calendarActiveMonthAndYear.addClass('moveup');
                        calendarTbody.addClass('moveright');
                        setTimeout(function () {
                            calendarActiveMonthAndYear.removeClass('moveup');
                            calendarActiveMonthAndYear.addClass('movedown');

                            calendarTbody.removeClass('moveright');
                            calendarTbody.addClass('moveleft');
                        }, 300);
                        setTimeout(function () {
                            calendarActiveMonthAndYear.removeClass('movedown');
                            calendarTbody.removeClass('moveleft');
                        }, 450);

                        if (this.active.month == 0) {
                            this.active.month = 11;
                            this.active.year = this.active.year - 1;
                        } else {
                            this.active.month = this.active.month - 1;
                        }
                        this.createMonthHtml(this.active.year, this.active.month);
                    } else {
                        console.log('Calendar Limit Down');
                    }
                }
            };

            calendar.active.year = calendar.currentYear;
            calendar.active.month = calendar.currentMonth;
            calendar.limitUp.year = calendar.currentYear + 1;
            calendar.limitUp.month = calendar.currentMonth;
            calendar.limitDown.year = calendar.currentYear;
            calendar.limitDown.month = calendar.currentMonth;
			calendar.weekStart = calendarHtml.data('weekstart');

            var busy_days = $('.busy_days_to_js').val();
            busy_days = busy_days.split("&");
            var calendarBusyDays = [];
            for (var i = 0; i < busy_days.length; i++) {
                calendarBusyDays.push(new Date(busy_days[i].replace(/,/g, "/")));
            }
            calendar.busyDays = calendarBusyDays; 
            calendar.init();

            calendarHtml.on(clickEventType, '.calendar-prev', function () {
                calendar.prevMonth();
            });

            calendarHtml.on(clickEventType, '.calendar-next', function () {
                calendar.nextMonth();
            });
        }
    }

    function filterBarLinePositioning(grid, button) {
        var filterValue = button.attr('data-filter');
        var buttonLeft = button.position().left;
        var buttonWidth = button.outerWidth();
        var filterLine = button.closest('.filter').find('.filter-bar-line');

        grid.isotope({filter: filterValue});
        filterLine.css({"left": buttonLeft + "px", "width": buttonWidth});
    }

    function navigationSmoothScrollOnLoad() {
        if ($('body').hasClass('home')) {
            var hash = location.hash.replace('#', '');

            if (hash != '') {
                // Clear the hash in the URL
                //location.hash = '';
                $('html, body').animate({scrollTop: $('#' + hash).offset().top}, 500);
            }
        }
    }

    function stickyNavigationAppear() {
		var header = $('.header');
		var stickyNav = $('.head-bar');
		var stickyNavHeight = 0;		
		
		if(stickyNav.length > 0) {
			stickyNav.addClass('animated');
			
			if ($(window).width() > 767 && !isMobile) {
				if (stickyNavHeight < stickyNav.outerHeight()) {
					stickyNavHeight = stickyNav.outerHeight();
					header.css('min-height', stickyNavHeight + 'px');					
				}

				if ($(window).scrollTop() > 0) {
					stickyNav.addClass('head-sticky');
				} else {
					stickyNav.removeClass('head-sticky');
					header.css('min-height', '0px');					
				}
			} else {
				stickyNav.removeClass('head-sticky');
				header.css('min-height', '0px');				
			}
			
        }		        
    }

    function hideSitePreloader() {
        $('#preloader').remove();
        $('body').removeClass('loading');
    }

    function initialiseGoogleMap() {
        var latlng;
        var lat = 44.5403;
        var lng = -78.5463;
        var map = $('#map');
        var mapCanvas = map.get(0);
        var map_styles = [
            {"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]},
            {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]},
            {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]},
            {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]},
            {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]},
            {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]},
            {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]},
            {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]},
            {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
            }
        ];

        if( $('html').hasClass('theme-skin-dark') ){
            map_styles = [
                {"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},
                {"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}
            ];
        }


        if (map.data("latitude")) lat = map.data("latitude");
        if (map.data("longitude")) lng = map.data("longitude");

        latlng = new google.maps.LatLng(lat, lng);

        // Map Options
        var mapOptions = {
            zoom: 14,
            center: latlng,
            scrollwheel: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: map_styles
        };

        // Create the Map
        map = new google.maps.Map(mapCanvas, mapOptions);

        var marker = new Marker({
            map: map,
            position: latlng,
            icon: {
                path: SQUARE_PIN,
                fillColor: '',
                fillOpacity: 0,
                strokeColor: '',
                strokeWeight: 0
            },
            map_icon_label: '<span class="map-icon map-icon-postal-code"></span>'
        });

        // Keep Marker in Center
        google.maps.event.addDomListener(window, 'resize', function () {
            map.setCenter(latlng);
        });
    };

    function lockScroll() {
        var $html = $('html');
        var $body = $('body');

        var initWidth = $body.outerWidth();
        var initHeight = $body.outerHeight();

        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];
        $html.data('scroll-position', scrollPosition);
        $html.data('previous-overflow', $html.css('overflow'));
        $html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        var marginR = $body.outerWidth() - initWidth;
        var marginB = $body.outerHeight() - initHeight;
        $body.css({'margin-right': marginR, 'margin-bottom': marginB});
        $html.addClass('lock-scroll');
    }

    function unlockScroll() {
        var $html = $('html');
        var $body = $('body');

        $html.css('overflow', $html.data('previous-overflow'));
        var scrollPosition = $html.data('scroll-position');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        $body.css({'margin-right': 0, 'margin-bottom': 0});
        $html.removeClass('lock-scroll');
    }

    function openMobileNav() {
        $('body').addClass('mobile-nav-opened');
        lockScroll();
    }

    function closeMobileNav() {
        $('body').removeClass('mobile-nav-opened');
        unlockScroll();
    }

    function openSidebar() {
        $('body').addClass('sidebar-opened');
        lockScroll();
    }

    function closeSidebar() {
        $('body').removeClass('sidebar-opened');
        unlockScroll();
    }

    function arrayContains(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }

	function setSectionContactHeight() {
		var section = $('.section-contact .row');
		var section_box = section.find('.section-box');
		
		if($(window).width() > 767){
			section_box.css('min-height', section.height()+'px');
		} else {
			section_box.css('min-height', '0px');
		}		
	}
	
	function ripple(element, pageX, pageY){
		var $rippleElement = $('<span class="ripple-effect" />');                
		var xPos = parseInt( pageX, 10 ) - parseInt( element.offset().left, 10 );
		var yPos = parseInt( pageY, 10 ) - parseInt( element.offset().top, 10 );
		var size = Math.floor( Math.min(element.height(), element.width()) * 0.5 );
		var animateSize = Math.floor( Math.max(element.width(), element.height()) * Math.PI );
							
		$rippleElement
			.css({
				top: yPos,
				left: xPos,
				width: size,
				height: size                   
			})
			.appendTo(element)
			.animate({
				width: animateSize,
				height: animateSize,
				opacity: 0
			}, 500, function () {
				$(this).remove();
			});
	}

    function setPriceBoxHeight(){
        var priceRow = $('.price-list');

        if( $(window).width() > 767 ) {
            priceRow.each(function(){
                var priceRowHeight = 0;
                var priceBox = $(this).find('.price-box');

                priceBox.css('height', 'auto');
                priceRowHeight = $(this).height();
                priceBox.height(priceRowHeight);
            });
        } else {
            $('.price-box').css('height', 'auto');
        }
    }
	
	
    /**
     * Window Load
     */
    $(window).on( "load", function() {
		numberAnimatedCounter();
        /** Window Scroll Animations */
        windowScrollAnimations();


        /** Progress Bars:
         *  fill progress bars on window scroll */
        fillProgressBars();


        /** Tooltips:
         *  positioning interests section tooltips */
        positioningInterestsTooltips();


        /** Timeline:
         *  positioning timeline elements */
		if(rtl){ // switch timeline box classes for RTL
			var tLineLeft = $('.timeline-box-left');
			var tLineRight = $('.timeline-box-right');
			
			tLineLeft.removeClass('timeline-box-left').addClass('timeline-box-right');
			tLineRight.removeClass('timeline-box-right').addClass('timeline-box-left');
			tLineLeft.find('.animate-right').removeClass('animate-right').addClass('animate-left');			
			tLineRight.find('.animate-left').removeClass('animate-left').addClass('animate-right');
		}
		
        positioningTimelineElements();


        /** Calendar:
         *  calendar object initialization */
        availabilityCalendar();
		
        /** Contct Section:
         *  set equal height for section boxes */
        setSectionContactHeight();

        /** Set Price Boxe's height */
        setPriceBoxHeight();

        /** Reference Slider */
	    var ref_slider = $('.ref-slider');
	    var slide_speed = $('.ref-slider').data('speed');
        if (ref_slider.length > 0) {
            for (var i = 0; i < ref_slider.length; i++) {
                var $ref_slider_prev = $(ref_slider[i]).closest('.section-box').find('.slider-prev');
                var $ref_slider_next = $(ref_slider[i]).closest('.section-box').find('.slider-next');

                $(ref_slider[i]).bxSlider({
                    auto: true,
                    speed: 800,
                    pause: slide_speed,
                    pager: false,
                    controls: true,
                    adaptiveHeight: true,
                    nextSelector: $ref_slider_prev,
                    prevSelector: $ref_slider_next,
                    nextText: '<i class="rsicon rsicon-chevron_right"></i>',
                    prevText: '<i class="rsicon rsicon-chevron_left"></i>'
                });
            }
        }


        /** Post Slider */
		var post_slider = $('.post-slider');
        if (post_slider.length > 0) {
			for (var i = 0; i < post_slider.length; i++) {
                var $prevSelector = $(post_slider[i]).closest('.post-media').find('.slider-prev');
                var $nextSelector = $(post_slider[i]).closest('.post-media').find('.slider-next');

                $(post_slider[i]).bxSlider({
                    pager: false,
                    controls: true,
                    nextSelector: $nextSelector,
                    prevSelector: $prevSelector,
                    nextText: '<i class="rsicon rsicon-chevron_right"></i>',
                    prevText: '<i class="rsicon rsicon-chevron_left"></i>'
                });
            }
        }

        /** Clients Carousel */
        var clients_carousel = $(".clients-carousel");
        if (clients_carousel.length > 0) {
            for (var i = 0; i < clients_carousel.length; i++) {
                var carousel = $(clients_carousel[i]);
                var items_count = carousel.children().size();
                var items_single = false;

                if (items_count >= 5) items_count = 5;
                if (items_count == 1) items_single = true;

                carousel.owlCarousel({
                    items: items_count,
                    singleItem: items_single,
                    autoPlay: true,
                    stopOnHover: true,
                    responsive: true,
                    navigation: false,
                    pagination: false,
                    lazyLoad: true,
                    itemsDesktopSmall: [992, 4],
                    itemsTabletSmall: [767, 3],
                    itemsMobile: [320, 1]
                });
            }
        }


        /** Audio Player */
		var post_audio = $('.post-media audio');
        if (post_audio.length > 0) {
            post_audio.mediaelementplayer({
                loop: false,
                audioHeight: 40,
                startVolume: 0.7
            });
        }


        /** Video Player */
		var post_video = $('.post-media video');
        if (post_video.length > 0) {
            post_video.mediaelementplayer({
                loop: false,
                defaultVideoWidth: 723,
                defaultVideoHeight: 405,
                videoWidth: -1,
                videoHeight: -1,
                startVolume: 0.7,
                enableAutosize: true,
                alwaysShowControls: true
            });
        }


        /** Material Inputs */
        var material_inputs = $('.input-field input, .input-field textarea');

		for (var i = 0; i < material_inputs.length; i++) {	
            if ($(material_inputs[i]).val())
                $(material_inputs[i]).parent('.input-field').addClass('used');
            else
                $(material_inputs[i]).parent('.input-field').removeClass('used');
        }

        material_inputs.on('blur', function () {
            if ($(this).val())
                $(this).parent().addClass('used');
            else
                $(this).parent().removeClass('used');
        });

        material_inputs.on('focus', function () {
            $(this).parent().addClass('used');
        });


        /** Ripple:
         *  appears where clicked on the element */
        $(document).on(clickEventType, '.ripple', function (e) {
			ripple( $(this), e.pageX, e.pageY );            
        });


        /** Ripple Centered:
         *  appears from element center */
        $(document).on(clickEventType, '.ripple-centered', function () {
            var $rippleElement = $('<span class="ripple-effect" />'),
                $buttonElement = $(this),
                xPos = $buttonElement.width() / 2,
                yPos = $buttonElement.height() / 2,
                size = Math.floor( Math.min($buttonElement.height(), $buttonElement.width()) * 0.5 ),
                animateSize = Math.floor( Math.max($buttonElement.width(), $buttonElement.height()) * 1.5 );
            $rippleElement
                .css({
                    top: yPos,
                    left: xPos,
                    width: size,
                    height: size,
                    backgroundColor: $buttonElement.data("ripple-color")
                })
                .appendTo($buttonElement)
                .animate({
                    width: animateSize,
                    height: animateSize,
                    opacity: 0
                }, 450, function () {
                    $(this).remove();
                });
        });


        /** Portfolio */
		var portfolios = $('.grid');
		if(portfolios.length > 0){
			portfolios.each(function(){
				var portfolio = $(this);
				var portfolioItem = portfolio.find('.grid-box');
				
				var gridFilter = portfolio.prev('.filter');
				
				var gridMore = portfolio.next('.grid-more');
				var gridMoreBtn = gridMore.find('.btn');
				var gridMoreLoader = gridMore.find('.ajax-loader');								
							
				// Isotope Initialization
				var grid = portfolio.isotope({
					isOriginLeft: !rtl,
					itemSelector: '.grid .grid-item',
					percentPosition: true,
					masonry: {
						columnWidth: '.grid-sizer'
					}
				});
				
				grid.imagesLoaded().progress(function () {
					grid.isotope('layout');
				});
				
				// Isotope Filter								
				if(gridFilter.length > 0) {
					var filterBtn = gridFilter.find('button');
					var filterBtnFirst = $('.filter-btn-group button:first-child');
					
					// Filter Init
					filterBtnFirst.addClass('active');
					filterBarLinePositioning(grid, filterBtnFirst);
					
					// Filter Click
					filterBtn.on('click', function () {
						var activeBtn = $(this);
						
						filterBtn.removeClass('active');					
						activeBtn.addClass('active');
						portfolioItem.addClass('animated');
						filterBarLinePositioning(grid, activeBtn);
						
						// Show more button only for "All" filter item
						if(activeBtn.data('filter')!='*'){
							gridMore.hide();
						} else {
							gridMore.show();
						}
					});   
															
				}
				
				// Portfolio add more elements (ajax)								
				gridMoreBtn.on('click', function () {					
					// show ajax loader	
					gridMoreBtn.css('display','none');
					gridMoreLoader.css('display','inline-block');
					var offset_count = gridMore.data('offset'); 
					
					// ajax request
					jQuery.post(
						ajax_var.url,
						{
							action : 'rs_card_get_portfolio',
							tax_query: gridMore.data('tax'),
							portfolio_cat: gridMore.data('cat'),							
							section_item_count: gridMore.data('count'),
							more_count: gridMore.data('more-count'),
							offset: offset_count,
						},
						function(data){
							if(data) {
								// add grid items 
								var html = $.parseHTML(data);					
								portfolio.append(html).isotope('appended', html);
								
								offset_count = parseInt(offset_count)+parseInt(gridMore.data('more-count'));
								gridMore.data('offset', offset_count);
								
								// hide ajax loader
								gridMoreBtn.css('display','inline-block');
								gridMoreLoader.css('display','none');
							} else {
								gridMoreBtn.css('display','none');
								gridMoreLoader.css('display','none');
							}							
						},
						"html"
					);
					
				});
				
			});
		}
		
		// Portfolio fancybox
		if($('.portfolioFancybox').length > 0){
			var _player;
			$('.portfolioFancybox').fancybox({
				padding: 0,
				wrapCSS: 'fancybox-portfolio',
				maxWidth: '795px',
				maxHeight: '85%',
				minWidth: '250px',
				mouseWheel: 'true',
				scrolling: "no",
				autoCenter: true,
				beforeShow: function() {
					// Get current popup
					var currentID = $(this.element).attr("href"); 
					var currentPopup = $('.fancybox-portfolio '+currentID);

					// Append current popup embed
					var currentEmbed = currentPopup.find('.inline-embed');
					if( currentEmbed.length > 0 ){
						var currentEmbedType = currentEmbed.data('embed-type'); 
						var curentEmbedUrl = currentEmbed.data('embed-url');

						switch(currentEmbedType) {
							case "image":
								currentEmbed.empty();
								currentEmbed.addClass('inline-embed-image');
								currentEmbed.append('<img src="'+curentEmbedUrl+'" />');
								break;
							case "iframe":
								currentEmbed.empty();
								currentEmbed.addClass('inline-embed-iframe');
								currentEmbed.append('<iframe src="'+curentEmbedUrl+'" allowfullscreen></iframe>');
								break;
							case "video":
								_player = ''; // reset player
								currentEmbed.addClass('inline-embed-video');
								var currentVideo = $(''+currentID+'').find('video');
								if(currentVideo.length > 0){
									new MediaElementPlayer(currentID+' video', { // initialize player
										loop: false,
										defaultVideoWidth: 723,
										defaultVideoHeight: 405,
										videoWidth: -1,
										videoHeight: -1,
										startVolume: 0.7,
										enableAutosize: true,
										alwaysShowControls: true,
										success: function (mediaElement, domObject) {
											_player = mediaElement;
											_player.load();
										}
									});
								}
								break;
						}
					}
				},
				afterShow: function() {
					// Get current popup
					var currentID = $(this.element).attr("href");
					var currentPopup = $('.fancybox-portfolio '+currentID);

					// Make current popup visible with css
					currentPopup.addClass('opened');
				},
				beforeClose: function () {
					// reset player
					_player = '';
				}
			});
		}		

		
        /** Main Navigation */
        navigationSmoothScrollOnLoad();

        // Header Navigation
        $('#head-nav>nav>ul').onePageNav({
			easing: 'swing',
			changeHash: true,
			scrollSpeed: 500,
            scrollThreshold: 0.5,
            currentClass: 'active',            
			filter: ':not(.external)'                     
        });

        // Add header navigation hover lines
        if ($('.nav-wrap .nav').length > 0) {
            $('.nav-wrap .nav > ul > li > a').append('<span></span>');
        }

        // Sticky Navigation        
        stickyNavigationAppear();
		
		$(window).scroll(function () {
			stickyNavigationAppear();
		});


        /** Mobile Navigation */
        // Mobile Navigation
        $('#mobile-nav>nav>ul').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 500,
            scrollThreshold: 0.5,
            easing: 'swing',
            begin: function() {
                closeMobileNav();
            }
        });

        // open/close mobile navigation
        $(document).on(clickEventType, '.btn-mobile', function () {
            if ($('body').hasClass('mobile-nav-opened')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        // init mobile navigation custom scroll
        if ($('.mobile-nav').length > 0) {
            $(".mobile-nav-inner").mCustomScrollbar({
                theme: "dark"
            });
        }


        /** Sidebar */

        // open/close sidebar
        $(document).on(clickEventType, '.btn-sidebar', function () {
            if ($('body').hasClass('sidebar-opened')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        // init sidebar custom scroll
        if ($('.sidebar-fixed').length > 0) {
            $(".widget-area").mCustomScrollbar({
                theme: "dark"
            });
        }


        /** Overlay:
         *  the same overlay is used for fixed sidebar and for mobile navigation */
        $(document).on(clickEventType, '#overlay', function () {
            if ($('body').hasClass('mobile-nav-opened')) closeMobileNav();

            if ($('body').hasClass('sidebar-opened')) closeSidebar();
        });


        /** Google Map Initialisation */
        if ($('#map').length > 0) {
            initialiseGoogleMap();
        }

        /** Blog */
        var blog_grid_selector = $('.blog-grid');
        if (blog_grid_selector.length > 0) {
            var blog_grid = blog_grid_selector.isotope({
				isOriginLeft: !rtl,
                itemSelector: '.blog-grid .grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });

            blog_grid.imagesLoaded().progress(function () {
                blog_grid.isotope('layout');
            });
        }


        /** Window Scroll Top Button */
		var $btnScrollTop = $('.btn-scroll-top');
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $btnScrollTop.fadeIn();
            } else {
                $btnScrollTop.fadeOut();
            }
        });

        $btnScrollTop.on('click', function(){
            $('html, body').animate({scrollTop : 0},800);
            return false;
        });		

        /** Preloader:
         *  site was successfully loaded, hide site pre-loader */
        hideSitePreloader();
    });


    /**
     * Window Resize
     */
    var resizeTimeout;
    var winWidth = $(window).width();
    var winHeight = $(window).height();

    $(window).resize(function () {
        var onResize = function () {
            setPriceBoxHeight();
            stickyNavigationAppear();
            setSectionContactHeight();
            positioningTimelineElements();
        }

        // New height and width
        var winNewWidth = $(window).width(),
            winNewHeight = $(window).height();

        // Compare the new height and width with old one
        if (winWidth != winNewWidth || winHeight != winNewHeight) {
            window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(onResize, 10);
        }

        //Update the width and height
        winWidth = winNewWidth;
        winHeight = winNewHeight;
    });

})(jQuery);