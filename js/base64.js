$(document).ready(function() {
//start by declaring some variables and messages    
    var status = ["READY",                                                      //0
                 "LOADING FONTS",                                               //1
                 "ERROR - NO FONTS WHERE LOADED. TRY REFRESHING PAGE",          //2
                 "SOME FONTS DID NOT LOAD OR LOADED SLOWER THAN EXPECTED",      //3
                 "ERROR - A PROBLEM OCCURED POSITIONING PAGE ELEMENTS",         //4
                 "PLEASE ENTER A VALID URL",                                    //5
                 "FILE MUST BE A JPG, JPEG, GIF OR PNG IMAGE",                  //6
                 "PROCESSING : ",                                               //7
                 "FINISHED : ",                                                 //8
                 "COULD NOT FIND AN IMAGE",                                     //9
                 "COULD NOT PROCESS ",                                          //10
                 "THE ENCODINGS COUNTER HAS EXPERIENCED AN ERROR",              //11
                 "BASE 64 CODE COPIED TO CLIPBOARD AS ",                        //12
                 "THIS IMAGE SEEMS TO BE THE SAME AS THE LAST IMAGE"            //13
                  ];
    var StatusNum = 0;
    var imgData = [];
    
//Create some general functions for the site to make things easier
    var b64 = {
        storage: function() { return !!localStorage.getItem; },
        fileapi: function() { var response = false;if (window.File && window.FileReader && window.FileList && window.Blob)var response = true;return response; },
        dragdrop: function() { var testdiv = document.createElement('div'); return ('draggable' in testdiv) || ('ondragstart' in testdiv && 'ondrop' in testdiv) },
        objectURL: function() { var response = false; if(window.URL || window.webkitURL) var response=true; if (response==true) {window.URL  = window.URL || window.webkitURL;} return response; },
        canvas: function() { var response = false; if ("HTMLCanvasElement" in window) var response = true; return response; },
        isie: function() { var ie = false; var version = 100;if (navigator.appVersion.indexOf("MSIE") != -1) var version = parseFloat(navigator.appVersion.split("MSIE")[1]);if (version < 9) {var ie = true} return ie; },
        stopProp: function(e) { e.stopPropagation(); e.preventDefault(); },
        testURL: function(url) { var v = new RegExp(); v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$"); if (!v.test(url)) {return false;}return true; },
        testIMG: function(img) { var valid=false; if(/^.*\.(jpg|jpeg|png|gif)$/i.test(img)) var valid=true; return valid; },
        setStatus: function(num, name) {
                    if (name=="undefined"||name===null) {name="";}
                        if(num==7||num==8||num==10||num==12) {StatusNum=num;$("h6", "#status").fadeOut('fast', function() {
                            $("h6", "#status").html(status[num]+name).fadeIn('fast');
                            });
                        }
                        else if(num !==StatusNum) {StatusNum=num;$("h6", "#status").fadeOut('fast', function() {$("h6", "#status").html(status[num]).fadeIn('fast');
                    });}},
        setPreIMG: function(img) {
            if (img == "clear") {
                $("#previmg").empty();
                if ($("#preback").is(":visible")) {
                    $("#preback").fadeOut("fast");}
            }else{
                var i = img;
                var imh = i.height;
                var imw = i.width;
                $("#bigimg").html('<img id="bigI" src="'+i.src+'"></img>');
                if (imh > 670 && imw > 900) {
                    $("#bigI").css({
                        borderBottomLeftRadius: 40, WebkitBorderBottomLeftRadius: 40, MozBorderRadiusBottomLeft: 40, borderBottomRightRadius: 40, WebkitBorderBottomRightRadius: 40, MozBorderRadiusBottomRight: 40,
                        borderTopLeftRadius: 20, WebkitBorderTopLeftRadius: 20, MozBorderRadiusTopLeft: 20, borderTopRightRadius: 20, WebkitBorderTopRightRadius: 20, MozBorderRadiusTopRight: 20
                    });
                }
                i.id = "pi";
                if (imh===0 || imh=="undefined" || imw===0 || imw=="undefined") {
                    $("#previmg").empty();
                    if ($("#preback").is(":visible")) {
                        $("#preback").fadeOut("fast");}
                }else {
                    var wih = 280; var wiw = 336; var wia = 336 / 280; var ima = imw/imh; var ash = imh / wih; var asw = imw / wiw; var iw, ih;
                    if (ima < wia) {
                        var iw = parseInt(imw/ash);
                        var ih = 280;
                        $(i).height(ih).width(iw);
                    }else{
                        var iw = 336;
                        var ih = parseInt(imh/asw);
                        $(i).height(ih).width(iw);
                    }
                    if ($("#preback").not(":visible")) {
                        $("#preback").fadeIn("fast");
                    }
                    if ($("#previmg img").length) {
                        $("#previmg").fadeOut("slow", function() {
                            $("#previmg").html(i).fadeIn('slow').delay(100).children().css({left: 168-iw/2, top: 140-ih/2});
                        });
                    }else{$("#previmg").append(i).fadeIn('slow').delay(100).children().css({left: 168-iw/2, top: 140-ih/2});};
        }   }   }
    };
    
//extend jQuery a little bit to make centering all the fracking boxes inside one another easy
    $.fn.center = function( method ) {
        var sW = this.width(); var sH = this.height();
        sW += parseInt(this.css("padding-left"), 10) + parseInt(this.css("padding-right"), 10);
        sW += parseInt(this.css("margin-left"), 10) + parseInt(this.css("margin-right"), 10);
        sW += parseInt(this.css("borderLeftWidth"), 10) + parseInt(this.css("borderRightWidth"), 10);
        sH += parseInt(this.css("padding-top"), 10) + parseInt(this.css("padding-bottom"), 10);
        sH += parseInt(this.css("margin-top"), 10) + parseInt(this.css("margin-bottom"), 10);
        sH += parseInt(this.css("borderTopWidth"), 10) + parseInt(this.css("borderBottomWidth"), 10);
        var methods = { both: function(elm) {this.css("left", $(elm).width()/2-sW/2); this.css("top", $(elm).height()/2-sH/2);},
                        horisontal: function(elm) {this.css("left", $(elm).width()/2-sW/2);},
                        vertical: function(elm) {this.css("top", $(elm).height()/2-sH/2);}         };
        if ( methods[method] ) { return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) { return methods.init.apply( this, arguments );
        } else {$.error(b64.setStatus(4));}    
    };
  
//start site construction - load fonts
    (function InitSite() {
        var Timer=0;
        b64.setStatus(1);
        var fontcheck = setInterval(CheckWebFonts, 100);
        function CheckWebFonts() {
            if(typeof(WebFont)=='undefined') {
                if(Timer>=1500) {clearInterval(fontcheck); b64.setStatus(2); CreateSite();}
                Timer=Timer+100;
            }else{
                var fontReady = false;
                WebFont.load({google: {families: [ 'Raleway:100', 'Cantarell']}, active: function() {fontReady=true;}});
                clearInterval(fontcheck); CreateSite();
                var timeFontLoad = 0; var fontNotReady = setInterval(CheckFontLoad, 100);
            }
            function CheckFontLoad() {
                if (fontReady==true) {
                    clearInterval(fontNotReady);
                    b64.setStatus("0");
                    $("#bigassx").fadeIn(1200);
                }else if(timeFontLoad>=3500) {
                    clearInterval(fontNotReady);
                    b64.setStatus(3);
                    $("#bigassx").fadeIn(1200);
                    }
                timeFontLoad=timeFontLoad+100;
            }
        }
    })();
        
 //create the site
    function CreateSite() {
        window.location.hash = 'encode';                                        //set url hash
        $("#imgbase").val("     BASE 64 CODE WILL APPEAR HERE ONCE IMAGE IS UPLOADED"); //reset field on load in certain browsers
        $("#cover").delay(200).fadeOut("slow");                                 //remove the cover and display the site
        InitLogo();                                                             //draw the logo
        createPreview();                                                        //Create the preview window according to browser support
        createBigImg();                                                         //create the holder for large image
        clipboard();                                                            //start the copy to clipboard function
        SetPosition();                                                          //Position site elements
        count(0);                                                               //get the current count of performed encodings, does not count this request
        yourbrowser();                                                          //detects browser features
        $(window).bind("resize", function(){SetPosition();});                   //bind positions to browser size to update on resize
        socialmedia();                                                          //create social media buttons asyncronously
        $('#copyright h4').prepend("&copy;"+new Date().getFullYear()+"&nbsp;"); //autoupdate copyright year - lazy :-) 
    }

//set positions
    function SetPosition() {
        //control when scrollbars appear
        var H=$(window).height(); var W=$(window).width();
        if ( H > 900 ) {
            $("#content_container").css({height : 890}).center('both', window);
            $("#baselogo").show();
        } else if ( H < 900 &&  W < 960 ) {
            $("#content_container").css({height : 773, left : 0,  top : 20})
            $("#baselogo").hide();
        } else {
            $("#content_container").css({height : 773, top : 20}).center('horisontal', window);
            $("#baselogo").hide();
        }
        if ( H < 773 ) {
            $("body, html").css("overflowY", "scroll");
        } else {
            $("body, html").css("overflowY", "hidden");
        }
        if ( W < 960 ) {
            $("body, html").css("overflowX", "scroll");
        } else {
            $("body, html").css("overflowX", "hidden");
        }
        //position site elements
        $("#content_frame").center('horisontal', "#content_container");
        $("#content").center('horisontal', "#content_frame");
        $("#menu").center('horisontal', "#content_frame");
        $("#upldfield").center('both', "#upldfield_frame");
        $("#codefield").center('both', "#codefield_frame");
        $("#advert").center('both', "#advert_frame");
        $("#preview").center('both', "#preview_frame");
        $("#copyright").center('horisontal', "#content_frame");
    }

//create preview window and get dropped images if supported
    function createPreview() {
        var SL = ST = 0;                                                        //create a checkered background for preview window
        for(i = 0; i < 10; i++){
            i%2 == 0 ? SL=0 : SL=28;
            for(j = 1; j < 7; j++){    
                $("<span>").css({height: "28px", width: "28px", left: SL, top: ST, background: "#e1e1e1", position: "absolute", zIndex: "6"}).appendTo("#preback");
                SL = SL + 56;
            } ST=ST+28;
        } 
                                                                                //set rounded corner on checkered background
        $("#preback span:first").css({borderTopLeftRadius: 12, WebkitBorderTopLeftRadius: 12, MozBorderRadiusTopLeft: 12 });
        $("#preback span:last").css({borderBottomRightRadius: 12, WebkitBorderBottomRightRadius: 12, MozBorderRadiusBottomRight: 12 });
        if (b64.dragdrop() && b64.fileapi()) {                                  //create dropzone only if supported
            var dropzone;  
                dropzone = document.getElementById("dropzone");  
                dropzone.addEventListener("dragenter", dragin, false);
                dropzone.addEventListener("dragleave", dragout, false);
                dropzone.addEventListener("dragover", b64.stopProp, false);
                dropzone.addEventListener("drop", drop, false);  
        } else {
            $("#pretext").html("PREVIEW");
            $("#dropzone, #usethedrop, #ortwo").hide();
            $(".tableft h2", "#preview_frame").html("PREVIEW");} //create a preview only box if drag and drop is not supported
        
        function drop(e) {
            b64.stopProp(e);
            if ($("#previBG").hasClass("dragged")) {
                $("#previBG, #bigassx, #pretext").removeClass("dragged");
                $("#pretext").removeClass("dragtxt");
            }
            handleFiles("dropped", e.dataTransfer.files);
        }
        
        function dragin(e) {
            b64.stopProp(e);
            if ($("#previmg img").length) {
                $("#previBG, #bigassx, #pretext").addClass("dragged");
                $("#pretext").addClass("dragtxt");
            }
        }
        
        function dragout(e) {
            b64.stopProp(e);
            if ($("#previBG").hasClass("dragged")) {
                $("#previBG, #bigassx, #pretext").removeClass("dragged");
                $("#pretext").removeClass("dragtxt");
            }
        }
    }
    
//get local image
    $("#fileSelect").click(function (e) {                                       //create a nicer input button that Opera does not seem to understand. hacked away in css
        b64.stopProp(e);
        $("#fileElem").trigger('click');
    });
    $("#fileElem").bind("change", function(){
            handleFiles("inputted", this.files);                                //and send file down the line, as html 5 support is already confirmed otherwise this option would be hidden
    });
    
//get online image
    $("input", "#onlined").bind("keydown mousedown", function() {               //register events in the inputs to compare later
        $("#online").data('oldVal', $("#online").val());
    });
    $("input", "#onlined").bind("keyup paste", function() {                     //register events in the inputs to send data
        $("#imgbase").data('oldVal', $("#imgbase").val());
        setTimeout(getURL, 1);
    });
    
    $("#online, #imgbase").keypress(function(e) {if (e.keyCode == 13) {return false; b64.stopProp(e)}}); //prevent refresh on enter key pressed in form
    
    function getURL() {
        var url=$("#online").val();                                                                     //get url
        var oldURL = $("#online").data('oldVal');                                                       //compares old data to new data
        if (url !==oldURL) {                                                                            //check if it's changed since last time
            if (url.length > 4) {                                                                       //if url has more than 4 letters
                var filename = url.substring(url.lastIndexOf("/") + 1, url.length);                     //get the filename
                if(!url.match('^http://')){url='http://' + url}                                         //add http if missing
                    url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));   //remove hash
                    url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));   //remove querystring
                    if(b64.testURL(url)) {                                                              //valid url check
                    if(b64.testIMG(filename)) {                                                         //do nothing if it is not an image, headers checked later to make sure
                        b64.setStatus(7, filename);                                                     //set status
                        handleFiles("online", url);                                                     //send down the line for prossessing
                    } else {b64.setStatus(6);}                                                          //url not valid
                } else {b64.setStatus(5);}                                                              //not valid image url
            } else {
                b64.setStatus("0");                                                                     //status - Ready
            }
        }
    }

