<?php
    require_once(realpath(dirname(__FILE__) . "/../config.php"));
 
    function renderLayoutWithContentFile($contentFile, $variables = array())
    {
        $contentFileFullPath = $contentFile;
     
        // making sure passed in variables are in scope of the template
        // each key in the $variables array will become a variable
        if (count($variables) > 0) {
            foreach ($variables as $key => $value) {
                if (strlen($key) > 0) {
                    ${$key} = $value;
                }
            }
        }
     
    //    require_once(TEMPLATES_PATH . "/admin_header.php");
     
      /*  echo "<div id=\"container\">\n"
           . "\t<div id=\"content\">\n";*/
     
        if (file_exists($contentFileFullPath)) {
            require_once($contentFileFullPath);
        } else {
            /*
                If the file isn't found the error can be handled in lots of ways.
                In this case we will just include an error template.
            */
        	echo "Not found";
           // require_once(TEMPLATES_PATH . "/error.php");
        }
     
        // close content div
       // echo "\t</div>\n";
     
      // require_once(TEMPLATES_PATH . "/admin_sidebar.php");
     
        // close container div
     //   echo "</div>\n";
     
       // require_once(TEMPLATES_PATH . "/admin_footer.php");
    }
    
    function handleError($message)
    {
    	header('HTTP/1.1 400 Bad Request');
    	$timestamp = date("Y-m-d h:i:sa") ;
    	file_put_contents(realpath(dirname(__FILE__) . "/../../PDOErrors.txt"), PHP_EOL.$timestamp." - ".$message, FILE_APPEND);
    }
    
?>