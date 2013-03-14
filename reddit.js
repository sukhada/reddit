var count;
var counts = [];
var result1 = [];
var c = 0;
var array = [];
var weights = [];
var lastItems = [];
var lastItem;
var redditBaseURL= "http://www.reddit.com/.json?limit=" + 100+"&after=" + lastItems[0] +"&jsonp=?";
var redditFrontPageURL= "http://www.reddit.com/.json?limit=100&jsonp=?";

$("#subreddit").keyup(function(event){
    if(event.keyCode == 13){
    	addNewSubreddit();
    }
});

setTimeout(function() {localStorage.clear();}, 1800000);

function addNewSubreddit() {	
	console.log('added new subreddit');
	var temp = $("#subreddit").val();
	array.push(temp);
	counts.push(0);
	$("#listofsubreddits").append("<li>" + temp+"</li>");
	$("#listofsubreddits").append('<input type="text" class="new"></input>')
	$("#subreddit").val("");	

    localStorage.setItem('subreddits', array);	
    localStorage.setItem('counts', counts);  
    localStorage.removeItem('posts');
}

function loadModal() {
	$("#listofsubreddits").empty();	
	if (localStorage.getItem('subreddits')) {
		array = (localStorage.getItem('subreddits')).split(",");
		if (localStorage.getItem('weights').length > 1) {
			weights = (localStorage.getItem('weights')).split(",");					
		}
		else {
			if (localStorage.getItem('weights')) {
				console.log(weights);
			}
		}
		var temp2 = (localStorage.getItem('counts')).split(",");
		for (var i = 0; i < temp2.length; i++) {
			counts[i] = parseInt(temp2[i]);
		}		
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
}

function loadSubreddit() {
	$("#listofsubreddits").empty();
	if (localStorage.getItem('subreddits')) {
		array = (localStorage.getItem('subreddits')).split(",");
		if (localStorage.getItem('weights')){
			weights = (localStorage.getItem('weights')).split(",");							
		}
		var temp = (localStorage.getItem('counts')).split(",");
		for (var i = 0; i < temp.length; i++) {
			counts[i] = parseInt(temp[i]);
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
		var redditEndURL = "/.json?limit=100&after=" + lastItems[j] + "&jsonp=?";	
	    $.getJSON(redditBaseURL + temp + redditEndURL, (function(i_copy) {
    	    return function(data) {
        	    addNewPosts(data, i_copy);
        	};
    	}) (j));
	}
	//setTimeout(loadPosts, 1000);	
}

function addNewPosts(e,j) {
	result1[j] = e;
	loadPosts();
}

function getNewPage(e) {
	result1.push(e);		
}

function loadPosts() {
	console.log(counts);
	if (result1.length > 0) {
		localStorage.removeItem('result1');
		localStorage.setItem('result1', JSON.stringify(result1));				
	}
	if (localStorage.getItem('lastItems')) {
		lastItems = localStorage.getItem('lastItems').split(",");
	}
	console.log(lastItems);
	for (var ind = 0; ind < array.length; ind++) {
		count = parseInt(counts[ind]);
		console.log(count,counts);
		result = result1[ind];
		if (count > 99) {
			counts[ind] = 0;
			localStorage.setItem('counts', counts);	
			lastItem=result.data.children[99].data.name;
			lastItems[ind] = lastItem;		
	    	//localStorage.setItem('lastItems', lastItems);    	
			loadSubreddit();
			console.log(lastItem);
			return;
		}	

		var length = 20 * (weights[ind]/100);
		console.log(lastItems);
		for (var i = 0; i < length && i < result.data.children.length; i++){	
			i = count+i;
			if (result.data.children[i] != undefined) {
				var img = result.data.children[i].data.title;
				if (!result.data.children[i].data.over_18) {
					$("#posts").append("<li><span class='upvotes'>" +result.data.children[i].data.ups+  "</span><a href='" + 
					result.data.children[i].data.url +"'><span class='title'>" + img + "</span></a><span class='author'>Submitted by <span class='color'>" 
					+ result.data.children[i].data.author+ "</span></span> to <span class='subreddit'>" + result.data.children[i].data.subreddit+ "</span></li>");
				}
			}
			i = i - count;
		}
	counts[ind] +=i;
	console.log(lastItems);	
	lastItems[ind] = result.data.after;
	localStorage.setItem('lastItems', lastItems);    		
	console.log(localStorage.getItem('lastItems'));
	localStorage.setItem('counts', counts);				
	}	

	console.log(counts);
	var height = $("li").each(function() {
		var height = $(this).height();
		$(this).children("span.upvotes").css("line-height", height+'px');
	});	


	localStorage.removeItem('posts');
	localStorage.removeItem('lastItems');	
    localStorage.setItem('posts', $("#posts").html());	 
    console.log(array);
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
  		if (localStorage.getItem('lastItems')) {
  			lastItems = localStorage.getItem('lastItems').split(",");  			
  		}
  		console.log(lastItems);
  		result1 = JSON.parse(localStorage.getItem('result1'));  		
		var temp = (localStorage.getItem('counts').split(","));
		for (var i = 0; i < temp.length; i++) {
			counts[i] = parseInt(temp[i]);
		}
    	$("#posts").html(localStorage.getItem('posts'));
		loadModal();			
  	} 
  	else {
		if (array.length > 0) {
	    	localStorage.setItem('subreddits', array);
		}
		if (localStorage.getItem('subreddits')) {
			array = (localStorage.getItem('subreddits')).split(",");		
		}
		if (localStorage.getItem('lastItems')) {
  			lastItems = localStorage.getItem('lastItems').split(",");			
		}		
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
		if (tem != "") {
			weights.push(tem);			
		}
	});
    if (weights.length == 0) {
    	for (var i = 0; i < array.length; i++) {		
    		weights[i] = 100/array.length;
    	}
    }		
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
		$("#img").css("top", $(this).position().top-50);
		$("#img").css("left", "500px");		
		$("#img").append("<img class='image' src='"+ link +"'></img>")
	}
});

$(document).on("mouseleave", "a", function() {
	$("#img").empty();
});

$("#refresh").click(function() {
	localStorage.removeItem("posts");
	window.location.reload();
});

$("#loadmore").click(function () {
	loadPosts();
});