//handle files
    function handleFiles(sender, files) {  
        if (sender=="dropped" || sender=="inputted") {                          //if it's dropped or inputted
            if (b64.fileapi()) {                                                 //check if html5 File API is supported
                $("#online").val("       TYPE OR PASTE IN LINK TO AN ONLINE IMAGE"); //reset url input box
                var file = files[0];                                            //only one image at the time, but html5 File API only supports arrays
                var filename = file.name;                                       //get the filename
                var filesize = file.size;                                       //get filesize
                imgData = [filename, filesize];
                b64.setStatus(7, filename); 
                var imageType = /image.*/;                                      //only allowed filetype is image
                if (!file.type.match(imageType)) {                              //check for image type
                    b64.setStatus(6);
                } else {
                    var img = document.createElement("img");  
                    img.file = file;
                    
                    if (b64.objectURL()) {
                        window.URL  = window.URL || window.webkitURL;   
                        img.src = window.URL.createObjectURL(file);             //create html5 spec url for object if supported
                    }
                    img.onload = (function(e) {  
                        var ImgW = img.width;
                        var ImgH = img.height;
                        imgData[2] = img.height;
                        imgData[3] = img.width;
                        b64.setPreIMG(img);                                     //set the preview
                        var updateT = setTimeout(UpdateFileInfo, 300);
                    });
                    var reader = new FileReader();                              
                    reader.onloadstart = (function() {
                        b64.setStatus(7, filename);
                    });   
                    reader.onload = (function(aImg) {
                        return function(e) {
                            aImg.src = e.target.result;
                            populate(e.target.result);                          //populate the basecode box
                            b64.setStatus(8, filename);
                            count(1);
                            UpdateFileInfo();
                        };
                        })(img);  
                    reader.onerror = (function() {
                            b64.setStatus(10, filename);
                    });
                    
                    reader.readAsDataURL(file);                                 //reads image file on users local computer as base 64
                }
            }else{}                                                             //if no html5 do something else like php, maybe later !
        }    
        else if(sender=="online") {                                             //if it's online we need to use PHP
            url = files;                                                        //if it's online it's probably a URL not a file
            var onload = function(){                                            //wait until image is loaded
                b64encodePHP(url, filename);                                    //send to encoding
                b64.setPreIMG(image);                                           //send it to be resized and previewed in preview window
                imgData = [filename, "&quest;", image.height, image.width];     //push image data to array
                UpdateFileInfo();                                               //update file info window
            };   
            var image = new Image();
            image.src = url;
            var filename = url.substring(url.lastIndexOf("/") + 1, url.length); //get filename
            if(b64.isie()){ function testImg(){ if(image.complete != null && image.complete == true){ onload(); return; } setTimeout(testImg, 200); } setTimeout(testImg, 200); } //IE hack
            else{ image.onload = onload(); }
        }
    }

