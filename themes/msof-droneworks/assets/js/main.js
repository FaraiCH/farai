(function ($) {
    "use strict"
    
    // Add header background on menu show (Global)
    $('#navbarCollapse').on('show.bs.collapse', function () {
        $('.pheader').addClass('pheader_dark');
    });

    // Remove header background on menu hide (Global)
    $('#navbarCollapse').on('hide.bs.collapse', function () {
        $('.pheader').removeClass('pheader_dark');
    });

    // Headroom.js
    if ($('.pheader').length) {
        var myElement = document.querySelector(".pheader");
        var headroom  = new Headroom(myElement, { offset: 50 });
        headroom.init();
    }

    // Smooth scrolling (Global)
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                    });
                }
            }
        });

    // Preloader (Global)
    $(window).on('load', function () {
        $('#preloader-active').delay(450).fadeOut('slow');
        $('body').delay(450).css({
            'overflow': 'visible'
        });
    });

    // Show/Hide back to top (Global)
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 2000) {
            $('#back-top').fadeOut(500);
        } else {
            $('#back-top').fadeIn(500);
        }
    });

    // Scroll Up (Global)
    $('#back-top a').on("click", function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Main slider 1 (Home)
    var BasicSlider = $('.slider-active');
    if (BasicSlider.length) {
        function mainSlider() {
            BasicSlider.on('init', function (e, slick) {
                var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
                doAnimations($firstAnimatingElements);
            });
            BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
                var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
                doAnimations($animatingElements);
            });
            BasicSlider.slick({
                autoplay: true,
                autoplaySpeed: 8000,
                dots: false,
                fade: true,
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev" aria-label="Previous slide"><i class="fas fa-chevron-left"></button>',
                nextArrow: '<button type="button" class="slick-next" aria-label="Next slide"><i class="fas fa-chevron-right"></button>',
                responsive: [{
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true,
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: false
                        }
                    }
                ]
            });

            function doAnimations(elements) {
                var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                elements.each(function () {
                    var $this = $(this);
                    var $animationDelay = $this.data('delay');
                    var $animationType = 'animated ' + $this.data('animation');
                    $this.css({
                        'animation-delay': $animationDelay,
                        '-webkit-animation-delay': $animationDelay
                    });
                    $this.addClass($animationType).one(animationEndEvents, function () {
                        $this.removeClass($animationType);
                    });
                });
            }
        }
        mainSlider();
    }

    // Testimonial active (Home)
    var testimonial = $('.h1-testimonial-active');
    if (testimonial.length) {
        testimonial.slick({
            dots: false,
            infinite: true,
            speed: 1000,
            autoplay: true,
            loop: true,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev" aria-label="Previous statement"><i class="fas fa-arrow-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="Next statement"><i class="fas fa-arrow-right"></i></button>',
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                        arrows: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false
                    }
                }
            ]
        });
    }

    // Single img slider (Home)
    var services = $('.services-active');
    if (services.length) {
        services.slick({
            dots: false,
            infinite: true,
            autoplay: true,
            speed: 400,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev" aria-label="Previous item"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="Next item"><i class="fas fa-chevron-right"></i></button>',
            slidesToShow: 3,
            slidesToScroll: 1,
            centerPadding: '32px',
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        arrows: true
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true,
                    }
                },
            ]
        });
    }

    // data-background
    $("[data-background]").each(function () {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });

    // Popup video
    var popUpVideo = $('.popup-video');
    if (popUpVideo.length) {
        popUpVideo.magnificPopup({
            mainClass: 'mfp-fade',
            type: 'iframe',
            preloader: false,
            // Magnific popup fix
            callbacks: {
        		beforeOpen: function() {
        			$('body').addClass('mfp-active');
        		},
        		beforeClose: function() {
        			$('body').removeClass('mfp-active');
        		}
        	}
        });
    }

    // Popup dialog
    var popUpDialog = $('.popup-modal');
    if (popUpDialog.length) {
        popUpDialog.magnificPopup({
            mainClass: 'mfp-fade',
            type: 'inline',
            preloader: false,
            // Magnific popup fix
            callbacks: {
        		beforeOpen: function() {
        			$('body').addClass('mfp-active');
        		},
        		beforeClose: function() {
        			$('body').removeClass('mfp-active');
        		}
        	}
        });
    }
})(jQuery);