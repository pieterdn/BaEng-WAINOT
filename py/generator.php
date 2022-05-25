<?php
   $PYTHON='python';
   putenv("REQUEST_METHOD=GET");
   $s = http_build_query($_POST);
   echo "$s";
   putenv("QUERY_STRING=$s");
   $command_exec = escapeshellcmd("$PYTHON generator.py");
   $str_output = shell_exec($command_exec);
   echo $str_output;
?>