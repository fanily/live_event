jQuery(function(t){var e=function(){return function(e,o,n){var a=t(e).html();return"undefined"==typeof o?Mustache.render(a):"undefined"==typeof n?Mustache.render(a,o):Mustache.render(a,o,n)}}(),o=function(e){var o=t(".add-chat-input").val(),n=t(".add-chat-input").attr("data-name");if("undefined"==typeof n)t(".add-chat-input").attr("data-name",e),t(".add-chat-input").val("@"+e+" "+o);else{var a=n.split(" ");-1==t.inArray(e,a)&&(t(".add-chat-input").attr("data-name",n+" "+e),t(".add-chat-input").val("@"+e+" "+o))}},n=function(e){var o=t(".add-chat-input").attr("data-name").split(" ");if(-1!==t.inArray(e,o)){var n=t(".add-chat-input").val().replace("@"+e,"");o=t.grep(o,function(t){return t!=e}),t(".add-chat-input").attr("data-name",o.join(" ")),t(".add-chat-input").val(t.trim(n))}};if(t(window).on("checkLoginState",function(){"undefined"!=typeof t.cookie("live-token")&&FB.getLoginStatus(function(e){if("connected"===e.status){var o=e.authResponse.accessToken;FB.api("/me",function(e){FB.api("/me/picture?width=50&height=50",function(n){socket.emit("add user",e.name),t(".login-form").removeClass("show"),t(".logout .avatars").attr("src",n.data.url).attr("data-name",e.name),t(".logout").addClass("show"),t.cookie("live-token",o,{expires:7});var a=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(a+1)})})}else t.removeCookie("live-token")})}),moment().format("X")<=moment(config.start_time).format("X")){t(".login-form").remove(),t(".comment").remove();var a=e("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,is_end:!1,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});t(".info-div").append(a).addClass("show").countdown(config.start_time,function(e){t(".countdown .date .count").text(e.strftime("%D")),t(".countdown .hour .count").text(e.strftime("%H")),t(".countdown .min .count").text(e.strftime("%M")),t(".countdown .sec .count").text(e.strftime("%S"))})}else if(moment().format("X")>=moment(config.end_time).format("X")){t(".login-form").remove();var a=e("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,is_end:!0,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});t(".info-div").append(a).addClass("show").css("opacity","0.9")}else t(".info-div").remove(),t(".add-chat").addClass("show"),t("body").on("keypress",".add-chat-input",function(e){return 13==e.which&&e.shiftKey!==!0?(t(".add-chat-btn").click(),!1):void 0}).on("click",".chat",function(e){e.stopPropagation();var a=t(this).data("toggled");t(this).data("toggled",!a),a?(n(t(this).attr("data-name")),t(this).removeClass("mention")):(o(t(this).attr("data-name")),t(this).addClass("mention"))}),t(".add-chat-input").textareaAutoSize().emojiPicker({width:"300px",height:"200px",button:!1}),t(".emoji-btn").click(function(e){e.preventDefault(),t(".add-chat-input").emojiPicker("toggle")}),t(".add-chat-btn").click(function(o){o.stopPropagation();var n=t.trim(t(".add-chat-input").val());if(""!==n){t(this).css("pointer-events","none"),t(".add-chat-input").prop("disabled",!0);var a=t(".comment-btn .num"),i=parseInt(a.text(),10);a.text(i+1);var r=e("#template-new-comment",{avatars:t(".logout .avatars").attr("src"),display_name:t(".logout .avatars").attr("data-name"),comment:n.replace(/\n/g,"<br>"),unixtime:moment().format("X")});t(".chat-list").append(r).animate({scrollTop:t(".chat-list").prop("scrollHeight")},1e3),t(this).css("pointer-events","auto"),t(".add-chat-input").val("").prop("disabled",!1).attr("rows",1).css("height","auto")}});t(".live-title").find("h1").html(config.title),t(".live-title").find("h2").html(config.description),t(".video-container").find("iframe").attr("src","https://www.youtube.com/embed/"+config.video_id+"?autoplay=1"),t(".banner").find("a").attr("href",config.banner.link),t(".banner").find("img").attr("src",config.banner.image),t("title").text(config.title),t("meta[property=og\\:title]").attr("content",config.title),t("meta[name=description]").attr("content",config.description),t("meta[property=og\\:description]").attr("content",config.description),t("meta[name=keywords]").attr("content",config.keywords),t("meta[property=og\\:image]").attr("content",config.og_image),t("meta[property=og\\:url]").attr("content",config.og_url),ga("create","UA-38227997-6","auto"),ga("create","UA-38227997-1","auto",{name:"atouchofgreenLive"}),ga("send","pageview"),ga("atouchofgreenLive.send","pageview"),t(".fb-login-btn").click(function(e){e.stopPropagation(),FB.login(function(e){if(e.authResponse){var o=e.authResponse.accessToken;FB.api("/me",function(e){FB.api("/me/picture?width=50&height=50",function(n){socket.emit("add user",e.name),t(".login-form").removeClass("show"),t(".logout .avatars").attr("src",n.data.url).attr("data-name",e.name),t(".logout").addClass("show"),t.cookie("live-token",o,{expires:7});var a=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(a+1)})})}else alert("取得 Facebook 授權失敗。")},{scope:"user_about_me, user_birthday, user_friends, publish_actions, email"})}),t(".logout").click(function(){t(".logout").removeClass("show"),t(".logout .avatars").attr("src","img/avatars.png").removeAttr("data-name"),t(".login-form").addClass("show"),t.removeCookie("live-token");var e=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(e-1)}),t(".social-group li").click(function(e){e.preventDefault();var o=t(this),n=config.title,a=window.location.href;o.hasClass("fb")&&window.open("https://www.facebook.com/share.php?u="+encodeURI(a),"_blank"),o.hasClass("weibo")&&window.open("http://v.t.sina.com.cn/share/share.php?title="+n+"&url="+a,"_blank"),o.hasClass("twitter")&&window.open("https://twitter.com/share?url="+encodeURI(a)+"&text="+n,"_blank"),o.hasClass("google-plus")&&window.open("https://plus.google.com/share?url="+encodeURI(a),"_blank")})});