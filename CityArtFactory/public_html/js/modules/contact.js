var concat = "@spl@";
var url = "scripts/contact.php"; 
var message;
var success;


$(document).ready(function() {
	populateValues();
	
	$(".close").click(
			function () {				
				$(this).parent().hide();
				return false;
			}
		);

	 $("#feedbackForm").submit(function(e) {
		  $('#message').parent().hide(); 
		  $('#message').parent().removeClass('success error');		  		 
		  
		  //clear any errors
		    contactForm.clearErrors();
	
		    //do a little client-side validation -- check that each field has a value and e-mail field is in proper format
		    var hasErrors = false;
		    $('#feedbackForm input,textarea').each(function() {
		      if (!$(this).val()) {
		        hasErrors = true;
		        contactForm.addError($(this));
		      }
		    });
		    var $email = $('#email');
		    if (!contactForm.isValidEmail($email.val())) {
		      hasErrors = true;
		      contactForm.addError($email);
		    }
	
		    //if there are any errors return without sending e-mail
		    if (hasErrors) {
		      return false;
		    }
		    
		  var dataAjax = $('form#feedbackForm').serializeArray();		  		  
		  dataAjax.push({name: 'action',value: 'sendFeedBackMessage'});
		  
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: dataAjax, // serializes the form's elements.
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
			        			  $('#message').parent().show();
			        			  $('#message').html(message);
			        			  
			        			  if(success){
			        				  if("true" === success){
			        					  $('#message').parent().addClass('success');			        					 										  
			        				  }
			        				  else{
			        					  $('#message').parent().addClass('error');
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

		    e.preventDefault(); // avoid to execute the actual submit of the form.
		});
	
	
});

function populateValues() {
	
	$.ajax({
           type: "POST",
           url: url,
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
	        					  
	        					  $('input[name="name"]').val(userDetails.NAME_USER);
	        					  $("#name").prop("readonly", true);	        					  
	        					  
	        					  $('input[name="email"]').val(userDetails.EMAIL);	        					  
	        					  $("#email").prop("readonly", true);
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

//namespace as not to pollute global namespace
var contactForm = {
  isValidEmail: function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  },
  clearErrors: function () {
    $('#emailAlert').remove();
    $('#feedbackForm .help-block').hide();
    $('#feedbackForm .form-group').removeClass('has-error');
  },
  addError: function ($input) {
    $input.siblings('.help-block').show();
    $input.parent('.form-group').addClass('has-error');
  },
  addAjaxMessage: function(msg, isError) {
    $("#feedbackSubmit").after('<div id="emailAlert" class="alert alert-' + (isError ? 'danger' : 'success') + '" style="margin-top: 5px;">' + $('<div/>').text(msg).html() + '</div>');
  }
};