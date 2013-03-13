var count =0;
var result;
var array = [];
var lastItem;
var redditBaseURL= "http://www.reddit.com/.json?limit=" + 100+"&after=" + lastItem +"&jsonp=?";

$("#subreddit").keyup(function(event){
    if(event.keyCode == 13){
    	addNewSubreddit();
    }
});


function addNewSubreddit() {
	var temp = $("#subreddit").val();
	array.push(temp);
	$("#listofsubreddits").append(temp+"<br>");
	$("#subreddit").val("");	
	var redditBaseURL = "http://www.reddit.com/r/";
	var redditEndURL = "/new.json?sort=new&jsonp=?";
	//$.getJSON(redditBaseURL + temp + redditEndURL, addNewPosts);
    localStorage.setItem('subreddits', array);		
    localStorage.removeItem('posts');
}

function loadSubreddit() {
	if (localStorage.getItem('subreddits')) {
		array = (localStorage.getItem('subreddits')).split(",");
		console.log(array);
	}
	else {
		array = [];
	}	
	for (var i = 0; i < array.length; i++) {
		var temp = array[i];
		$("#listofsubreddits").append(temp+"<br>");
		$("#subreddit").val("");
	}
}

function addNewPosts(e) {
	result = e;
	loadPosts();
}

function getNewPage(e) {
	console.log('here');
	result = e;	
}

function loadPosts() {
	for (var i = 0; i < 20; i++){
		i = count+i;
		var img = result.data.children[i].data.title;
		$("#posts").append("<li><span class='upvotes'>" +result.data.children[i].data.ups+  "</span><a href='" + 
		result.data.children[i].data.url +"'><span class='title'>" + img + "</span></a><span class='author'>Submitted by <span class='color'>" 
		+ result.data.children[i].data.author+ "</span></span> to <span class='subreddit'>" + result.data.children[i].data.subreddit+ "</span></li>");
		i = i - count;
	}
	count+=20;		
	var height = $("li").each(function() {
		var height = $(this).height();
		$(this).children("span.upvotes").css("line-height", height+'px');
	});	

	if (count > 99) {
		redditBaseURL = "http://www.reddit.com/.json?limit=" + 100+"&after=" + result.data.children[99].data.name+"&jsonp=?";
		console.log(redditBaseURL);
		$.getJSON(redditBaseURL, getNewPage);			
		count = 0;
	}
	localStorage.clear();
    localStorage.setItem('lastItem', result.data.children[99].data.name);		
    localStorage.setItem('posts', $("#posts").html());	 
}

function loadRedditPosts() {
	redditBaseURL = "http://www.reddit.com/.json?limit=" + 100+"&jsonp=?";
	if (array.length > 0) {
		console.log('here');
		redditBaseURL = "http://www.reddit.com/r/" + array[0] + ".json?limit=" + 100+"&jsonp=?"
	}
	$.getJSON(redditBaseURL, addNewPosts);
}

function adjustHeights(elem) {
    var fontstep = 1;
    $(elem).each(function(title) {  	
	    if ($(".title:eq("+ title+")").height()>$(".title:eq("+ title+")").parent().height() || $(".title:eq("+ title+")").width()>$(".title:eq("+ title+")").parent().width()) {
	        $(".title:eq("+ title+")").css('font-size',(($(".title:eq("+ title+")").css('font-size').substr(0,2)-fontstep)) + 'px').css('line-height',(($(".title:eq("+ title+")").css('font-size').substr(0,2))) + 'px');
	        adjustHeights(".title:eq("+ title+")");
	    }      	
    });
}


$(window).on('resize', function () {
	var height = $("li").each(function() {
		var height = $(this).height();
		$(this).children("span.upvotes").css("line-height", height+'px');
	});	

	$(".title").each(function() {
		if (($(this).height() != 20) && $(this).parent().siblings("span.upvotes").css("line-height") =='75px') {	
			$(this).parent().siblings("span.upvotes").css("line-height", '95px');
		}		
	});
	$(".title").each(function(title) {
		adjustHeights(".title");
	});
});

window.onload = function() {
  	if (localStorage.getItem('posts')) {
  		console.log(localStorage.getItem('posts'));
  		lastItem = localStorage.getItem('lastItem');		
    	$("#posts").html(localStorage.getItem('posts'));
		$.getJSON(redditBaseURL, getNewPage);    
		loadSubreddit();			
  	} 
  	else {
  		loadRedditPosts();
		loadSubreddit();			  		
  	}
} 

$("#open").click(function() {
	$(".modal").toggleClass("hide");
});

$(".close").click(function() {
	$(".modal").addClass("hide");	
})