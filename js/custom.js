/* ---------------------------------------------------- 
Jestem - JS Core  v.1.0

by Suelo (www.suelo.pl)
---------------------------------------------------- */

'use strict';

var Jestem = {
    init: function() {
    	Pace.on("done", function() {
			$('.pace-progress, .pace','#page-loader').delay(1000).fadeOut(100, function() {
			    $('#page-loader').delay(300).fadeOut(700);
		    });
		}); 
    	this.layout();
    	this.contact();
    	this.portfolio();
    	this.checkBrowser();
		this.chart();
		this.editableAlpha();
		this.twitterFeed();
		this.contactForm();
		this.carousel();
		if($('body').hasClass('sticky-header')) this.stickyHeader();
		

    },
    layout: function() {

    	var self = this;

		var numberOfSections = 0;
		var activeSection = 0;

		var firstSlide = false;
		var homeVisible = false;

		var $pageWrapper = $('#page-wrapper');
		$pageWrapper.addClass('active');
		var $home = $('#home');
		var $homeContent = $('.home-content','#home');
		var $mainNav = $('#main-nav');
		var $mobileIntro = $('#mobile-intro');
		var $navCaption = $('.nav-caption','#main-nav');
		var $navButtons = $('.nav-buttons','#main-nav');
		var $contentButtons = $('.content-buttons','#main-nav');
		var $sections = $('#sections');
		var $sectionsWrapper = $('#sections-wrapper');

		var $nextBtn = $('[data-target="next-section"]');
		var $prevBtn = $('[data-target="prev-section"]');

		var navWidth,
		    pageWidth;

		var defaultCaption = $navCaption.html();
		var defaultBtn = $nextBtn.children('span').html();

		function setSizes() {

			window.viewportWidth = $(window).width();
			window.viewportHeight = $(window).height();

			navWidth = ($mainNav.is(':visible')) ? $mainNav.outerWidth() : 0;
			pageWidth = $home.width();

			$pageWrapper.css('height', viewportHeight+'px');
			if(activeSection==0) $home.css('width', viewportWidth+'px');
			else $home.css('width', navWidth+'px');
			$sections.css({
				'width': viewportWidth-navWidth+'px',
				'height': viewportHeight+'px',
				'margin-left': navWidth+'px'
			});
			$('#sections section').css('height', viewportHeight+'px');
			$('#google-map').css('height', viewportHeight+'px');
		}
		setSizes();
		self.verticalCenter();
		self.onResize(setSizes);
		self.onResize(self.verticalCenter);

		var mySwiper = new Swiper ('.swiper-container', {
		    speed: 700,
		    onInit: function() {
			    $('#sections section').each(function() {
					numberOfSections++;
					$(this).attr('data-number',numberOfSections);
				});
				hideSections();
				updateButtons();
		    },
		    onTransitionStart: function() {
	    		if(activeSection==1) { 
					var $obj = $('.swiper-wrapper');
					var getMatrix = function(obj) {
				    	var matrix = $obj.css("-webkit-transform") ||
					                 $obj.css("-moz-transform")    ||
					                 $obj.css("-ms-transform")     ||
					                 $obj.css("-o-transform")      ||
					                 $obj.css("transform");		
					    return matrix;
					};
					var matrix = getMatrix($obj);
				    var matrixTmp = matrix.replace(/^matrix(3d)?\((.*)\)$/,'$2').split(/, /);
					matrix = matrixTmp[4];
					if(matrix>20) showHome();
				}
		    },
		    onSlideChangeStart: function() {
		    	setTimeout(function(){
		    		if(homeVisible) activeSection = 0;
		    		else activeSection = $sections.find('.swiper-slide-active').data('number');
					updateCaption();
					updateButtons();
		    	},250);
		    }
		});   

		function updateCaption() {
			var newCaption;
			$navCaption.animate({
				'opacity': 0
			},150,function(){
				if(activeSection!=0) newCaption = $sections.find('.swiper-slide-active').data('caption');
				else newCaption = defaultCaption;
				$navCaption.html(' ').append(newCaption).delay(200).animate({
					'opacity': 1
				},150);
			});
		};

		function updateButtons() {

			var nextTitle, prevTitle;
			var $nextSection = $sections.find('.swiper-slide-next');
			var $prevSection = $sections.find('.swiper-slide-prev');

			$navButtons.fadeOut(150,function(){

				if(activeSection==0) $prevBtn.hide();
				else if((activeSection!=0)&&($prevBtn.is(':hidden'))) $prevBtn.show();

				if(activeSection!=0) {
					nextTitle = $nextSection.data('title');
					if(!nextTitle) $nextBtn.hide();
					else {
						if($nextBtn.is(':hidden')) $nextBtn.show();
						$nextBtn.children('span').text(nextTitle);
					}
					prevTitle = $prevSection.data('title');
					if(activeSection==0) $prevBtn.hide();
					else if(activeSection==1) $prevBtn.children('span').text('');
					else {
						if($prevBtn.is(':hidden')) $prevBtn.show();
						$prevBtn.children('span').text(prevTitle);
					}
				} else if(activeSection==0) {
					nextTitle = defaultBtn;
					$nextBtn.children('span').text('').text(nextTitle);
				}

				$navButtons.delay(200).fadeIn(150);

			});

			$contentButtons.animate({
				'opacity':0
			},150,function(){

				$contentButtons.children().each(function(){
					if(activeSection==$(this).data('placement')) $(this).show().css('display','inline-block');
					else if((activeSection!=$(this).data('placement'))&&($(this).is(':visible'))) $(this).hide();
				});

				$contentButtons.delay(200).animate({
					'opacity':1
				},150);

			});


		}

		function hideSections() {
			$sections.animate({
				'opacity': 0
			},400, function() {
				$(this).css('visibility','hidden');
			});
		}

		function showSections() {
			$sections.css('visibility','visible').delay(300).animate({
				'opacity': 1
			},1000);
		}

		function hideNav() {
			$mainNav.animate({
				'opacity': 0
			},400, function() {
				$(this).css('visibility','hidden');
			});
		}

		function showNav() {
			$mainNav.css('visibility','visible').delay(300).animate({
				'opacity': 1
			},1000);
		}

		function showMobileInfo() {
			$('#mobile-info').fadeIn();
		}
		$('#mobile-info').on('click touchstart', function(){
			$(this).fadeOut();
			return false;
		});

		function hideHome() {
			activeSection=1;
			homeVisible = false;
			$home.addClass('home-hidden');
			var homeContentWidth = $homeContent.width();
			$homeContent.stop().animate({
				'margin-left': -homeContentWidth+'px'
			},1200, "easeOutQuint", function() {
				$home.css('width', navWidth+'px');
			});
			$mobileIntro.animate({
				'left': -homeContentWidth+'px'
			},1200, "easeOutQuint");
			showSections();
			updateCaption();
			updateButtons();
		};

		function showHome() {
			activeSection=0;
			homeVisible = true;
			$home.removeClass('home-hidden');
			$home.css('width', viewportWidth+'px');
			$homeContent.stop().animate({
				'margin-left': 0+'px'
			},1200, 'easeOutQuint');
			$mobileIntro.animate({
				'left': -0+'px'
			},1200, "easeOutQuint");
			hideSections();
			updateCaption();
			updateButtons();
			if(!$('#main-nav').hasClass('visible-on-start')) hideNav();
		};

		function goHome() {
			mySwiper.slideTo(0);
			showHome();
		};

		function showMenu() {
			$('#main-menu').addClass('active');
		};

		function hideMenu() {
			$('#main-menu').removeClass('active');
		};

		$nextBtn.on('click', function() {
			if(activeSection==0) {
				hideHome();
				showNav();
				if(!firstSlide&&($(window).width()<767)) showMobileInfo();
				firstSlide = true;
			} else {
				mySwiper.slideNext();
			}
			$(this).blur();
			return false;
		});

		$prevBtn.on('click', function() {
			if(activeSection==1) {
				showHome();
			} else {
				mySwiper.slidePrev();
			}
			$(this).blur();
			return false;
		});

		$('a[data-target="menu-toggle"]').on('click',function(){
			showMenu();
			return false;
		});

		$('#menu-close').on('click',function(){
			hideMenu();
			return false;
		});

		$('a, a[data-target="slide"]','#main-menu, #sections').on('click',function(){
			var target = $(this).data('slide')-1;
			if(target>=0) {
				mySwiper.slideTo(target);
				return false;
			} else 
			if(target<0) {
				goHome();
				hideMenu();
				return false;
			}
		});

    },
    portfolio: function() {

    	var $container = $('.portfolio-list','#portfolio');
		function setContainer() {
			if($(window).width() < 489) return $container.width();
			if($(window).width() < 1200) return $container.width()/2;
			else return $container.width()/4;
		}
		function setList() {
			$container.masonry({
			  columnWidth: setContainer(),
			  itemSelector: '.portfolio-item'
			});
		}
		$container.imagesLoaded(setList);
		$(window).resize(function () {
			setTimeout(function() {
				setList();
			},600);
		});

		var toLoad;
		var loadingPortfolio = false;

		function showNewContent() {
		   $('#portfolio-details').show().animate({
		    	'top': 0,
		    	'opacity': 1
		   });
		}
		
	    function loadContent() {　
		   $('#portfolio-details').load(toLoad);
	　  }
		
		$('a[data-target="ajax-portfolio"]','#portfolio').on('click', function() {
			loadingPortfolio = true;
			toLoad = $(this).attr('href');　
			loadContent();
			return false;
		});

		$(document).ajaxStart(function() {
			$('.ajax-loader','#portfolio').fadeIn();
		});
		$(document).ajaxStop(function() {
			$('.ajax-loader','#portfolio').fadeOut(function() {
				if(loadingPortfolio) showNewContent();
			});
		});

		function closeDetails() {
			$('#portfolio-details').animate({
		    	'top': -100+'px',
		     	'opacity': 0
		    }, function(){
		    	$(this).hide();
		    });
			loadingPortfolio = false;
		}

		$('#portfolio-details').delegate('a[data-target="close-details"]','click', function(){
			closeDetails();
			return false;
		});

    },
    contact: function() {

	    function hideMap() {
	    	$('.map-overlay', '#contact').fadeOut(400);
	    	$('a[data-target="toggle-map"]', '#contact').addClass('active')
	    }

	    function showMap() {
	    	$('.map-overlay').fadeIn(400);
	    	$('a[data-target="toggle-map"]', '#contact').removeClass('active')
	    }
	
	    $('a[data-target="toggle-map"]', '#contact').on('click', function() {
	    	if($('.map-overlay').is(':visible')) hideMap(); else showMap();
	    	return false;
	    });

    },
    chart: function() {

    	$('.chart.chart-lg').easyPieChart({
	        barColor: $(this).data('bar-color'),
	        trackColor: $(this).data('track-color'),
	        scaleColor: false,
	        size: 150,
	        onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
	    });

    	$('.chart.chart-sm').easyPieChart({
	        barColor: $(this).data('bar-color'),
	        trackColor: $(this).data('track-color'),
	        scaleColor: false,
	        size: 110,
	        onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent));
			}
	    });
    },
    checkBrowser: function() {
		var ua = navigator.userAgent.toLowerCase(); 
		if (ua.indexOf('safari') != -1) { 
			if (ua.indexOf('chrome') > -1) {
			  $('html').addClass('chrome');
			} else {
			  $('html').addClass('safari');
			}
		}
		if (ua.indexOf('msie') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			$('html').addClass('ie');
		}
	},
    onResize: function(func) {
		$(window).resize(function() {
			setTimeout(func(),400);
		});
	},
	verticalCenter: function() {
		
		$('.vertical-center').each(function() {	
			$(this).css({
				'margin-top': ($(this).parent().height()/2)-($(this).height()/2)+'px'
			})
		});

	},
	editableAlpha: function() {

		$('.overlay, .editable-alpha').each(function() {
			$(this).css('opacity',$(this).attr('data-alpha')/100);
		});

	},
	carousel: function() {
		$('.owl-carousel').owlCarousel({
			items : $(this).data('items'),
			itemsDesktop : $(this).data('items-desktop'),
			itemsDesktopSmall : false,
			itemsTablet : $(this).data('items-tablet'),
			itemsMobile : $(this).data('items-mobile'),
			singleItem : $(this).data('single-item'),
			autoPlay : $(this).data('auto-play'),
			pagination : $(this).data('pagination')
		});
	},
	twitterFeed: function() {
		$(".tweet").tweet({
			modpath: './php/twitter/',
			username:"Suelo",
			join_text: "auto",
			count: 2,
			auto_join_text_default: "We said,",
			auto_join_text_ed: "We",
			auto_join_text_ing: "We were",
			auto_join_text_reply: "We replied to",
			auto_join_text_url: "We were checking out",
			loading_text: "Loading tweets..."
		});
	},
	stickyHeader: function() {
		
		var stickyNavTop = $('#header').offset().top+400;
		var isSticky = false;  
		var headerHeight = $('#header').height();
	
		$(window).scroll(function() {  
			var scrollTop = $(window).scrollTop();  
	
			if ((scrollTop > stickyNavTop)&&(!isSticky)) {   
				isSticky = true;
				$('body').css('padding-top',headerHeight+'px');
				$('#header').stop().css('margin-top',-headerHeight+'px').addClass('sticky').animate({
					'margin-top': 0
				},300,'easeOutCubic');
			} else if ((scrollTop == 0)&&(isSticky)) {
				$('body').css('padding-top',0);
				$('#header').css('margin-top',0);
				$('#header').removeClass('sticky');
				isSticky = false;
			}
		}); 

	},
	contactForm: function() {
	
		/* Contact Form */
		var $contactForm  = $('#contact-form');
		$('#contact-form').prepend('<div class="form-alert"></div>');
		var $formAlert = $contactForm.find('.form-alert');
	
		$contactForm.validate({
			rules: {
				name: {
					required    : true,
					minlength   : 2
				},
				email: {
					required    : true,
					email       : true
				},
				message: {
					required    : true,
					minlength   : 10
				}
			},
			messages: {
				name: {
					required    : "Please enter your name.",
					minlength   : "Your name needs to be at least 2 characters"
				},
				email: {
					required    : "Please enter your email address.",
					minlength   : "You entered an invalid email address."
				},
				message: {
					required    : "Please enter a message.",
					minlength   :"Enter at least 10 characters"
				}
			},
		});
	
		$contactForm.submit(function() {
			var response;
			$formAlert.slideUp(400, function(){
				$formAlert.text('');
				if ($contactForm.valid()){
					$.ajax({
						type: "POST",
						url: "php/contact-form.php",
						data: $contactForm.serialize(),
						success: function(msg) {
							if (msg === 'SEND') {
								response = '<div class="alert alert-success">Done! Thank for your message - You will get you an answer as fast as possible!</div>';
							}
							else {
								alertLabel = "Error!";
								response = '<div class="alert alert-danger">Ooops... It seems that we have a problem.</div>';
							}
							$formAlert.prepend(response);
							$formAlert.slideDown(400);
						}
					 });
					return false;
				}
			});
			return false;
		});

	},
	tooltip: function() {
		$("[data-toggle='tooltip']").tooltip();
	},
	popover: function() {
		$("[rel='popover']").popover();
	}
};

$(document).ready(function (){
	Jestem.init();
});
