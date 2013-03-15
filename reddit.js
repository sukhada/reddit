var r,t;
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
	var temp = $("#subreddit").val();
  $("#submit").css("display", "inline");
  $("#clear").css("display", "inline");  
	array.push(temp);
	counts.push(0);
  var placeholder = 100/(array.length);
	$("#listofsubreddits").append("<li>" + temp+ '<input type="text" class="new" placeholder="'+ placeholder + '%"></input>'+"</li>");
	$("#subreddit").val("");	

  localStorage.setItem('subreddits', array);	
  localStorage.setItem('counts', counts);  
  localStorage.removeItem('posts');
}

function loadSubreddit() {
  console.log('loadSubreddit');
	$("#listofsubreddits").empty();
  console.log(array,weights,counts);
  if (array.length > 0) {
    $("#submit").css("display", "inline");
    $("#clear").css("display", "inline");     
  }
	for (var j = 0; j < array.length; j++) {
		var temp = array[j];
    console.log(temp);
		var weight = weights[j]		
		$("#listofsubreddits").append("<li><span class='remove'>x</span><a href='#'>" + temp+'<span class="percentage">' + weight+"%</span>"+"</a></li>");
		$("#subreddit").val("");	
		var redditBaseURL = "http://www.reddit.com/r/";
		var redditEndURL = "/.json?limit=100&after=" + lastItems[j] + "&jsonp=?";	
	    $.getJSON(redditBaseURL + temp + redditEndURL, (function(i_copy) {
    	    return function(data) {
        	    addNewPosts(data, i_copy);
        	};
    	}) (j));
	}
}

function loadModal() {
  console.log('loadSubreddit');
  $("#listofsubreddits").empty();
  $("#submit").css("display", "inline");
  $("#clear").css("display", "inline");      
  console.log(array,weights,counts);
  for (var j = 0; j < array.length; j++) {
    var temp = array[j];
    console.log(temp);
    var weight = weights[j]   
    $("#listofsubreddits").append("<li><span class='remove'>x</span><a href='#'>" + temp+'<span class="percentage">' + weight+"%</span>"+"</a></li>");
  }
}

function addNewPosts(e,j) {
	result1[j] = e;
	loadPosts();
}

function getNewPage(e) {
	result1.push(e);		
}

function loadPosts() {
	if (result1.length > 0) {
		localStorage.removeItem('result1');
		localStorage.setItem('result1', JSON.stringify(result1));				
	}
	if (localStorage.getItem('lastItems')) {
		lastItems = localStorage.getItem('lastItems').split(",");
	}
	for (var ind = 0; ind < array.length; ind++) {
		count = parseInt(counts[ind]);
  
		result = result1[ind];
		if (count > 99) {
			counts[ind] = 0;
			localStorage.setItem('counts', counts);	
			lastItem=result.data.children[99].data.name;
			lastItems[ind] = lastItem;		
	    	//localStorage.setItem('lastItems', lastItems);    	
			loadSubreddit();
			return;
		}	
		var length = 20 * (weights[ind]/100);
		if (result != undefined){
			for (var i = 0; i < length && i < result.data.children.length; i++){	
				i = count+i;
				if (result.data.children[i] != undefined) {
					var img = result.data.children[i].data.title;
					if (!result.data.children[i].data.over_18) {
						$("#posts").append("<li><span class='upvotes'>" +result.data.children[i].data.ups+  "<span class='labelupvotes'>upvotes</span></span><a class='mainlink' href='" + 
						result.data.children[i].data.url +"'><span class='title'>" + img + "</span></a><span class='author'>Submitted by <span class='color'>" 
						+ result.data.children[i].data.author+ "</span></span> to <span class='subreddit'>" + result.data.children[i].data.subreddit+ 
            " </span><span class='comments'><a href='http://www.reddit.com"+ result.data.children[i].data.permalink +"'>"+ 
            result.data.children[i].data.num_comments + " comments</a></span></li>");
					}
				}
				i = i - count;
			}			
			counts[ind] +=i;
			console.log(counts[ind]);			
			lastItems[ind] = result.data.after;
			localStorage.setItem('lastItems', lastItems);    		
			localStorage.setItem('counts', counts);						
		}
  }
  $("#posts").css("display", "block");    
  if ($(window).width > 704) {
    var height = $("li").each(function() {
      var height = $(this).outerHeight();
      $(this).children("span.upvotes").css("height", (height+15)+'px');    
      $(this).children("span.upvotes").css("line-height", (height)+'px');
    });        
  }
  else {
    var height = $("li").each(function() {
      var height = $(this).outerHeight();
      $(this).children("span.upvotes").css("height", (height+15)+'px');    
      $(this).children("span.upvotes").css("line-height", (height+15)+'px');
    });            
  }


  localStorage.removeItem('posts');
  localStorage.removeItem('lastItems'); 
  localStorage.setItem('posts', $("#posts").html());       	
	}	

