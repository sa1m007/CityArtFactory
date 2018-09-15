var grid;	  	 	  
var concat = "@spl@";
var options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  forceFitColumns: true
};
var url = "scripts/admin.php"; 
var urlCommon = "scripts/commonUtil.php"; 
var message;
var success;
var fileData;

function initFileUploadify() {	         	    
    // file upload
    $('#file_upload').uploadify({
		'formData'     : {
			'timestamp' : '<?php echo $timestamp;?>'
		},
		'swf'      : '/js/uploadify/uploadify.swf',
		'uploader' : '/scripts/admin.php',
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
	
	  getSessionValues();
	  populateGrid("none");
	  initFileUploadify();
	  
	  $('#message').parent().hide(); 
	  $('#uploaderr').parent().hide(); 
	  $('#tab2-box').click(function () {
		  $('input[name="user_id"]').val("new");
		  $('input[name="name_user"]').val("");
		  $('input[name="email"]').val("");
		  $('input[name="password"]').val("");
		  $('input[name="phoneno"]').val("");
		  $("textarea#address").val("");		  
		  
		  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
		  $(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab2"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
	  });	
	  
	  $('#tab1-box').click(function () {		  
		    $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
			$(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab1"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab	
			setTimeout(function(){}, 3000);
			$('#category-select').val("none").attr("selected", true);
			populateGrid("none");
	  });
	  
	  $('#category-select').change(function(){
		  var categorySelectValue = $("#category-select option:selected").val();
		  populateGrid(categorySelectValue);		  
	  });
	  
	  $("#form1").submit(function(e) {
		  var dataAjax = $('form#form1').serializeArray();
		  $('#message').parent().removeClass('success error');		  
		  
		  if($('input[name="email"]').val() == null || $('input[name="email"]').val() == "" || 
				  ( ($('input[name="password"]').val() == null || $('input[name="password"]').val() == "") && $('input[name="user_id"]').val() == "new")
			|| $("#category-type option:selected").val() == "none" ){
			  $('#message').parent().show();
		      $('#message').parent().addClass('error');
			  $('#message').html('Please fill out the mandatory fields column'); 
			  return false;
		  }
		  
		  var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		  if (!reg.test($('input[name="email"]').val())){
			  $('#message').parent().show();
		      $('#message').parent().addClass('error');
			  $('#message').html('Invalid Email Address'); 
			  return false;
		  }
		  
		  if($('input[name="phoneno"]').val() != null){
			  var phoneno = /^\d{10}$/;  
			  if(!$('input[name="phoneno"]').val().match(phoneno))  
			  {  
				  $('#message').parent().show();
			      $('#message').parent().addClass('error');
				  $('#message').html('Phone Number should be 10 digit'); 
				  return false;	         
			  }  
		  }
		  
		  if($('input[name="user_id"]').val() == "new")
		  {
			  dataAjax.push({name: 'action',value: 'insert'});			  
		  }
		  else
		  {
			  dataAjax.push({name: 'action',value: 'update'});
		  }
		  dataAjax.push({name: 'fileData',value: fileData});
		  
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
			        					  $('#file_upload').uploadify('cancel','*');	
			        					  initFileUploadify();
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
	  	  		 
	  
	  $('#deleteButton').click(function () {			  
		    var selected = grid.getSelectedRows();
		    var selectedUserIdValue = [];
		    $('#message').parent().removeClass('success error');
		    if(selected.length == 0){
		    	$('#message').parent().show();
		    	$('#message').parent().addClass('error');
				  $('#message').html('Please select atleast one row.'); 
				  return;
			  }	
		    $('#message').parent().hide(); 
		    var gridData = grid.getData();	
		    for(var i = 0; i<selected.length; i++)
		    {
		    	var index = selected[i];
		    	var user_id = gridData[index].user_id;
		    	selectedUserIdValue.push(user_id);	    	   
	    	}
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedUserId:selectedUserIdValue,action:'delete'}, 
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
			        					  var categorySelectValue = $("#category-select option:selected").val();
			        					  populateGrid(categorySelectValue);
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
		});
	  
	  $('#editButton').click(function () {				  
		//  $('input[name="action"]').val("update");
		  var selected = grid.getSelectedRows();
		  $('#message').parent().removeClass('success error');
		  if(selected.length == 0){
			  $('#message').parent().show();
			  $('#message').parent().addClass('error');
			  $('#message').html('Please select atleast one row.'); 
			  return;
		  }	
		  if(selected.length > 1){
			  $('#message').parent().show();
			  $('#message').parent().addClass('error');
			  $('#message').html('Please select only one row.');
			  return;
		  }		  
		  $('#message').parent().hide(); 
		  
		  var dataSelectedRow = grid.getDataItem(selected[0]);
		  $('input[name="user_id"]').val(dataSelectedRow.user_id);		  
		  $('input[name="name_user"]').val(dataSelectedRow.name_user);
		  $('input[name="email"]').val(dataSelectedRow.email);
		  $('input[name="phoneno"]').val(dataSelectedRow.phone);
		  $("textarea#address").val(dataSelectedRow.address);
		  setTimeout(function(){}, 3000);
		  $('#category-type').val(dataSelectedRow.category).attr("selected", true);
		  
		  $('#uploaderr').parent().hide(); 
		  
		  $('#tab2-box').addClass('default-tab current'); // Add class "current" to clicked tab
		  $('#tab2').addClass('default-tab'); // Add class "current" to clicked tab
		  $('#tab1-box').removeClass('default-tab current'); // Add class "current" to clicked tab
		  $('#tab1').removeClass('default-tab'); // Add class "current" to clicked tab
		  $('#tab1').hide(); // Hide all content divs
		  $('#tab2').show(); // Show the content div with the id equal to the id of clicked tab
		  
		  $('#file_upload').uploadify('cancel','*');	
		  initFileUploadify();		  
		  
		  grid.setSelectedRows([]);		  		 
	  });
	  
	  $( "#logOut" ).click(function() {
		  logOut();
	  });
});

function populateGrid(categorySelectValue) {
		
	$.ajax({
           type: "POST",
           url: url,
           data: {category:categorySelectValue, action:'select'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(userData)
           {
        	  var userDetails = jQuery.parseJSON(userData);
        	  var data = [];	   
    		  var count = 0;
    		  var columns = [];
    		  for(i in userDetails)
    			  {
    				  data[count++] = {
    						  user_id: userDetails[i].USER_ID,
    						  category: userDetails[i].CATEGORY,
    						  name_user: userDetails[i].NAME_USER,
    						  email: userDetails[i].EMAIL,
    						  phone: userDetails[i].PHONENO,
    						  address: userDetails[i].ADDRESS,	
    						  present_ind: userDetails[i].PRESENT_IND
    				};			
    			  }  
    		
    		  var checkboxSelector = new Slick.CheckboxSelectColumn({
    		      cssClass: "slick-cell-checkboxsel"
    		    });
    		    
    		    var columns = [
    		  	checkboxSelector.getColumnDefinition(),
    			    {id: "name_user", name: "ARTIST NAME", field: "name_user" },
    			    {id: "email", name: "EMAIL", field: "email" },
    			    {id: "phone", name: "PHONE NUMBER", field: "phone" },
    			    {id: "address", name: "ADDRESS", field: "address" },	
    			    {id: "present_ind", name: "IMAGE STATUS", field: "present_ind" }
    			  ];	     
    		    
    		    grid = new Slick.Grid("#myGrid", data, columns, options);
    		    grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    		    grid.registerPlugin(checkboxSelector);
    		
    		    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);	    
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
if(userDetails.CATEGORY != "Admin"){
       window.location = '/index.html';
}					  
	        				  }
	        				  else{
	        					 window.location = '/index.html';
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