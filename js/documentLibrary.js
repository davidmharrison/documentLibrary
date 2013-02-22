/***************************************
Documnet Library jQuery Widget
created by David Michael Harrison
http://www.twitter.com/watchinharrison
***************************************/

$(function() {
	String.prototype.trunc = 
      function(n){
          if(this.length > (n+14)) return this.substr(0,n-1)+(this.length>n?'...':'')+(this.substr((this.length-10),10));
		  else return this;
      };
	  
	  var delay = (function(){
	    var timer = 0;
	    return function(callback, ms){
	      clearTimeout (timer);
	      timer = setTimeout(callback, ms);
	    };
	  })();
		  
	$.widget( "wh.documentLibrary", {
      // options
      options: {
      	//view type columns/folders/list 
        view: 'column',
		//search boolean
		search: true,
		//set Title of the Widget
		title: 'Document Library',
		//set home directory
		directory: 'files/',
		//set moveable folders and files
		moveable: true,
		
 
        // callbacks
		close: null,
        minimise: null,
        clear: null
      },
 
      // the constructor
      _create: function() {
		this.element
		// add a class for theming
	  	.addClass( "document-library" );
	  	//pass this to widget;
        widget = this;
		//create view
		//this.options.view
		
		this.view = this.options.view;
		
		this.directory = this.options.directory;
		//create reset button to clear cache and return elements to default value          
		this.titlebar = $( "<div>", {
		  html: "<h3>"+this.options.title+"</h3>",
		  "class": "titlebar"
		}).appendTo( this.element );
		
		this.close = $("<button>",{
			"class": "close"
		}).button({
			icons: {
        		primary: "ui-icon-close"
      	  	},
      	  	text: false
		}).appendTo( this.titlebar );
		
		this.minimise = $("<button>",{
			"class": "minimise"
		}).button({
			icons: {
    			primary: "ui-icon-minus"
      	  	},
      	  	text: false
		}).on({
			click: function() {
//				widget.element.hide();
			}
		}).appendTo( this.titlebar );
		
		this.toolbar = $("<div>",{
			"class":"toolbar"
		}).appendTo(this.element);
		
		this.toolbarbuttons = [
			this.back = $("<div>",{
				"class": "back"
			}).button({
				icons: {
	    			primary: "ui-icon-arrowthick-1-w"
	      	  	},
	      	  	text: false
			}).on({
				click: function() {
					if(!widget.history) widget.history = '';
					widget.history = widget.directory.split('/').splice(-2,2).join("/");
					$('.column').slice(-1).remove();
					$('.column:last-child').find('li.clicked').removeClass('clicked').addClass('unclicked');
					if(widget.directory.split('/').splice(-1,1)[0].length == 0) number = -2;
					else number = -1;
					widget.directory = widget.directory.split('/').slice(0,number).join("/")+"/";
			  		if(widget.directory.split('/').length==2) widget.back.button({ disabled: true });
			  		else widget.back.button({ disabled: false });
//					widget.setWidth();
//					widget.getcontents();
				}
			}),
			this.forward = $("<div>",{
				"class": "forward"
			}).button({
				icons: {
	    			primary: "ui-icon-arrowthick-1-e"
	      	  	},
	      	  	text: false
			}).on({
				click: function() {
					$.each(widget.history.split("/"),function(i,e){
						$('.column .folder').filter(function(i1,e2) { if($(e2).text()==e) $(e2).addClass('clicked'); });
					});
					widget.directory = widget.directory+widget.history;
					widget.getcontents();
				}
			}),
			this.home = $("<div>",{
				"class": "home"
			}).button({
				icons: {
	    			primary: "ui-icon-home"
	      	  	},
	      	  	text: false
			}).on({
				click: function() {
					$('.column').remove();
					widget.directory = widget.options.directory;
					widget.getcontents();
					widget.back.button({ disabled: true });
				}
			})
		];
		/*
		this.fileupload = $('<form>',{
			"id": "fileupload",
			"action": "#",
			"method": "POST",
			"enctype": "multipart/form-data"
		}).fileupload({
		        // Uncomment the following to send cross-domain cookies:
		        //xhrFields: {withCredentials: true},
				autoUpload: true,
//				dropZone: $('.column'),
		        url: 'upload.php'
		});
		
		this.fileuploadbutton = $("<div>",{
			"html": "<span class='btn btn-success fileinput-button'><i class='icon-plus icon-white'></i><span>Add Files</span><input type='file' name='files[]' multiple></span>"
		}).appendTo(this.fileupload);
		
		this.fileupload.appendTo(widget.toolbar);
		*/
		$.each(this.toolbarbuttons,function (i,e) { e.appendTo(widget.toolbar) });
		
		this.back.button({ disabled: true });
		
		var cache = {};
		if(this.options.search) {
			this.searchinput = $("<input>",{
				"name": "search",
				"class": "search",
				"placeholder": "Search...",
				"type": "text"
			}).on({
				keyup: function(event, ui){
					term = $(event.target).val();
					delay(function(){
//				        if ( term in cache ) {
//				          console.log( cache[ term ] );
//				        }
						if(term.length==0) {
							widget.directory = widget.options.directory;
							$('.column').remove();
							widget.getcontents();
							return false;
						}
						$.getJSON('dljson.php',{search: term,dir: widget.options.directory},function(data){
							if(data) {
								$('.column:first-child ul').empty();
								$('.column:not(.column:first-child)').remove();
								cache[ term ] = data;					  			
					  			listheader = $("<li>",{
					  				  "class":"list-header",
					  				  html: "<span>Name</span><span>Modified</span><span>Size</span><span>Kind</span>"
					  			}).prependTo($('.column:first-child ul'));
								$.each(data,function(key,file){
									path = file.split("/");
									$('<li>',{
		  	  						  "class":"file unclicked "+path[path.length-1].substr(path[path.length-1].lastIndexOf(".")+1),
		  							  "data-filename": path[path.length-1],
									  "data-path": path.join("/"),
									  "data-ext": path[path.length-1].substr(path[path.length-1].lastIndexOf(".")+1)
									}).append($("<span>",{
	  						  		 	"class":"file-name",							  
	  						  			text: path[path.length-1].trunc(25)
	  					  			})).append($("<span>",{
		  	  						  "class":"file-date",							  
		  	  						  text: ""
		  	  					  	})).append($("<span>",{
		  	  						  "class":"file-size",							  
		  	  						  text: ""
		  	  					  	})).append($("<span>",{
		  	  						  "class":"file-mime",							  
		  	  						  text: ""
		  	  					  	})).on({ 
										mouseup: function( event ) {
											if($(event.delegateTarget).hasClass('clicked')) return false;
									  		columnth = $(event.delegateTarget).closest('.column').index()+1;
									  		columncount = $('.view').find('.column').length;
											$(event.delegateTarget).closest('.column').find('.clicked').removeClass('clicked').addClass('unclicked');  	
											$('.column:not(.column:first-child)').remove();
											$(event.delegateTarget).removeClass('unclicked').addClass('clicked');
											widget.directory = $(event.delegateTarget).data("path");
											widget.getdetails();
										},
										dblclick: function(event) {
											ext = $(event.delegateTarget).data("ext");
											if(ext=='png' || ext=='jpg' || ext=='pdf') window.open(widget.directory,'_newtab');
											else window.location = widget.directory;
										}
									}).appendTo('.column:first-child ul');
									widget.setWidth();
								});
							}
						})
					}, 300 );
				}
			})
			/*
			.autocomplete({
				source: function(request, response) { 
					var term = request.term;
			        if ( term in cache ) {
			          response( cache[ term ] );
			          return;
			        }
					$.getJSON('dljson.php',{search: term,dir: widget.options.directory},function(data){
						cache[ term ] = data;
						response(data);
					})
				},
				select: function( event, ui ) {
	//				console.log(ui.item.value);
				}
			});
			*/
			widget.searchinput.appendTo(widget.toolbar);
		}
		
		this.viewoptions = $("<div>",{
			"class": "view-options"
		}).appendTo(this.toolbar)
		
		this.column = $("<input>", {
			"name": "view",
			"id": "column",
			"type": "radio"
		}).appendTo(this.viewoptions);
		
		this.column.after(
			$("<label>",{
				"for": "column",
				text: "Column"
			})
		);
		
		this.folder = $("<input>", {
			"name": "view",
			"id": "folder",
			"type": "radio"
		}).appendTo(this.viewoptions);
		
		
		this.folder.after(
			$("<label>",{
				"for": "folder",
				text: "Folder"
			})
		);
		
		this.list = $("<input>", {
			"name": "view",
			"id": "list",
			"type": "radio"
		}).appendTo(this.viewoptions);
		
		this.list.after(
			$("<label>",{
				"for": "list",
				text: "List"
			})
		);
		
		this[this.options.view].attr("checked","checked");
		
		this.viewoptions.buttonset().find('input').on({
			click: function( event ) {
				$('.view').attr('class','view view-'+event.target.id);
				widget.view = event.target.id;
				if(event.target.id=='folder') {
					$('.view .column, .document-view-inner').css('width','780px');
					if($('.column:last-child').find('div.file-contents').length>0) { 
						$('.column:last-child').hide();
						$('.column:last-child li.clicked').removeClass('clicked').addClass('unclicked');
					}
					if(widget.documentviewinnertype.find('.column').is(':data(uiResizable)')) widget.documentviewinnertype.find('.column').resizable( "destroy" );
					if(widget.documentviewinnertype.find('.column ul').is(':data(sortable)')) widget.documentviewinnertype.find('.column ul').sortable("disable");
				} else if(event.target.id=='list') { 
					$('.view .column, .document-view-inner').css('width','800px');
					if($('.column:last-child').find('div.file-contents').length>0) { 
						$('.column:last-child').hide();
						$('.column:last-child li.clicked').removeClass('clicked').addClass('unclicked');
					}
					if(widget.documentviewinnertype.find('.column').is(':data(uiResizable)')) widget.documentviewinnertype.find('.column').resizable( "destroy" );
					if(widget.documentviewinnertype.find('.column ul').is(':data(sortable)')) widget.documentviewinnertype.find('.column ul').sortable("disable");
				} else if(event.target.id=='column') { 
					$('.view .column').css('width','200px');
					if($('.column:last-child').find('div.file-contents').length>0) { 
						$('.column:last-child').show();
					}
					if(widget.documentviewinnertype.find('.column ul').is(':data(sortable)')) widget.documentviewinnertype.find('.column ul').sortable("enable");
				widget.documentviewinnertype.find('.column').resizable({
					containment: ".document-view-inner",
				    maxHeight: 385,
			      	minHeight: 385,
			      	minWidth: 200,
				  	resize: function() { widget.setWidth() }
			    });
//				widget.setWidth();
			}
			},
		});
		
		this.documentview = $("<div>",{
			"class": "document-view"
		}).appendTo( this.element );
		
		this.breadcrumb = $("<div>",{
			"class": "breadcrumb",
		}).appendTo( this.element );
		
		this.documentviewinner = $("<div>",{
			"class": "document-view-inner"
		}).appendTo( this.documentview );
		
		this.documentviewinnertype = $("<div>",{
			"class": "view view-"+this.options.view
		}).appendTo( this.documentviewinner );
		
	    // bind click events on the reset button to clear cache and reset element values
//	    this._on( this.viewoptions, {
//	      click: "view"
//	    });
		
	    //bind change, click and keyup events for elements that need to cache values
	    this._on( this.close, {
	      click: "close"
	    });
		
//		this._on( this.folder, {
//			click: "getcontents"
//		});
		
		this._on( this.file, {
			click: "getfile"
		});
        
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
		//if cached values exist set their elements value to the cached value
 	   	this.getcontents();
        // trigger a callback/event
        this._trigger( "getcontents" );
      },
	  
	  //clear library and return home folder
      clear: function() {

      },
 
      // a private method to cache the values of the elements in the widget element
	  _cache: function( event ) {
      
	  },
	  
	   //called when clearing the cache with the reset button created earlier or cacheSearch('clear') is used
      close: function( event ) {
		  this.element;
      },
	  
	  setWidth: function( event ) {
		width = 0;				
		widget.documentviewinnertype.find('.column').each(function( column ){ return width+=$(this).outerWidth()+2; });
		widget.documentviewinner.css({width: width+'px' });
	  },
	  
	  //set the cached values. private method and can only be set via element changes
	  getcontents: function( event ) {
//		  console.log(widget.directory.split('/').length);
		  parentdir = this.directory;
		  $.getJSON('dljson.php',{dir: parentdir},function(data) {
			  directory = [];
			  
				widget.newview = $("<div>",{
					"class": "column"
				}).appendTo( widget.documentviewinnertype );
				
				$('.view.view-column .column').resizable({
					containment: ".document-view-inner",
				    maxHeight: 385,
			      	minHeight: 385,
			      	minWidth: 200,
				  	resize: function() { widget.setWidth() }
			    });
				
				$('.view.view-column .column').css('width','200px');
				
				widget.homeviewul = $("<ul>",{
					"class": "folder-contents"
				}).data('dir',parentdir).on({
					click: function(event, ui) {
						if($(event.toElement).hasClass('folder-contents')) { 
							$(event.toElement).closest('div').nextAll('div.column').remove()
							$(event.currentTarget).children('li.clicked').removeClass('clicked').addClass('unlicked');
							if($('.column').length==1) widget.back.button({ disabled: true });
						}
						
					}
				}).appendTo( widget.newview );
				
				if(widget.options.moveable==true && widget.view=='column') {
					widget.homeviewul.sortable({
						placeholder: "ui-state-highlight",
						connectWith: ".column ul",
						stop: function( event, ui) {
							olddir = $(event.target).data('dir');
							newdir = $(ui.item[0].parentElement).data('dir')
							filname = $(ui.item).text();
							$.getJSON('dljson.php',{file:filname,from:olddir,to:newdir},function(data){
//								$(ui.item).removeClass('clicked')
							});								
						},
						change: function( event, ui) {
							$(ui.item).removeClass('clicked');
//							event.preventDefault();
						},
					}).droppable().disableSelection();
				} else {
//					widget.homeviewul.sortable("destroy");
				}
				
			  listheader = $("<li>",{
				  "class":"list-header",
				  html: "<span>Name</span><span>Modified</span><span>Size</span><span>Kind</span>"
			  })
			  
			  listheader.appendTo(widget.homeviewul);
				
			  if(data) {
  				  $.each(data,function(key,val) {
					  if(val.ext.length > 0) {
	  					  file = $("<li>",{
	  						  "class":"file unclicked "+val.ext,
							  "data-filename": val.name,
							  "data-ext": val.ext
	  					  }).on({ 
	  						  mouseup: function( event ) {
							  	columnth = $(event.delegateTarget).closest('.column').index()+1;
							  	columncount = $('.view').find('.column').length;
									if(columnth <= columncount) {
										$(event.delegateTarget).closest('.column').find('.clicked').removeClass('clicked').addClass('unclicked');
										widget.directory = widget.directory.split('/').splice(0,columnth).join("/")+'/';
										$('.column:gt('+(columnth-1)+')').remove();
									}
	  							  	if($(event.delegateTarget).hasClass('clicked')) return false;
	  								$(event.delegateTarget).removeClass('unclicked').addClass('clicked');
									widget.directory += $(event.delegateTarget).data("filename");
	  						    	widget.getdetails();
							},
							dblclick: function(event) {
								ext = $(event.delegateTarget).data("ext");
								if(ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='pdf' || ext=='mov'  || ext=='mp4') window.open(widget.directory,'_newtab');
								else window.location = widget.directory;
							}
	  					  });
	  					  file.append($("<span>",{
	  						  "class":"file-name",							  
	  						  text: val.name.trunc(25)
	  					  }));
	  					  file.append($("<span>",{
	  						  "class":"file-date",							  
	  						  text: val.mod
	  					  }));
	  					  file.append($("<span>",{
	  						  "class":"file-size",							  
	  						  text: (val.size/1000)+" KB"
	  					  }));
	  					  file.append($("<span>",{
	  						  "class":"file-mime",							  
	  						  text: val.ext
	  					  }));
				
	  					  file.appendTo(widget.homeviewul);
					  } else {	
						  folder = $("<li>",{
							  "class":"folder unclicked",
							  "data-filename": val.name,
						  }).on({
							  mouseup: function( event ) {
								  	widget.back.button({ disabled: false });
								  	columnth = $(event.delegateTarget).closest('.column').index()+1;
								  	columncount = $('.view').find('.column').length;
									if(columnth <= columncount) {
										$(event.delegateTarget).closest('.column').find('.clicked').removeClass('clicked').addClass('unclicked');
										widget.directory = widget.directory.split('/').splice(0,columnth).join("/")+'/';
										$('.column:gt('+(columnth-1)+')').remove();
									}
								  	if($(event.delegateTarget).hasClass('clicked')) return false;
									$(event.delegateTarget).removeClass('unclicked').addClass('clicked');
								  	if(widget.view=='folder' || widget.view=='list') { 
										return false;
								  	}
									widget.directory += $(event.delegateTarget).data("filename")+'/';
							    	widget.getcontents();
							   },
							   dblclick: function(event) {
									widget.directory += $(event.delegateTarget).data("filename")+'/';
						    		widget.getcontents();
							   }
						  });
						  folder.append($("<span>",{
							  "class":"folder-name",
							  text: val.name.trunc(25)
						  }));
	  					  folder.append($("<span>",{
	  						  "class":"file-date",							  
	  						  text: val.mod
	  					  }));
	  					  folder.append($("<span>",{
	  						  "class":"file-size",							  
	  						  text: "--"
	  					  }));
	  					  folder.append($("<span>",{
	  						  "class":"file-mime",							  
	  						  text: "Folder"
	  					  }));
						  
				
						  folder.appendTo(widget.homeviewul);
						  $('.document-view-inner').animate({
						           scrollLeft: widget.homeviewul.offset().left
						  }, 2000);
					  }
				  });
/*				  widget.homeviewul.find('li').draggable({
				        appendTo: "body",
				        helper: "clone"
				  });
*/				  
//				  widget.newview.jScrollPane();
//				  if(widget.view=='column') widget.newview.width('200px');
				  if(widget.view=='column') widget.setWidth();
		  	}
		  });
	  },
	  
	  //get details of file
	  getdetails: function( event ) {
		widget.newview = $("<div>",{
			"class": "column"
		}).appendTo( widget.documentviewinnertype );
		
		if(widget.view=='folder' || widget.view=='list') widget.newview.hide();
		
		widget.homeview = $("<div>",{
			"class": "file-contents"
		}).appendTo( widget.newview );
		
		$.getJSON('dljson.php',{dir:widget.directory},function(data) {
			$.each(data,function(key,file){
				ext = file.ext;
				size = file.size;
				mod = file.mod;
				name = file.name;
			});

			if(ext=='pdf' || ext=='png' || ext=='jpg') var view = $("<div>",{
				"class": "btn btn-sucess file-view",
				html: '<a target="blank_" href="'+widget.directory+'">View</a>'
			});
			else var view = $("<div>");
		
			filedetails = [
		
			$("<div>",{
				"class": "file-preview "+ext,
//				"style": "background-image:url('css/images/icons/"+ext+"/"+ext+"-64_32.png')"
			}),
			$("<div>",{
				"class": "file-name",
				html: 'Name: <span>'+name+'</span>'
			}),
			$("<div>",{
				"class": "file-mime",
				html: 'Extension: <span>'+ext+'</span>'
			}),
			$("<div>",{
				"class": "file-size",
				html: 'Size: <span>'+(size/1000)+' Kbs</span>'
			}),
			$("<div>",{
				"class": "file-date",
				html: 'Date Modified: <span>'+mod+'</span>'
			}),
			view
			,
			$("<div>",{
				"class": "btn btn-primary file-download",
				html: '<a target="blank_" href="'+widget.directory+'">Download</a>'
			})
		
			];
			
			$.each(filedetails,function(i,e) { e.appendTo(widget.homeview) });
			if(widget.view=='column') widget.setWidth();
		});
	  },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements and methods
        this.clear.remove();
        this.getcache.remove();
 
        this.element
          .removeClass( "document-library" )
		  .empty();
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        // prevent invalid storage values
        if ( /serach|title|view/.test(key)) {
          return;
        }
        this._super( key, value );
      }
    });
});