function frontPage(result) {
  for (var i = 0; i < result.data.children.length; i++){    
    if (result.data.children[i] != undefined) {    
      var img = result.data.children[i].data.title;
      if (!result.data.children[i].data.over_18) {
        $("#posts").append("<li><span class='upvotes'>" +result.data.children[i].data.ups+  "<span class='labelupvotes'>upvotes</span></span><a class='mainlink' href='" + 
          result.data.children[i].data.url +"'><span class='title'>" + img + "</span></a><span class='author'>Submitted by <span class='color'>" 
          + result.data.children[i].data.author+ "</span></span> to <span class='subreddit'>" + result.data.children[i].data.subreddit+ 
          " </span><span class='comments'><a href='http://www.reddit.com"+ result.data.children[i].data.permalink +"'>"+ 
          result.data.children[i].data.num_comments + " comments</a></span></li>");
      }  
    }
  }
  $("#posts").css("display", "block");    
  if ($(window).width > 704) {
    var height = $("li").each(function() {
      var height = $(this).outerHeight();
      $(this).children("span.upvotes").css("height", (height+15)+'px');    
      $(this).children("span.upvotes").css("line-height", (height)+'px');
    });        
  }
  else {
    var height = $("li").each(function() {
      var height = $(this).outerHeight();
      $(this).children("span.upvotes").css("height", (height+15)+'px');    
      $(this).children("span.upvotes").css("line-height", (height+15)+'px');
    });            
  }

}

function loadRedditPosts() {
	if (localStorage.getItem('subreddits')) {
    array = localStorage.getItem('subreddits').split(",");
		redditBaseURL = "http://www.reddit.com/r/" + array[0] + ".json?limit=" + 100+"&jsonp=?"
    $.getJSON(redditBaseURL, loadPosts);        
	}
	else {
    redditBaseURL = "http://www.reddit.com/.json?limit=" + 100+"&jsonp=?";
    $.getJSON(redditBaseURL, frontPage);    
  }

}

function fixMargins() {
  var height = $("li").each(function() {
    var height = $(this).height();
    $(this).children("span.upvotes").css("line-height", height+'px');
    $(this).children("span.labelupvotes").css("line-height", height+'px');
  }); 

  $(".title").each(function() {
    if (($(this).height() != 20) && $(this).parent().siblings("span.upvotes").css("line-height") =='75px') {  
      $(this).parent().siblings("span.upvotes").css("line-height", '95px');    
      $(this).parent().siblings("span.labelupvotes").css("line-height", '95px');    

    }   
  });
  $(".title").each(function(title) {
    adjustHeights(".title");
  });  
}

