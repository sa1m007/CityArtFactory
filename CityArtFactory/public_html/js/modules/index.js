var concat = "@spl@";
var url = "scripts/index.php";
var urlCommon = "scripts/commonUtil.php"; 
var message;
var success;




$(document).ready(function() {
		
	$('#message').parent().hide();
	
	$('.navbar-nav').hide();
	$('.register-link').show();
	  
	populateForthComingEvent();	
    populateArtists();  	
    getSessionValues();
    
    $( "#logOut" ).click(function() {
		  logOut();
	  });
		
});

function populateForthComingEvent() {
		
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'selectForthComingEvent'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(userData)
           {
        	  var eventDetails = jQuery.parseJSON(userData);
			  var event_type,from_date,to_date,headline,location,image_name;
			  var tempString = "";
    		  for(i in eventDetails)
    			  { 
						event_type = eventDetails[i].event_type;
    					from_date = eventDetails[i].from_date;
    					to_date = eventDetails[i].to_date;
    					headline = eventDetails[i].headline;
    					location = eventDetails[i].location;
						image_name = eventDetails[i].IMAGE_NAME; 
						
						tempString = "";
						
						if (event_type === "International"){
							tempString = tempString + '<li class="item"><a href="international_events.html" >'; 
							tempString = tempString + '<img src="images/programme/'+ image_name + '" alt="" class="cache">';
						}
						else if (event_type === "Domestic"){
							tempString = tempString + '<li class="item"><a href="domestic_events.html" >'; 	
							tempString = tempString + '<img src="images/programme/'+ image_name + '" alt="" class="cache">';
						}
						else if (event_type === "Eco Art tourism"){
							tempString = tempString + '<li class="item"><a href="art_tourism.html" >'; 	
							tempString = tempString + '<img src="images/tourism/'+ image_name + '" alt="" class="cache">';
						}
						
						tempString = tempString + '<div class="testimonials-carousel-content">';									
						tempString = tempString + '<h2>'+ headline + '</h2>';
						if(from_date == null){
							tempString = tempString + '<h3>DATES YET TO BE FINALIZED</h3>';
						}
						else{
							tempString = tempString + '<h3>'+ from_date + ' to '+ to_date + '</h3>';
						}
						tempString = tempString + '</div></a></li>';	
						
						$("#forthcoming-slider ul").append(tempString);						    					  					
    			  }      		    		    
				  
				  $('.forthcoming-slider').iosSlider({
					snapToChildren: true,
					infiniteSlider: true,
					responsiveSlideContainer: true,
					responsiveSlides: false,
					autoSlide: 100,
					autoSlideTimer: 2000,
					keyboardControls: true,
					navPrevSelector: $("#forthcoming-slider-prev"),
					navNextSelector: $("#forthcoming-slider-next"),
					stageCSS: {
					overflow: 'hidden'
					}
				}); 
    		    NProgress.done();
				
           },
           error: function(xhr){
        	   $('#message').parent().show();
 			  $('#message').parent().addClass('error');
 			  $('#message').html('Database error occurred. See error logs.');
 			  NProgress.done();
 			  return;
	         }
         }
         );    	  
	    
	    return this;
}

