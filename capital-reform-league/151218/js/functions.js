var MustacheTemplate=function(){return function(e,t,a){var n=$(e).html();return"undefined"==typeof t?Mustache.render(n):"undefined"==typeof a?Mustache.render(n,t):Mustache.render(n,t,a)}}(),loadLiveInfo=function(){var e=moment().format("X"),t=moment(config.start_time).format("X"),a=MustacheTemplate("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});$(".info-div").append(a).addClass("show").countdown(config.start_time,function(e){$(".countdown .date .count").text(e.strftime("%D")),$(".countdown .hour .count").text(e.strftime("%H")),$(".countdown .min .count").text(e.strftime("%M")),$(".countdown .sec .count").text(e.strftime("%S"))}),$(".comment").hide();var n=1e3*(t-e);0!==n&&setTimeout(function(){openLive()},n)},openLive=function(){var e=moment().format("X"),t=moment(config.end_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").addClass("show"),$(".comment").show();var a=1e3*(t-e);0!==a&&setTimeout(function(){closeLive()},a)},closeLive=function(){var e=moment().format("X"),t=moment(config.close_time).format("X");appendLive(),$(".info-div").removeClass("show"),$(".login-form").removeClass("show");var a=1e3*(t-e);0!==a&&setTimeout(function(){closeChat()},a)},closeChat=function(){appendLive(),$(".live-info .user-btn").hide(),$(".add-chat").removeClass("show"),$(".chat-list").css("padding-bottom",0)},getLiveArticle=function(){var e=MustacheTemplate("#template-article",{title:config.article.title,content:config.article.content});$(".article").append(e)},getLoginForm=function(){var e=MustacheTemplate("#template-login-form",{login_link:config.api+"/auth/facebook?redirect_url="+window.location.href});$(".login-form").append(e)},appendLive=function(){var e="https://www.youtube.com/embed/"+config.live.id+"?autoplay=1";""!==config.live.start_time&&(e+="&start="+config.live.start_time),""!==config.live.playlist&&(e+="&loop=1&playlist="+config.live.playlist);var t='<iframe class="embed-responsive-item" src="'+e+'" frameborder="0" allowfullscreen></iframe>';$(".video-container").append(t)},getCommentNum=function(){$.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(e){$(".live-info .comment-btn .num").text(e.count)})},appendComment=function(e,t){var a=parseInt($(".comment-btn .num").text(),10);$(".comment-btn .num").text(a+1),1==e.is_img?e.message='<img src="'+e.message+'">':(e.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(e.message=linkify(e.message)),e.message=e.message.replace(/\n/g,"<br>"));var n=MustacheTemplate("#template-new-comment",{avatars:"https://graph.facebook.com/"+e.uid+"/picture?width=50",display_name:e.display_name,comment:e.message,time:moment().format("YYYY-MM-DD HH:mm"),unixtime:e.time}),o=!1;if("server"==t?-1!==$.inArray(e.uid,config.moderator_uid)&&(o=!0):-1!==$.inArray($.cookie("live-uid"),config.moderator_uid)&&(o=!0),1==o){var i=$(n).addClass("announce");0!==$(".comment .announce").length&&$(".comment .announce").remove(),$(".chat-list").before(i),$(".chat-list .mention").removeClass("mention")}$(".chat-list").append(n).animate({scrollTop:$(".chat-list").prop("scrollHeight")},1e3)},getComment=function(){$.ajax({type:"GET",url:"comment.json",dataType:"json"}).done(function(e){if(!$.isEmptyObject(e)){$(".live-info .comment-btn .num").text(e.length);var t=[];e.reverse(),$.each(e,function(e,a){var n=moment.utc(a.timestamp).local().format("X"),o=moment.unix(n).format("YYYY-MM-DD HH:mm");""!==a.image?a.message='<img src="'+a.image+'">':(a.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(a.message=linkify(a.message)),a.message=a.message.replace(/\n/g,"<br>")),t.push({avatars:"https://graph.facebook.com/"+a.uid+"/picture?width=50",display_name:a.display_name,comment:a.message,time:o,unixtime:n})});var a=MustacheTemplate("#template-comment-list",{list:t});$(".chat-list").append(a).animate({scrollTop:$(".chat-list").prop("scrollHeight")},1e3)}})},linkify=function(e){var t=e.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return $.each(t,function(t,a){e=e.replace(a,'<a href="'+a+'" target="_target">'+a+"</a>")}),e},mentionSomeone=function(e){var t=$(".add-chat-input").val(),a=$(".add-chat-input").attr("data-name");if("undefined"==typeof a)$(".add-chat-input").attr("data-name",e),$(".add-chat-input").val("@"+e+" "+t);else{var n=a.split(" ");-1==$.inArray(e,n)&&($(".add-chat-input").attr("data-name",a+" "+e),$(".add-chat-input").val("@"+e+" "+t))}},unmentionSomeone=function(e){var t=$(".add-chat-input").attr("data-name").split(" ");if(-1!==$.inArray(e,t)){var a=$(".add-chat-input").val().replace("@"+e,"");t=$.grep(t,function(t){return t!=e}),$(".add-chat-input").attr("data-name",t.join(" ")),$(".add-chat-input").val($.trim(a))}},ajax_login=function(e,t){var a=moment().format("X"),n=moment(config.start_time).format("X"),o=moment(config.close_time).format("X");$.ajax({type:"GET",url:config.api+"/profile?access_token="+e,dataType:"json",beforeSend:function(){$(".fb-login-btn").html('<i class="fa fa-facebook"></i>登入中⋯⋯')}}).done(function(t){var i="https://graph.facebook.com/"+t.uid+"/picture?width=50";a>n&&o>a&&$(".add-chat").addClass("show"),$(".login-form").removeClass("show"),$(".logout .avatars").attr("src",i).attr("data-name",t.display_name);var m=parseInt($(".user-btn .num").text(),10);$(".user-btn .num").text(m+1),$.cookie("live-token",e,{expires:7}),$.cookie("live-fid",t.id,{expires:7}),$.cookie("live-uid",t.uid,{expires:7}),""!==window.location.search&&(window.location.search="")}).fail(function(){"autologin"==t&&$.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})};