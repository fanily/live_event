$(function () {
  if( window.matchMedia("screen and (max-width: 480px)").matches){
		var insert = "在抗戰70周年時間點，<br>白先勇的文學、曹瑞原的影像、黃世鳴的劇本、<br>陳小霞的音樂、董陽孜的書寫…<br>場景、美術、道具、文物、年代生活，<br>我們希望能在此刻，<br>藉由台灣電視史上最磅礡的《一把青》，<br>找出影像與年代對話的另一個角度。"
    $("#wrapper section h2").html(insert);
  }
	$('.fix-icon a').bind('click', function (event) {
		var $anchor = $(this);
		var nav = $($anchor.attr('href'));
		if (nav.length) {
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');

			event.preventDefault();
		}
	});
 

  //clock event
  $(".counter1211").countdown("2015/12/11 14:00" , function(event){
    $(this).find("span").eq(1).html(event.strftime('%D-%H:%M:%S'));
  });
	
	$(".counter1213").countdown("2015/12/13 14:00" , function(event){
    $(this).find("span").eq(1).html(event.strftime('%D-%H:%M:%S'));
  });
  
  $("#counter").on("finish.countdown", function(){
    $(this).hide();
  });


  $(".social-media li").click(function(){
    var url = window.location.href;

    if( $(this).find("i").hasClass("fa-facebook") ){
      window.open('https://www.facebook.com/share.php?u='+encodeURI(url), '_blank');
      ga("send" , "event" , "atouchofgreenLive" , "click" , "nav-facebook");
      ga("atouchofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "nav-facebook");
    }else if( $(this).find("i").hasClass("fa-twitter") ){
      window.open('http://twitter.com/share?url=' + encodeURI(url) +  '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
      ga("send" , "event" , "atouchofgreenLive" , "click" , "nav-twitter");
      ga("atouchofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "nav-twitter");
    }else if( $(this).find("i").hasClass("fa-google-plus") ){
      window.open('https://plus.google.com/share?url=' + encodeURI(url), '_blank');
      ga("send" , "event" , "atouchofgreenLive" , "click" , "nav-google-plus");
      ga("atouchofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "nav-google-plus");
    }else if($(this).find("i").hasClass("fa-weibo")){
      window.open('http://v.t.sina.com.cn/share/share.php?&url='+url, '_blank');
      ga("send" , "event" , "atouchofgreenLive" , "click" , "nav-weibo");
      ga("atouchofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "nav-weibo");
    }else if( $(this).find("i").hasClass("fa-envelope") ){
      window.location = 'mailto:?subject='+"一把青。請講 影像文創x跨界對談"+'&body='+url ;
      ga("send" , "event" , "atouchofgreenLive" , "click" , "nav-email");
      ga("atouchofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "nav-email");

    }
  });

  // ga label event
  $("#links .container li a").first().click(function(){
    ga("send" , "event" , "atouchofgreenLive" , "click" , "middle-fan-plus");
    ga("atocuhofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "middle-fan-plus");
  });
  $("#links .container li a").eq(1).click(function(){
    ga("send" , "event" , "atouchofgreenLive" , "click" , "middle-cp-page");
    ga("atocuhofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "middle-cp-page");
  });
  $("#links .container li a").eq(2).click(function(){
    ga("send" , "event" , "atouchofgreenLive" , "click" , "middle-facebook-fanpage");
    ga("atocuhofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "middle-facebook-fanpage");
  });
  $("#links .container li a").last().click(function(){
    ga("send" , "event" , "atouchofgreenLive" , "click" , "middle-official-site");
    ga("atocuhofgreenLive.send" , "event" , "atouchofgreenLive" , "click" , "middle-official-site");
  });
  
});