//base 64 encode online images with PHP
    function b64encodePHP(url, filename) {
        $.ajax({
            type: 'POST',
            url: '/base64.php',
            data: {myurl : url},
            success: function(data) {
                if (data=="error"||data==""){ b64.setPreIMG("clear"); b64.setStatus(9);
                }else {
                    b64.setStatus(8, filename);
                    populate(data);                                             //if returns data, populate base code box
                    imgData[1] = data.length * 0.75;                            //calculate approx size  of image
                    var updateT = setTimeout(UpdateFileInfo, 300);
                    count(1);                                                   //count encoding
                    $("img", "#previmg").center('vertical', '#previmg');        //fix a bug with preview not always being centered vertical
                }
            },
            error: function() {b64.setPreIMG("clear"); b64.setStatus(9);}       //report error
        });
    }

//count number of total files encoded    
    function count(c) {
        setTimeout(docount, 500);
            function docount() {
                var oldVal = $("#imgbase").data('oldVal'); var newVal = $("#imgbase").val();
                if (newVal !== oldVal) {
                    $("#imgbase").data('oldVal', $("#imgbase").val());
                    $.ajax({
                        type: 'GET',
                        url: '/count.php',
                        data: {cnt : c},
                        success: function(data) {
                            if (data=="error" || data=="undefined") {b64.setStatus(11);
                            } else {$("#count h4").html(data + "&nbsp;IMAGES ENCODED");}
                        },
                        error: function() {b64.setStatus(11);}
                    });
                }
            }
    }

