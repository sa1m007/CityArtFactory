//CREATE VARIABLES

var iScroll = 0,
	iTop = 0,
	iScreenWidth,
	iScreenHeight,
	iWindowWidth,
	iWindowHeight,
	isTimeline = false,
	isMap = false,
	is_animating = false,
	sCurrent = "",
	oStage,
	aFlakes,
	sProgram,
	iFeather = 0,
	bInitEksperience = false;	

$(document).ready(function() {
	
	
	
	  
	  $('.testimonials-slider').bxSlider({
			slideWidth: 800,
			minSlides: 1,
			maxSlides: 1,
			slideMargin: 32,
			auto: true,
			autoControls: true
		  });		  			
		
		$('.sold-slider').iosSlider({
			snapToChildren: true,
			infiniteSlider: true,
			responsiveSlideContainer: true,
			responsiveSlides: false,
			keyboardControls: true,
			navPrevSelector: $("#bottom-slider-prev1"),
			navNextSelector: $("#bottom-slider-next1"),
			stageCSS: {
			overflow: 'hidden'
			}
		}); 
		
		$('.partnerSlider').iosSlider({
			snapToChildren: true,
			infiniteSlider: true,
			responsiveSlideContainer: true,
			responsiveSlides: false,
			autoSlide: 100,
			autoSlideTimer: 2000,
			stageCSS: {
			overflow: 'hidden'
			}
		}); 

		$('.gallery-slider').iosSlider({
			snapToChildren: true,
			desktopClickDrag: false,
			infiniteSlider: true,
			responsiveSlideContainer: true,
			responsiveSlides: false,
			keyboardControls: true,
			navPrevSelector: $("#gallery-slider-prev"),
			navNextSelector: $("#gallery-slider-next"),
			stageCSS: {
			overflow: 'hidden'
			}
		}); 
		
	
});