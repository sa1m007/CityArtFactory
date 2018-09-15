var concat = "@spl@";
var url = "scripts/events.php"; 
var message;
var success;




$(document).ready(function() {
		
	populateEvent('N','Eco Art Tourism');			// ForthComing Event			  
	populateEvent('Y','Eco Art Tourism');			// Past Event	
	
	$( "#dialog-confirm" ).dialog({
	      resizable: false,
	      height: "auto",
	      width: 400,
	      modal: true,
	      autoOpen:false,
	      buttons: {
	        "Login Now": function() {
	        	window.location = '/login.html';
	        },
	        Cancel: function() {
	          $( this ).dialog( "close" );
	          $('#dialog-confirm').hide();
	        }
	      }
	 });
	
	 $( "#dialog-message" ).dialog({
	      modal: true,
	      autoOpen:false,
	      buttons: {
	        Ok: function() {
	        	window.location = '/domestic_events.html';
	        }
	      }
	    });
	
});

function populateEvent(past_ind,event_typeValue) {
		
	var actionValue = null;
	if(past_ind == 'Y'){
		actionValue = "selectPastEvent";
	}
	else{
		actionValue = "selectForthComingEvent";
	}
	
	$.ajax({
           type: "POST",
           url: url,
           data: {action:actionValue,event_type:event_typeValue}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(userData)
           {
        	  var eventDetails = jQuery.parseJSON(userData);
			  var from_date,to_date,headline,location,image_name;
			  var tempString = "";
    		  for(i in eventDetails)
    			  { 
    			  		event_id  = eventDetails[i].event_id;
						from_date = eventDetails[i].from_date;
    					to_date = eventDetails[i].to_date;
    					headline = eventDetails[i].headline;
    					location = eventDetails[i].location;
						image_name = eventDetails[i].IMAGE_NAME; 
						invitation_status = eventDetails[i].INVITATION_STATUS;
						
						tempString = "";
						
						tempString = tempString + '<li><a href="#" >'; 	
						tempString = tempString + '<img src="images/tourism/'+ image_name + '" alt=""></a>';
						tempString = tempString + '<div><div>';									
						tempString = tempString + '<h2>'+ headline + '</h2>';
						
						if(from_date == null){
							tempString = tempString + '<h3>DATES YET TO BE FINALIZED</h3>';
						}
						else{
							tempString = tempString + '<h3>'+ from_date + ' to '+ to_date + '</h3>';
						}
						
						if(location != null && location != "")
						{
							tempString = tempString + '<span>Location : '+ location + '</span>';
						}
						else
						{
							tempString = tempString + '<span>Location : Not decided yet</span>';
						}
						
						if(past_ind == 'N'){
							
							if(invitation_status == 2)
							{
								tempString = tempString + '<br><br> <h3> Invitation Confirmed by Admin </h3>';
							}
							else if(invitation_status == 3)
							{
								tempString = tempString + '<br><br> <h3> Invitation Pending with Admin </h3>';
							}
							else{
								tempString = tempString + '<button class="request_button" onclick="requestInvite('+event_id+ ')">Request Invite</button>';								
							}
						}
						tempString = tempString + '</div></div></li>';	
						
						if(past_ind == 'Y'){
							$("#past").append(tempString);
						}
						else{
							$("#forthcoming").append(tempString);	
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


function requestInvite(event_id) {
	
	if($('#headline_email').text() == "")
	{	 
		$( "#dialog-confirm" ).dialog('open');
	}
	else
	{
		var event_idValue = event_id;
		var actionValue = "inviteEvent";
		var emailValue = $('#headline_email').text();
		
		$.ajax({
	           type: "POST",
	           url: url,
	           data: {action:actionValue,event_id:event_idValue,email:emailValue}, // serializes the form's elements.
	           beforeSend: function (jqXHR, settings) {
	        	   NProgress.start();
	        	   // alert("Data: " + this.url + this.data);
	        	  },
	           success: function(userData)
	           {
	        	   var res = userData.split(concat);
	        	   if(res.length == 2)
	        	   {
		        	   message = res[0];
		        	   success = res[1];
		        	   if(message){
		        			  
		        			  if(success){		        				  
		        				  if("true" === success){		        					  
		        					  $("#dialog-message p").html(
		        					  "<span class='ui-icon ui-icon-circle-check' style='float:left; margin:0 7px 50px 0;'></span>"+
		        					  message
		        					  );	
		        					  $("#dialog-message").dialog("open");
		        				  }
		        				  else{
		        					  $("#dialog-message p").html(
		        					  "<span class='ui-icon ui-icon-alert' style='float:left; margin:12px 12px 20px 0;'>"+
		        					  message
		        					  );
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
	}
	
}