//menu functions
    $("#socialcover").mouseenter(function() {
        $(this).stop(true, true).fadeOut("fast");
    });
    
    $("#social").mouseleave(function() {
        if ($("#socialcover").is(":hidden")) {
            $("#socialcover").delay(1000).fadeIn("fast");
        }    
    });
    
    $("#menu li").mouseenter(function() {
        if ($(this).hasClass("normal")) {$(this).children().children().stop(true, true).animate({ color: "#797979"}, 500 );}
        })    
                .mouseleave(function() {
        $(this).children().children().animate({ color: "#072225"}, 500 );
    });

    $("#menu li, #menu li a").click(function() {
        if ($("#big").is(":visible")) {$("#big").fadeOut(1000)}
        $("#menu li").removeClass("active").addClass("normal");
        $(this).closest("li").toggleClass("active normal");
        
        if ($(this).closest("li").is(':nth-child(1)')){
            if ( $("#privacy").is(":visible") ) {$("#privacy").fadeOut(1000)}    
            $("#slide").animate({left: 0, top: 0}, 1000);
            
        }else if ($(this).closest("li").is(':nth-child(2)')){
            if ( $("#privacy").is(":visible") ) {$("#privacy").fadeOut(1000)}
            $("#slide").animate({left: -936, top: 0}, 1000);
            
        }else if ($(this).closest("li").is(':nth-child(3)')){
            if ( $("#privacy").is(":visible") ) {$("#privacy").fadeOut(1000)}
            $("#slide").animate({left: -936, top: -706}, 1000);
            
        }else if ($(this).closest("li").is(':nth-child(4)')){
            if ( $("#privacy").is(":visible") ) {$("#privacy").fadeOut(1000)}
            $("#slide").animate({left: 0, top: -706}, 1000);
            
        }else if ($(this).closest("li").is(':last-child')){
            $("#privacy").show(1000);
        }
        b64.stopProp(e);
    });

    $("#online").focus(function() {
        if ( $(this).val() == "       TYPE OR PASTE IN LINK TO AN ONLINE IMAGE") {$(this).val("");}  })
                .blur(function() {
        if ( $(this).val() == "") {$(this).val("       TYPE OR PASTE IN LINK TO AN ONLINE IMAGE");}  })
                .mouseenter(function() {$(this).stop(true, true).animate({ color: "#FFF"}, 500 );  })
                .mouseleave(function() {$(this).animate({ color: "#b7b7b7"}, 500 );
    });
     
    $("#fileSelect").mouseenter(function() {
        $("h3", this).stop(true, true).animate({ color: "#FFF"}, 500 );
        })    
                    .mouseleave(function() {
        $("h3", this).animate({ color: "#b7b7b7"}, 500 );
    });

    $("#usethedrop").stop(true, true).mouseenter(function() {
        if ($("#previmg img").length) {
            $("#previBG, #bigassx, #pretext").addClass("dragged");
            $("#pretext").addClass("dragtxt");
        } else {
            $("#bigassx, #pretext").animate({ color: "#FFF"}, 500 );    
        }
    })    
                            .mouseleave(function() {
        if ($("#previBG").hasClass("dragged")) {
            $("#previBG, #bigassx, #pretext").removeClass("dragged");
            $("#pretext").removeClass("dragtxt");
        } else {
            $("#bigassx, #pretext").animate({ color: "#9a9a9a"}, 500 );    
        }
    });
                            
    $("#dropzone, #previmg").mouseenter(function() {
        if ($("#previmg img").is(":visible")) {
            $("#dropzone, #previmg img").css("cursor", "url(/zoom.png), pointer");
        }
        })
                        .mouseleave(function() {
            $("#dropzone, #previmg").css("cursor", "default");
    
        })
                        .click(function() {              
        if ($("#previmg img").is(":visible")) {
            $("#big").fadeIn(1000);
            $("#bigI").center('both', '#bigBG');
        }else{
            b64.stopProp(e);
        }
    });
                    
