var socket=io.connect(config.api_socket);socket.emit("get numUsers");var loadStatus=!1,MustacheTemplate=function(){return function(t,e,a){var n=$(t).html();return"undefined"==typeof e?Mustache.render(n):"undefined"==typeof a?Mustache.render(n,e):Mustache.render(n,e,a)}}(),getLiveInfo=function(){var t=MustacheTemplate("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});$(".info-div").append(t).addClass("show").countdown(config.start_time,function(t){$(".countdown .date .count").text(t.strftime("%D")),$(".countdown .hour .count").text(t.strftime("%H")),$(".countdown .min .count").text(t.strftime("%M")),$(".countdown .sec .count").text(t.strftime("%S"))})},getLiveArticle=function(){var t=MustacheTemplate("#template-article",{title:config.article.title,content:config.article.content});$(".article").append(t)},getLoginForm=function(){var t=MustacheTemplate("#template-login-form",{login_link:config.api+"/auth/facebook?redirect_url="+window.location.href});$(".login-form").append(t)},appendLive=function(){var t="https://www.youtube.com/embed/"+config.live.id+"?autoplay=1";""!==config.live.start_time&&(t+="&start="+config.live.start_time),""!==config.live.playlist&&(t+="&loop=1&playlist="+config.live.playlist);var e='<iframe class="embed-responsive-item" src="'+t+'" frameborder="0" allowfullscreen></iframe>';$(".video-container").append(e)},getCommentNum=function(){$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(t){$(".live-info .comment-btn .num").text(t.count)})},updateComment=function(){var t=moment().format("X");$(".chat-list .chat").each(function(e){var a=Math.ceil((t-$(this).attr("data-value"))/60);$(".chat:eq("+e+")").find(".post-at .num").text(a),$(".chat:eq("+e+")").find(".post-at .unit").text("分鐘前")})},appendComment=function(t,e){var a=parseInt($(".comment-btn .num").text(),10);$(".comment-btn .num").text(a+1),1==t.is_img?t.message='<img src="'+t.message+'">':(t.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(t.message=linkify(t.message)),t.message=t.message.replace(/\n/g,"<br>"));var n=MustacheTemplate("#template-new-comment",{avatars:"https://graph.facebook.com/"+t.uid+"/picture?width=50",display_name:t.display_name,comment:t.message,unixtime:t.time}),i=!1;if("server"==e?-1!==$.inArray(t.uid,config.moderator_uid)&&(i=!0):-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)&&(i=!0),1==i){var o=$(n).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(o),$(".chat-list .mention").removeClass("mention")}$(".chat-list").append(n).animate({scrollTop:$(".chat-list").prop("scrollHeight")},1e3)},getComment=function(t){var e=moment().format("X"),a=config.api+"/chatlog";loadStatus=!0,"undefined"!=typeof t&&(a+="?timestamp="+t),$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(n){var i=n.count;$(".live-info .comment-btn .num").text(i),i>=20&&(a+="?limit="+i),$.ajax({type:"GET",url:a,dataType:"json"}).done(function(a){if($.isEmptyObject(a))return loadStatus=!1,void 0;var n=[];a.reverse(),$.each(a,function(t,a){var i=moment.utc(a.timestamp).local().format("X");if(e>=moment(config.start_time).format("X")&&moment(config.end_time).format("X")>=e)var o=Math.ceil((e-i)/60)+'</span><span class="unit">分鐘前';else var o=moment.unix(i).format("YYYY-MM-DD HH:mm");""!==a.image?a.message='<img src="'+a.image+'">':(a.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(a.message=linkify(a.message)),a.message=a.message.replace(/\n/g,"<br>")),n.push({avatars:"https://graph.facebook.com/"+a.uid+"/picture?width=50",display_name:a.display_name,comment:a.message,time:o,unixtime:i})});var i=MustacheTemplate("#template-comment-list",{list:n});"undefined"!=typeof t?$(".chat-list").prepend(i):$(".chat-list").append(i).animate({scrollTop:$(".chat-list").prop("scrollHeight")},1e3),loadStatus=!1})})},linkify=function(t){var e=t.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return $.each(e,function(e,a){t=t.replace(a,'<a href="'+a+'" target="_target">'+a+"</a>")}),t},mentionSomeone=function(t){var e=$(".add-chat-input").val(),a=$(".add-chat-input").attr("data-name");if("undefined"==typeof a)$(".add-chat-input").attr("data-name",t),$(".add-chat-input").val("@"+t+" "+e);else{var n=a.split(" ");-1==$.inArray(t,n)&&($(".add-chat-input").attr("data-name",a+" "+t),$(".add-chat-input").val("@"+t+" "+e))}},unmentionSomeone=function(t){var e=$(".add-chat-input").attr("data-name").split(" ");if(-1!==$.inArray(t,e)){var a=$(".add-chat-input").val().replace("@"+t,"");e=$.grep(e,function(e){return e!=t}),$(".add-chat-input").attr("data-name",e.join(" ")),$(".add-chat-input").val($.trim(a))}},ajax_login=function(t,e){var a=moment().format("X"),n=moment(config.start_time).format("X"),i=moment(config.end_time).format("X");$.ajax({type:"GET",url:config.api+"/profile?access_token="+t,dataType:"json",beforeSend:function(){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入中⋯⋯')}}).done(function(e){var o="https://graph.facebook.com/"+e.uid+"/picture?width=50";socket.emit("add user",{provider:"FB",id:e.id,uid:e.uid,display_name:e.display_name}),a>=n&&i>=a&&$(".add-chat").addClass("show"),$(".login-form").removeClass("show"),$(".logout .avatars").attr("src",o).attr("data-name",e.display_name);var c=parseInt($(".user-btn .num").text(),10);$(".user-btn .num").text(c+1),$.cookie("live-token",t,{expires:7}),$.cookie("live-fid",e.id,{expires:7}),$.cookie("live-uid",e.uid,{expires:7}),""!==window.location.search&&(window.location.search="")}).fail(function(){"autologin"==e&&$.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})};