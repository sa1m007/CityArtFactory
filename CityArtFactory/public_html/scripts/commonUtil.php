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
    	if ( strcasecmp( $_POST["action"], 'logOut' ) == 0 ){
    		try {
    			$_SESSION = array();
    			if (ini_get("session.use_cookies")) {
    				$params = session_get_cookie_params();
    				setcookie(session_name(), '', time() - 42000,
    						$params["path"], $params["domain"],
    						$params["secure"], $params["httponly"]
    						);
    			}
    			session_destroy();
    			exit;
    			 
    		}
    		catch(PDOException $e) {
    			handleError($e->getMessage()." , Line number - ".$e->getLine());
    		}
    	}
    	
    }           
 
?>
