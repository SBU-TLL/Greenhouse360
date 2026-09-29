<?php
$savePath="../data/";
$id=$_GET['id'];
$gid=$_GET['gid'] ?? 0;
if($gid==""){
$gid=0;
}

if(array_key_exists ("prePath",$_GET)){
$prePath=$_GET['prePath'];
}
else {
$prePath="d/";
}
$cache_life = '120'; //caching time, in seconds
//$cache_life = '1'; //turn on for testing;
$file = "$savePath/data/${id}_${gid}.txt";


 $url = "https://docs.google.com/spreadsheets/$prePath$id/pub?output=csv&gid=$gid";

///print $url;
//exit;
if (file_exists($file)){
	if (time()-filemtime ($file) >=$cache_life   &&  get_http_response_code($url) ==200)
	{
		$contents = file_get_contents($url);
		if($contents) {file_put_contents("$file",$contents);}
	}
	else{

		$contents = file_get_contents("$file");
	}

}
else {
	$contents = file_get_contents($url);
	file_put_contents("$file",$contents);
}



printHeaders();
print $contents;
function get_http_response_code($url) {
    $headers = get_headers($url);
    return substr($headers[0], 9, 3);
}

function printHeaders()
{
header('Access-Control-Allow-Origin: *');
header('Content-type: application/csv');
#header('Content-Length: ' . filesize($contents));
header('Content-Disposition: attachment; filename="export.csv"');

}



?>