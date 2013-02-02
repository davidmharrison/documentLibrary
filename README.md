documentLibrary
===============

Document Library Widget

Summary:
	Document Library Widget allows for the quick and seamless creation of
	a Document Library/File Manager. Built with jQuery Widget Factory.
	Recreates functionality of FTP/Network Drive via HTML/jQuery

Options:
	view: choose between 'folder' or 'column' view as default
	directory: choose home directory (note: ensure the dljson.php file contains this directory in preg_match())
	title: the tile of the Document Library Window

Features:
	* Allows file/folder navigation as if the user were using a network drive/ftp
	* Back and Forward navigation up and down the document tree
	* Multiple views (folder/column) 
	* Home button for return to the home directory

Instructions:
	1. This widget requires PHP for various functions including returning
		a json encoded array of directory contents and file information
	2. I've included the jQuery UI Theme 'Smoothness' form the jQuery CDN. You may customise a theme
		and include that as your jQuery UI theme.

Notes:
	* PHP is used for preventing malicious use of the widget. 
		As the home directory is defined in JavaScript it's possible to manipulate HTTP GET requests
		to see directory contents not intended to be seen. There is a preg_match performed to check
		the directory being requested starts with "files/". 

Issues:
	* Forward button only recalls previous back action

Future Features:
	* Add Files and Folders (currently has to be done manually)
	* Search
	* List view
	* Drag and Drop folders/files to new directories
	* Breadcrumb