function populateArtists() {
		
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'selectArtists'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(userData)
           {
        	  var userDetails = jQuery.parseJSON(userData);
			  var name_user,image_name;
			  var length = userDetails.length;
			  var tempString = "";
			  var index = 0;
    		  for(i in userDetails)
    			  {     			    
					name_user = userDetails[i].NAME_USER;					  
					image_name = userDetails[i].IMAGE_NAME; 
						
					tempString = "";												
					
					tempString = tempString + '<li class="item">';
					tempString = tempString + '<a class="launch-overlay" data-group="gallery-2" href="images/artists/'+ image_name + '">';
					tempString = tempString + '<img src="images/artists/'+ image_name +'" alt="" class="cache">';	
					tempString = tempString + '</a>';
					tempString = tempString + '<figcaption><div>';
					tempString = tempString + name_user;
					tempString = tempString + '</div></figcaption></li>';	
					
					if(index <= length/2){
						$("#infinite-slider ul").append(tempString);
					}
					else{
						$("#infinite-slider2 ul").append(tempString);
					}
											    					  											
					index++;
    			  }      		    		    
				  
				  $('.infinite-slider').iosSlider({
						snapToChildren: true,
						infiniteSlider: true,
						responsiveSlideContainer: true,
						responsiveSlides: false,
						autoSlide: 100,
						autoSlideTimer: 700,
						keyboardControls: true,
						navPrevSelector: $("#bottom-slider-prev"),
						navNextSelector: $("#bottom-slider-next"),
						stageCSS: {
						overflow: 'hidden'
						}
					}); 
					
					$('.infinite-slider2').iosSlider({
						snapToChildren: true,
						infiniteSlider: true,
						responsiveSlideContainer: true,
						responsiveSlides: false,
						autoSlide: 100,
						autoSlideTimer: 700,
						keyboardControls: true,
						navPrevSelector: $("#bottom-slider-prev2"),
						navNextSelector: $("#bottom-slider-next2"),
						stageCSS: {
						overflow: 'hidden'
						}
					}); 
					$( '.launch-overlay' ).simpleOverlay();
    		    NProgress.done();
				
           },
           error: function(xhr){
        	   $('#message').parent().show();
 			  $('#message').parent().addClass('error');
 			  $('#message').html('Database error occurred. See error logs.');
 			  NProgress.done();
 			  return;
	         }
         }
         );    	  
	    
	    return this;
}

function getSessionValues() {
	
	$.ajax({
           type: "POST",
           url: urlCommon,
           data: {action:'getSessionValues'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(data)
           {
        	   var res = data.split(concat);
        	   if(res.length == 2)
        	   {
	        	   message = res[0];
	        	   success = res[1];
	        	   if(message){
	        			  
	        			  if(success){
	        				  if("true" === success){
	        					  var userDetails = jQuery.parseJSON(message);
	        					  $('#headline_first_name').html(userDetails.NAME_USER);
	        					  $('#headline_full_name').html(userDetails.NAME_USER);
	        					  $('#headline_email').html(userDetails.EMAIL);
	        					  $('#headline_category').html(userDetails.CATEGORY);
	        					  if(userDetails.FILENAME != null){
	        						  $('#headline_image').html('<img src="images/artists/'+userDetails.FILENAME+'" alt="" />');
	        					  }else{
	        						  $('#headline_image').html('<span class="glyphicon glyphicon-user icon-size"></span>');
	        					  }	
if(userDetails.CATEGORY != "Admin"){
	        						  $('#manageEvent').html('');	        						  	        					  
	        					  }
	        					  $('.navbar-nav').show();
	        					  $('.register-link').hide();
	        				  }
	        				  else{
	        					  $('.navbar-nav').hide();
	        					  $('.register-link').show();
	        				  }
	        			  }
	        		  }
        	   }
        	   NProgress.done();
           },
           error: function(xhr){
        	   $('#message').parent().show();
 			  $('#message').parent().addClass('error');
 			  $('#message').html('Database error occurred. See error logs.');
 			  NProgress.done();
 			  return;
	         }
         }
         );    	  
	    
	    return this;
}

function logOut() {
	$.ajax({
        type: "POST",
        url: urlCommon,
        data: {action:'logOut'}, // serializes the form's elements.
        beforeSend: function (jqXHR, settings) {
     	   NProgress.start();
     	   // alert("Data: " + this.url + this.data);
     	  },
        success: function(data)
        {
           window.location = '/login.html';	     	   
     	   NProgress.done();
        },
        error: function(xhr){
     	   $('#message').parent().show();
			  $('#message').parent().addClass('error');
			  $('#message').html('Database error occurred. See error logs.');
			  NProgress.done();
			  return;
	         }
      }
      );    	  
	    
	    return this;
}