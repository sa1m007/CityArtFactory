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
    $tempFolder = '/images/temp'; // Relative to the root
    $userFolder = '/images/artists'; // Relative to the root
    $artistfileName = 'artist';
    $artgroupfileName = 'artgroup';
    $institutefileName = 'institute';
    $buyerfileName = 'buyer';
    $dealerfileName = 'dealer';
    $collectorfileName = 'collector';
    $othersfileName = 'others';
    $tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder;
	
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
    	$targetFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    
    	move_uploaded_file($tempFile,$targetFile);
    	//echo $tempFolder . '/' . $_FILES['Filedata']['name'];
    	echo json_encode($_FILES);
    	//echo $tempFile . "---" . $targetFile;
    }
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
    	
    	if ( strcasecmp( $_POST["action"], 'loginEvent' ) == 0 ){
    		try {
    			$user_id = $_POST["email_login"];
    			$password = $_POST["password_login"];
    			$category_type_login  =  $_POST["category_type_login"];
    			
    			$STH = $DBH->query("SELECT `CATEGORY`,`NAME_USER`,`EMAIL`,`PASSWORD`,`PHONENO`,`ADDRESS`,`IMAGE_ID` FROM `cat_user` WHERE EMAIL = '".$user_id."' AND CATEGORY = '".$category_type_login."'");    			 
    			$result = $STH->fetch(PDO::FETCH_ASSOC);
    			
    			$hash = $result['PASSWORD'];
    			
    			if (password_verify($password, $hash)) {
    				session_start();
    				    				
    				$STH = $DBH->query("SELECT `NAME_USER`,`EMAIL`,`FILENAME`,`CATEGORY` FROM `cat_user` user LEFT OUTER JOIN `cat_image` AS img ON img.`IMAGE_ID` = user.`IMAGE_ID` WHERE EMAIL = '".$user_id."' AND CATEGORY = '".$category_type_login."'");
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    				$_SESSION["userDetails"] = $result;
    				
    				$message = json_encode($result);
    				$success = "true";    				   				 			
    			} else {
    				$message = "Password is invalid!";
    				$success = "false";
    			}    			
    			
    			echo $message.$concat.$success;
    			exit;
    		
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'insert' ) == 0 ){
    		try {
    			 
    			$name_user = $_POST["name_user"];
    			$email = $_POST["email"];
    			$category_type = $_POST["category_type"];
    			$password = $_POST["password"];
    			$options = ['cost' => 12];
    			$password = password_hash($password, PASSWORD_BCRYPT, $options);
    			$phone = $_POST["phoneno"];
    			$address = $_POST["address"];
    			$fileData = $_POST["fileData"];
    			$offer_ind = $_POST["offer_ind"];
    			$_FILES = json_decode($fileData,true);
    			$artistId = null;
    			$fileName = null;
    			
    			if($offer_ind == null){
    				$offer_ind = 'N';
    			}
    			 
    			$STH = $DBH->query("SELECT USER_ID FROM cat_user WHERE EMAIL = '".$email."'");
    			# setting the fetch mode
    			$result = $STH->fetch(PDO::FETCH_ASSOC);
    	
    			if($result['USER_ID'] != null){
    				$message = "The User is already Registered";
    				$success = "false";
    				echo $message.$concat.$success;
    				exit;
    			}
    			 
    			// Step 1 : Insert all the records except the file to be Uploaded
    			$DBH->beginTransaction();
    			$STH = $DBH->prepare("INSERT INTO `cat_user` (`CATEGORY` , `NAME_USER` , `EMAIL` ,`PASSWORD` ,`PHONENO` ,`ADDRESS` , `OFFER_IND` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,?,?,?,?,?,NOW(),NOW(),'ADMIN_ID')");
    			 
    			$STH->bindParam(1, $category_type,PDO::PARAM_STR);
    			$STH->bindParam(2, $name_user,PDO::PARAM_STR);
    			$STH->bindParam(3, $email,PDO::PARAM_STR);
    			$STH->bindParam(4, $password,PDO::PARAM_STR);
    			$STH->bindParam(5, $phone,PDO::PARAM_STR);
    			$STH->bindParam(6, $address,PDO::PARAM_STR);
    			$STH->bindParam(7, $offer_ind,PDO::PARAM_STR);
    	
    			$STH->execute();
    			$artistId = $DBH->lastInsertId();
    			$DBH->commit();
    			$message = "New User inserted successfully. You can login now.";
    			$success = "true";
    			 
    			// Step 2 : If a new file is there to be uploaded then add the new file.
    			if (!empty($_FILES) && file_exists(rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name']))
    			{
    				$tempFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    				$userPath = $_SERVER['DOCUMENT_ROOT'] . $userFolder;
    	
    				// Validate the file type
    				$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
    				$fileParts = pathinfo($_FILES['Filedata']['name']);
    				 
    				if (in_array($fileParts['extension'],$fileTypes)) {
    						
    					$STH = $DBH->query("SELECT x.`FILENAME` AS FILENAME FROM (SELECT `FILENAME` FROM `cat_image` WHERE IMAGE_TYPE = '".$category_type."' ORDER BY IMAGE_ID DESC) AS x LIMIT 1");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    						
    					if($result)	{
    						$newOrder = ((int)substr(substr(strrchr($result['FILENAME'], "-"), 1), 0,strpos(substr(strrchr($result['FILENAME'], "-"), 1),".")))+1;
    					}
    					else {
    						$newOrder = 1;
    					}
    						
    						
    					if($category_type == "Artist"){
    						$fileName = $artistfileName;
    					}
    					else if($category_type == "Art Group"){
    						$fileName = $artgroupfileName;
    					}
    					else if($category_type == "Institute"){
    						$fileName = $institutefileName;
    					}
    					else if($category_type == "Buyer"){
    						$fileName = $buyerfileName;
    					}
    					else if($category_type == "Dealer"){
    						$fileName = $dealerfileName;
    					}
    					else if($category_type == "Collector"){
    						$fileName = $collectorfileName;
    					}
    					else if($category_type == "Others"){
    						$fileName = $othersfileName;
    					}
    						
    					$fileName = $fileName."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    						
    					$DBH->beginTransaction();
    					$STH = $DBH->prepare("INSERT INTO `cat_image` (`FILENAME` , `IMAGE_TYPE` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,NOW(),NOW(),'ADMIN_ID')");
    					$STH->bindParam(1, $fileName,PDO::PARAM_STR);
    					$STH->bindParam(2, $category_type,PDO::PARAM_STR);
    					$STH->execute();
    					$imageId = $DBH->lastInsertId();
    					$DBH->commit();
    						
    						
    					$STH = $DBH->prepare("UPDATE `cat_user` SET `IMAGE_ID` = ? WHERE USER_ID = ?");
    						
    					$STH->bindParam(1, $imageId,PDO::PARAM_INT);
    					$STH->bindParam(2, $artistId,PDO::PARAM_INT);
    						
    					$STH->execute();
    						
    					$targetFile = rtrim($userPath,'/') . '/' . $fileName;
    					if(rename($tempFile,$targetFile))
    					{
    						$success = "true";
    						$message = "New User inserted successfully. You can login now.";
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
    	
    }           
 
?>