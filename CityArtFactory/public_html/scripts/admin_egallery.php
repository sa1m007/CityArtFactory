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
    $egalleryFolder = '/images/egallery'; // Relative to the root
    $egalleryfileName = 'image';
    $egalleryPath = $_SERVER['DOCUMENT_ROOT'] . $egalleryFolder;
	
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
    	
    	if ( strcasecmp( $_POST["action"], 'getSlotId' ) == 0 ){
    		try {
    			$STH = $DBH->query("SELECT IFNULL((MAX(SLOTID)+1),1) SLOT_ID FROM cat_slot");    			 
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
    	else if ( strcasecmp( $_POST["action"], 'getAvailablePosition' ) == 0 ){
    		try {
    			$slotId = $_POST["slotId"];
    			$STH = $DBH->query("SELECT SLOT_LEFT FROM (SELECT 1 SLOT_LEFT UNION SELECT 2 SLOT_LEFT UNION SELECT 3 SLOT_LEFT UNION SELECT 4 SLOT_LEFT UNION SELECT 5 SLOT_LEFT UNION SELECT 6 SLOT_LEFT UNION SELECT 7 SLOT_LEFT UNION SELECT 8 SLOT_LEFT UNION SELECT 9 SLOT_LEFT UNION SELECT 10 SLOT_LEFT ) TEMP1 where slot_left not in (SELECT position FROM cat_egallery a, cat_slot b where a.slotId = b.slotId and a.slotId = ".$slotId.")");
    				
    			# setting the fetch mode
    			$result_slotId = $STH->fetchAll(PDO::FETCH_ASSOC);
    			
    			$userDetails =json_encode($result_slotId);
    			echo $userDetails;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'getUsedPosition' ) == 0 ){
    		try {
    			$slotId = $_POST["slotId"];
    			$STH = $DBH->query("SELECT position SLOT_USED FROM cat_egallery a, cat_slot b where a.slotId = b.slotId and a.slotId = ".$slotId);
    	
    			# setting the fetch mode
    			$result_slotId = $STH->fetchAll(PDO::FETCH_ASSOC);
    			 
    			$userDetails =json_encode($result_slotId);
    			echo $userDetails;
    			exit;
    			 
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'selectSlot' ) == 0 ){
    		try {
    			$STH = $DBH->query("SELECT b.SLOTID AS SLOTID, b.SLOTDESCRIPTION AS SLOTDESCRIPTION, (select count(*) from cat_egallery where slotId = b.slotId) AS NOOFIMAGES FROM cat_slot b");
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
    	else if ( strcasecmp( $_POST["action"], 'getImageOfSlot' ) == 0 ){
    		try {
    			$slotId = $_POST["slotId"];
    			$STH = $DBH->query("SELECT SLOTID , POSITION , TITLE , SIZE , MEDIUM , MASTER_IND , if(IMAGE_ID is NULL,'Not Present','Present') AS PRESENT_IND FROM cat_egallery where slotId = ".$slotId." ORDER BY POSITION");
    	
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
    	else if ( strcasecmp( $_POST["action"], 'insertImageInSlot' ) == 0 ){
    		try {
    			 
    			$slot_number_copied = $_POST["slot_number_copied"];
    			$title = $_POST["title"];
    			$size = $_POST["size"];
    			$medium = $_POST["medium"];
    			$position_select = $_POST["position_select"];
    			$master_ind = $_POST["master_ind"];    			
    			$fileData = $_POST["fileData"];
    			$_FILES = json_decode($fileData,true);    		
    			$tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder;       			
    			
    			if($master_ind == 'Y'){
    				$DBH->query("UPDATE `cat_egallery` SET `MASTER_IND` = 'N' where `slotId` = ". $slot_number_copied)->execute();
    			}
    			
    			if($position_select == "1")
    			{
    				$position = $_POST["position_available"];    			    			     				
    				
	    			// Step 1 : Insert all the records except the file to be Uploaded
	    			$DBH->beginTransaction();
	    			$STH = $DBH->prepare("INSERT INTO `cat_egallery`(`slotId`, `IMAGE_ID`, `POSITION`, `MASTER_IND`, `TITLE`, `SIZE`, `MEDIUM`,  `INSERT_DATETIME`, `UPDATE_DATETIME`, `INSERT_USER`) VALUES (?,NULL,?,?,?,?,?,NOW(),NOW(),'ADMIN_ID')");
	    			 
	    			$STH->bindParam(1, $slot_number_copied,PDO::PARAM_INT);
	    			$STH->bindParam(2, $position,PDO::PARAM_INT);
	    			$STH->bindParam(3, $master_ind,PDO::PARAM_STR);
	    			$STH->bindParam(4, $title,PDO::PARAM_STR);
	    			$STH->bindParam(5, $size,PDO::PARAM_STR);
	    			$STH->bindParam(6, $medium,PDO::PARAM_STR);
	    		
	    			$STH->execute();
	    			$DBH->commit();
	    			$message = "New Image inserted successfully in slot";
	    			$success = "true";
    			}
    			// Step 3 : If we use an existing position - the old image in that position will get deleted
    			else if($position_select == "2")
    			{
    				$position = $_POST["position_used"];
    				 
    				// Step 1 : Update all the records except the file to be Uploaded
    				$DBH->beginTransaction();
    				$STH = $DBH->prepare("UPDATE `cat_egallery` SET `TITLE` = ?, `SIZE`= ?, `MEDIUM` = ?, `MASTER_IND` = ? , `UPDATE_DATETIME`= NOW() , `INSERT_USER` = 'ADMIN_ID' WHERE `slotId` = ? AND `POSITION` = ?");
    				 
    				$STH->bindParam(1, $title,PDO::PARAM_STR);
    				$STH->bindParam(2, $size,PDO::PARAM_STR);
    				$STH->bindParam(3, $medium,PDO::PARAM_STR);
    				$STH->bindParam(4, $master_ind,PDO::PARAM_STR);
    				$STH->bindParam(5, $slot_number_copied,PDO::PARAM_INT);
    				$STH->bindParam(6, $position,PDO::PARAM_INT);
    				    				 
    				$STH->execute();
    				$DBH->commit();
    				
    				$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` WHERE `IMAGE_ID` = (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position.")");
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    				
    				$deleteFileName = $result['FILENAME'];
    				
    				if($deleteFileName != null)
    				{
	    				$deleteFileName = rtrim($egalleryPath,'/') . '/' .$deleteFileName;
	    				if (file_exists($deleteFileName)){
	    					unlink($deleteFileName);
	    				}
    				}
    				
    				$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position.")")->execute();    				
    				$DBH->query("UPDATE `cat_egallery` SET `IMAGE_ID` = NULL where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position)->execute();
    				
    				$message = "New Image inserted successfully in slot";
    				$success = "true";    				    				
    			}
    				
    			// Step 2 : If a new file is there to be uploaded then add the new file.
    			if (!empty($_FILES) && file_exists(rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name']))
    			{
    				$tempFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    				
    				// Validate the file type
    				$fileTypes = array('jpg','jpeg','gif','png','JPG','JPEG','PNG','GIF'); // File extensions
    				$fileParts = pathinfo($_FILES['Filedata']['name']);
    				 
    				if (in_array($fileParts['extension'],$fileTypes)) {
    						
    					$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` img , `cat_egallery` egal WHERE egal.`IMAGE_ID` = img.`IMAGE_ID` AND egal.`IMAGE_ID` = (SELECT MAX(IMAGE_ID) FROM `cat_egallery` WHERE IMAGE_TYPE = 'Egallery' AND slotId = ".$slot_number_copied.")");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    						
    					if($result)	{
    						$newOrder = ((int)substr(substr(strrchr($result['FILENAME'], "-"), 1), 0,strpos(substr(strrchr($result['FILENAME'], "-"), 1),".")))+1;
    					}
    					else {
    						$newOrder = 1;
    					}
    						
    					$egalleryfileName = $egalleryfileName."-".strval($slot_number_copied)."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
    						
    					$DBH->beginTransaction();
    					$STH = $DBH->prepare("INSERT INTO `cat_image` (`FILENAME` , `IMAGE_TYPE` , `INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,'Egallery',NOW(),NOW(),'ADMIN_ID')");
    					$STH->bindParam(1, $egalleryfileName,PDO::PARAM_STR);    					
    					$STH->execute();
    					$imageId = $DBH->lastInsertId();
    					$DBH->commit();
    						
    						
    					$STH = $DBH->prepare("UPDATE `cat_egallery` SET `IMAGE_ID` = ? WHERE slotId = ? and position = ?");
    						
    					$STH->bindParam(1, $imageId,PDO::PARAM_INT);
    					$STH->bindParam(2, $slot_number_copied,PDO::PARAM_INT);
    					$STH->bindParam(3, $position,PDO::PARAM_INT);
    						
    					$STH->execute();
    						
    					$targetFile = rtrim($egalleryPath,'/') . '/' . $egalleryfileName;
    					if(rename($tempFile,$targetFile))
    					{
    						$success = "true";
    						$message = "New Image inserted successfully in the slot";
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
    	else if ( strcasecmp( $_POST["action"], 'updateImageInSlot' ) == 0 ){
    		try {
    	
    			$slot_number_copied = $_POST["slot_number_copied"];
    			$title = $_POST["title"];
    			$size = $_POST["size"];
    			$medium = $_POST["medium"];
    			$position_select = $_POST["position_select"];
    			$master_ind = $_POST["master_ind"];
    			$fileData = $_POST["fileData"];
    			$_FILES = json_decode($fileData,true);
    			$tempPath = $_SERVER['DOCUMENT_ROOT'] . $tempFolder;
    			$position_old = $_POST["position-select-hidden"];
    			$position_temp = null;
    			
    			if($master_ind == 'Y'){
    				$DBH->query("UPDATE `cat_egallery` SET `MASTER_IND` = 'N' where `slotId` = ". $slot_number_copied)->execute();
    			}
    			
    			if($position_select == "1")
    			{
    				$position = $_POST["position_available"];
    				
    				// Step 1 : Insert all the records except the file to be Uploaded
    				$DBH->beginTransaction();
    				$STH = $DBH->prepare("UPDATE `cat_egallery` SET POSITION = ? , `TITLE` = ?, `SIZE`= ?, `MEDIUM` = ?,  `MASTER_IND` = ? , `UPDATE_DATETIME`= NOW() , `INSERT_USER` = 'ADMIN_ID' WHERE `slotId` = ? AND `POSITION` = ?");
    				
    				$STH->bindParam(1, $position,PDO::PARAM_INT);
    				$STH->bindParam(2, $title,PDO::PARAM_STR);
    				$STH->bindParam(3, $size,PDO::PARAM_STR);
    				$STH->bindParam(4, $medium,PDO::PARAM_STR);
    				$STH->bindParam(5, $master_ind,PDO::PARAM_STR);
    				$STH->bindParam(6, $slot_number_copied,PDO::PARAM_INT);
    				$STH->bindParam(7, $position_old,PDO::PARAM_INT);
    					    				
    				$STH->execute();
    				$DBH->commit();
    				$message = "New Image updated successfully in slot";
    				$success = "true";
    			}
    			// Step 3 : If we use an existing position - the old image in that position will get deleted
    			else if($position_select == "2")
    			{
    				$position = $_POST["position_used"];
    					
    				if($position == $position_old){
    					$DBH->beginTransaction();
    					$STH = $DBH->prepare("UPDATE `cat_egallery` SET `TITLE` = ?, `SIZE`= ?, `MEDIUM` = ?, `MASTER_IND` = ? , `UPDATE_DATETIME`= NOW() , `INSERT_USER` = 'ADMIN_ID' WHERE `slotId` = ? AND `POSITION` = ?");
    						
    					$STH->bindParam(1, $title,PDO::PARAM_STR);
    					$STH->bindParam(2, $size,PDO::PARAM_STR);
    					$STH->bindParam(3, $medium,PDO::PARAM_STR);
    					$STH->bindParam(4, $master_ind,PDO::PARAM_STR);
    					$STH->bindParam(5, $slot_number_copied,PDO::PARAM_INT);
    					$STH->bindParam(6, $position,PDO::PARAM_INT);
    						
    					$STH->execute();
    					$DBH->commit();    					
    				}
    				else{
    					// Step 1 : Delete the image in new position
    					$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` WHERE `IMAGE_ID` = (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position.")");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    						
    					$deleteFileName = $result['FILENAME'];
    					
    					if($deleteFileName != null)
    					{
    						$deleteFileName = rtrim($egalleryPath,'/') . '/' .$deleteFileName;
    						if (file_exists($deleteFileName)){
    							unlink($deleteFileName);
    						}
    					}
    					
    					$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position.")")->execute();
    					
    					// Step 2 : Copy the Image ID from position_old to position
    					// Also update the contents of position
    					
    					$STH = $DBH->query("select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position_old."");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    					$imageIdCopy = $result['IMAGE_ID'];
    					
    					$DBH->beginTransaction();
    					$STH = $DBH->prepare("UPDATE `cat_egallery` SET `TITLE` = ?, `SIZE`= ?, `MEDIUM` = ?, `MASTER_IND` = ? , `UPDATE_DATETIME`= NOW() , `INSERT_USER` = 'ADMIN_ID' , `IMAGE_ID` = ? WHERE `slotId` = ? AND `POSITION` = ?");
    						
    					$STH->bindParam(1, $title,PDO::PARAM_STR);
    					$STH->bindParam(2, $size,PDO::PARAM_STR);
    					$STH->bindParam(3, $medium,PDO::PARAM_STR);
    					$STH->bindParam(4, $master_ind,PDO::PARAM_STR);
    					$STH->bindParam(5, $imageIdCopy,PDO::PARAM_INT);
    					$STH->bindParam(6, $slot_number_copied,PDO::PARAM_INT);
    					$STH->bindParam(7, $position,PDO::PARAM_INT);
    						
    					$STH->execute();
    					$DBH->commit();    					     					    					
    				}
    				
    				$message = "New Image updated successfully in slot";
    				$success = "true";    				
    			}
    	
    			// Step 2 : If a new file is there to be uploaded then add the new file.
    			if (!empty($_FILES) && file_exists(rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name']))
    			{
    				$tempFile = rtrim($tempPath,'/') . '/' . $_FILES['Filedata']['name'];
    	
    				// Validate the file type
    					$fileTypes = array('jpg','jpeg','gif','png','JPG','JPEG','PNG','GIF'); // File extensions
    				$fileParts = pathinfo($_FILES['Filedata']['name']);
    					
    				if (in_array($fileParts['extension'],$fileTypes)) {
    	
    					$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` img , `cat_egallery` egal WHERE egal.`IMAGE_ID` = img.`IMAGE_ID` AND egal.`IMAGE_ID` = (SELECT MAX(IMAGE_ID) FROM `cat_egallery` WHERE IMAGE_TYPE = 'Egallery' AND slotId = ".$slot_number_copied.")");
    					$result = $STH->fetch(PDO::FETCH_ASSOC);
    					
    					if($result)	{
    						$newOrder = ((int)substr(substr(strrchr($result['FILENAME'], "-"), 1), 0,strpos(substr(strrchr($result['FILENAME'], "-"), 1),".")))+1;
    					}
    					else {
    						$newOrder = 1;
    					}
    	
    					$egalleryfileName = $egalleryfileName."-".strval($slot_number_copied)."-".strval($newOrder).".".substr(strrchr($_FILES['Filedata']['name'], "."), 1);
						
    					// If from Available position then delete the image from new position
    					if($position_select == "1"){
    						$position_temp = $position;
    					}
    					// If from Used position then delete the old image from old position
    					else if($position_select == "2"){
    						$position_temp = $position_old;
    					}
    											
	    				$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` WHERE `IMAGE_ID` = (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position_temp.")");
	    				$result = $STH->fetch(PDO::FETCH_ASSOC);
	    				 
	    				$deleteFileName = $result['FILENAME'];
	    				
	    				if($deleteFileName != null)
	    				{
		    				$deleteFileName = rtrim($egalleryPath,'/') . '/' .$deleteFileName;
		    				if (file_exists($deleteFileName)){
		    					unlink($deleteFileName);
		    				}
	    				}
	    				
	    				$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position_temp.")")->execute();	    				
						
						// Insert the new image in new position
    					$DBH->beginTransaction();
    					$STH = $DBH->prepare("INSERT INTO `cat_image` (`FILENAME` , `IMAGE_TYPE` , `INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,'Egallery',NOW(),NOW(),'ADMIN_ID')");
    					$STH->bindParam(1, $egalleryfileName,PDO::PARAM_STR);    					
    					$STH->execute();
    					$imageId = $DBH->lastInsertId();
    					$DBH->commit();
    	    	
    					$STH = $DBH->prepare("UPDATE `cat_egallery` SET `IMAGE_ID` = ? WHERE slotId = ? and position = ?");
    	
    					$STH->bindParam(1, $imageId,PDO::PARAM_INT);
    					$STH->bindParam(2, $slot_number_copied,PDO::PARAM_INT);
    					$STH->bindParam(3, $position,PDO::PARAM_INT);
    	
    					$STH->execute();
    	
    					$targetFile = rtrim($egalleryPath,'/') . '/' . $egalleryfileName;
    					if(rename($tempFile,$targetFile))
    					{
    						$success = "true";
    						$message = "New Image inserted successfully in the slot";
    					}
    					else {
    						$success = "false";
    						$message = "File move failed";
    					}    					
    	
    				} else {
    					$success = "false";
    				}
    	
    			}
    			// Step 4: Delete the position_old record
    			if($position != $position_old && $position_select == "2"){
    				$DBH->query("DELETE FROM `cat_egallery` WHERE `slotId` = ". $slot_number_copied." AND `POSITION` = ".$position_old)->execute();
    			}
    			
    			/* ------------------------------------ */
    			echo $message.$concat.$success;
    			exit;
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'insertNewSlot' ) == 0 ){    		
    		try {    			 
    			
    			$slot_number = $_POST["slot_number"];
    			$slot_description = $_POST["slot_description"];    			
    			
    			$DBH->beginTransaction();
    			$STH = $DBH->prepare("INSERT INTO `cat_slot` (`SLOTID` , `SLOTDESCRIPTION` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,NOW(),NOW(),'ADMIN_ID')");
    			
    			$STH->bindParam(1, $slot_number,PDO::PARAM_STR);
    			$STH->bindParam(2, $slot_description,PDO::PARAM_STR);
    			    			
    			$STH->execute();
    			$DBH->commit();
    			$message = "New Slot inserted successfully. Now insert Images in the slot.";
    			$success = "true";
    			    			    			
    			echo $message.$concat.$success;
    			exit;    			
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}    		    		    		
    		
    	}
    	else if ( strcasecmp( $_POST["action"], 'updateExistingSlot' ) == 0 ){
    		try {
    			
    			$slot_number = $_POST["slot_number"];
    			$slot_description = $_POST["slot_description"];
    			
    			$STH = $DBH->prepare("UPDATE `cat_slot` SET `slotDescription` = ? , UPDATE_DATETIME = NOW() , INSERT_USER = 'ADMIN_ID' WHERE slotId = ?");
    			
    			$STH->bindParam(1, $slot_description,PDO::PARAM_STR);
				$STH->bindParam(2, $slot_number,PDO::PARAM_INT);    			
    			
    			$STH->execute();
    			$message = "Slot updated. Now insert Images in the slot.";
				$success = "true";
    			 
    			echo $message.$concat.$success;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	else if ( strcasecmp( $_POST["action"], 'deleteSlot' ) == 0 ){
    		try {    			
	    		$selectedSlotId = $_POST["selectedSlotId"];	    
	    		
	    		// Lopp through each slot
	    		foreach ($selectedSlotId as &$slotValue) {
	    			
	    			$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slotValue.")");
					$STH->setFetchMode(PDO::FETCH_ASSOC);
    			 
	    			$result = $STH->fetchAll();					
	    			// Step 1: Delete all the images in the slot 
	    			foreach($result as &$row) {
	    				$deleteFileName = $row['FILENAME'];	    				
	    				if($deleteFileName != null)
	    				{	
	    					$deleteFileName = rtrim($egalleryPath,'/') . '/' .$deleteFileName;		    				
		    				if (file_exists($deleteFileName)){
		    					unlink($deleteFileName);
		    				}
	    				}
	    			}	  
					
					
	    			$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $slotValue.")")->execute();	    			
	    			
	    			// Step 2: Delete all the positions in the slot	    			
	    			$DBH->query("DELETE FROM `cat_egallery` where `slotId` = ". $slotValue)->execute();	
	    			// Step 3: Delete the slot
	    			$DBH->query("DELETE FROM `cat_slot` where `slotId` = ". $slotValue)->execute();
	    		}
	    			    		
	    		$message = "Selected Slot deleted successfully with all the corresponding images";
	    		$success = "true";
	    		echo $message.$concat.$success;
	    		exit;
    		
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	} 
    	else if ( strcasecmp( $_POST["action"], 'deleteImage' ) == 0 ){
    		try {
    			$selectedSlotId = $_POST["selectedSlotId"];
    			$selectedPosition = $_POST["selectedPosition"];
    			     			
    			foreach ($selectedPosition as &$value) {    
    				$STH = $DBH->query("SELECT `FILENAME` FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $selectedSlotId." AND `position` = ".$value.")");
    				$result = $STH->fetch(PDO::FETCH_ASSOC);
    				
    				$deleteFileName = $result['FILENAME'];
    				if($deleteFileName != null)
    				{
	    				$deleteFileName = rtrim($egalleryPath,'/') . '/' .$deleteFileName;
	    				if (file_exists($deleteFileName)){
	    					unlink($deleteFileName);
	    				}  
    				}
    				$DBH->query("DELETE FROM `cat_image` WHERE `IMAGE_ID` IN (select `IMAGE_ID` from `cat_egallery` where `slotId` = ". $selectedSlotId." AND `position` = ".$value.")")->execute();
    				
    				$DBH->query("DELETE FROM `cat_egallery` where `slotId` = ". $selectedSlotId." AND `position` = ".$value)->execute();
    			}    			     			    			     			    			     			
    			 
    			$message = "Selected Positions deleted successfully";
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