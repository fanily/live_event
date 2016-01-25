var comment_mode="auto",unread_comment=0,MustacheTemplate=function(){return function(e,t,a){var o=$(e).html();return"undefined"==typeof t?Mustache.render(o):"undefined"==typeof a?Mustache.render(o,t):Mustache.render(o,t,a)}}(),loadLiveInfo=function(){var e=moment().format("X"),t=moment(config.start_time).format("X"),a=MustacheTemplate("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});$(".info-div").append(a).addClass("show").countdown(config.start_time,function(e){$(".countdown .date .count").text(e.strftime("%D")),$(".countdown .hour .count").text(e.strftime("%H")),$(".countdown .min .count").text(e.strftime("%M")),$(".countdown .sec .count").text(e.strftime("%S"))});var o=1e3*(t-e);0!==o&&setTimeout(function(){openLive()},o)},openLive=function(){var e=moment().format("X"),t=moment(config.end_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").addClass("show");var a=1e3*(t-e);0!==a&&setTimeout(function(){closeLive()},a)},closeLive=function(){var e=moment().format("X"),t=moment(config.close_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").addClass("show");var a=1e3*(t-e);0!==a&&setTimeout(function(){closeChat()},a)},closeChat=function(){$(".live-info .user-btn").hide(),$(".live-info .logout").hide(),$(".login-form").removeClass("show"),$(".add-chat").removeClass("show"),$(".chat-list").css("padding-bottom",0)},getLiveArticle=function(){var e=MustacheTemplate("#template-article",{title:config.article.title,content:config.article.content});$(".article").append(e)},getLoginForm=function(){var e=MustacheTemplate("#template-login-form",{title:config.login_title,api:config.api,redirect_url:window.location.origin+window.location.pathname});$(".login-form").append(e)},appendVideo=function(){if(""!==config.video.playlist)var e="http://www.youtube.com/embed?autoplay=1&rel=0&loop=1&listType=playlist&list="+config.video.playlist;else var e="https://www.youtube.com/embed/"+config.video.id+"?autoplay=1&rel=0";""!==config.video.start_time&&(e+="&start="+config.video.start_time),$(".video-container iframe").attr("src",e)},appendLive=function(){var e="https://www.youtube.com/embed/"+config.live.id+"?autoplay=1";""!==config.live.start_time&&(e+="&start="+config.live.start_time),""!==config.live.playlist&&(e+="&loop=1&playlist="+config.live.playlist),$(".video-container iframe").attr("src",e)},getCommentNum=function(){$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(e){$(".live-info .comment-btn .num").text(e.count)})},appendComment=function(e,t){var a=parseInt($(".comment-btn .num").text(),10);$(".comment-btn .num").text(a+1),1==e.is_img?e.message='<img src="'+e.message+'">':(e.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(e.message=linkify(e.message)),e.message=e.message.replace(/\n/g,"<br>"));var o=MustacheTemplate("#template-new-comment",{avatars:"https://graph.facebook.com/"+e.uid+"/picture?width=50",display_name:e.display_name,comment:e.message,time:moment().format("YYYY-MM-DD HH:mm"),unixtime:e.time}),n=!1;if("server"==t?-1!==$.inArray(e.uid,config.moderator_uid)&&(n=!0):-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)&&(n=!0),1==n){var i=$(o).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i),$(".chat-list .mention").removeClass("mention")}$(".chat-list").append(o),"server"!==t&&(comment_mode="auto"),"auto"==comment_mode||-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)?($(".chat-list").stop().animate({scrollTop:$(".chat-list").prop("scrollHeight")},700),unread_comment=0,comment_mode="auto"):(unread_comment++,unread_comment>=3&&$(".comment .show-more").css({bottom:50,right:($(".comment").width()-$(".comment .show-more").width())/2}).addClass("show"))},load_comment_when_scroll=function(e){$.ajax({url:config.api+"/chatlog?timestamp="+e,dataType:"json",type:"GET"}).done(function(e){if(e.length>0){var t=[],a=[];e.reverse(),$.each(e,function(e,o){var n=moment.utc(o.timestamp).local().format("X"),i=moment.unix(n).format("YYYY-MM-DD HH:mm");""!==o.image?o.message='<img src="'+o.image+'">':(o.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(o.message=linkify(o.message)),o.message=o.message.replace(/\n/g,"<br>")),t.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n}),-1!==$.inArray(o.uid,config.moderator_uid)&&a.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n})});var o=MustacheTemplate("#template-comment-list",{list:t});$(".chat-list").prepend(o).scrollTop(500)}})},getComment=function(){$.ajax({type:"GET",url:"comment.json",dataType:"json"}).done(function(e){if(!$.isEmptyObject(e)){$(".live-info .comment-btn .num").text(e.length);var t=[],a=[];e.reverse(),$.each(e,function(e,o){var n=moment.utc(o.timestamp).local().format("X"),i=moment.unix(n).format("YYYY-MM-DD HH:mm");""!==o.image?o.message='<img src="'+o.image+'">':(o.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(o.message=linkify(o.message)),o.message=o.message.replace(/\n/g,"<br>")),t.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n}),-1!==$.inArray(o.uid,config.moderator_uid)&&a.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n})});var o=MustacheTemplate("#template-comment-list",{list:t});if(a.length>0){var n=MustacheTemplate("#template-new-comment",a[a.length-1]),i=$(n).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i)}$(".chat-list").append(o),comment_mode="auto"}})},linkify=function(e){var t=e.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return $.each(t,function(t,a){e=e.replace(a,'<a href="'+a+'" target="_target">'+a+"</a>")}),e},mentionSomeone=function(e){var t=$(".add-chat-input").val(),a=$(".add-chat-input").attr("data-name");if("undefined"==typeof a)$(".add-chat-input").attr("data-name",e),$(".add-chat-input").val("@"+e+" "+t);else{var o=a.split(" ");-1==$.inArray(e,o)&&($(".add-chat-input").attr("data-name",a+" "+e),$(".add-chat-input").val("@"+e+" "+t))}},unmentionSomeone=function(e){var t=$(".add-chat-input").attr("data-name").split(" ");if(-1!==$.inArray(e,t)){var a=$(".add-chat-input").val().replace("@"+e,"");t=$.grep(t,function(t){return t!=e}),$(".add-chat-input").attr("data-name",t.join(" ")),$(".add-chat-input").val($.trim(a))}},ajax_login=function(e,t){var a=moment().format("X"),o=moment(config.start_time).format("X"),n=moment(config.close_time).format("X");$.ajax({type:"GET",url:config.api+"/profile?access_token="+e,dataType:"json",beforeSend:function(){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入中⋯⋯')}}).done(function(t){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入');var i="https://graph.facebook.com/"+t.uid+"/picture?width=50";a>o&&n>a&&$(".add-chat").addClass("show"),$(".login-form").removeClass("show"),$(".logout .avatars").attr("src",i).attr("data-name",t.display_name),$(".live-info .logout").show();var m=parseInt($(".user-btn .num").text(),10);$(".user-btn .num").text(m+1),$.cookie("live-token",e,{expires:7}),$.cookie("live-fid",t.id,{expires:7}),$.cookie("live-uid",t.uid,{expires:7}),window.history.replaceState({},document.title,window.location.pathname)}).fail(function(){"autologin"==t&&$.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})};