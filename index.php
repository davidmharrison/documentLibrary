<!DOCTYPE html>
<html>
<head>
	<title>Document Libarary Widget</title>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.0/themes/smoothness/jquery-ui.css" />
	<!--<link rel="stylesheet" href="css/jquery-ui-1.10.0.custom.css" />-->
	<link rel="stylesheet" href="css/jScrollPane.css" />
	<link rel="stylesheet" href="css/documentLibrary.css" />
</head>
<body>
	<div id="content">
		<div id="library"></div>
	</div>
	<script src="http://code.jquery.com/jquery-1.9.0.js"></script>
	<script src="http://code.jquery.com/ui/1.10.0/jquery-ui.js"></script>
<!--<script src="js/jquery-1.9.0.js"></script>
<script src="js/jquery-ui.js"></script>-->
<script src="js/jScrollPane.js"></script>
<script src="js/jquery.em.js"></script>
<script src="js/jquery.mousewheel.js"></script>
<script src="js/documentLibrary.js"></script>
<style>

</style>
<script>
$(function() {
	$('#library').documentLibrary({
		view: 'column',
		title: " Document Library"
	});
});
</script>
</body>
</html>