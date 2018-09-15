var grid;	  	 	  
var grid2;	
var concat = "@spl@";
var options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  forceFitColumns: true
};
var url = "scripts/admin_egallery.php"; 
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
		'uploader' : '/scripts/admin_egallery.php',
		'fileTypeDesc' : 'Image Files',
        'fileTypeExts' : '*.gif; *.jpg; *.jpeg; *.png',
		 multi     : false, 		 
		 removeCompleted : false,
		 fileSizeLimit   : 4000,
		 'onUploadSuccess' : function(file, data, response) {
			 	 //message = 'The file was saved to: ' + data;
			 	 fileData = data;			
	/*		 	 $('#uploaderr').parent().removeClass('success error');			 	
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
	  initFileUploadify();
	  setSlotId();
	  populateSlotGrid();
	
	  $('#message').parent().hide(); 
	  $('#uploaderr').parent().hide(); 
	  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
	  $(this).addClass('current'); // Add class "current" to clicked tab	  
		var currentTab = "#tab1"; // Set variable "currentTab" to the value of href of clicked tab		
		$(currentTab).siblings().hide(); // Hide all content divs
		$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
		$('#tab1-box').addClass('current'); 
		var currentTab = "#tab3";
		$(currentTab).show();
		
	  $('#position-select').change(function(){
		  var slotIdValue = $("#slot_number_copied_select option:selected").val();
		  $('#message').parent().removeClass('success error');
		  if(slotIdValue == "none"){	
			message = "Please select a slotId first";
			$('#message').parent().addClass('error');
			$('#message').parent().show();
			$('#message').html(message);
			setTimeout(function(){}, 3000);
			$("#position-select").val("none").attr("selected", true);	
		  }
		  else{
			   if($('#position-select').val() == "1"){			  			  
				  $('#position-select-available').show();
				  $('#position-select-used').hide();
				  setAvailablePosition(slotIdValue);				  
			  }
			  else if($('#position-select').val() == "2"){
				  $('#position-select-used').show();
				  $('#position-select-available').hide();
				  setUsedPosition(slotIdValue,"");			  
			  }
		  }		  
	  });
	  
	  $('#slot_number_copied_select').change(function(){
		  var slotIdValue = $('#slot_number_copied_select').val();
		  if(slotIdValue != "none"){
			  populateImageGrid(slotIdValue);
			  $('input[name="title"]').val("");
			  $('input[name="size"]').val("");
			  $('input[name="medium"]').val("");
			  $('#position-select-available').hide();
			  $('#position-select-used').hide();      
			  $('input[name="actionImage"]').val("new");
		  }			  
	  });
		
	  $('#tab1-box').click(function () {	
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
		  setSlotId();
		  populateSlotGrid();
		  
		  $('input[name="slot_description"]').val("");		  
		  
		  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
		  $(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab1"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
			var currentTab = "#tab3";
			$(currentTab).show();
	  });	
	  
	  $('#tab2-box').click(function () {
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
		  setImageForm();		  
		  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
		  $(this).addClass('current'); // Add class "current" to clicked tab
	  });
	  
	  $("#form2").submit(function(e) {
		  var dataAjax = $('form#form2').serializeArray();
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
		  $('#message').parent().removeClass('success error');
		  if($('input[name="action"]').val() == "insertNewSlot")
		  {
			  dataAjax.push({name: 'action',value: 'insertNewSlot'});			  
		  }
		  else
		  {
			  dataAjax.push({name: 'action',value: 'updateExistingSlot'});
		  }
		  
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
			        					  setImageForm();
										  setSlotDropdown($('input[name="slot_number"]').val());										  
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
	  
	  $("#form1").submit(function(e) {
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
		  $('#message').parent().removeClass('success error');
		  
		  if(!($('#position-select').val() == "1" || $('#position-select').val() == "2")){		    			  
			  $('#message').parent().show();
			  $('#message').parent().addClass('error');
			  $('#message').html('Please select position method.'); 
			  return false;
		  }
		  
		  var dataAjax = $('form#form1').serializeArray();		  		  
		  
		  if($('input[name="actionImage"]').val() == "new")
		  {
			  dataAjax.push({name: 'action',value: 'insertImageInSlot'});			  
		  }
		  else
		  {
			  dataAjax.push({name: 'action',value: 'updateImageInSlot'});
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
			        					  $("#position-select").val("none");
			        					  $('#position-select-available').hide();
			        					  $('#position-select-used').hide();
										  populateImageGrid($("#slot_number_copied_select option:selected").val());	
$('input[name="actionImage"]').val("new");									  
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
	  	  		 
	  
	  $('#deleteSlotButton').click(function () {			  
		    var selected = grid2.getSelectedRows();
		    var selectedSlotIdValue = [];
		    $('#message').parent().hide(); 
			$('#uploaderr').parent().hide();
		    $('#message').parent().removeClass('success error');
		    if(selected.length == 0){
		    	$('#message').parent().show();
		    	$('#message').parent().addClass('error');
				  $('#message').html('Please select atleast one row.'); 
				  return;
			  }	
		    $('#message').parent().hide(); 
		    var gridData = grid2.getData();	
		    for(var i = 0; i<selected.length; i++)
		    {
		    	var index = selected[i];
		    	var slot_id = gridData[index].slot_id;
		    	selectedSlotIdValue.push(slot_id);	    	   
	    	}
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedSlotId:selectedSlotIdValue,action:'deleteSlot'}, 
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
										  setSlotId();
			        					  populateSlotGrid();										  
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
	  
	  $('#deleteImageButton').click(function () {			  
		    var selected = grid.getSelectedRows();
		    var selectedPositionValue = [];
		    $('#message').parent().hide(); 
			$('#uploaderr').parent().hide();
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
		    	var position = gridData[index].position;
		    	selectedPositionValue.push(position);	    	   
	    	}
		    
		    var selectedSlotIdValue = gridData[0].slot_id;
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedPosition:selectedPositionValue,selectedSlotId:selectedSlotIdValue,action:'deleteImage'}, 
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
			        					  populateImageGrid($("#slot_number_copied_select option:selected").val());
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
	  
	  $('#editSlotButton').click(function () {				  
		
		var selected = grid2.getSelectedRows();
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
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
		  
		  var dataSelectedRow = grid2.getDataItem(selected[0]);
		  $('input[name="slot_number"]').val(dataSelectedRow.slot_id);		  
		  $('input[name="slot_description"]').val(dataSelectedRow.slot_description);
		  $('input[name="action"]').val("updateExistingSlot");
		  populateImageGrid(dataSelectedRow.slot_id);
		  
		  message = "Edit the slot Id - "+ dataSelectedRow.slot_id + " and click Save & Next to update the Image in the slot";
		  
		  $('#message').parent().show();
		  $('#message').html(message);
		  $('#message').parent().addClass('success');
		  
		  grid2.setSelectedRows([]);		  		 
	  });
	  
	  $('#editImageButton').click(function () {				  
			  var selected = grid.getSelectedRows();
			  $('#message').parent().hide(); 
			  $('#uploaderr').parent().hide();
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
			  
			  var dataSelectedRow = grid.getDataItem(selected[0]);
			  $('#slot_number_copied_select').val(dataSelectedRow.slot_id);
			  $('input[name="title"]').val(dataSelectedRow.title);
			  $('input[name="size"]').val(dataSelectedRow.size);
			  $('input[name="medium"]').val(dataSelectedRow.medium);			 
			  
			  if(dataSelectedRow.master_ind == 'Y'){
				  $("input[name=master_ind][value='Y']").prop("checked",true);
				  $("input[name=master_ind][value='N']").prop("checked",false);
			  }
			  else{
				  $("input[name=master_ind][value='N']").prop("checked",true);
				  $("input[name=master_ind][value='Y']").prop("checked",false);
			  }
			  
			  $('#position-select-available').hide();
			  $('#position-select-used').show(); 
			  setUsedPosition(dataSelectedRow.slot_id,dataSelectedRow.position);
			  $("#position-select").val("2").attr("selected", true);			  			  
			  $('input[name="position-select-hidden"]').val(dataSelectedRow.position);
			  
			  $('input[name="actionImage"]').val("updateExistingSlot");		
			  $('#file_upload').uploadify('cancel','*');
			  initFileUploadify();
			  grid.setSelectedRows([]);		  		 
		  });
	  
	  $( "#logOut" ).click(function() {
		  logOut();
	  });
});

function setSlotId() {
	
	$('input[name="action"]').val("insertNewSlot");
	
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'getSlotId'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(slotData)
           {
        	  var slotId = (jQuery.parseJSON(slotData))[0].SLOT_ID;        	    
        	  $('input[name="slot_number"]').val(slotId);
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

function setAvailablePosition(slotIdValue) {
	
	$.ajax({
           type: "POST",
           url: url,
           data: {slotId:slotIdValue,action:'getAvailablePosition'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(slotDataValue)
           {
        	   var selectbox = document.getElementById("position-select-available");        	   
        	   for(var i = selectbox.options.length - 1 ; i >= 0 ; i--)
        	   {
        	        selectbox.remove(i);
        	   }
        	   
        	   slotData = jQuery.parseJSON(slotDataValue);
        	   for (var field in slotData) {
        	         $('<option value="'+ slotData[field].SLOT_LEFT +'">' + slotData[field].SLOT_LEFT + '</option>').appendTo('#position-select-available');
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

function setUsedPosition(slotIdValue,position) {
	
	$.ajax({
           type: "POST",
           url: url,
           data: {slotId:slotIdValue,action:'getUsedPosition'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(slotDataValue)
           {
        	   var selectbox = document.getElementById("position-select-used");        	   
        	   for(var i = selectbox.options.length - 1 ; i >= 0 ; i--)
        	   {
        	        selectbox.remove(i);
        	   }
        	   
        	   slotData = jQuery.parseJSON(slotDataValue);
        	   for (var field in slotData) {
        	         $('<option value="'+ slotData[field].SLOT_USED +'">' + slotData[field].SLOT_USED + '</option>').appendTo('#position-select-used');
        	    }        	   
        	   setTimeout(function(){}, 3000);
 			  	$("#position-select-used").val(position).attr("selected", true);	       	         	            	  
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

function setSlotDropdown(slotDefaultValue) {
	
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'selectSlot'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);
        	  },
           success: function(slotDataValue)
           {
        	   var selectbox = document.getElementById("slot_number_copied_select");        	   
        	   for(var i = selectbox.options.length - 1 ; i >= 0 ; i--)
        	   {
        	        selectbox.remove(i);
        	   }
        	   
        	   slotData = jQuery.parseJSON(slotDataValue);
			    $('<option value="none"> Select </option>').appendTo('#slot_number_copied_select');
        	   for (var field in slotData) {
        	         $('<option value="'+ slotData[field].SLOTID +'">' + slotData[field].SLOTID + '</option>').appendTo('#slot_number_copied_select');
        	    }        	        			 
				setTimeout(function(){}, 3000);
				$("#slot_number_copied_select").val(slotDefaultValue).attr("selected", true);	
				if(slotDefaultValue == "none"){
					populateImageGrid(0);				
				}
				else{
					populateImageGrid(slotDefaultValue);				
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

function setImageForm()
{
	$('input[name="title"]').val("");
    $('input[name="size"]').val("");
    $('input[name="medium"]').val("");
	$("#position-select").val("none");
    $('#position-select-available').hide();
    $('#position-select-used').hide();      
    $('input[name="actionImage"]').val("new");
    setSlotDropdown("none");
	populateImageGrid(0);
		
	$('#file_upload').uploadify('cancel','*');	
	initFileUploadify();
    
    $('#tab2-box').parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
	$('#tab2-box').addClass('current'); // Add class "current" to clicked tab
	var currentTab = "#tab2"; // Set variable "currentTab" to the value of href of clicked tab
	$(currentTab).siblings().hide(); // Hide all content divs
	$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
}

function populateSlotGrid() {
	
	$.ajax({
           type: "POST",
           url: url,
           data: {action:'selectSlot'}, // serializes the form's elements.
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
    						  slot_id: userDetails[i].SLOTID,
    						  slot_description: userDetails[i].SLOTDESCRIPTION,
    						  no_of_images: userDetails[i].NOOFIMAGES
    				};			
    			  }  
    		
    		  var checkboxSelector = new Slick.CheckboxSelectColumn({
    		      cssClass: "slick-cell-checkboxsel"
    		    });
    		    
    		    var columns = [
    		  	checkboxSelector.getColumnDefinition(),
    			    {id: "slot_id", name: "SLOT ID", field: "slot_id" },
    			    {id: "slot_description", name: "SLOT DESCRIPTION", field: "slot_description" },
    			    {id: "no_of_images", name: "NO. OF IMAGES IN SLOT", field: "no_of_images" }
    			  ];	     
    		    
    		    grid2 = new Slick.Grid("#myGrid2", data, columns, options);
    		    grid2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    		    grid2.registerPlugin(checkboxSelector);
    		
    		    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid2, options);	    
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

function populateImageGrid(slotIdValue) {
	
	$.ajax({
           type: "POST",
           url: url,
           data: {slotId:slotIdValue,action:'getImageOfSlot'}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);POSITION , TITLE , SIZE , MEDIUM , MASTER_IND
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
    						  slot_id: userDetails[i].SLOTID,
    						  position: userDetails[i].POSITION,
    						  title: userDetails[i].TITLE,
    						  size: userDetails[i].SIZE,
    						  medium: userDetails[i].MEDIUM,
    						  master_ind: userDetails[i].MASTER_IND,
							  present_ind: userDetails[i].PRESENT_IND
    				};			
    			  }  
    		
    		  var checkboxSelector = new Slick.CheckboxSelectColumn({
    		      cssClass: "slick-cell-checkboxsel"
    		    });
    		    
    		    var columns = [
    		  	checkboxSelector.getColumnDefinition(),
    			    {id: "position", name: "SLOT POSITION", field: "position" },
    			    {id: "title", name: "TITLE", field: "title" },
    			    {id: "size", name: "SIZE", field: "size" },
    			    {id: "medium", name: "MEDIUM", field: "medium" },
    			    {id: "master_ind", name: "MASTER INDICATOR", field: "master_ind" },
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