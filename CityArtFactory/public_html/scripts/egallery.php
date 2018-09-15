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
    $egalleryFolder = '/CityArtFactory/public_html/images/egallery'; // Relative to the root   
    $egalleryPath = $_SERVER['DOCUMENT_ROOT'] . $egalleryFolder;    
	
    try {
    
    	# MySQL with PDO_MYSQL
    	$DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    	$DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );    	     	
    }
    catch(PDOException $e) {
    	handleError($e->getMessage()." , Line number - ".$e->getLine());
    }               
    
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
    	
    	if ( strcasecmp( $_POST["action"], 'fetchEgalleryMaster' ) == 0 ){
    		try {
    			$STH = $DBH->query("SELECT SLOTID , TITLE , SIZE , MEDIUM , FILENAME FROM cat_egallery egallery INNER JOIN `cat_image` image ON image.`image_id` = egallery.`image_id` where MASTER_IND = 'Y' ORDER BY SLOTID");
    			 
    			# setting the fetch mode
    			$result_ImageDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    			
    			$userDetails =json_encode($result_ImageDetails);
    			echo $userDetails;
    			exit;
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'fetchEgalleryChild' ) == 0 ){
    		try {
    			$slot_id = $_POST['slotId'];
    			
    			$STH = $DBH->query("SELECT POSITION , TITLE , SIZE , MEDIUM , FILENAME FROM cat_egallery AS egallery , `cat_image` AS image  WHERE image.`image_id` = egallery.`image_id` AND slotId = ".$slot_id." ORDER BY POSITION");
    			 
    			# setting the fetch mode
    			$result_ImageDetails = $STH->fetchAll(PDO::FETCH_ASSOC);
    			
    			$userDetails =json_encode($result_ImageDetails);
    			echo $userDetails;
    			exit;
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}    	
    	
    }           
 
?>
