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
    $message = null;
    $success = false;
    $concat = "@spl@";
	
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
    			$STH = $DBH->query("SELECT `event_type`, DATE_FORMAT(`from_date`,'%d-%b-%Y') as `from_date`, DATE_FORMAT(`to_date`,'%d-%b-%Y') as `to_date`, `headline`, `location` , image.`filename` AS IMAGE_NAME FROM `cat_event` AS event , `cat_image` image WHERE image.`image_id` = event.`image_id` and past_ind IS NULL ORDER BY event_type");
    	
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
    	else if ( strcasecmp( $_POST["action"], 'selectArtists' ) == 0 ){
    		try {
    			//$category = $_POST["category"];
    			 
    			$STH = $DBH->query("SELECT NAME_USER , image.`filename` AS IMAGE_NAME FROM `cat_user` user , `cat_image` image WHERE image.`image_id` = user.`image_id` and CATEGORY = 'Artist' ORDER BY user.`image_id`");
    			$STH->setFetchMode(PDO::FETCH_ASSOC);
    	
    			$assocDataAll = $STH->fetchAll();
    			$userDetails =json_encode($assocDataAll);
    			echo $userDetails;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}    	
    	
    }           
 
?>
