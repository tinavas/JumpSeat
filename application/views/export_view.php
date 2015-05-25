<?php

$export = json_encode($export); // sexport lol.

// User download
header("Content-Type: text/plain");
header('Content-Disposition: attachment; filename="' . $filename . '"');
header("Content-Length: " . strlen($export));
echo $export;

?>
