

	  	 	  
var concat = "@spl@";
var url = "scripts/egallery.php"; 
var message;
var success;




$(document).ready(function() {
		
	$('.inner-mid-area-egallery').show();
	$('.inner-egallery-child').hide();
	
	populateEgallery();			// ForthComing Event			
	
	$('#backToEgallery').click(function () {		  
		$('.inner-mid-area-egallery').show();
		$('.inner-egallery-child').hide();
		
		populateEgallery();	
  });
		
});

function populateEgallery() {
		
	$("#egallery-master").html("");
	
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'fetchEgalleryMaster'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(userData)
           {
        	  var eventDetails = jQuery.parseJSON(userData);
			  var slotid,title,size,medium,filename;
			  var tempString = "";
    		  for(i in eventDetails)
    			  { 
    			  		slotid  = eventDetails[i].SLOTID;
						title = eventDetails[i].TITLE;
    					size = eventDetails[i].SIZE;
    					medium = eventDetails[i].MEDIUM;
    					filename = eventDetails[i].FILENAME;						
						
						tempString = "";						
						
						tempString = tempString + '<li><a href="#" onclick=getSlotDetails('+slotid+') '; 	
						tempString = tempString + 'title="'+ title + '"> ';
						tempString = tempString + '<img alt="'+ title + '" ';
						tempString = tempString + 'src=images/egallery/'+ filename +'>';									
						tempString = tempString + '</a></li>';
												
						$("#egallery-master").append(tempString);
						
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

function getSlotDetails(slotIdValue)
{
	$('.inner-mid-area-egallery').hide();
	$('.inner-egallery-child').show();
	
	$("#thumbnail-slider").html('<div class="inner" style="width:100% !important;">'+
    '<ul id="inner-egallery-child-thumb">'    +              
    '</ul>'+
    '</div>'+
	'<div id="closeBtn">CLOSE</div>');

	$("#egallery-child").html("");
	
	$.ajax({
        type: "POST",
        url: url,
        data: {slotId:slotIdValue, action:'fetchEgalleryChild'}, // serializes the form's elements.
        beforeSend: function (jqXHR, settings) {
     	   NProgress.start();
     	   // alert("Data: " + this.url + this.data);
     	  },
        success: function(userData)
        {
     	  var eventDetails = jQuery.parseJSON(userData);
		  var position,title,size,medium,filename;
		  var tempString = "";
 		  for(i in eventDetails)
 			  { 
 			  		position  = eventDetails[i].POSITION;
					title = eventDetails[i].TITLE;
 					size = eventDetails[i].SIZE;
 					medium = eventDetails[i].MEDIUM;
 					filename = eventDetails[i].FILENAME;						
						
					tempString = "";
					tempString2 = "";
											
					tempString = tempString + '<li><a href="#" '; 	
					tempString = tempString + 'title="'+ title + '"> ';
					tempString = tempString + '<div class="wrapper"><img alt="'+ title + '" ';
					tempString = tempString + 'src=images/egallery/'+ filename +'>';									
					tempString = tempString + '<div class="description">';
					tempString = tempString + '<p>Size- '+ size + '</p>';
					tempString = tempString + '<p>Medium- '+ medium + '</p>';
					tempString = tempString + '<p style="color:#0789ac;">Click to enlarge</p>';
					tempString = tempString + '</div></div></a></li>';
											
					$("#egallery-child").append(tempString);
					
					tempString2 = tempString2 + '<li><a class="thumb" '; 	
					tempString2 = tempString2 + 'href="images/egallery/'+ filename + '"> ';
					tempString2 = tempString2 + '</a></li>';
															
					$("#inner-egallery-child-thumb").append(tempString2);					
						
 			  }      		    		    
				  	
 		  
	 		 //Note: this script should be placed at the bottom of the page, or after the slider markup. It cannot be placed in the head section of the page.
	          var thumbSldr = document.getElementById("thumbnail-slider");
	          var closeBtn = document.getElementById("closeBtn");
	          var galleryImgs = document.getElementById("myGallery").getElementsByTagName("li");
	          var mcThumbnailSlider = new ThumbnailSlider(thumbnailSliderOptions);
	          for (var i = 0; i < galleryImgs.length; i++) {
	              galleryImgs[i].index = i;
	              galleryImgs[i].onclick = function (e) {
	                  var li = this;
	                  thumbSldr.style.display = "block";
	                  mcThumbnailSlider.init(li.index);
	              };
	          }
	
	          thumbSldr.onclick = closeBtn.onclick = function (e) {
	              //This event will be triggered only when clicking the area outside the thumbs or clicking the CLOSE button
	              thumbSldr.style.display = "none";
	          };
          
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