//insert social media buttons
    function socialmedia() {
        //Google
        //$.getScript("https://apis.google.com/js/plusone.js", function () {
            $('#googleplus').html('<g:plusone size="medium" count="false" width="60" href="www.base64img.com"></g:plusone>');
        //});
        //Facebook
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        $('<div class="fb-like" data-href="www.base64img.com" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true"></div>').insertAfter('#fb-root');
        //Twitter
        $('<a href="https://twitter.com/share" class="twitter-share-button" data-url="www.base64img.com" data-text="Base 64 Image - converting your images to base 64 encoding made easy!" data-count="none">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>').appendTo('#tweet');
        //Digg
        $.getScript("http://widgets.digg.com/buttons.js", function () {
            $('<a class="DiggThisButton DiggCompact" href="http://digg.com/submit?url=http%3A//www.base64img.com?style=no"></a>').appendTo('#digg');
        });
        //Tumblr
        $('<span id="tumblr_button_base64img"></span>').appendTo('#tumblr');
        var tumblr_link_url = "http://www.base64img.com";
        var tumblr_link_name = "Base 64 Image";
        var tumblr_link_description = "Converting your images to base 64 encoding made easy!";
        var tumblr_button = document.createElement("a");
        tumblr_button.setAttribute("href", "http://www.tumblr.com/share/link?url=" + encodeURIComponent(tumblr_link_url) + "&name=" + encodeURIComponent(tumblr_link_name) + "&description=" + encodeURIComponent(tumblr_link_description));
        tumblr_button.innerHTML = "Share on Tumblr";
        $("#tumblr_button_base64img").append(tumblr_button);
    }    

//creates the window for large image
    function createBigImg() {
        var SL = 0;
        var ST = 0;                                                             //create a checkered background for previews
        for(i = 0; i < 20; i++){                                                //If for some reason anyone from Opera software should read this
            i%2 == 0 ? SL=28 : SL=-7;                                           //please stop making browsers, as you suck at it. Also the morron who decided
            for(j = 1; j < 15; j++){                                            //to limit nth child to 127 should be fired, and Opera should be fined for not documenting it ANYWHERE - IDIOTS?
                $("<span>").css({height: "35px", width: "35px", left: SL, top: ST, background: "#e1e1e1", position: "absolute", zIndex: "96"}).appendTo("#bigBG");
                SL = SL + 70;
            }
            ST=ST+35;
        }
        $("#bigBG span:nth-child(267)").css({width: 25, height: 31, left: 2, borderBottomLeftRadius: 40, WebkitBorderBottomLeftRadius: 40, MozBorderRadiusBottomLeft: 40 });
        $("#bigBG span:nth-child(280)").css({width: 25, height: 31, borderBottomRightRadius: 40, WebkitBorderBottomRightRadius: 40, MozBorderRadiusBottomRight: 40 });
    }
    
    $("#closebig").click(function() {
        $("#big").fadeOut(1000);
    });

//checkboxes for string, css and html options    
    $("input[name='base64']", "#checks").change(function() {
            var checks = $(this).val();
            $("#checks").data("selected", checks);
            var data = $("#imgbase").data("code");
            if (checks == "css") {
                encoded = "background: url("+data+");";
            }else if (checks == "html") {
                encoded = "<img src='"+data+"' />";
            }else{
                encoded = data;
            }
            $("#imgbase").val(encoded);
    });

//populates the base code input box    
    function populate(data) {
        $("#ZeroClipboardMovie").css("display", "block");
        if (data !== $("#imgbase").val()) {
            var fnm = imgData[0];
            var ext = fnm.substr(fnm.lastIndexOf('.') + 1);
            if (ext=="jpg") {ext="jpeg";}
            if(!data.match('^data')){
                data='data:image/' + ext + ';base64,' + data;
            }
            $("#imgbase").data("code", data);
            
            var checks = $("#checks").data("selected") || "string";             //again run the checkboxes to see what is selected
            var encoded;
            
            if (checks == "css") {
                encoded = "background: url("+data+");";
            }else if (checks == "html") {
                encoded = "<img src='"+data+"' />";
            }else{
                encoded = data;
            }
            
            $("#imgbase").val(encoded).css("cursor", "text").animate({color: '#bebebe'}, 500);
            $("#clipboard").animate({color: '#9f9f9f'}, 500);
            $("#checks, #fileinfo").fadeIn(1000);
            UpdateFileInfo();
            var updT = setTimeout(UpdateFileInfo, 2000);
        }
        
//the copy to clipboard function, button activated when data is populated
        $("#ZeroClipboardMovie").live("mouseenter", function() {                //some hover effects on the copy to clipboard button
            $("#clipboard").animate({ color: "#FFF"}, 500 );    
            })
                            .live("mouseleave", function() {
            $("#clipboard").animate({ color: "#9a9a9a"}, 500 );    
        });
    }

    function clipboard() {
        $.getScript("/ZeroClipboard.js", function () {                     //copy to clipboard function
            var clip = null;
                    function init() {
                            clip = new ZeroClipboard.Client();
                            clip.setHandCursor( true );
                            clip.addEventListener('mouseOver', my_mouse_over);
                            clip.addEventListener('complete', my_complete);
                            clip.glue( 'clipboard' );
                    }
                    function my_mouse_over(client) {
                            clip.setText( $('#imgbase').val() );
                    }
                    function my_complete(client, text) {
                            var checks = $("#checks").data("selected") || "string";
                            b64.setStatus(12, checks.toUpperCase());
                    }
                init();
        });
    }

