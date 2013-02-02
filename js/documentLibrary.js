/***************************************
Documnet Library jQuery Widget
created by David Michael Harrison
http://www.twitter.com/watchinharrison
***************************************/

$(function() {
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
					$('.column').slice(-2).remove();
					if(widget.directory.split('/').splice(-1,1)[0].length == 0) number = -2;
					else number = -1;
					widget.directory = widget.directory.split('/').slice(0,number).join("/")+"/";
					widget.getcontents();
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
				}
			})
		];
		
		$.each(this.toolbarbuttons,function (i,e) { e.appendTo(widget.toolbar) });
		
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
		
		this[this.options.view].attr("checked","checked");
		
		this.viewoptions.buttonset().find('input').on({
			click: function( event ) {
				$('.view').attr('class','view view-'+event.target.id);
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
	  
	  //change view
	  view: function( event ) {
//		  console.log(event.target.id);
//		  this.view = $(event.target.id);
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
	  
	  //set the cached values. private method and can only be set via element changes
	  getcontents: function( event ) {
//		  console.log(widget.directory.split('/').length);
		  if(widget.directory.split('/').length==2) widget.back.button({ disabled: true });
		  else widget.back.button({ disabled: false });
		  $.getJSON('dljson.php',{dir: this.directory},function(data) {
			  directory = [];
			  
				widget.newview = $("<div>",{
					"class": "column"
				}).appendTo( widget.documentviewinnertype );
		
				widget.homeviewul = $("<ul>",{
					"class": "folder-contents"
				}).appendTo( widget.newview );
			  if(data) {
  				  $.each(data,function(key,val) {
					  if(val.ext.length > 0) {
	  					  file = $("<li>",{
	  						  "class":"file unclicked "+val.ext
	  					  }).on({ 
	  						  click: function( event ) {
								  	columnth = $(event.delegateTarget).closest('.column').index()+1;
								  	columncount = $('.view-column').find('.column').length;
									if(columnth <= columncount) {
										$(event.delegateTarget).closest('.column').find('.clicked').removeClass('clicked').addClass('unclicked');
										widget.directory = widget.directory.split('/').splice(0,columnth).join("/")+'/';
										$('.column:gt('+(columnth-1)+')').remove();
									}
	  							  	if($(event.delegateTarget).hasClass('clicked')) return false;
	  								$(event.delegateTarget).removeClass('unclicked').addClass('clicked');
									widget.directory += $(event.delegateTarget).text();
	  						    	widget.getdetails();
	  						   }
	  					  });
	  					  file.append($("<span>",{
	  						  "class":"file-name",
	  						  text: val.name
	  					  }));
	  					  file.append($("<span>",{
	  						  "class":"folder-arrow",
	  					  }));
				
	  					  file.appendTo(widget.homeviewul);
					  } else {	
						  folder = $("<li>",{
							  "class":"folder unclicked"
						  }).on({ 
							  click: function( event ) {
								  	columnth = $(event.delegateTarget).closest('.column').index()+1;
								  	columncount = $('.view-column').find('.column').length;
									if(columnth <= columncount) {
										$(event.delegateTarget).closest('.column').find('.clicked').removeClass('clicked').addClass('unclicked');
										widget.directory = widget.directory.split('/').splice(0,columnth).join("/")+'/';
										$('.column:gt('+(columnth-1)+')').remove();
									}
								  	if($(event.delegateTarget).hasClass('clicked')) return false;
									$(event.delegateTarget).removeClass('unclicked').addClass('clicked');
									widget.directory += $(event.delegateTarget).text()+'/';
							    	widget.getcontents();
							   }
						  });
						  folder.append($("<span>",{
							  "class":"folder-name",
							  text: val.name
						  }));
						  folder.append($("<span>",{
							  "class":"folder-arrow",
						  }));
				
						  folder.appendTo(widget.homeviewul);
					  }
				  });
		  	}
		  });
	  },
	  
	  //get details of file
	  getdetails: function( event ) {
		widget.newview = $("<div>",{
			"class": "column"
		}).appendTo( widget.documentviewinnertype );
		
		widget.homeview = $("<div>",{
			"class": "file-contents"
		}).appendTo( widget.newview );
		
		$.getJSON('dljson.php',{dir:widget.directory},function(data) {
			ext = data[0].ext;
			size = data[0].size;
			mod = data[0].mod;
			name = data[0].name;
		
			filedetails = [
		
			$("<div>",{
				"class": "file-preview "+ext
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
				html: 'Size: <span>'+size+' bytes</span>'
			}),
			$("<div>",{
				"class": "file-date",
				html: 'Date Modified: <span>'+mod+'</span>'
			}),
			$("<div>",{
				"class": "file-download",
				html: '<a target="blank_" href="'+widget.directory+'">Download</a>'
			}),
			$("<div>",{
				"class": "file-view",
				html: '<a target="blank_" href="'+widget.directory+'">View</a>'
			})
		
			];
		
			$.each(filedetails,function(i,e) { e.appendTo(widget.homeview) });
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