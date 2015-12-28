var comment_mode="auto",unread_comment=0,MustacheTemplate=function(){return function(e,t,o){var n=$(e).html();return"undefined"==typeof t?Mustache.render(n):"undefined"==typeof o?Mustache.render(n,t):Mustache.render(n,t,o)}}(),loadLiveInfo=function(){var e=moment().format("X"),t=moment(config.open_time).format("X"),o=MustacheTemplate("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});$(".info-div").append(o).addClass("show"),appendVideo();var n=1e3*(t-e);n>0&&($(".info-div").countdown(config.open_time,function(e){$(".countdown .date .count").text(e.strftime("%D")),$(".countdown .hour .count").text(e.strftime("%H")),$(".countdown .min .count").text(e.strftime("%M")),$(".countdown .sec .count").text(e.strftime("%S"))}),setTimeout(function(){openChat()},n))},openChat=function(){var e=moment().format("X"),t=moment(config.start_time).format("X");$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").addClass("show");var o=1e3*(t-e);0!==o&&setTimeout(function(){openLive()},o)},openLive=function(){var e=moment().format("X"),t=moment(config.end_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").addClass("show");var o=1e3*(t-e);0!==o&&setTimeout(function(){closeLive()},o)},openLiveCloseChat=function(){appendLive(),$(".info-div").removeClass("show"),$(".login-form").removeClass("show"),$(".comment").addClass("show"),$(".live-info .user-btn").hide(),$(".live-info .logout").hide(),$(".add-chat").removeClass("show")},closeLive=function(){var e=moment().format("X"),t=moment(config.close_time).format("X");appendVideo(),$(".info-div").removeClass("show"),$(".login-form").removeClass("show"),$(".comment").addClass("show");var o=1e3*(t-e);0!==o&&setTimeout(function(){closeChat()},o)},closeChat=function(){$(".live-info .user-btn").hide(),$(".live-info .logout").hide(),$(".add-chat").removeClass("show")},getLiveArticle=function(){var e=MustacheTemplate("#template-article",{title:config.article.title,content:config.article.content});$(".article").append(e)},getLoginForm=function(){var e=MustacheTemplate("#template-login-form",{title:config.info.title,date:config.info.date,content:config.info.content,api:config.api,redirect_url:window.location.origin+window.location.pathname});$(".login-form").append(e)},appendVideo=function(){if(""!==config.video.playlist)var e="http://www.youtube.com/embed?autoplay=1&rel=0&loop=1&listType=playlist&list="+config.video.playlist;else var e="https://www.youtube.com/embed/"+config.video.id+"?autoplay=1&rel=0";""!==config.video.start_time&&(e+="&start="+config.video.start_time),$(".video-container iframe").attr("src",e)},appendLive=function(){var e="https://www.youtube.com/embed/"+config.live.id+"?autoplay=1";""!==config.live.start_time&&(e+="&start="+config.live.start_time),""!==config.live.playlist&&(e+="&loop=1&playlist="+config.live.playlist),$(".video-container iframe").attr("src",e)},getCommentNum=function(){$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(e){$(".live-info .comment-btn .num").text(e.count)})},appendComment=function(e,t){var o=parseInt($(".comment-btn .num").text(),10);$(".comment-btn .num").text(o+1),1==e.is_img?e.message='<img src="'+e.message+'">':(e.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(e.message=linkify(e.message)),e.message=e.message.replace(/\n/g,"<br>"));var n=MustacheTemplate("#template-new-comment",{avatars:"https://graph.facebook.com/"+e.uid+"/picture?width=50",display_name:e.display_name,comment:e.message,time:moment().format("YYYY-MM-DD HH:mm"),unixtime:e.time}),a=!1;if("server"==t?-1!==$.inArray(e.uid,config.moderator_uid)&&(a=!0):-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)&&(a=!0),1==a){var i=$(n).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i),$(".chat-list .mention").removeClass("mention")}$(".chat-list").append(n),"server"!==t&&(comment_mode="auto"),"auto"==comment_mode||1==a?($(".chat-list").stop().animate({scrollTop:$(".chat-list").prop("scrollHeight")},700),unread_comment=0):(unread_comment++,unread_comment>=3&&($(".comment .show-more").addClass("show"),$(".comment .show-more").css({bottom:50,right:($(".comment").width()-$(".comment .show-more").width())/2}).addClass("show")))},getComment=function(){$.ajax({type:"GET",url:"comment.json",dataType:"json"}).done(function(e){if(!$.isEmptyObject(e)){$(".live-info .comment-btn .num").text(e.length);var t=[],o=[];e.reverse(),$.each(e,function(e,n){var a=moment.utc(n.timestamp).local().format("X"),i=moment.unix(a).format("YYYY-MM-DD HH:mm");""!==n.image?n.message='<img src="'+n.image+'">':(n.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(n.message=linkify(n.message)),n.message=n.message.replace(/\n/g,"<br>")),t.push({avatars:"https://graph.facebook.com/"+n.uid+"/picture?width=50",display_name:n.display_name,comment:n.message,time:i,unixtime:a}),-1!==$.inArray(n.uid,config.moderator_uid)&&o.push({avatars:"https://graph.facebook.com/"+n.uid+"/picture?width=50",display_name:n.display_name,comment:n.message,time:i,unixtime:a})});var n=MustacheTemplate("#template-comment-list",{list:t});if(o.length>0){var a=MustacheTemplate("#template-new-comment",o[o.length-1]),i=$(a).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i)}$(".chat-list").append(n),comment_mode="auto"}})},linkify=function(e){var t=e.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return $.each(t,function(t,o){e=e.replace(o,'<a href="'+o+'" target="_target">'+o+"</a>")}),e},mentionSomeone=function(e){var t=$(".add-chat-input").val(),o=$(".add-chat-input").attr("data-name");if("undefined"==typeof o)$(".add-chat-input").attr("data-name",e),$(".add-chat-input").val("@"+e+" "+t);else{var n=o.split(" ");-1==$.inArray(e,n)&&($(".add-chat-input").attr("data-name",o+" "+e),$(".add-chat-input").val("@"+e+" "+t))}},unmentionSomeone=function(e){var t=$(".add-chat-input").attr("data-name").split(" ");if(-1!==$.inArray(e,t)){var o=$(".add-chat-input").val().replace("@"+e,"");t=$.grep(t,function(t){return t!=e}),$(".add-chat-input").attr("data-name",t.join(" ")),$(".add-chat-input").val($.trim(o))}},ajax_login=function(e,t){var o=moment().format("X"),n=moment(config.open_time).format("X"),a=moment(config.close_time).format("X");$.ajax({type:"GET",url:config.api+"/profile?access_token="+e,dataType:"json",async:!0,beforeSend:function(){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入中⋯⋯').prop("disabled",!0)}}).done(function(t){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入').prop("disabled",!1).hide();var i="https://graph.facebook.com/"+t.uid+"/picture?width=50";o>n&&a>o&&$(".add-chat").addClass("show"),$(".login-form").removeClass("show"),$(".logout .avatars").attr("src",i).attr("data-name",t.display_name),$(".live-info .logout").show();var m=parseInt($(".user-btn .num").text(),10);$(".user-btn .num").text(m+1),$.cookie("live-token",e,{expires:7}),$.cookie("live-fid",t.id,{expires:7}),$.cookie("live-uid",t.uid,{expires:7}),window.history.replaceState({},document.title,window.location.pathname)}).fail(function(){"autologin"==t&&$.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})};