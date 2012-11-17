$(document).ready(function(){

   //global variables
   
   var RTapiKey = 'n2vkjw599famnjxu5yj7mq3m', // Rotten Tomatoes API key
   	   baseURL = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=', // for Rotten Tomatoes movie search query
   	   keyboardInput = $('#movie_title_search'),
   	   displaySearch = $('#display_search'),
   	   searchButton = $('#search_button'),
   	   imageID = '',
   	   imageURL = '',
   	   displayURL = '',
   	   RTwebsiteURL = '',
   	   movieAllContent = '',
   	   movieTitle = '',
   	   tomatoMeter = '',
   	   audienceScore = '',
   	   movieYear = '',
   	   movieRuntime = '',
   	   movieRating = '';
   
   // news ticker plugin	   
   $('#newsticker_1').newsticker({
	   'style': 'reveal', // Use reveal animation
	   'showControls': true, // Display pause, previous and next buttons
	   'tickerTitle': 'Latest news', // News ticker title text
	   'autoStart': true, // Start animation automatically
	   'twitter': 'YahooMovies', // News items will be pulled from https://twitter.com/YahooMovies
	   'feedItems': 50, // 50 news items will be displayed
	   'twitterFormat': '%excerpt% | %timeago%', // Format that each news item will take
	   'timeAgoFormat': function(date){
		   return $.fn.newsticker.methods.getTimeAgo(date);
	    }, // Implements $.fn.newsticker.methods.getTimeAgo()
		'dateFormat': function(date){
			return $.fn.newsticker.methods.getFormattedDate(date);
		}, // Implements $.fn.newsticker.methods.getFormattedDate()
		'letterRevealSpeed': 70, // Each new letter is revealed after 70 milliseconds
		'transitionSpeed': '2000', // News item will display for 2 seconds before fading into next item
		'pauseOnHover': false, // Animation will be not be paused when hovering over the news ticker.
		'openLinksInNewWindow': true, // Will open links in a new window
		'excerptLength': 130 //size of excerpt of news item
	});
   // end newsticker
   	
   //clear
   keyboardInput.focus(function(){
			displaySearch.empty(); //clear results
			keyboardInput.val(''); //clear keyword
	}); //end clear
	
 	
 	//Make the return key trigger the search
 	$(document).keypress(function(event){
    	if (event.which == 13){
        	searchButton.click();
        	}
    }); //end return 
    
 	//search and display
	searchButton.click(function(){
		
		query = keyboardInput.val(); //retrieve the keyword typed
		
		
		if(query !== ''){ // if for valid input

            displaySearch.html('<h2 class="searching_text">Searching ...</h2>');
		
            //JSON Rotten Tomatoes Query
		
            searchRequest = baseURL + RTapiKey + '&q=' + encodeURI(query);
		
            //console.log(searchRequest); //check search request syntax
		
			// callback for when we get back the results
			function searchCallback(data) {
				displaySearch.html('<h2 class="searching_text">Found ' + data.total + ' results for "' + query + '"</h2>');
			
				var movies = data.movies; //data from Rotten Tomatoes
				
				var popUpContent = { //data to store for tootip plugin
				}
				
				//console.log(movies); //checking the API request works
				
				$.each(movies, function(index, movie) {
				
					imageID = 'imageID' + (index + 1); // to identify each particular tooltip
					
					//console.log(imageID);
					
					movieTitle = '<span class="tipDivLabel">Title:</span> ' + movie.title;
					
					movieYear = movie.year;
					
					audienceScore = '<span class="tipDivLabel">Audience Score:</span> ' + movie.ratings.audience_score + ' Percent';
					
					tomatoMeter = movie.ratings.critics_score; // score from critics
					
					movieRuntime = movie.runtime;
					
					movieRating = '<span class="tipDivLabel">Rating:</span> ' + movie.mpaa_rating;
					
					
					// Conditionals if blank data is retrieved
					
					if (movieYear != '') {// if No Movie Year is available
						
						movieYear = '<span class="tipDivLabel">Year Released:</span> ' + movie.year;
					}
					else {
						movieYear = '<span class="tipDivLabel">Year Released:</span> N/A';
					} // end no Movie Year is available
					
					if (tomatoMeter != -1) {// if No Critics Score is available
						
						tomatoMeter = '<span class="tipDivLabel">Critics Score:</span> ' + movie.ratings.critics_score + ' Percent';
					}
					else {
						tomatoMeter = '<span class="tipDivLabel">Critics Score:</span> N/A';
					} // end no Critics Score is available
					
					
					if (movieRuntime != '') { // if no Runtime is available
					
						movieRuntime = '<span class="tipDivLabel">Runtime:</span> ' + movie.runtime + ' minutes';
					}
					else {
						movieRuntime = '<span class="tipDivLabel">Runtime:</span> N/A';
					} // end No Runtime is available
					
					
					// build the tooltip data
					movieAllContent = movieTitle + '<br><br>' + movieYear + '<br><br>' + audienceScore + '<br><br>' + tomatoMeter + '<br><br>' + movieRuntime + '<br><br>' + movieRating; 

					popUpContent[imageID] = movieAllContent;

					//console.log(popUpContent);
					
					imageURL = '<img id="image_container" src="' + movie.posters.original + '">';
					
					//console.log(imageURL); //checking the URL construction works
					
					RTwebsiteURL = movie.links.alternate;
					
					displayURL = '<a class="showTip ' + imageID + '" href="' + RTwebsiteURL + '" target="_blank">' + imageURL + '</a>'; // image display
					
					//console.log(displayURL); //checking the URL construction works
					
					$(displayURL).appendTo(displaySearch);
					
				}); // end each loop
				
				var content_vars = popUpContent; //save the tooltip data from the loop
				
				// Tooltip plugin
				
				dw_Tooltip.defaultProps = {
					hoverable: true, // tooltip lingers so user can hover to click links
					klass: 'tooltip', // class to be used for tooltips
					wrapFn: dw_Tooltip.wrapToWidth // formatting function for tooltip content
				}
		 
				dw_Tooltip.content_vars = content_vars;
		 
				// end tooltip 
				
			 }; // end searchCallback
			 
			 // send off the query
             $.ajax({
				url: searchRequest,
				dataType: "jsonp",
				success: searchCallback
			 });
			 
         } // end if valid query
         
         
         else { //for invalid input
         
         	displaySearch.html('<h2 class="searching_text">Please enter a movie title.</h2>');

		 } // end else
		 
	}); //end search and display
	
}); //end document ready