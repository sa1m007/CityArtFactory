var grid;	  	 	  
var grid2;
var pendingRequestGrid;
var InvitedMembersGrid;
var concat = "@spl@";
var options = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  forceFitColumns: true
};
var url = "scripts/admin_event.php"; 
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
		'uploader' : '/scripts/admin_event.php',
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
	  initFileUploadify();	  	  
	
	  $('#message').parent().hide(); 
	  $('#uploaderr').parent().hide(); 
	  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
	  $(this).addClass('current'); // Add class "current" to clicked tab	  
		var currentTab = "#tab1"; // Set variable "currentTab" to the value of href of clicked tab		
		$(currentTab).siblings().hide(); // Hide all content divs
		$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
		$('#tab1-box').addClass('current'); 		
		
	  $('#event-select').change(function(){
		  var eventSelectValue = $("#event-select option:selected").val();
		  populateGrid(eventSelectValue,'Y');
		  populateGrid(eventSelectValue,'N');		  
	  });	
	  
	  $('#event-select-invite').change(function(){
		  var eventSelectValue = $("#event-select-invite option:selected").val();
		  populateInvitationGrid(eventSelectValue,'Y');
		  populateInvitationGrid(eventSelectValue,'N');		  
	  });
		
	  $('#tab2-box').click(function () {
		  $('input[name="event_id"]').val("new");		  
		  $('input[name="headline"]').val("");
		  $('input[name="location"]').val("");
		  $('input[name="from_date"]').val("");
		  $('input[name="to_date"]').val("");
		  $('input[name="to_date"]').datepicker({dateFormat: 'yy-mm-dd'});
		  $('input[name="from_date"]').datepicker({dateFormat: 'yy-mm-dd'});
		  $('#file_upload').uploadify('cancel','*');	
		  initFileUploadify();	
		  
		  $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs		 
		  $(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab2"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
	  });	
	  
	  $('#tab1-box').click(function () {
		  
		  setTimeout(function(){}, 3000);
		  $('#event-select').val("none").attr("selected", true);
		  populateGrid("none",'Y');
		  populateGrid("none",'N');
		  
		    $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
			$(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab1"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab			
		    //populateGrid();
	  });	  	  
	  
	 
	  
	  $('#tab3-box').click(function () {
		  
		  setTimeout(function(){}, 3000);
		  $('#event-select-invite').val("none").attr("selected", true);
		  populateInvitationGrid("none",'Y')
		  populateInvitationGrid("none",'N')		  
		  
		    $(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
			$(this).addClass('current'); // Add class "current" to clicked tab
			var currentTab = "#tab3"; // Set variable "currentTab" to the value of href of clicked tab
			$(currentTab).siblings().hide(); // Hide all content divs
			$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab			
		    //populateGrid();
	  });
	  
	  $("#form1").submit(function(e) {
		  $('#message').parent().hide(); 
		  $('#uploaderr').parent().hide();
		  $('#message').parent().removeClass('success error');
		  
		  if($("#event_type option:selected").val() == "none"){		    			  
			  $('#message').parent().show();
			  $('#message').parent().addClass('error');
			  $('#message').html('Please select event type.'); 
			  return false;
		  }
		  
		  var dataAjax = $('form#form1').serializeArray();		  		  
		  
		  if($('input[name="event_id"]').val() == "new")
		  {
			  dataAjax.push({name: 'action',value: 'insertEvent'});			  
		  }
		  else
		  {
			  dataAjax.push({name: 'action',value: 'updateEvent'});
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
		    var selectedEventIdValue = [];
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
		    	var event_id = gridData[index].event_id;
		    	selectedEventIdValue.push(event_id);	    	   
	    	}
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedEvent_id:selectedEventIdValue,action:'deleteEvent'}, 
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
			        					  populateGrid($("#event_type option:selected").val(),'N');										  
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
	  
	  $('#moveToPast').click(function () {			  
		    var selected = grid.getSelectedRows();
		    var selectedEventIdValue = [];
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
		    	var event_id = gridData[index].event_id;
		    	selectedEventIdValue.push(event_id);	    	   
	    	}
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedEvent_id:selectedEventIdValue,action:'moveToPastEvent'}, 
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
			        					  populateGrid($("#event_type option:selected").val(),'Y');
			        					  populateGrid($("#event_type option:selected").val(),'N');										  
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
	  
	  $('#ApproveButton').click(function () {			  
		    var selected = pendingRequestGrid.getSelectedRows();
		    
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
		    var gridData = pendingRequestGrid.getData();	
		    var jsonObj = [];
		    for(var i = 0; i<selected.length; i++)
		    {
		    	var index = selected[i];
		    	var event_id = gridData[index].event_id;
		    	var user_id = gridData[index].user_id;
		    	
		    	item = {}
		        item ["user_id"] = user_id;
		        item ["event_id"] = event_id;

		        jsonObj.push(item);    	   
	    	}
		    
		    var jsonObjValue = JSON.stringify(jsonObj);
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {jsonObj:jsonObjValue,action:'approveRequest'}, 
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
			        					  populateInvitationGrid($("#event-select-invite option:selected").val(),'Y');
			        					  populateInvitationGrid($("#event-select-invite option:selected").val(),'N');										  
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
	  
	  $('#sendEmailInvitation').click(function () {			  
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
				  $('#message').html('Please select only one event at a time.');
				  return;
			  }	
		    $('#message').parent().hide(); 		    
		    
		    var selectedEventIdValue = grid.getDataItem(selected[0]).event_id;
		    
		    $.ajax({
		           type: "POST",
		           url: url,
		           data: {selectedEvent_id:selectedEventIdValue,action:'sendEmailInvitation'}, 
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
		        	   else if(res.length == 4)
		        	   {
		        		   successMessage = res[1];
			        	   failureMessage = res[3];
			        	   
	        			  $('#message').parent().show();
	        			  $('#message').html('Success : '+ successMessage + ' <br> Failure : ' + failureMessage);
	        			  $('#message').parent().addClass('success');	        			 
			        		  
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
			  
			  $('#tab2-box').addClass('default-tab current'); // Add class "current" to clicked tab
			  $('#tab2').addClass('default-tab'); // Add class "current" to clicked tab
			  $('#tab1-box').removeClass('default-tab current'); // Add class "current" to clicked tab
			  $('#tab1').removeClass('default-tab'); // Add class "current" to clicked tab
			  $('#tab1').hide(); // Hide all content divs
			  $('#tab2').show(); // Show the content div with the id equal to the id of clicked tab
			  
			  
			  var dataSelectedRow = grid.getDataItem(selected[0]);			  			 			 
			  var dateTemp,datetoString;
			  
			  if(dataSelectedRow.from_date != null){
				dateTemp = moment(dataSelectedRow.from_date, "DD-MMM-YYYY");
				datetoString = dateTemp.format('YYYY-MM-DD');
				$('input[name="from_date"]').val(datetoString);
			  }
			  if(dataSelectedRow.to_date != null){
				  dateTemp = moment(dataSelectedRow.to_date, "DD-MMM-YYYY");
				  datetoString = dateTemp.format('YYYY-MM-DD');
				  $('input[name="to_date"]').val(datetoString);
			  }			  
			  
			  setTimeout(function(){}, 3000);
			  $('#event_type').val(dataSelectedRow.event_type).attr("selected", true);
			  $('input[name="headline"]').val(dataSelectedRow.headline);
			  $('input[name="location"]').val(dataSelectedRow.location);			  			  
			  $('input[name="event_id"]').val(dataSelectedRow.event_id);
			  
			  $('#file_upload').uploadify('cancel','*');
			  initFileUploadify();
			  grid.setSelectedRows([]);		  		 
		  });
	  
	  $( "#logOut" ).click(function() {
		  logOut();
	  });
});

function populateGrid(eventSelectValue, past_ind) {
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
           data: {event_select:eventSelectValue,action:actionValue}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);POSITION , TITLE , SIZE , MEDIUM , MASTER_IND
        	  },        	  
           success: function(userData)
           {
        	  var eventDetails = jQuery.parseJSON(userData);
        	  var data = [];	   
    		  var count = 0;
    		  var columns = [];
    		  for(i in eventDetails)
    			  {
    				  data[count++] = {
    					  event_id: eventDetails[i].event_id,
    					  event_type: eventDetails[i].event_type,
    					  from_date: eventDetails[i].from_date,
    					  to_date: eventDetails[i].to_date,
    					  headline: eventDetails[i].headline,
    					  location: eventDetails[i].location,
						  present_ind: eventDetails[i].PRESENT_IND,
						  total_invitation: eventDetails[i].total_invitation,
						  total_confirmed: eventDetails[i].total_confirmed
    				};			
    			  }  
    		
    		  var checkboxSelector = new Slick.CheckboxSelectColumn({
    		      cssClass: "slick-cell-checkboxsel"
    		    });
    		    
    		    var columns2 = [    		  	
    			    {id: "headline", name: "HEADLINE", field: "headline" },
    			    {id: "location", name: "LOCATION", field: "location" },
    			    {id: "from_date", name: "FROM DATE", field: "from_date" },
    			    {id: "to_date", name: "TO DATE", field: "to_date" },
    			    {id: "total_invitation", name: "TOTAL INVITATION", field: "total_invitation" },
    			    {id: "total_confirmed", name: "TOTAL INVITATION CONFIRMED", field: "total_confirmed" },
					{id: "present_ind", name: "IMAGE STATUS", field: "present_ind" }
    			  ];	
    		    
    		    var columns = [
        		  	checkboxSelector.getColumnDefinition(),
        			    {id: "headline", name: "HEADLINE", field: "headline" },
        			    {id: "location", name: "LOCATION", field: "location" },
        			    {id: "from_date", name: "FROM DATE", field: "from_date" },
        			    {id: "to_date", name: "TO DATE", field: "to_date" },
        			    {id: "total_invitation", name: "TOTAL INVITATION", field: "total_invitation" },
        			    {id: "total_confirmed", name: "TOTAL INVITATION CONFIRMED", field: "total_confirmed" },
    					{id: "present_ind", name: "IMAGE STATUS", field: "present_ind" }
        			  ];
    		    
    		    if(past_ind == 'Y'){
    		    	grid2 = new Slick.Grid("#pastGrid", data, columns2, options);
    			}
    			else{
    				grid = new Slick.Grid("#forthComingGrid", data, columns, options);
    				grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
        		    grid.registerPlugin(checkboxSelector);
        		
        		    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);	
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

function populateInvitationGrid(eventSelectValue, confirm_ind) {
	var actionValue = null;
	if(confirm_ind == 'Y'){
		actionValue = "selectConfirmedRequest";
	}
	else{
		actionValue = "selectPendingRequest";
	}
	$.ajax({
           type: "POST",
           url: url,
           data: {event_select:eventSelectValue,action:actionValue}, // serializes the form's elements.
           beforeSend: function (jqXHR, settings) {
        	   NProgress.start();
        	   // alert("Data: " + this.url + this.data);POSITION , TITLE , SIZE , MEDIUM , MASTER_IND
        	  },        	  
           success: function(userData)
           {
        	  var invitationDetails = jQuery.parseJSON(userData);
        	  var data = [];	   
    		  var count = 0;
    		  var columns = [];
    		  for(i in invitationDetails)
    			  {
    				  data[count++] = {
    					  name_user: invitationDetails[i].NAME_USER,
    					  email: invitationDetails[i].email,
    					  user_id: invitationDetails[i].user_id,
    					  event_id: invitationDetails[i].event_id,
    					  headline: invitationDetails[i].headline,
    					  location: invitationDetails[i].location,
    					  from_date: invitationDetails[i].from_date
						  
    				};			
    			  }  
    		
    		  var checkboxSelector = new Slick.CheckboxSelectColumn({
    		      cssClass: "slick-cell-checkboxsel"
    		    });
    		    
    		    var columns2 = [    		  	
    			    {id: "name_user", name: "USER NAME", field: "name_user" },
    			    {id: "email", name: "EMAIL", field: "email" },
    			    {id: "headline", name: "EVENT NAME", field: "headline" },
    			    {id: "location", name: "LOCATION", field: "location" },
    			    {id: "from_date", name: "FROM DATE", field: "from_date" }
    			  ];
    		    
    		    var columns = [    	
    		    	checkboxSelector.getColumnDefinition(),
    			    {id: "name_user", name: "USER NAME", field: "name_user" },
    			    {id: "email", name: "EMAIL", field: "email" },
    			    {id: "headline", name: "EVENT NAME", field: "headline" },
    			    {id: "location", name: "LOCATION", field: "location" },
    			    {id: "from_date", name: "FROM DATE", field: "from_date" }
    			  ];
    		        		        		   
    		    
    		    if(confirm_ind == 'Y'){
    		    	InvitedMembersGrid = new Slick.Grid("#InvitedMembersGrid", data, columns2, options);
    			}
    			else{
    				pendingRequestGrid = new Slick.Grid("#pendingRequestGrid", data, columns, options);
    				pendingRequestGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    				pendingRequestGrid.registerPlugin(checkboxSelector);
        		
        		    var columnpicker = new Slick.Controls.ColumnPicker(columns, pendingRequestGrid, options);	
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