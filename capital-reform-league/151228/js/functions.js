var comment_mode="auto",unread_comment=0,MustacheTemplate=function(){return function(t,e,a){var o=$(t).html();return"undefined"==typeof e?Mustache.render(o):"undefined"==typeof a?Mustache.render(o,e):Mustache.render(o,e,a)}}(),loadLiveInfo=function(){var t=moment().format("X"),e=moment(config.start_time).format("X"),a=MustacheTemplate("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});$(".info-div").append(a).addClass("show").countdown(config.start_time,function(t){$(".countdown .date .count").text(t.strftime("%D")),$(".countdown .hour .count").text(t.strftime("%H")),$(".countdown .min .count").text(t.strftime("%M")),$(".countdown .sec .count").text(t.strftime("%S"))});var o=1e3*(e-t);0!==o&&setTimeout(function(){openLive()},o)},openLive=function(){var t=moment().format("X"),e=moment(config.end_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").addClass("show");var a=1e3*(e-t);0!==a&&setTimeout(function(){closeLive()},a)},closeLive=function(){var t=moment().format("X"),e=moment(config.close_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").removeClass("show"),$(".comment").addClass("show");var a=1e3*(e-t);0!==a&&setTimeout(function(){closeChat()},a)},closeChat=function(){$(".live-info .user-btn").hide(),$(".live-info .logout").hide(),$(".add-chat").removeClass("show"),$(".chat-list").css("padding-bottom",0)},getLiveArticle=function(){var t=MustacheTemplate("#template-article",{title:config.article.title,content:config.article.content});$(".article").append(t)},getLoginForm=function(){var t=MustacheTemplate("#template-login-form",{title:config.login_title,api:config.api,redirect_url:window.location.origin+window.location.pathname});$(".login-form").append(t)},appendLive=function(){var t="https://www.youtube.com/embed/"+config.live.id+"?autoplay=1";""!==config.live.start_time&&(t+="&start="+config.live.start_time),""!==config.live.playlist&&(t+="&loop=1&playlist="+config.live.playlist),$(".video-container iframe").attr("src",t)},getCommentNum=function(){$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(t){$(".live-info .comment-btn .num").text(t.count)})},appendComment=function(t,e){var a=parseInt($(".comment-btn .num").text(),10);$(".comment-btn .num").text(a+1),1==t.is_img?t.message='<img src="'+t.message+'">':(t.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(t.message=linkify(t.message)),t.message=t.message.replace(/\n/g,"<br>"));var o=MustacheTemplate("#template-new-comment",{avatars:"https://graph.facebook.com/"+t.uid+"/picture?width=50",display_name:t.display_name,comment:t.message,time:moment().format("YYYY-MM-DD HH:mm"),unixtime:t.time}),n=!1;if("server"==e?-1!==$.inArray(t.uid,config.moderator_uid)&&(n=!0):-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)&&(n=!0),1==n){var i=$(o).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i),$(".chat-list .mention").removeClass("mention")}$(".chat-list").append(o),"server"!==e&&(comment_mode="auto"),"auto"==comment_mode||1==n?($(".chat-list").stop().animate({scrollTop:$(".chat-list").prop("scrollHeight")},700),unread_comment=0):(unread_comment++,unread_comment>=3&&$(".comment .show-more").css({bottom:50,right:($(".comment").width()-$(".comment .show-more").width())/2}).addClass("show"))},load_comment_when_scroll=function(t){$.ajax({url:config.api+"/chatlog?timestamp="+t,dataType:"json",type:"GET"}).done(function(t){if(t.length>0){var e=[];t.reverse(),$.each(t,function(t,a){var o=moment.utc(a.timestamp).local().format("X"),n=moment.unix(o).format("YYYY-MM-DD HH:mm");""!==a.image?a.message='<img src="'+a.image+'">':(a.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(a.message=linkify(a.message)),a.message=a.message.replace(/\n/g,"<br>")),e.push({avatars:"https://graph.facebook.com/"+a.uid+"/picture?width=50",display_name:a.display_name,comment:a.message,time:n,unixtime:o})});var a=MustacheTemplate("#template-comment-list",{list:e});$(".chat-list").prepend(a).scrollTop(500)}})},getComment=function(){$.ajax({type:"GET",url:"comment.json",dataType:"json"}).done(function(t){if(!$.isEmptyObject(t)){$(".live-info .comment-btn .num").text(t.length);var e=[],a=[];t.reverse(),$.each(t,function(t,o){var n=moment.utc(o.timestamp).local().format("X"),i=moment.unix(n).format("YYYY-MM-DD HH:mm");""!==o.image?o.message='<img src="'+o.image+'">':(o.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(o.message=linkify(o.message)),o.message=o.message.replace(/\n/g,"<br>")),e.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n}),-1!==$.inArray(o.uid,config.moderator_uid)&&a.push({avatars:"https://graph.facebook.com/"+o.uid+"/picture?width=50",display_name:o.display_name,comment:o.message,time:i,unixtime:n})});var o=MustacheTemplate("#template-comment-list",{list:e});if(a.length>0){var n=MustacheTemplate("#template-new-comment",a[a.length-1]),i=$(n).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i)}$(".chat-list").append(o),$(".chat-list").animate({scrollTop:$(".chat-list").prop("scrollHeight")},1e3),comment_mode="auto"}})},linkify=function(t){var e=t.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return $.each(e,function(e,a){t=t.replace(a,'<a href="'+a+'" target="_target">'+a+"</a>")}),t},mentionSomeone=function(t){var e=$(".add-chat-input").val(),a=$(".add-chat-input").attr("data-name");if("undefined"==typeof a)$(".add-chat-input").attr("data-name",t),$(".add-chat-input").val("@"+t+" "+e);else{var o=a.split(" ");-1==$.inArray(t,o)&&($(".add-chat-input").attr("data-name",a+" "+t),$(".add-chat-input").val("@"+t+" "+e))}},unmentionSomeone=function(t){var e=$(".add-chat-input").attr("data-name").split(" ");if(-1!==$.inArray(t,e)){var a=$(".add-chat-input").val().replace("@"+t,"");e=$.grep(e,function(e){return e!=t}),$(".add-chat-input").attr("data-name",e.join(" ")),$(".add-chat-input").val($.trim(a))}},ajax_login=function(t,e){var a=moment().format("X"),o=moment(config.start_time).format("X"),n=moment(config.close_time).format("X");$.ajax({type:"GET",url:config.api+"/profile?access_token="+t,dataType:"json",beforeSend:function(){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入中⋯⋯')}}).done(function(e){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入');var i="https://graph.facebook.com/"+e.uid+"/picture?width=50";a>o&&n>a&&$(".add-chat").addClass("show"),$(".login-form").removeClass("show"),$(".logout .avatars").attr("src",i).attr("data-name",e.display_name),$(".live-info .logout").show();var m=parseInt($(".user-btn .num").text(),10);$(".user-btn .num").text(m+1),$.cookie("live-token",t,{expires:7}),$.cookie("live-fid",e.id,{expires:7}),$.cookie("live-uid",e.uid,{expires:7}),window.history.replaceState({},document.title,window.location.pathname)}).fail(function(){"autologin"==e&&$.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})};