//updates the file info section when an image is added    
    function UpdateFileInfo() {            
            var filename = imgData[0];
            var extension = filename.substr(filename.lastIndexOf('.') + 1);
            if (extension=="jpg") {extension="jpeg";}
            var filesize = Math.round(imgData[1] / 1024);
            var fileheight = imgData[2];
            var filewidth = imgData[3];
        
        $("#fileinfo").html('<span id="filenm">FILENAME : '+filename.toUpperCase()+'</span>' +
                              '<span id="fileext">FILETYPE : IMAGE/'+extension.toUpperCase()+'</span>' +
                              '<span id="filesize">FILESIZE&nbsp;&nbsp;: '+filesize+' kb</span>' +
                              '<span id="fileheight">HEIGHT : '+fileheight+' px</span>' +
                              '<span id="filewidth">WIDTH&nbsp;&nbsp;: '+filewidth+' px</span>');
        $("#filenm").center('horisontal', "#fileinfo");
    }

//the canvas for the logo
    function CreateLogo() {
            var logotext = $("#logo").text();
            var pi=Math.PI;
            
            $("#logo").center('horisontal', "#content_container");
            ctx = document.getElementById("logo").getContext("2d");
            ctx.fillStyle = "black";
            ctx.font = "bold 100px arial";
            ctx.fillText(logotext, 60, 120);  
                
            ctx.globalCompositeOperation = 'xor';
                
            grad=ctx.createRadialGradient(100,100,0,100,100,100);
            grad.addColorStop(0.0,'rgba(87,46,46,1)');
            grad.addColorStop(0.55,'rgba(58,24,24,1)');
            grad.addColorStop(1.0,'rgba(56,23,23,0)');
            ctx.fillStyle=grad;
            ctx.beginPath();
            ctx.arc(100,100,100,pi/2,3*pi/2,false);
            ctx.closePath();
            ctx.fill();
            
            grad=ctx.createRadialGradient(860,100,0,860,100,100);
            grad.addColorStop(0.0,'rgba(87,46,46,1)');
            grad.addColorStop(0.55,'rgba(58,24,24,1)');
            grad.addColorStop(1.0,'rgba(56,23,23,0)');
            ctx.fillStyle=grad;
            ctx.beginPath();
            ctx.arc(860,100,100,3*pi/2,pi/2,false);
            ctx.closePath();
            ctx.fill();
            
            grad=ctx.createLinearGradient(0,0,0,200);
            grad.addColorStop(0.0,'rgba(61,29,29,0)');
            grad.addColorStop(0.25,'rgba(58,24,24,1)');
            grad.addColorStop(0.5,'rgba(87,46,46,1)');
            grad.addColorStop(0.75,'rgba(58,24,24,1)');
            grad.addColorStop(1.0,'rgba(40,13,13,0)');
            ctx.fillStyle=grad;
            ctx.fillRect(100,0,760,960);
    }

//matrix rain
    var matrix = {
        Rand: function(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;},
    
        makeLine: function() {
            var linemin = 10;
            var linemax = 25;
            var minsize = 4;
            var maxsize = 13;
            var minleft = 1;
            var maxleft = 820;
            var charmin = 20000;
            var charmax = 24000;
            var line = "";
            var linelength = matrix.Rand(linemin, linemax);
            var left = matrix.Rand(minleft, maxleft);
            var size = matrix.Rand(minsize, maxsize);
            line = "<span style='font-size:" + size + "px; line-height:" + size + "px; left:" + left + "px;'>";
            for (var i=1;i<=linelength;i++) {
                var opac = i/10 || 1;
                var character = matrix.Rand(charmin, charmax);
                line = line + "<span style='opacity:" + opac + ";'>&#"+character+";</span><br/>";
            }
            character = matrix.Rand(12000, 14000); 
            line = line + "<span class='lastchar'>&#"+character+";</span></span>";
            $("#matrix").data("speed", size);
            return line;
        },
        
        insertLine: function() {
            var fallspeed = 700;
            var linje = matrix.makeLine();
            var speed = $("#matrix").data("speed")-16;
            var speed = speed-(speed*2);
            var speed = speed*fallspeed;
            $(linje).css("top", "-300px").appendTo($("#matrix")).animate({top: "100"}, speed, 'linear', function() {
                $(this).remove();
            });
        },
    
        rotateChar: function() {
            degree = degree+90;
            var elm = $(".lastchar");
            $(elm).css('-webkit-transform', 'rotate('+degree+'deg)');
            $(elm).css('-moz-transform', 'rotate('+degree+'deg)');
            $(elm).css('-ms-transform', 'rotate('+degree+'deg)');
            $(elm).css('-o-transform', 'rotate('+degree+'deg)');
            $(elm).css('transform', 'rotate('+degree+'deg)');
        },
        
        StartMatrix: function() {
            var lines = 260;
            var rotatespeed = 200;
            degree=0;
            rotating = setInterval(this.rotateChar, rotatespeed);
            generateLines = setInterval(this.insertLine, lines);
            running=true;
        },
        
        StopMatrix: function() {
            clearInterval(rotating);
            clearInterval(generateLines);
            $("#matrix").children().stop(true, true);
            running=false;
        }
    }


