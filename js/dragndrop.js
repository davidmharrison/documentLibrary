function upload(event) {
	
	alert(event);
	
	return false;
    
    var data = event.dataTransfer;

    var boundary = '------multipartformboundary' + (new Date).getTime();
    var dashdash = '--';
    var crlf     = '\r\n';

    /* Build RFC2388 string. */
    var builder = '';

    builder += dashdash;
    builder += boundary;
    builder += crlf;
    
    var xhr = new XMLHttpRequest();
    
    /* For each dropped file. */
    for (var i = 0; i < data.files.length; i++) {
        var file = data.files[i];

        /* Generate headers. */            
        builder += 'Content-Disposition: form-data; name="user_file[]"';
        if (file.fileName) {
          builder += '; filename="' + file.fileName + '"';
        }
        builder += crlf;

        builder += 'Content-Type: application/octet-stream';
        builder += crlf;
        builder += crlf; 

        /* Append binary data. */
        builder += file.getAsBinary();
        builder += crlf;

        /* Write boundary. */
        builder += dashdash;
        builder += boundary;
        builder += crlf;
    }
    
    /* Mark end of the request. */
    builder += dashdash;
    builder += boundary;
    builder += dashdash;
    builder += crlf;

    xhr.open("POST", "upload.php", true);
    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' 
        + boundary);
    xhr.sendAsBinary(builder);        
    
    xhr.onload = function(event) { 
        /* If we got an error display it. */
        if (xhr.responseText) {
            alert(xhr.responseText);
        }
        $("#dropzone").load("list.php?random=" +  (new Date).getTime());
    };
    
    /* Prevent FireFox opening the dragged file. */
    event.stopPropagation();
    
}