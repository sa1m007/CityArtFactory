var concat = "@spl@";
var url = "scripts/login.php"; 
var message;
var success;
var fileData;
var close = "<a href='#' class='close' data-dismiss='alert'>&times;</a>";

function initFileUploadify() {	         	    
    // file upload
    $('#file_upload').uploadify({
		'formData'     : {
			'timestamp' : '<?php echo $timestamp;?>'
		},
		'swf'      : '/js/uploadify/uploadify.swf',
		'uploader' : '/scripts/login.php',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.jpeg; *.png',
		 multi     : false, 
		 removeCompleted : false,
		 fileSizeLimit   : 4000,
		 'onUploadSuccess' : function(file, data, response) {
			 	 //message = 'The file was saved to: ' + data;
			 	 fileData = data;			
			 /*	 $('#uploaderr').parent().removeClass('success error');			 	
			  	 $('#uploaderr').html(message);
			     $('#uploaderr').parent().addClass('success');
			     $('#uploaderr').parent().show();*/
	             //alert('The file ' +data.Filedata.name + "--- "+ file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
	        },
	        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
	        	 message = 'The file ' + file.name + ' could not be uploaded: ' + errorMsg;	  
	        	 $('#uploaderr').parent().removeClass('success error');
   			  	 $('#uploaderr').html(message);
   			     $('#uploaderr').parent().addClass('error');
   			     $('#uploaderr').parent().show();
	             //alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
	        },	        
	        'onSelectError' : function(file, errorCode, errorMsg, errorString) {
	        	 message = 'The file ' + file.name + ' could not be uploaded: ' + errorMsg;	    
	        	 $('#uploaderr').parent().removeClass('success error');
   			  	 $('#uploaderr').html(message);
   			     $('#uploaderr').parent().addClass('error');
   			     $('#uploaderr').parent().show();
	             //alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
	        }
	});
}



$(document).ready(function() {
	 
	  $('#message').hide(); 	
	  $('#uploaderr').parent().hide(); 
	  
	  $('.navbar-nav').hide();
	  $('.register-link').show();	  	 
	  
	  initializeForm();
	  initFileUploadify();
	  
	  $("#loginForm").submit(function(e) {
		  $('#message').hide(); 
		  $('#message').removeClass('alert-success alert-danger');		
		  
		  if($('input[name="email_login"]').val() == "" || $('input[name="email_login"]').val() == "" ||
				  $('input[name="password_login"]').val() == "" || $('input[name="password_login"]').val() == ""){
			  $('#message').show();
			  $('#message').addClass('alert-danger');
			  $('#message').html('<strong>Error!</strong> Some mandatory fields are empty.'+close); 
			  return false;
		  }
		  
		  var dataAjax = $('form#loginForm').serializeArray();		  		  
		  
		  dataAjax.push({name: 'action',value: 'loginEvent'});		 
		  
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
			        			  
			        			  if(success){
			        				  if("true" === success){
			        					  if($("#category_type_login option:selected").val() === "Admin")
			        					  {
			        						  window.location = '/admin_artist.html';
			        					  }
			        					  else
		        						  {
			        						  window.location = '/index.html';
		        						  }
			        					 
			        				  }
			        				  else{
			        					  $('#message').show();
					        			  $('#message').html(message+close);					        			  
			        					  $('#message').addClass('alert-danger');
			        				  }
			        			  }
			        		  }
		        	   }
		        	   NProgress.done();
		           },
		           error: function(xhr){
		        	   $('#message').show();
		  			  $('#message').addClass('alert-danger');
		  			  $('#message').html('Database error occurred. See error logs.'+close);
		  			  NProgress.done();
		  			  return;
			         }
		         }
		         );

		    e.preventDefault(); // avoid to execute the actual submit of the form.
		});
	  
	  
	  $("#registrationForm").submit(function(e) {
		  var dataAjax = $('form#registrationForm').serializeArray();
		  $('#message').hide(); 
		  $('#message').removeClass('alert-success alert-danger');		  
		  
		  if($('input[name="email"]').val() == null || $('input[name="email"]').val() == "" || 
				  $('input[name="password"]').val() == null || $('input[name="password"]').val() == "" 
			|| $("#category-type option:selected").val() == "none" ){
			  $('#message').show();
  			  $('#message').addClass('alert-danger');
			  $('#message').html('Please fill out the mandatory fields column'+close); 
			  return false;
		  }
		  
		  var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		  if (!reg.test($('input[name="email"]').val())){
			  $('#message').show();
  			  $('#message').addClass('alert-danger');
			  $('#message').html('Invalid Email Address'+close); 
			  return false;
		  }
		  
		  if($('input[name="phoneno"]').val() != null){
			  var phoneno = /^\d{10}$/;  
			  if(!$('input[name="phoneno"]').val().match(phoneno))  
			  {  
				  $('#message').show();
	  			  $('#message').addClass('alert-danger');
				  $('#message').html('Phone Number should be 10 digit'+close); 
				  return false;	         
			  }  
		  }
		  
		  dataAjax.push({name: 'fileData',value: fileData});
		  dataAjax.push({name: 'action',value: 'insert'});
		  
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
			        			  $('#message').show();
			        			  $('#message').html(message+close);
			        			  
			        			  if(success){
			        				  if("true" === success){
			        					  $('#message').addClass('alert-success');		
			        					  initializeForm();
			        				  }
			        				  else{
			        					  $('#message').addClass('error');
			        				  }
			        				  $('#file_upload').uploadify('cancel','*');	
		        					  initFileUploadify();
			        			  }
			        		  }
		        	   }
		        	   NProgress.done();
		           },
		           error: function(xhr){
		        	   $('#message').show();
			  		  $('#message').addClass('alert-danger');
		  			  $('#message').html('Database error occurred. See error logs.'+close);
		  			  NProgress.done();
		  			  return;
			         }
		         }
		         );

		    e.preventDefault(); // avoid to execute the actual submit of the form.
		});
	  
});

function initializeForm()
{
	 $('input[name="email_login"]').val("");
	  $('input[name="password_login"]').val("");
	  
	  // TODO - category_type 
	  $('input[name="name_user"]').val("");
	  $('input[name="email"]').val("");
	  $('input[name="password"]').val("");
	  $('input[name="phoneno"]').val("");
	  $('input[name="offer_ind"]').attr('checked',false);
	  $("textarea#address").val("");	  	 
}