//browser stuff
    function yourbrowser() {
        if (b64.fileapi())   { $("#yb li:nth-child(2)").html("yes") } else { $("#yb li:nth-child(2)").html("no") }
        if (b64.dragdrop())  { $("#yb li:nth-child(3)").html("yes") } else { $("#yb li:nth-child(3)").html("no") }
        if (b64.storage())   { $("#yb li:nth-child(4)").html("yes") } else { $("#yb li:nth-child(4)").html("no") }
        if (b64.objectURL()) { $("#yb li:nth-child(5)").html("yes") } else { $("#yb li:nth-child(5)").html("no") }
        if (b64.canvas())    { $("#yb li:nth-child(6)").html("yes") } else { $("#yb li:nth-child(6)").html("no") }
    }

    function InitLogo() {
        if(b64.isie()) {
            $("#matrix, .or, #fileElem, #fileSelect, #socialcover, #clipboard, #checks").remove();
            $(".tableft, .tabright").css("background", "#2c0101");
            $("#privacy").css("background", "#072e2e");
            $("#baselogo").css("left", 175);
            $("#count h4").css("color", "#319ea4");
            
            function positionIE() {
                var W=$(window).width();
                var C=W / 2 - 480;
                $("#content_container").css("left", C);
                $("#copyright").css("left", 370);
            }
            
            positionIE();
            $(window).bind("resize", function(){
                positionIE();
            });
            
            function IEmsg(){
                $("h6", "#status").html("WE STRONGLY RECOMMEND USING ANOTHER BROWSER");
            }
            var msg = setTimeout(IEmsg, 3000);
        
        }else{
            if (navigator.appVersion.indexOf("MSIE") != -1) {
                $(".or, #fileElem, #fileSelect, #clipboard, #checks").remove();
                $(".tableft, .tabright").css("background", "#2c0101");
                CreateLogo();                                                     
                matrix.StartMatrix();
                $("#logo").click(function() {
                    if (running) {
                        matrix.StopMatrix();
                    }else{
                        matrix.StartMatrix();
                    }
                });
            } else {
                    if(navigator.appVersion.indexOf("Apple") != -1) {
                        if(navigator.vendor.indexOf("Apple") != -1) {           //problem with vendor in Opera (<--sucks)
                            $(".or, #fileElem, #fileSelect").remove();
                        }
                    }
                
                CreateLogo();                                                     
                matrix.StartMatrix();
                $("#logo").click(function() {
                    if (running) {
                        matrix.StopMatrix();
                    }else{
                        matrix.StartMatrix();
                    }
                });
            }
        }
    }
});
window.___jsl=window.___jsl||{};
window.___jsl.h=window.___jsl.h||'r;gc\/24805178-fa62ba1b';
window.___jsl.l=[];
window.__GOOGLEAPIS=window.__GOOGLEAPIS||{};
window.__GOOGLEAPIS.gwidget=window.__GOOGLEAPIS.gwidget||{};
window.__GOOGLEAPIS.gwidget.superbatch=false;window.__GOOGLEAPIS.iframes=window.__GOOGLEAPIS.iframes||{};
window.__GOOGLEAPIS.iframes.plusone=window.__GOOGLEAPIS.iframes.plusone_m=window.__GOOGLEAPIS.iframes.plusone||{url:':socialhost:/u/:session_index:/_/+1/fastbutton',params:{count:'',size:'',url:''}};window.___gpq=[];
window.gapi=window.gapi||{};
window.gapi.plusone=window.gapi.plusone||(function(){
  function f(n){return function(){window.___gpq.push(n,arguments)}}
  return{go:f('go'),render:f('render')}})();
