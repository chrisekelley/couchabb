require([
  "namespace",

  // Libs
  "jquery",
  "use!backbone",
  "use!backbone_couchdb",

  // Modules
  //"modules/example",
  "modules/todo"
],

function(namespace, $, Backbone, Example, Todo) {

  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      ":hash": "index"
      //":tutorial": "tutorial"
      //"/": "index",
      //"couchabb/_design/couchabb/index.html": "index"
    },

    index: function(hash) {
    	var route = this;
    	//** Configure the database **//
    	Backbone.couch_connector.config.db_name = "couchabb";
    	Backbone.couch_connector.config.ddoc_name = "couchabb";
    	//Backbone.couch_connector.config.base_url = "http://localhost:5984";
    	// Fetch the template, render it to the View element and call done.
    	namespace.fetchTemplate("app/templates/todomvc.html", function(tmpl) {
    		var htmlText = tmpl();
    		//this.$("#main").innerHTML = htmlText;
    		this.$("#main").html(htmlText);
    		console.log("rendered index template. ");
    		/*var todosDone = Todo.TodoCollection.done().length;
        	var remaining = Todo.TodoCollection.remaining().length;
        	namespace.fetchTemplate("app/templates/stats.html", function(tmpl2) {
        		var statsjson = {
        	        total:      Todo.TodoCollection.length,
        	        done:       todosDone,
        	        remaining:  remaining
        	      };
        		var htmltext = tmpl2(statsjson);
        		console.log(JSON.stringify(htmltext));
        		//view.statsEl = view.$('#todo-stats');
        		$('#todo-stats').html(htmltext);
        	});*/
    		
        	var todoView = new Todo.Views.Todomvc();
        	todoView.render(
        			function(el){
        				//$("#main").html(el);
        				//Todo.TodoCollection.fetch();
        				// Fix for hashes in pushState and hash fragment
        				if (hash && !route._alreadyTriggered) {
        					// Reset to home, pushState support automatically converts hashes
        					Backbone.history.navigate("", false);
        					// Trigger the default browser behavior
        					location.hash = hash;
        					// Set an internal flag to stop recursive looping
        					route._alreadyTriggered = true;
        				}
        			});

    		
    	});
    	


    },
    /*tutorial: function(hash) {
    	*//** Configure the database **//*
    	Backbone.couch_connector.config.db_name = "couchabb";
    	Backbone.couch_connector.config.ddoc_name = "couchabb";
    	//Backbone.couch_connector.config.base_url = "http://localhost:5984";
    	var route = this;
    	var tutorial = new Example.Views.Tutorial();
    	var startkey, startkey_docid;
    	var limit = 16;
    	//var searchResults = new ItemsList();
    	var searchResults = new Example.Collection();
    	searchResults.db["keys"] = null;
    	//var viewQuery = "byItemSorted?descending=true&limit=" + limit + "&startkey=" + startkey + "&startkey_docid=" + startkey_docid;
    	var viewQuery = "byItemSorted?descending=true&limit=" + limit + "&startkey=" + "[" + startkey + "]" + "&startkey_docid=" + startkey_docid;
    	//var viewQuery = "byItemSorted?descending=true&limit=" + limit + "&startkey=" + "[" + startkey + "]";
    	if (startkey == null || startkey == "" || startkey == "home") {
    		viewQuery = "byItemSorted?descending=true&limit=" + limit;
    	}
    	console.log("viewQuery: " + viewQuery);
    	searchResults.db["view"] = [viewQuery];
    	searchResults.fetch({
    		//dataType : "jsonp",
    		success : function(){
    			console.log("item count: " + searchResults.length);
    			var listLength = searchResults.length;
    			//var querySize = 15
    			if (listLength < limit) {
    				limit = listLength;
    				startkey = null;
    			} else {
    				var next_start_record = searchResults.at(limit-1);
    				if (next_start_record) {
    					startkey_docid = next_start_record.id;
    					console.log("next_start_record: " + JSON.stringify(next_start_record));
    					console.log("startkey_docid: " + startkey_docid);
    					startkey = next_start_record.get("lastModified");
    					FORMY.Items = searchResults.remove(next_start_record);
    				}
    			}
    			if (startkey == "" || startkey == null) {	//home (/)
    				//FORMY.Items = searchResults;
    				startkey = 16;
    				//console.log("searchResults: " + JSON.stringify(searchResults));
    			}
    			var page = new Page({content: "Default List of Items:", startkey_docid:startkey_docid, startkey:startkey});
				(new HomeView(
						{model: page, el: $("#homePageView"), startkey_docid:startkey_docid, startkey:startkey})).render();
				//console.log("starting stripeme.");
				$(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
				$(".stripeMe tr:even").addClass("alt");
				$("#noStripeMe").removeClass("alt");
				$("#noStripeMe").addClass("noStripeMeHeader");
    		},
    		error : function(){
    			console.log("Error loading PatientRecordList: " + JSON.stringify(arguments)); 
    		}
    	});
    	
    	// Attach the tutorial to the DOM
    	tutorial.render(function(el) {
    		$("#main").html(el);
    		
    		// Fix for hashes in pushState and hash fragment
    		if (hash && !route._alreadyTriggered) {
    			// Reset to home, pushState support automatically converts hashes
    			Backbone.history.navigate("", false);
    			
    			// Trigger the default browser behavior
    			location.hash = hash;
    			
    			// Set an internal flag to stop recursive looping
    			route._alreadyTriggered = true;
    		}
    	});
    }*/
  });

  // Shorthand the application namespace
  var app = namespace.app;

  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  $(function() {
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true, root: "/couchabb/_design/couchabb/index.html" });
  });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router.  If the link has a data-bypass
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol &&
        href.indexOf("javascript:") !== 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events.  The Router's internal `navigate` method
      // calls this anyways.
      Backbone.history.navigate(href, true);
    }
  });

});
