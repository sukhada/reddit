var count =0;
var result1 = [];
var c = 0;
var array = ["funny"];
var weights = [100];
var lastItem;
var redditBaseURL= "http://www.reddit.com/.json?limit=" + 100+"&after=" + lastItem +"&jsonp=?";
var redditFrontPageURL= "http://www.reddit.com/.json?limit=100&jsonp=?";


$("#subreddit").keyup(function(event){
    if(event.keyCode == 13){
    	addNewSubreddit();
    }
});

setTimeout(function() {localStorage.clear();}, 1800000);

function addNewSubreddit() {
	var temp = $("#subreddit").val();
	array.push(temp);
	$("#listofsubreddits").append("<li>" + temp+"</li>");
	$("#listofsubreddits").append('<input type="text" class="new"></input>')
	$("#subreddit").val("");	

    localStorage.setItem('subreddits', array);	
    localStorage.removeItem('posts');
}

function loadModal() {
	if (localStorage.getItem('subreddits')) {
		array = (localStorage.getItem('subreddits')).split(",");
		weights = (localStorage.getItem('weights')).split(",");		
	}
	else {	
		array = [];
	}	
	for (var i = 0; i < array.length; i++) {
		var temp = array[i];
		var weight = weights[i];
		$("#listofsubreddits").append("<li>" + temp+"</li>");
		$("#listofsubreddits").append('<span>' + weight+"</span>");
		$("#subreddit").val("");
	}
    if (weights.length == 0) {
    	for (var i = 0; i < array.length; i++) {		
    		weights[i] = 100/array.length;
    	}
    }	
    localStorage.setItem('subreddits', array);
    localStorage.setItem('weights', weights);
}

function loadSubreddit() {
	if (localStorage.getItem('subreddits')) {
		array = (localStorage.getItem('subreddits')).split(",");
		if (localStorage.getItem('weights')){
			weights = (localStorage.getItem('weights')).split(",");							
		}
	}	
	else {
		array = [];
	}	
	for (var j = 0; j < array.length; j++) {
		var temp = array[j];
		var weight = weights[j]		
		$("#listofsubreddits").append("<li>" + temp+"</li>");
		$("#listofsubreddits").append('<span>' + weight+"</span>");		
		$("#subreddit").val("");	
		var redditBaseURL = "http://www.reddit.com/r/";
		var redditEndURL = "/.json?limit=100&after=" + lastItem + "&jsonp=?";	
	    $.getJSON(redditBaseURL + temp + redditEndURL, (function(i_copy) {
    	    return function(data) {
        	    addNewPosts(data, i_copy);
        	};
    	})(j));

	}
	var lastProcessedIndex = 0;
    localStorage.setItem('subreddits', array);
	setTimeout(loadPosts,3000);
}

function addNewPosts(e,j) {
	result1[j] = e;
}

function getNewPage(e) {
	result1.push(e);		
}

function loadPosts() {
	console.log(count);
	if (count > 99) {
		console.log('more than 100');
		lastItem=result.data.children[99].data.name;
		console.log(result.data.children[99].data.title);
		console.log(lastItem);
		$.getJSON(redditBaseURL, loadSubreddit);			
		count = 0;
		return;
	}	
	for (var ind = 0; ind < result1.length; ind++) {
		result = result1[ind];
		var len = result.data.children.length;
		var length = 20 * (weights[ind]/100);
	    localStorage.setItem('lastItem', result.data.after);	
		for (var i = 0; i < length && i < result.data.children.length; i++){
			i = count+i
			var img = result.data.children[i].data.title;
			$("#posts").append("<li><span class='upvotes'>" +result.data.children[i].data.ups+  "</span><a href='" + 
			result.data.children[i].data.url +"'><span class='title'>" + img + "</span></a><span class='author'>Submitted by <span class='color'>" 
			+ result.data.children[i].data.author+ "</span></span> to <span class='subreddit'>" + result.data.children[i].data.subreddit+ "</span></li>");
			i = i - count;
		}		
	}
	count+=20;		
	var height = $("li").each(function() {
		var height = $(this).height();
		$(this).children("span.upvotes").css("line-height", height+'px');
	});	


	localStorage.removeItem('posts');
	localStorage.removeItem('lastItem');	
    localStorage.setItem('posts', $("#posts").html());	 
}

function loadRedditPosts() {
	redditBaseURL = "http://www.reddit.com/.json?limit=" + 100+"&jsonp=?";
	if (array.length > 0) {
		redditBaseURL = "http://www.reddit.com/r/" + array[0] + ".json?limit=" + 100+"&jsonp=?"
	}
	$.getJSON(redditBaseURL, getNewPage);
	
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
  		lastItem = localStorage.getItem('lastItem');		
    	$("#posts").html(localStorage.getItem('posts'));
		loadModal();			
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

$("#submit").click(function() {
	$(".new").each(function (eachone) {		
		var tem = $(".new:eq("+eachone+")").val();
		weights.push(tem);
	});
	$("#listofsubreddits").empty();
    localStorage.setItem('weights', weights);	
    window.location.reload();
});

$("#clear").click(function() {
	localStorage.clear();
	window.location.reload();
});

$(document).on("mouseenter", "a", function() {
	var link = $(this).attr('href');
	if ($(this).attr('href').indexOf("i.imgur") != -1) {
		$("#img").css("top", $(this).position().top);
		$("#img").css("left", "500px");		
		$("#img").append("<img class='image' src='"+ link +"'></img>")
	}
});

$(document).on("mouseleave", "a", function() {
	$("#img").empty();
});

