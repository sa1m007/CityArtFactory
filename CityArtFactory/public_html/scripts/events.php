<?php
 
    require_once(realpath(dirname(__FILE__) . "/../../resources/config.php"));
 
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
    $tempFolder = '/CityArtFactory/public_html/images/temp'; // Relative to the root    
    $domesticInternationalFolder = '/CityArtFactory/public_html/images/programme'; // Relative to the root
    $artTourismEventFolder = '/CityArtFactory/public_html/images/tourism'; // Relative to the root
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
    
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
    	
    	if ( strcasecmp( $_POST["action"], 'selectForthComingEvent' ) == 0 ){
    		try {
    			$eventtype = $_POST["event_type"];
    			
    			session_start();
    			    			
    			if(isset($_SESSION["userDetails"]) && !empty($_SESSION["userDetails"]))
    			{    				 
    				$userDetails = $_SESSION["userDetails"];
    				$email = $userDetails["EMAIL"];
    				$user_id = null;
    				 
    				$STH = $DBH->query("SELECT USER_ID FROM cat_user WHERE EMAIL = '".$email."'");
    				# setting the fetch mode
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    				 
    				if($result['USER_ID'] == null){
    					$message = "The User is not Registered";
    					$success = "false";
    					echo $message.$concat.$success;
    					exit;
    				}
    				$user_id = $result['USER_ID'];
    				
    				$STH = $DBH->query("SELECT event.`event_id` AS `event_id`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location` , image.`filename` AS IMAGE_NAME , CASE WHEN invite.`event_id` IS NULL THEN 1 WHEN invite.`confirmed` = 'Y' THEN 2 WHEN invite.`confirmed` = 'N' THEN 3 ELSE 4 END AS INVITATION_STATUS FROM `cat_event` AS event INNER JOIN `cat_image` image ON image.`image_id` = event.`image_id` LEFT OUTER JOIN `cat_invitation` invite ON event.`event_id` = invite.`event_id` and `user_id` = ".$user_id." WHERE past_ind IS NULL and `event_type` = '".$eventtype."' ORDER BY -from_date DESC");
    				
    				# setting the fetch mode
    				$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    				 
    				$eventDetails =json_encode($result_EventDetails);
    				echo $eventDetails;
    				exit;
    			}
    			else {
    				$STH = $DBH->query("SELECT `event_id`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location` , image.`filename` AS IMAGE_NAME FROM `cat_event` AS event , `cat_image` image WHERE image.`image_id` = event.`image_id` and past_ind IS NULL and `event_type` = '".$eventtype."' ORDER BY -from_date DESC");
    				
    				# setting the fetch mode
    				$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    				 
    				$eventDetails =json_encode($result_EventDetails);
    				echo $eventDetails;
    				exit;
    			}    			    			
    			    			    			
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'selectPastEvent' ) == 0 ){
    		try {
    			$eventtype = $_POST["event_type"];
    			
    			session_start();
    			
    			if(isset($_SESSION["userDetails"]) && !empty($_SESSION["userDetails"]))
    			{    					
    				
    				$userDetails = $_SESSION["userDetails"];
    				$email = $userDetails["EMAIL"];
    				$user_id = null;
    					
    				$STH = $DBH->query("SELECT USER_ID FROM cat_user WHERE EMAIL = '".$email."'");
    				# setting the fetch mode
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    					
    				if($result['USER_ID'] == null){
    					$message = "The User is not Registered";
    					$success = "false";
    					echo $message.$concat.$success;
    					exit;
    				}
    				$user_id = $result['USER_ID'];
    				
	    			$STH = $DBH->query("SELECT event.`event_id` AS `event_id`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location` , image.`filename` AS IMAGE_NAME , CASE WHEN invite.`event_id` IS NULL THEN 1 WHEN invite.`confirmed` = 'Y' THEN 2 WHEN invite.`confirmed` = 'N' THEN 3 ELSE 4 END AS INVITATION_STATUS FROM `cat_event` AS event INNER JOIN `cat_image` image ON image.`image_id` = event.`image_id` LEFT OUTER JOIN `cat_invitation` invite ON event.`event_id` = invite.`event_id` and `user_id` = ".$user_id." WHERE past_ind = 'Y' and `event_type` = '".$eventtype."' ORDER BY -from_date DESC");
	    			 
	    			# setting the fetch mode
	    			$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
	    	
	    			$eventDetails =json_encode($result_EventDetails);
	    			echo $eventDetails;
	    			exit;
	    		}
    			else 
    			{
    				$STH = $DBH->query("SELECT `event_id`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location` , image.`filename` AS IMAGE_NAME FROM `cat_event` AS event , `cat_image` image WHERE image.`image_id` = event.`image_id` and past_ind = 'Y' and `event_type` = '".$eventtype."' ORDER BY -from_date DESC");
    				
    				# setting the fetch mode
    				$result_EventDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    				 
    				$eventDetails =json_encode($result_EventDetails);
    				echo $eventDetails;
    				exit;
    			}
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'inviteEvent' ) == 0 ){
    		try {
    			$event_id = $_POST["event_id"];
    			$email = $_POST["email"];
    			$user_id = null;
    			
    			$STH = $DBH->query("SELECT USER_ID FROM cat_user WHERE EMAIL = '".$email."'");
    			# setting the fetch mode
    			$result = $STH->fetch(PDO::FETCH_ASSOC);
    			
    			if($result['USER_ID'] == null){
    				$message = "The User is not Registered";
    				$success = "false";
    				echo $message.$concat.$success;
    				exit;
    			}
    			$user_id = $result['USER_ID'];
    			
    			$STH = $DBH->query("SELECT `event_id` FROM `cat_event` WHERE `event_id` = ".$event_id);
    	
    			# setting the fetch mode
    			$result = $STH->fetch(PDO::FETCH_ASSOC);
    			 
    			if($result['event_id'] == null){
    				$message = "The Event is not Registered";
    				$success = "false";
    				echo $message.$concat.$success;
    				exit;
    			}
    			
    			// Step 1 : Insert all the records in the invitation table
    			$DBH->beginTransaction();
    			$STH = $DBH->prepare("INSERT INTO `cat_invitation` (`event_id` , `user_id` , `confirmed` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,'N',NOW(),NOW(),'ADMIN_ID')");
    			 
    			$STH->bindParam(1, $event_id,PDO::PARAM_INT);
    			$STH->bindParam(2, $user_id,PDO::PARAM_INT);    			
    			
    			$STH->execute();
    			$artistId = $DBH->lastInsertId();
    			$DBH->commit();
    			$message = "Invitation sent successfully";
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