function __bsld(){var p=window.gapi.plusone=window.googleapisv0.plusone;var f;while(f=window.___gpq.shift()){
  p[f]&&p[f].apply(p,window.___gpq.shift())}
if (gadgets.config.get("gwidget")["parsetags"]!=="explicit"){gapi.plusone.go();}}
window['___jsl'] = window['___jsl'] || {};window['___jsl']['u'] = 'https:\/\/apis.google.com\/js\/plusone.js';window['___jsl']['f'] = ['googleapis.client','plusone'];window['___jsl']['ms'] = 'https://plus.google.com';(window['___jsl']['ci'] = (window['___jsl']['ci'] || [])).push({"gwidget":{"parsetags":"onload","superbatch":false},"iframes":{"sharebox":{"params":{"json":"&"},"url":":socialhost:/u/:session_index:/_/sharebox/dialog"},":socialhost:":"https://plusone.google.com","plusone_m":{"url":":socialhost:/u/:session_index:/_/+1/fastbutton","params":{"count":"","size":"","url":""}},"card":{"params":{"style":"#","userid":"&"},"url":":socialhost:/u/:session_index:/_/hovercard/card"},"plusone":{"url":":socialhost:/u/:session_index:/_/+1/fastbutton","params":{"count":"","size":"","url":""}}},"googleapis.config":{"requestCache":{"enabled":true},"methods":{"chili.people.list":true,"pos.plusones.list":true,"pos.plusones.get":true,"chili.people.get":true,"pos.plusones.insert":true,"chili.activities.list":true,"pos.plusones.delete":true,"chili.activities.get":true,"chili.activities.search":true,"pos.plusones.getSignupState":true},"versions":{"chili":"v1","pos":"v1"},"rpc":"/rpc","transport":{"isProxyShared":true},"sessionCache":{"enabled":true},"root-1p":"https://clients6.google.com","root":"https://www.googleapis.com","xd3":"/static/proxy.html","developerKey":"AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ","auth":{"useInterimAuth":false}}});var gapi=window.gapi||{};gapi.client=window.gapi&&window.gapi.client||{};
(function(){var o=void 0,p=void 0,q="___jsl",G="h",k="l",H="m",r="ms",s="cu",t="c",I="o",l="p",i="q",m="https://ssl.gstatic.com",J="/webclient/js",K="/webclient/jsx/",u="https://apis.google.com",v=".js",L="gcjs-3p",M=/^(https?:)?\/\/([^/:@]*)(:[0-9]+)?(\/[\w.,:!=/-]*)(\?[^#]*)?(#.*)?$/,w=/^[?#]([^&]*&)*jsh=([^&]*)/,x="d",j="r",N="f",n="m",O="n",P="sync",Q="callback",y="config",z="nodep",A="gapi.load: ",B=function(a,b){o&&o(a,b);throw A+a+(b&&" "+b);},C=function(a){p&&p(a);var b=window.console;b&&
b.warn(A+a)},R=function(a,b,d){a=a[G];if(b=b&&w.exec(b)||d&&w.exec(d))try{a=decodeURIComponent(b[2])}catch(f){C("Invalid hint "+b[2])}return a},D=function(a){a.sort();for(var b=0;b<a.length;)!a[b]||b&&a[b]==a[b-1]?a.splice(b,1):++b},S=function(a,b){for(var d=true,f=0,c=0,e,g;d&&(e=a[f])&&(g=b[c]);)e==g?++f:e<g&&(d=false),++c;return d&&!e},T=function(a){if(document.readyState!="loading")return false;if(typeof window.___gapisync!="undefined")return window.___gapisync;if(a&&(a=a[P],typeof a!="undefined"))return a;
for(var a=document.getElementsByTagName("meta"),b=0,d;d=a[b];++b)if("generator"==d.getAttribute("name")&&"blogger"==d.getAttribute("content"))return true;return false},U=function(a){var b=document.createElement("script");b.setAttribute("src",a);a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)},W=function(a,b,d,f,c){var e=d.shift(),g;g=e==j?m:e==n?f[r]||u:(g=d.shift())&&g.replace(/\/+$/,"");var h;e==j?(h=d.shift(),h=(h.indexOf(K)?J+"/":"")+h):h=d.shift();var i=e==x,V=i&&
d.shift()||L,d=i&&d.shift();if(e==x)c=h,h=V,a="/"+a.join(":")+(b.length?"!"+b.join(":"):"")+v+"?container="+h+"&c=2&jsload=0",c&&(a+="&r="+c),d=="d"&&(a+="&debug=1");else if(e==j||e==N)c=h,a=(c.indexOf("/")?"/":"")+c+"/"+a.join("__")+(b.length?"--"+b.join("__"):"")+v;else if(e==n||e==O)b=h,a=a.join(",").replace(/\./g,"_").replace(/-/g,"_"),a=b.replace("__features__",a),a=c[z]?a.replace("/d=1/","/d=0/"):a;else return C("Unknown hint type "+e),"";if(!g)return"";g+=a;a=g;b=f;if(c=f=M.exec(a))if(c=!/\.\.|\/\//.test(f[4]))b:if(c=
a,f=f[2],e==j)c=c.substr(0,m.length)==m;else if(e==n)f=b[r]||u,c=c.substr(0,f.length)==f;else{e=b[H];if(f&&e){e=e.split(",");b=0;for(c=e.length;b<c;++b)if(d=e[b],h=f.lastIndexOf(d),(h==0||d.charAt(0)=="."||f.charAt(h-1)==".")&&f.length-d.length==h){c=true;break b}}c=false}c||B("Invalid URI",a);return g},X=function(a,b,d){(a[i]=a[i]||[]).push([b,d])},F=function(a){a[i]&&a[i].length>0&&(window.gapi.load||E).apply(null,a[i].shift())},E=function(a,b){var d,f={};typeof b!=="function"?(f=b||{},d=f[Q]):
d=b;var c=window[q]=window[q]||{};if(c[l])X(c,a,b);else{var e=a.split(":");f[z]||D(e);var g=c[k]=c[k]||[];D(g);var h=R(c,window.location.search,window.location.hash);h||B("No hint present","");var i=function(a){if(a)try{a()}catch(b){return b}return null};if(!S(e,g)&&(h=h.split(";"),g=W(e,g,h,c,f),f[y]&&(c[s]=c[s]||[]).push(f[y]),g)){c[l]=e;c[I]=1;c[t]=function(){delete c[l];delete c[t];var a=i(d);F(c);if(a)throw a;};[].push.apply(c[k],e);T(f)?document.write('<script src="'+g+'"><\/script>'):U(g);
return}f=i(d);F(c);if(f)throw f;}};gapi.loader={load:E}})();
gapi.load=window.___jsl&&window.___jsl.il&&window.gapi&&window.gapi.load||gapi.loader.load;
(window.gapi=window.gapi||{}).load=window.___jsl&&window.___jsl.il&&window.gapi.load||gapi.load;
gapi.load('googleapis.client:plusone', {'callback': window['__bsld']  });