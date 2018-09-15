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

    
    try {
    
    	# MySQL with PDO_MYSQL
    	$DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    	$DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );    	     	
    }
    catch(PDOException $e) {
    	handleError($e->getMessage());
    }                   
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
    	
    	if ( strcasecmp( $_POST["action"], 'getSessionValues' ) == 0 ){
    		try {
    			 
    			session_start();
    			 
    			if(isset($_SESSION["userDetails"]) && !empty($_SESSION["userDetails"]))
    			{
    	
    				$userDetails = $_SESSION["userDetails"];
    	
    				$message = json_encode($userDetails);
    				$success = "true";
    			}
    			else {
    				$message = "User not active";
    				$success = "false";
    			}
    			 
    			echo $message.$concat.$success;
    			exit;
    	
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}  
    	
    	else if ( strcasecmp( $_POST["action"], 'sendFeedBackMessage' ) == 0 ){
    		try {
    			$name = $_POST["name"];
    			$email = $_POST["email"];
    			$message = $_POST["message"];
    			
    			$successEmailList = "";
    			$failedEmailList = "";
    			$eventFilePath = "";
    			$eventUrl = "";
    			 
    			$mail = new PHPMailer;
    			//Whether to use SMTP authentication
    			$mail->SMTPAuth = false;
    	
    			//Set who the message is to be sent from
    			$mail->setFrom($email, $name);
    			//Set an alternative reply-to address
    			$mail->addReplyTo($email, $name);
    			//Set the subject line
    			$mail->Subject = 'Urgent - Feedback Message from User';
    			$mail->IsHTML(true);

    					
    			//$to = 'cityartfactory@gmail.com';
    			$to = 'sidd.cse.mckv@gmail.com';
    			$mail->addAddress($to, 'City Art Factory');
    	
    			// Compose a simple HTML email message
    			$message = "<html><body>";
    			$message .= '<h1 style="color:#f40;">Message from '.$name.'</h1>';
    			$message .= "<div>";
    				
    			$message .= "<p>".$message."</p>";
    					
    			$message .= '</div>';

    			$message .= '</body></html>';
    	
    	
    			$mail->Body = $message;
    	
    			if (!$mail->send()) {
    				$success = "false";
    				$message = "Feeback could not be sent . Please try again after sometime.";    					
    			}
    			else{
    				$success = "true";
    				$message = "Feedback sent successfully to Admin. Admin will get back to you as soon as possible.";
    			}
    				
    			    	    	    			
    			echo $message.$concat.$success;
    			exit;
    			 
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	
    }           
 
?>
