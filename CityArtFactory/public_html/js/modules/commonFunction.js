var concat = "@spl@";
var urlCommon = "scripts/commonUtil.php"; 
var message;
var success;




$(document).ready(function() {
		
	$('#message').parent().hide();
	
	$('.navbar-nav').hide();
	$('.register-link').show();
	  
	getSessionValues();
    
    $( "#logOut" ).click(function() {
		  logOut();
	  });
		
});


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