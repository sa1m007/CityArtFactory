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
    $fromAddress   = $config['FromEmail']['address'];
	$fromName = $config['FromEmail']['name'];
	$toAddress   = $config['ToEmail']['address'];
	$toName   = $config['ToEmail']['name'];
    $DBH = null;
    $variables = null;
    $message = null;
    $success = false;
    $concat = "@spl@";
    $tempFolder = '/images/temp'; // Relative to the root
    $userFolder = '/images/artists'; // Relative to the root
    $artistfileName = 'artist';
	$judgefileName = 'judge';
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
    			// $password = $_POST["password"];
    			$options = ['cost' => 12];
    			// $password = password_hash($password, PASSWORD_BCRYPT, $options);
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
    			// $STH = $DBH->prepare("INSERT INTO `cat_user` (`CATEGORY` , `NAME_USER` , `EMAIL` ,`PASSWORD` ,`PHONENO` ,`ADDRESS` , `OFFER_IND` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,?,?,?,?,?,NOW(),NOW(),'ADMIN_ID')");
				
				$STH = $DBH->prepare("INSERT INTO `cat_user` (`CATEGORY` , `NAME_USER` , `EMAIL` ,`PHONENO` ,`ADDRESS` , `OFFER_IND` ,`INSERT_DATETIME` , `UPDATE_DATETIME` , `INSERT_USER`) values (?,?,?,?,?,?,NOW(),NOW(),'ADMIN_ID')");
    			 
    			$STH->bindParam(1, $category_type,PDO::PARAM_STR);
    			$STH->bindParam(2, $name_user,PDO::PARAM_STR);
    			$STH->bindParam(3, $email,PDO::PARAM_STR);
    			//$STH->bindParam(4, $password,PDO::PARAM_STR);
    			$STH->bindParam(4, $phone,PDO::PARAM_STR);
    			$STH->bindParam(5, $address,PDO::PARAM_STR);
    			$STH->bindParam(6, $offer_ind,PDO::PARAM_STR);
    	
    			$STH->execute();
    			$artistId = $DBH->lastInsertId();
    			$DBH->commit();    			
				
				if(sendEmailToUser($name_user,$email,$category_type,$fromAddress,$fromName,$toAddress,$toName)){
				    $message = "Registered Details sent to City Art Factory curator. We will mail you the password.";
    			    $success = "true";
				}else{
				    $success = "false";
    				$message = "Mail sending failed. Check Logs.";
				}
    			 
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
						else if($category_type == "Judge"){
    						$fileName = $judgefileName;
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
    						$message = "Registered Details sent to City Art Factory curator. We will mail you the password.";
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

	function sendEmailToUser($name_user,$email,$category_type,$fromAddress,$fromName,$toAddress,$toName) : bool
    {	
        $isMailSent = false;
		
		$mail = new PHPMailer;
		//Whether to use SMTP authentication
		$mail->SMTPAuth = false;

		//Set who the message is to be sent from
		$mail->setFrom($fromAddress, $fromName);
		//Set an alternative reply-to address
		$mail->addReplyTo($toAddress, $toName);
		//CC eed the user who is registering
		$mail->AddCC($email,$name_user);
		//Set who the message is to be sent to
		$mail->addAddress($toAddress, $toName);
		//Set the subject line
		$mail->Subject = 'CAF New Registration -'.$category_type;
		$mail->IsHTML(true);
		
		// Compose a simple HTML email message
		$message = htmlEmailContent($name_user,$category_type);
			
		$mail->Body = $message;				
		

		if (!$mail->send()) {    					
			handleError("Mailer Error (" . str_replace("@", "&#64;", $email) . ') ' . $mail->ErrorInfo);
		}else{
		    $isMailSent = true;
		}
		
		// echo $fromAddress.'-----'.$fromName.'------'.$toAddress.'----'.$toName;

		$mail->clearAddresses();
		
		return $isMailSent;
					
	}
	
	function htmlEmailContent($name_user,$category_type) : string{
	
		$message ='<!DOCTYPE html>
		<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
		<head>
		  <meta charset="utf-8">
		  <meta name="viewport" content="width=device-width,initial-scale=1">
		  <meta name="x-apple-disable-message-reformatting">
		  <title></title>
		  <!--[if mso]>
		  <style>
			table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
			div, td {padding:0;}
			div {margin:0 !important;}
		  </style>
		  <noscript>
			<xml>
			  <o:OfficeDocumentSettings>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			  </o:OfficeDocumentSettings>
			</xml>
		  </noscript>
		  <![endif]-->
		  <style>
			table, td, div, h1, p {
			  font-family: Arial, sans-serif;
			}
			@media screen and (max-width: 530px) {
			  .unsub {
				display: block;
				padding: 8px;
				margin-top: 14px;
				border-radius: 6px;
				background-color: #555555;
				text-decoration: none !important;
				font-weight: bold;
			  }
			  .col-lge {
				max-width: 100% !important;
			  }
			}
			@media screen and (min-width: 531px) {
			  .col-sml {
				max-width: 27% !important;
			  }
			  .col-lge {
				max-width: 73% !important;
			  }
			}
		  </style>
		</head>
		<body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
		  <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background: url(http://cityartfactory.com/images/texture1.png) #c6b9a7 repeat center;">
			<table role="presentation" style="width:100%;border:none;border-spacing:0;">
			  <tr>
				<td align="center" style="padding:0;">
				  <!--[if mso]>
				  <table role="presentation" align="center" style="width:600px;">
				  <tr>
				  <td>
				  <![endif]-->
				  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:center;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
					<tr>
					  <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
						<a href="http://cityartfactory.com/" style="text-decoration:none;"><img src="http://cityartfactory.com/images/logo_desktop.png" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
					  </td>
					</tr>										
					<tr>
					  <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
						<!--[if mso]>
						<table role="presentation" width="100%">
						<tr>						
						<td style="width:395px;padding-bottom:20px;" valign="top">
						<![endif]-->
						<div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
						<h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">CAF New Registration -'.$category_type.'</h1>
						  <p style="margin-top:0;margin-bottom:12px;">'.$name_user.' has submitted for registration on City Art Factory.</p>
						  <p style="margin-top:0;margin-bottom:12px;">Please verify the same and send the password to the person CCed in this email.</p>
						  
						  <p style="margin:0;"><a href="http://cityartfactory.com/login.html" style="background: #ff3884; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Verify Now</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
						</div>
						<!--[if mso]>
						</td>
						</tr>
						</table>
						<![endif]-->
					  </td>
					</tr>					
				  </table>
				  <!--[if mso]>
				  </td>
				  </tr>
				  </table>
				  <![endif]-->
				</td>
			  </tr>
			</table>
		  </div>
		</body>
		</html>';
		
		return $message;
	}
 
?>