<?php
//error_reporting(E_ALL);
$dir = $_GET['dir'];
$file = $_GET['file'];
$olddir = $_GET['from'];
$newdir = $_GET['to'];
$search = $_GET['search'];

if($file) {
	if(!preg_match("(^files/)",$olddir) && !preg_match("(^files/)",$newdir)) die('Malicious Use');
	if(strpos($olddir,"/../") OR strpos($newdir,"/../")) die('Malicious Use');
	if(strpos($olddir,"/./") OR strpos($newdir,"/../")) die('Malicious Use');
	rename(dirname(__FILE__).'/'.$olddir.$file,dirname(__FILE__).'/'.$newdir.$file);
	die;
}

function fillArrayWithFileNodes( DirectoryIterator $dir, $search )
{
  $data = array();
  foreach ( $dir as $node )
  {
    if ( $node->isDir() && !$node->isDot() )
    {
      $data[] = implode(",",fillArrayWithFileNodes( new DirectoryIterator( $node->getPathname() ), $search));
    }
    else if ( $node->isFile() && preg_match('/^([^.])/',$node->getFilename())==1 )
    {
      if(stripos($node->getFilename(),$search)!==false) $data[] = $node->getPathname();
    }
  }
//  $data = implode(",",$files);
  return $data;
}

//prevent malicious use to gain access to unauthorised directories
if(strpos($dir,"/../")) die('Malicious Use');
if(strpos($dir,"/./")) die('Malicious Use');
//easiest way to prevent is to ensure the $_GET['dir'] var starts with a given directory
//you may also prepend the $_GET['dir] variable with a directory and pass "/" in the directory widget options
if(!preg_match("(^files/)",$dir)) die('Malicious Use');
if($search) {
$fileData = fillArrayWithFileNodes( new DirectoryIterator( $dir ), $search );
//print_r($fileData);
foreach($fileData as $key => $filearray) {
	$result[] = array_filter(explode(",",$filearray));
}
$results = array();
foreach($result as $arry) {
	$results = array_merge($results,$arry);
}
echo json_encode($results);
}
else if(is_file($dir)) {
	$stat = stat($dir);
	$size = $stat['size'];
	$mod = $stat['mtime'];
	$ext = end(explode('.', $dir));
	$name = end(explode('/', $dir));
//	$mime_type = mime_content_type($name);
	$contentsarray[$name] = array("size"=>$size,"ext"=>$ext,"mod"=>date("d-m-Y",$mod),"name"=>$name,"mime"=>$mime_type);
	echo json_encode($contentsarray);
}
else if($dir) {
	if ($handle = opendir($dir)) {
	    while (false !== ($entry = readdir($handle))) {
			$dName = $dir . $entry;
			$stat = stat($dir);
			$size = $stat['size'];
			$mod = $stat['mtime'];
//			$mime_type = mime_content_type($entry);
			if(is_file($dName)) $ext = end(explode('.', $entry));
			else $ext = '';
	        if(!in_array($entry,array('.','..')) && substr($entry, 0, 1) != '.') $contentsarray[$entry] = array("name"=>$entry,"ext"=>$ext,"size"=>$size,"mod"=>date("d-m-Y",$mod),"mime"=>$mime_type);
	    }
		sort($contentsarray);
		echo json_encode($contentsarray);

		closedir($handle);
	}
}
?>