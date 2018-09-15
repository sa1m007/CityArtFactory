<?php
 
    require_once(realpath(dirname(__FILE__) . "/../../resources/config.php"));
    require_once( LIBRARY_PATH . "/PHPMailerAutoload.php");
    require_once(LIBRARY_PATH . "/templateFunctions.php");
 
    /*
        Now you can handle all your php logic outside of the template
        file which makes for very clean code!
    */
    
    $host   = $config['db1']['host'];
    $dbname = $config['db1']['dbname'];
    $user   = $config['db1']['username'];
    $pass   = $config['db1']['password'];    
    $DBH = null;
    $variables = null;
    $message = null;
    $success = false;
    $concat = "@spl@";
    $tempFolder = '/images/temp'; // Relative to the root    
    $domesticInternationalFolder = '/images/programme'; // Relative to the root
    $artTourismEventFolder = '/images/tourism'; // Relative to the root
    $domesticInternationalFolder1 = '/images/programme'; // Relative to the root
    $artTourismEventFolder1 = '/images/tourism'; // Relative to the root
    $domesticEventfileName = 'domestic';
    $internationalEventfileName = 'international';
    $artTourismfileName = 'tourism';
    $domesticInternationalPath = $_SERVER['DOCUMENT_ROOT'] . $domesticInternationalFolder;
    $artTourismEventPath = $_SERVER['DOCUMENT_ROOT'] . $artTourismEventFolder;
	
    try {
    
    	# MySQL with PDO_MYSQL
    	$DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    	$DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );    	     	
    }
    catch(PDOException $e) {
    	handleError($e->getMessage()." , Line number - ".$e->getLine());
    }               
    
   if (!empty($_FILES))
    {
    	$tempFile = $_FILES['Filedata']['tmp_name'];
    	$tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder;
    	$targetFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];

    	move_uploaded_file($tempFile,$targetFile);
    	//echo $tempFolder . '/' . $_FILES['Filedata']['name'];
    	echo json_encode($_FILES);
    	//echo $tempFile . "---" . $targetFile;   
    }
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
    	
    	if ( strcasecmp( $_POST["action"], 'selectForthComingEvent' ) == 0 ){
    		try {
    			$event_select = $_POST["event_select"];    			
    			$STH = $DBH->query("SELECT `event_id` , `event_type`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y')  as `to_date`, `headline`, `location`, if(`image_id` is NULL,'Not Present','Present') AS PRESENT_IND , (SELECT COUNT(*) FROM `cat_invitation` WHERE event_id = event.event_id) AS total_invitation , (SELECT COUNT(*) FROM `cat_invitation` WHERE event_id = event.event_id and confirmed = 'Y') AS total_confirmed FROM `cat_event` AS event WHERE event_type = '".$event_select."' and past_ind IS NULL ORDER BY event_id");
    	
    			# setting the fetch mode
    			$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    			 
    			$eventDetails =json_encode($result_EventDetails);
    			echo $eventDetails;
    			exit;
    			 
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'selectPastEvent' ) == 0 ){
    		try {
    			$event_select = $_POST["event_select"];
    			$STH = $DBH->query("SELECT `event_id` , `event_type`,DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location`, if(`image_id` is NULL,'Not Present','Present') AS PRESENT_IND , (SELECT COUNT(*) FROM `cat_invitation` WHERE event_id = event.event_id) AS total_invitation , (SELECT COUNT(*) FROM `cat_invitation` WHERE event_id = event.event_id and confirmed = 'Y') AS total_confirmed FROM `cat_event` AS event WHERE event_type = '".$event_select."' and past_ind = 'Y' ORDER BY event_id");
    			 
    			# setting the fetch mode
    			$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    	
    			$eventDetails =json_encode($result_EventDetails);
    			echo $eventDetails;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}    	
    	else if ( strcasecmp( $_POST["action"], 'selectPendingRequest' ) == 0 ){
    		try {
    			$event_select = $_POST["event_select"];
    			$STH = $DBH->query("SELECT USER.`NAME_USER` AS `NAME_USER`, USER.`email` as `email`, USER.`user_id` as `user_id`, EVENT.`event_id` as `event_id`, `headline`, `location`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date` FROM `cat_user` AS USER, `cat_invitation` AS INVITE, `cat_event` AS EVENT WHERE USER.`user_id` = INVITE.`user_id` AND INVITE.`event_id` = EVENT.`event_id` AND event_type = '".$event_select."' AND past_ind IS NULL AND confirmed = 'N' ORDER BY EVENT.`event_id`");
    			 
    			# setting the fetch mode
    			$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    			 
    			$eventDetails =json_encode($result_EventDetails);
    			echo $eventDetails;
    			exit;
    			 
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'selectConfirmedRequest' ) == 0 ){
    		try {
    			$event_select = $_POST["event_select"];
    			$STH = $DBH->query("SELECT USER.`NAME_USER` AS `NAME_USER`, USER.`email` as `email`, USER.`user_id` as `user_id`, EVENT.`event_id` as `event_id`, `headline`, `location`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date` FROM `cat_user` AS USER, `cat_invitation` AS INVITE, `cat_event` AS EVENT WHERE USER.`user_id` = INVITE.`user_id` AND INVITE.`event_id` = EVENT.`event_id` AND event_type = '".$event_select."' AND past_ind IS NULL AND confirmed = 'Y' ORDER BY EVENT.`event_id`");
    			 
    			# setting the fetch mode
    			$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    	
    			$eventDetails =json_encode($result_EventDetails);
    			echo $eventDetails;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'insertEvent' ) == 0 ){
    		try {
    			 
    			$event_type = $_POST["event_type"];
    			$headline = $_POST["headline"];
    			$location = $_POST["location"];
    			$from_date = $_POST["from_date"];
    			$to_date = $_POST["to_date"];
    			$fileData = $_POST["fileData"];
    			$_FILES = json_decode($fileData,true);    		
    			$tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder;     	
    			
    			$from_date = (($from_date == '') ? null : $from_date);
    			$to_date = (($to_date == '') ? null : $to_date);
    			
    			// Step 1 : Insert all the records except the file to be Uploaded
    			$DBH->beginTransaction();
    			$STH = $DBH->prepare("INSERT INTO `cat_event` (`event_type`, `from_date`, `to_date`, `headline`, `location` , `INSERT_DATETIME`, `UPDATE_DATETIME`, `INSERT_USER`) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'ADMIN_ID')");
    			 
    			$STH->bindParam(1, $event_type,PDO::PARAM_STR);
    			$STH->bindParam(2, $from_date,PDO::PARAM_STR);
    			$STH->bindParam(3, $to_date,PDO::PARAM_STR);
    			$STH->bindParam(4, $headline,PDO::PARAM_STR);
    			$STH->bindParam(5, $location,PDO::PARAM_STR);
    		
    			$STH->execute();
    			$eventId = $DBH->lastInsertId();
    			$DBH->commit();
    			
    			$message = "New Event inserted successfully";
    			$success = "true";   				    				
    				
    			// Step 2 : If a new file is there to be uploaded then add the new file.
    			if (!empty($_FILES) && file_exists(rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name']))
    			{
    				$tempFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    				
    				// Validate the file type
    				$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
    				$fileParts = pathinfo($_FILES['Filedata']['name']);
    				 
    				if (in_array($fileParts['extension'],$fileTypes)) {
    						
    					$STH = $DBH->query("SELECT x.`FILENAME` AS FILENAME FROM (SELECT `FILENAME` FROM `cat_image` WHERE IMAGE_TYPE = '".$event_type." Event' ORDER BY IMAGE_ID DESC) AS x LIMIT 1");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    						
    					if($result)	{
    						$newOrder = ((int)substr(substr(strrchr($result['FILENAME'], "-"), 1), 0,strpos(substr(strrchr($result['FILENAME'], "-"), 1),".")))+1;
    					}
    					else {
    						$newOrder = 1;
    					}
    					
    					if($event_type == "Domestic"){
    						$eventfileName = $domesticEventfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    					else if($event_type == "International"){
    						$eventfileName = $internationalEventfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    					else if($event_type == "Eco Art tourism"){
    						$eventfileName = $artTourismfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    						
    					$DBH->beginTransaction();
    					$tempStr = $event_type." Event";
    					$STH = $DBH->prepare("INSERT INTO `cat_image` (`FILENAME` , `IMAGE_TYPE` , `INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,NOW(),NOW(),'ADMIN_ID')");
    					$STH->bindParam(1, $eventfileName,PDO::PARAM_STR);    	
    					$STH->bindParam(2, $tempStr,PDO::PARAM_STR);
    					$STH->execute();
    					$imageId = $DBH->lastInsertId();
    					$DBH->commit();
    						
    						
    					$STH = $DBH->prepare("UPDATE `cat_event` SET `IMAGE_ID` = ? WHERE event_id = ?");
    						
    					$STH->bindParam(1, $imageId,PDO::PARAM_INT);
    					$STH->bindParam(2, $eventId,PDO::PARAM_INT);    					
    						
    					$STH->execute();
    					
    					if($event_type == "Domestic"){
    						$targetFile = rtrim($domesticInternationalPath,'/') . '/' . $eventfileName;
    					}
    					else if($event_type == "International"){
    						$targetFile = rtrim($domesticInternationalPath,'/') . '/' . $eventfileName;
    					}
    					else if($event_type == "Eco Art tourism"){
    						$targetFile = rtrim($artTourismEventPath,'/') . '/' . $eventfileName;
    					}
    					    					
    					if(rename($tempFile,$targetFile))
    					{
    						$success = "true";
    						$message = "New Event inserted successfully";
    					}
    					else {
    						$success = "false";
    						$message = "File move failed";
    					}    					    					
    						
    				} else {
    					$success = "false";
    				}
    		
    			}
    			    			    			 
    			/* ------------------------------------ */
    			echo $message.$concat.$success;
    			exit;
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}    		
    	}
    	else if ( strcasecmp( $_POST["action"], 'updateEvent' ) == 0 ){
    		try {
    			$event_type = $_POST["event_type"];
    			$event_id = $_POST["event_id"];
    			$headline = $_POST["headline"];
    			$location = $_POST["location"];
    			$from_date = $_POST["from_date"];
    			$to_date = $_POST["to_date"];
    			$fileData = $_POST["fileData"];
    			$_FILES = json_decode($fileData,true);
    			$tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder; 
    			
    			$from_date = (($from_date == '') ? null : $from_date);
    			$to_date = (($to_date == '') ? null : $to_date);
    			
    			// Step 1 : Insert all the records except the file to be Uploaded
    			$DBH->beginTransaction();
    			$STH = $DBH->prepare("UPDATE `cat_event` SET `from_date`=?,`to_date`=?,`headline`=?,`location`=?,`UPDATE_DATETIME`=NOW(),`INSERT_USER`='ADMIN_ID' WHERE `event_id` = ? ");
    				    				
    			$STH->bindParam(1, $from_date,PDO::PARAM_STR);
    			$STH->bindParam(2, $to_date,PDO::PARAM_STR);
    			$STH->bindParam(3, $headline,PDO::PARAM_STR);
    			$STH->bindParam(4, $location,PDO::PARAM_STR);
    			$STH->bindParam(5, $event_id,PDO::PARAM_INT);
    					    				
    			$STH->execute();
    			$DBH->commit();
    			$message = "Event updated successfully";
    			$success = "true";    			
    	
    			// Step 2 : If a new file is there to be uploaded then add the new file.
    			if (!empty($_FILES) && file_exists(rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name']))
    			{
    				$tempFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    	
    				// Validate the file type
    				$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
    				$fileParts = pathinfo($_FILES['Filedata']['name']);
    					
    				if (in_array($fileParts['extension'],$fileTypes)) {
    					
    					//Delete old image if present
    					$STH = $DBH->query("SELECT `FILENAME` , `EVENT_TYPE` from `cat_event` AS event , `cat_image` AS img WHERE img.`IMAGE_ID` = event.`IMAGE_ID` AND event.`event_id` = ". $event_id);
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    					// Step 1: Delete the images in the event
    					$deleteFileName = $result['FILENAME'];
    					$deleteEventType = $result['EVENT_TYPE'];
    					if($deleteFileName != null)
    					{
    						if($deleteEventType == "Domestic"){
    							$deleteFileName = rtrim($domesticInternationalPath,'/') . '/' . $deleteFileName;
    						}
    						else if($deleteEventType == "International"){
    							$deleteFileName = rtrim($domesticInternationalPath,'/') . '/' . $deleteFileName;
    						}
    						else if($deleteEventType == "Eco Art tourism"){
    							$deleteFileName = rtrim($artTourismEventPath,'/') . '/' . $deleteFileName;
    						}
    						if (file_exists($deleteFileName)){
    							unlink($deleteFileName);
    						}
    					}    						
    						
    					$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_event` where `event_id` = ". $event_id.")")->execute();    					
    	
    					$STH = $DBH->query("SELECT x.`FILENAME` AS FILENAME FROM (SELECT `FILENAME` FROM `cat_image` WHERE IMAGE_TYPE = '".$event_type." Event' ORDER BY IMAGE_ID DESC) AS x LIMIT 1");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    					
    					if($result)	{
    						$newOrder = ((int)substr(substr(strrchr($result['FILENAME'], "-"), 1), 0,strpos(substr(strrchr($result['FILENAME'], "-"), 1),".")))+1;
    					}
    					else {
    						$newOrder = 1;
    					}
    	
    					if($event_type == "Domestic"){
    						$eventfileName = $domesticEventfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    					else if($event_type == "International"){
    						$eventfileName = $internationalEventfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    					else if($event_type == "Eco Art tourism"){
    						$eventfileName = $artTourismfileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    					}
    					
    					$DBH->beginTransaction();
    					$tempStr = $event_type." Event";
    					$STH = $DBH->prepare("INSERT INTO `cat_image` (`FILENAME` , `IMAGE_TYPE` , `INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,NOW(),NOW(),'ADMIN_ID')");
    					$STH->bindParam(1, $eventfileName,PDO::PARAM_STR);
    					$STH->bindParam(2, $tempStr,PDO::PARAM_STR);
    					$STH->execute();
    					$imageId = $DBH->lastInsertId();
    					$DBH->commit();
    					
    					
    					$STH = $DBH->prepare("UPDATE `cat_event` SET `IMAGE_ID` = ? WHERE event_id = ?");
    					
    					$STH->bindParam(1, $imageId,PDO::PARAM_INT);
    					$STH->bindParam(2, $event_id,PDO::PARAM_INT);
    					
    					$STH->execute();
    						
    					if($event_type == "Domestic"){
    						$targetFile = rtrim($domesticInternationalPath,'/') . '/' . $eventfileName;
    					}
    					else if($event_type == "International"){
    						$targetFile = rtrim($domesticInternationalPath,'/') . '/' . $eventfileName;
    					}
    					else if($event_type == "Eco Art tourism"){
    						$targetFile = rtrim($artTourismEventPath,'/') . '/' . $eventfileName;
    					}
    					
    					if(rename($tempFile,$targetFile))
    					{
    						$success = "true";
    						$message = "Event updated successfully";
    					}
    					else {
    						$success = "false";
    						$message = "File move failed";
    					}
    					
    				} 
    				else {
    					$success = "false";
    				}
    					
    			}
    					
    			/* ------------------------------------ */
    			echo $message.$concat.$success;
    			exit;
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}    	
    	else if ( strcasecmp( $_POST["action"], 'moveToPastEvent' ) == 0 ){
    		try {    			
    			$selectedEvent_id = $_POST["selectedEvent_id"];
	    		
	    		// Loop through each event Id
	    		foreach ($selectedEvent_id as &$eventIdValue) {
	    			
	    			$STH = $DBH->prepare("UPDATE `cat_event` SET `past_ind` = 'Y' WHERE event_id = ?");
	    				
	    			$STH->bindParam(1, $eventIdValue,PDO::PARAM_INT);
	    				
	    			$STH->execute();
	    				    			
	    		}
	    			    		
	    		$message = "Selected Events Moved to Past successfully";
	    		$success = "true";
	    		echo $message.$concat.$success;
	    		exit;
    		
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	} 
    	
    	else if ( strcasecmp( $_POST["action"], 'approveRequest' ) == 0 ){
    		try {

    			$selectedPenInvDetails = json_decode($_POST["jsonObj"], true);
    			 
    			// Loop through each event Id
    			foreach ($selectedPenInvDetails as &$selectedPenInvDetailsValue) {
    	
    				$STH = $DBH->prepare("UPDATE `cat_invitation` SET `confirmed` = 'Y', UPDATE_DATETIME = NOW() WHERE event_id = ? AND user_id = ?");
    				 
    				$STH->bindParam(1, $selectedPenInvDetailsValue['event_id'],PDO::PARAM_INT);
    				$STH->bindParam(2, $selectedPenInvDetailsValue['user_id'],PDO::PARAM_INT);
    				 
    				$STH->execute();
    	
    			}
    			
    			$message = "Selected Pending Requests confirmed successfully";
    			$success = "true";
    			echo $message.$concat.$success;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	    	
    	else if ( strcasecmp( $_POST["action"], 'sendEmailInvitation' ) == 0 ){
    		try {
    			$selectedEvent_id = $_POST["selectedEvent_id"];
    			$successEmailList = "";
    			$failedEmailList = "";
    			$eventFilePath = "";
    			$eventUrl = "";
    			
    			$mail = new PHPMailer;
    			//Whether to use SMTP authentication
    			$mail->SMTPAuth = false;

    			//Set who the message is to be sent from
    			$mail->setFrom('cityartfactory@gmail.com', 'City Art Factory');
    			//Set an alternative reply-to address
    			$mail->addReplyTo('cityartfactory@gmail.com', 'City Art Factory');
    			//Set the subject line
    			$mail->Subject = 'You are cordially Invited';
    			$mail->IsHTML(true);
    			
    			
    			$STH = $DBH->query("SELECT DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y')  as `to_date`, `headline`, `location`, `FILENAME` , `EVENT_TYPE` FROM `cat_event` AS event , `cat_image` AS img WHERE img.`IMAGE_ID` = event.`IMAGE_ID` AND event_id = ".$selectedEvent_id);
    			 
    			# setting the fetch mode
    			$result_EventDetails = $STH->fetch(PDO::FETCH_ASSOC);
    			
    			if($result_EventDetails == null){
    				$message = "Selected Event does not Exists";
    				$success = "false";
    				echo $message.$concat.$success;
    				exit;
    			}
    			    			
    			
    			if($result_EventDetails['EVENT_TYPE'] == "Domestic"){
$domesticInternationalPath = $_SERVER['DOCUMENT_ROOT'] . '/images/programme';
    				$eventFilePath = rtrim($domesticInternationalPath,'/') . '/' . $result_EventDetails['FILENAME'];
    				$eventUrl = "domestic_events.html";    				
    			}
    			else if($result_EventDetails['EVENT_TYPE'] == "International"){
$domesticInternationalPath = $_SERVER['DOCUMENT_ROOT'] . '/images/programme';
    				$eventFilePath = rtrim($domesticInternationalPath,'/') . '/' .  $result_EventDetails['FILENAME'];
    				$eventUrl = "international_events.html";
    			}
    			else if($result_EventDetails['EVENT_TYPE'] == "Eco Art tourism"){
$artTourismEventPath = $_SERVER['DOCUMENT_ROOT'] . '/images/tourism';
    				$eventFilePath = rtrim($artTourismEventPath,'/') . '/' .  $result_EventDetails['FILENAME'];
    				$eventUrl = "art_tourism.html";
    			}
    			$mail->AddEmbeddedImage($eventFilePath, 'eventimg', 'event.jpg');    			
    			
    			$STH = $DBH->query("SELECT EMAIL, NAME_USER FROM cat_user WHERE CATEGORY != 'Admin' ORDER BY INSERT_DATETIME DESC");
    			$STH->setFetchMode(PDO::FETCH_ASSOC);
    			
    			$emailListAllUsers = $STH->fetchAll();
    			
    			// Loop through each users
    			foreach ($emailListAllUsers as &$emailListAllUsersValue) {
    				 
    				$to = $emailListAllUsersValue['EMAIL'];
    				$mail->addAddress($emailListAllUsersValue['EMAIL'], $emailListAllUsersValue['NAME_USER']);    				
    				
    				// Compose a simple HTML email message
    				$message = "<html><body>";
    				//$message .= '<h1 style="color:#f40;">Hi '.$emailListAllUsersValue['NAME_USER'].'</h1>';
    				$message .= "<div style='width:100%;'>";
    				$message .= '<img src="cid:eventimg" style="width:600px;display:block;margin:0 auto;"/><br>';
    			/*	$message .= "<div style='events_block'>";
	    				$message .= '<h2>'.$result_EventDetails['headline'].'</h2>';
	    				if($result_EventDetails['from_date'] == null){
	    					$message .= '<h3> DATES NOT YET FINALIZED </h3>';
	    				}
	    				else{
	    					$message .= '<h3>'.$result_EventDetails['from_date'].' to '.$result_EventDetails['to_date'].'</h3>';
	    				}    				
	    				$message .= '<br><h3>Location : '.$result_EventDetails['location'].'</h3>';*/
	    				$message .= "<a href='http://cityartfactory.com/".$eventUrl."' style='width: 150px;
									    display: block;
									    margin: 1em auto;
									    background-image: linear-gradient(to right,#f6d365 0%,#fda085 51%,#f6d365 100%);
									    font-size: 1.2em;
									    color: #6c69d8;
									    padding: 20px;
									    text-align: center;
									    font-weight: bold;
									    text-decoration: none;
									    text-transform: uppercase;
									    background-size: 200% auto;
									    border-radius: 10px;'>Request Invite</a>";
    				$message .= '</div>';
    			/*	$message .= '<br><br><p>Thanks & Regards</p>';
    				$message .= '<p>Santanu Roy</p>';*/
    				$message .= '</body></html>';
    				
    			/*	$success = "true";
    				echo $message.$concat.$success;
    				exit;*/
    				//handleError($message);
    				
    				$mail->Body = $message;
    				
//if($emailListAllUsersValue['EMAIL'] == "sidd.cse.mckv@gmail.com"){
    				if (!$mail->send()) {    					
    					$failedEmailList = $failedEmailList.$emailListAllUsersValue['EMAIL'].",";     					
    					//handleError("Mailer Error (" . str_replace("@", "&#64;", $emailListAllUsersValue['EMAIL']) . ') ' . $mail->ErrorInfo);
    				}
    				else{
    					$successEmailList = $successEmailList.$emailListAllUsersValue['EMAIL'].",";    					
    				}    				
//}    				   
    				$mail->clearAddresses();
    			}
    			    			
    			$successEmailList = rtrim($successEmailList,',');
    			$failedEmailList = rtrim($failedEmailList,',');
    			
    			if($failedEmailList == ""){
    				$failedEmailList = "None";
    			}
    			if($successEmailList == ""){
    				$successEmailList = "None";
    			}
    			$message = "Success".$concat.$successEmailList.$concat."Failed".$concat.$failedEmailList;
                        //$message = "Success".$concat.$eventFilePath.$concat."Failed".$concat.$failedEmailList;
    			echo $message;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'deleteEvent' ) == 0 ){
    		try {
    			$selectedEvent_id = $_POST["selectedEvent_id"];
    			 
    			// Loop through each event Id
    			foreach ($selectedEvent_id as &$eventIdValue) {
    	
    				$STH = $DBH->query("SELECT `FILENAME` , `EVENT_TYPE` from `cat_event` AS event , `cat_image` AS img WHERE img.`IMAGE_ID` = event.`IMAGE_ID` AND event.`event_id` = ". $eventIdValue);
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    				// Step 1: Delete the images in the event
    				$deleteFileName = $result['FILENAME'];
    				$deleteEventType = $result['EVENT_TYPE'];
    				if($deleteFileName != null)
    				{
    					if($deleteEventType == "Domestic"){
    						$deleteFileName = rtrim($domesticInternationalPath,'/') . '/' . $deleteFileName;
    					}
    					else if($deleteEventType == "International"){
    						$deleteFileName = rtrim($domesticInternationalPath,'/') . '/' . $deleteFileName;
    					}
    					else if($deleteEventType == "Eco Art tourism"){
    						$deleteFileName = rtrim($artTourismEventPath,'/') . '/' . $deleteFileName;
    					}
    					if (file_exists($deleteFileName)){
    						unlink($deleteFileName);
    					}
    				}
    					
    					
    				$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_event` where `event_id` = ". $eventIdValue.")")->execute();
    	
    				// Step 2: Delete all the invitations of that event
    				$DBH->query("DELETE FROM `cat_invitation` where `event_id` = ". $eventIdValue)->execute();
    	
    				// Step 3: Delete the event
    				$DBH->query("DELETE FROM `cat_event` where `event_id` = ". $eventIdValue)->execute();
    			}
    	
    			$message = "Selected Events deleted successfully with all the corresponding images";
    			$success = "true";
    			echo $message.$concat.$success;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	
    }           
 
?>