window.onload = function() {
  if ($(window).width < 704) {
    $(".image").css("max-width", $(window).width());        
    $(".image").css("max-width", $(window).height());
    $("#apptitle").css("font-size", "16px");
  }
  else {
    $(".image").css("max-width", 500);      

  }
  console.log($(window).width());               
  if (localStorage.getItem('subreddits')) {
  	if (localStorage.getItem('lastItems')) {
  			lastItems = localStorage.getItem('lastItems').split(",");  			
  		}
    if (localStorage.getItem('result1')) {
      result1 = JSON.parse(localStorage.getItem('result1'));            
    }
    if (localStorage.getItem('counts')) {
      var temp = (localStorage.getItem('counts').split(","));
      for (var i = 0; i < temp.length; i++) {
        counts[i] = parseInt(temp[i]);
      }      
    }
    if (localStorage.getItem('weights')){
      weights = (localStorage.getItem('weights')).split(",");             
    }    
    if (localStorage.getItem('subreddits')) {
      array = localStorage.getItem('subreddits').split(",");
    }

    if (localStorage.getItem('posts')){
      $("#posts").html(localStorage.getItem('posts'));  
      loadModal();    
      $("#posts").css("display", "block");   
    }
    else {
      loadSubreddit();			
    }
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

$("#open").on('mouseenter', function() {
  clearTimeout(r);  
	$(".modal").removeClass("hide");
});

$(".modal").on('mouseleave', function() {
  r = setTimeout(function() {$(".modal").addClass("hide");},500);
});

$(".modal").on('mouseenter', function() {
  clearTimeout(r);
  $(".modal").removeClass("hide");
});

$("#open").on('mouseleave', function() {
  r=setTimeout(function() {$(".modal").addClass("hide");},500);
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
      console.log(weights);
    }   
  $("#listofsubreddits").empty();
    localStorage.setItem('weights', weights);
    window.location.reload();
});

$("#clear").click(function() {
  localStorage.clear();
  window.location.reload();
});


$(document).on("mouseenter", "a", function(e) {
  var link = $(this).attr('href');
  clearTimeout(t);
  $("#img").empty();
  if (link != undefined) {
    if (($(this).attr('href').indexOf("i.imgur") != -1) || 
        ($(this).attr('href').indexOf("jpg") != -1) || 
        ($(this).attr('href').indexOf("png") != -1) ||
        ($(this).attr('href').indexOf("gif") != -1)) {
      if ($(window).width() > 704) {
        $("#img").css("top", e.pageY - 10);
        $("#img").css("left", e.pageX - 30);    
        $(this).css("color", "#05B8CC");
        $("#img").append("<img class='image' src='"+ link +"'></img>")        
      }
      else {
        $("#img").css("top", e.pageY - 10);
        $("#img").css("left", 0);           
        $(this).css("color", "#05B8CC");
        $("#img").append("<img class='image' src='"+ link +"'></img>");
        console.log($(".image").css("width"));         
        t = setTimeout(function() {$("#img").empty();}, 3000);             
      }
    }  
  }
  localStorage.setItem("posts", $("#posts").html());
});

$(document).on("mousemove", "a", function(e) {
  if ($(window).width() > 704) {    
    var link = $(this).attr('href');
    if (link != undefined) {
      if (($(this).attr('href').indexOf("i.imgur") != -1) || 
          ($(this).attr('href').indexOf("jpg") != -1) || 
          ($(this).attr('href').indexOf("png") != -1) ||
          ($(this).attr('href').indexOf("gif") != -1)) {
        $("#img").css("top",(e.pageY - 10));
        $("#img").css("left", e.pageX + 30);
      }    
    }

    $(document).on("mouseleave", "a", function() {
      $("#img").empty();
    });  
  }
});




$("#refresh").click(function() {
	localStorage.removeItem("posts");
	window.location.reload();
});

$("#loadmore").click(function () {
	loadPosts();
});



$("#listofsubreddits").on('click', ".remove", function () {
  var temp = ($(this).siblings('a').text().substring(0,$(this).siblings('a').text().length-1)).replace(/[0-9]/g, '').replace(/\./g, "");
  var index = array.indexOf(temp);
  array.splice(index, 1);
  counts.splice(index,1);
  weights.splice(index,1);
  result1.splice(index,1);
  lastItems.splice(index,1);
  localStorage.setItem('subreddits',array);
  localStorage.setItem('counts',counts);
  localStorage.setItem('result1',JSON.stringify(result1));
  localStorage.setItem('lastItems',lastItems);    
  localStorage.setItem('weights',weights);  
  localStorage.removeItem('posts');    
  $(this).parent().remove();
  window.location.reload();  
});

