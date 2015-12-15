jQuery(function(t){var e=function(){return function(e,a,n){var o=t(e).html();return"undefined"==typeof a?Mustache.render(o):"undefined"==typeof n?Mustache.render(o,a):Mustache.render(o,a,n)}}(),a=function(e){var a=e.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi);return t.each(a,function(t,a){e=e.replace(a,'<a href="'+a+'" target="_target">'+a+"</a>")}),e},n=!1,o=function(o,i){var r=moment().format("X"),s=config.api+"/chatlog";""!==o&&(s+="?timestamp="+o),n=!0,t.ajax({type:"GET",url:s,dataType:"json"}).done(function(s){if(t.isEmptyObject(s))return n=!1,void 0;var c=[];s.reverse(),t.each(s,function(t,e){var n=moment.utc(e.timestamp).local().format("X");""!==e.image?e.message='<img src="'+e.image+'">':(e.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(e.message=a(e.message)),e.message=e.message.replace(/\n/g,"<br>")),c.push({avatars:"https://graph.facebook.com/"+e.uid+"/picture?width=50",display_name:e.display_name,comment:e.message,time:Math.ceil((r-n)/60),unixtime:n})});var m=e("#template-comment-list",{list:c});"history"==i?t(".chat-list").prepend(m):t(".chat-list").append(m),""==o&&t(".chat-list").animate({scrollTop:t(".chat-list").prop("scrollHeight")},1e3),n=!1})},i=function(){var e=moment().format("X");t(".chat-list .chat").each(function(a){var n=Math.ceil((e-t(this).attr("data-value"))/60);t(".chat:eq("+a+")").find(".post-at .num").text(n),t(".chat:eq("+a+")").find(".post-at .unit").text("分鐘前")})},r=function(e){var a=t(".add-chat-input").val(),n=t(".add-chat-input").attr("data-name");if("undefined"==typeof n)t(".add-chat-input").attr("data-name",e),t(".add-chat-input").val("@"+e+" "+a);else{var o=n.split(" ");-1==t.inArray(e,o)&&(t(".add-chat-input").attr("data-name",n+" "+e),t(".add-chat-input").val("@"+e+" "+a))}},s=function(e){var a=t(".add-chat-input").attr("data-name").split(" ");if(-1!==t.inArray(e,a)){var n=t(".add-chat-input").val().replace("@"+e,"");a=t.grep(a,function(t){return t!=e}),t(".add-chat-input").attr("data-name",a.join(" ")),t(".add-chat-input").val(t.trim(n))}},c=function(t,e,a){var n=window.open(t,e),o=window.setInterval(function(){try{(null==n||n.closed)&&(window.clearInterval(o),a(n))}catch(t){}},1e3);return n};if("undefined"!=typeof t.cookie("live-token")){var m=t.cookie("live-token");t.ajax({type:"GET",url:config.api+"/profile?access_token="+m,dataType:"json"}).done(function(e){var a="https://graph.facebook.com/"+e.uid+"/picture?width=50";d.emit("add user",{provider:"FB",id:e.id,uid:e.uid,display_name:e.display_name}),t(".login-form").removeClass("show"),t(".add-chat").addClass("show"),t(".logout .avatars").attr("src",a).attr("data-name",e.display_name),t(".logout").addClass("show");var n=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(n+1),t.cookie("live-token",m,{expires:7}),t.cookie("live-fid",e.id,{expires:7}),t.cookie("live-uid",e.uid,{expires:7})}).fail(function(){t.removeCookie("live-token"),alert("取得 Facebook 授權失敗。")})}if(moment().format("X")<=moment(config.start_time).format("X")){t(".login-form").remove(),t(".comment").remove();var l=e("#template-info",{title:config.info.title,date:config.info.date,content:config.info.content,is_end:!1,fanily:config.info.social.fanily,facebook:config.info.social.facebook,twitter:config.info.social.twitter,google_plus:config.info.social.google_plus,weibo:config.info.social.weibo});t(".info-div").append(l).addClass("show").countdown(config.start_time,function(e){t(".countdown .date .count").text(e.strftime("%D")),t(".countdown .hour .count").text(e.strftime("%H")),t(".countdown .min .count").text(e.strftime("%M")),t(".countdown .sec .count").text(e.strftime("%S"))})}else moment().format("X")>=moment(config.end_time).format("X")?(t(".login-form").remove(),t(".info-div").remove()):(t(".info-div").remove(),t("body").on("keypress",".add-chat-input",function(e){return 13==e.which&&e.shiftKey!==!0?(t(".add-chat-btn").click(),!1):void 0}),-1!==t.inArray(t.cookie("live-uid"),config.moderator_uid)&&t("body").on("click",".chat",function(e){e.stopPropagation();var a=t(this).data("toggled");t(this).data("toggled",!a),a?(s(t(this).attr("data-name")),t(this).removeClass("mention")):(r(t(this).attr("data-name")),t(this).addClass("mention"))}),t(".add-chat-input").textareaAutoSize().emojiPicker({width:"300px",height:"200px",button:!1}),t(".emoji-btn").click(function(e){e.preventDefault(),t(".add-chat-input").emojiPicker("toggle")}),t(".add-chat-btn").click(function(n){n.stopPropagation();var o=t.trim(t(".add-chat-input").val());if(""!==o){t(this).css("pointer-events","none"),t(".add-chat-input").prop("disabled",!0);var i=parseInt(t(".comment-btn .num").text(),10);t(".comment-btn .num").text(i+1),d.emit("new message",{message:o}),o.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(o=a(o));var r=e("#template-new-comment",{avatars:t(".logout .avatars").attr("src"),display_name:t(".logout .avatars").attr("data-name"),comment:o.replace(/\n/g,"<br>"),unixtime:moment().format("X")});if(-1!==t.inArray(t.cookie("live-uid"),config.moderator_uid)){var s=t(r).addClass("announce");0!==t(".comment .announce").length&&t(".comment .announce").remove(),t(".chat-list").before(s),t(".chat-list .mention").removeClass("mention")}t(".chat-list").append(r).animate({scrollTop:t(".chat-list").prop("scrollHeight")},1e3),t(this).css("pointer-events","auto"),t(".add-chat-input").val("").prop("disabled",!1).attr("rows",1).css("height","auto")}}));t(".live-title").find("h1").html(config.title),t(".live-title").find("h2").html(config.description),window.matchMedia("screen and (max-width: 480px)").matches&&(insert="《一把青》<br>全球首航特映會",t(".live-title h1").html(insert),t(".live-title h2").hide()),window.matchMedia("screen and (max-width: 990px)").matches&&t(".banner").hide(),t(".video-container").find("iframe").attr("src","https://www.youtube.com/embed/"+config.video_id+"?autoplay=1"),t(".banner").find("a").attr("href",config.banner.link),t(".banner").find("img").attr("src",config.banner.image),t("title").text(config.title),t("meta[property=og\\:title]").attr("content",config.title),t("meta[name=description]").attr("content",config.description),t("meta[property=og\\:description]").attr("content",config.description),t("meta[name=keywords]").attr("content",config.keywords),t("meta[property=og\\:image]").attr("content",config.og_image),t("meta[property=og\\:url]").attr("content",config.og_url),ga("create","UA-38227997-6","auto"),ga("create","UA-38227997-1","auto",{name:"atouchofgreenLive"}),ga("send","pageview"),ga("atouchofgreenLive.send","pageview");var d=io.connect(config.api_socket);d.emit("get numUsers"),o("","lastest"),t.ajax({type:"GET",url:config.api+"/chatlog/count",dataType:"json"}).done(function(e){t(".live-info .comment-btn .num").text(e.count)}),t(".chat-list").scroll(function(){if(0==t(".chat-list").scrollTop()&&0==n){var e=t(".chat-list .chat").first().attr("data-value");"undefined"==typeof e&&(e=""),o(e,"history")}}),t(".fb-login-btn").click(function(e){e.stopPropagation(),c(config.api+"/auth/facebook","_blank",function(){setTimeout(function(){"undefined"==typeof t.cookie("live-token")&&alert("取得 Facebook 授權失敗。")},2e3)})}),t(".logout").click(function(){t(".logout").removeClass("show"),t(".logout .avatars").attr("src","images/avatars.png").removeAttr("data-name"),t(".login-form").addClass("show"),t.removeCookie("live-token"),t.removeCookie("live-fid"),t.removeCookie("live-uid"),d.emit("user left");var e=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(e-1)}),t(".social-group li").click(function(e){e.preventDefault();var a=t(this),n=config.title,o=window.location.href;a.hasClass("fb")&&window.open("https://www.facebook.com/share.php?u="+encodeURI(o),"_blank"),a.hasClass("weibo")&&window.open("http://v.t.sina.com.cn/share/share.php?title="+n+"&url="+o,"_blank"),a.hasClass("twitter")&&window.open("https://twitter.com/share?url="+encodeURI(o)+"&text="+n,"_blank"),a.hasClass("google-plus")&&window.open("https://plus.google.com/share?url="+encodeURI(o),"_blank")}),d.on("numUsers",function(e){0==e.numUsers&&"undefined"!=typeof t.cookie("live-token")?t(".live-info .user-btn .num").text(1):t(".live-info .user-btn .num").text(e.numUsers)}),d.on("new message",function(n){var o=parseInt(t(".comment-btn .num").text(),10);t(".comment-btn .num").text(o+1),1==n.message.isImg?n.message.message='<img src="'+n.message.message+'">':(n.message.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/gi)&&(n.message.message=a(n.message.message)),n.message.message=n.message.message.replace(/\n/g,"<br>"));var i=e("#template-new-comment",{avatars:"https://graph.facebook.com/"+n.user.uid+"/picture?width=50",display_name:n.user.display_name,comment:n.message.message,unixtime:moment().format("X")});if(-1!==t.inArray(n.user.uid,config.moderator_uid)){var r=t(i).addClass("announce");0!==t(".comment .announce").length&&t(".comment .announce").remove(),t(".chat-list").before(r)}t(".chat-list").append(i).animate({scrollTop:t(".chat-list").prop("scrollHeight")},1e3)}),d.on("user joined",function(e){t(".live-info .user-btn .num").text(e.numUsers)}),d.on("user left",function(e){t(".live-info .user-btn .num").text(e.numUsers)}),window.addEventListener("message",function(e){if(e.origin===config.api){var a=e.data;t.ajax({type:"GET",url:config.api+"/profile?access_token="+a,dataType:"json"}).done(function(e){var n="https://graph.facebook.com/"+e.uid+"/picture?width=50";d.emit("add user",{provider:"FB",id:e.id,uid:e.uid,display_name:e.display_name}),t(".add-chat").addClass("show"),t(".login-form").removeClass("show"),t(".logout .avatars").attr("src",n).attr("data-name",e.display_name),t(".logout").addClass("show");var o=parseInt(t(".user-btn .num").text(),10);t(".user-btn .num").text(o+1),t.cookie("live-token",a,{expires:7}),t.cookie("live-fid",e.id,{expires:7}),t.cookie("live-uid",e.uid,{expires:7})}).fail(function(){alert("取得 Facebook 授權失敗。")})}},!1),setInterval(function(){i()},6e4),t(".upload-btn").click(function(e){e.preventDefault(),e.stopImmediatePropagation(),t("#add-photo-file").click()}),t("#add-photo-file").on("change",function(a){a.preventDefault(),a.stopImmediatePropagation();var n=this.files[0]||!1;if(!n)return!1;if(n.size>8388608)return alert("檔案大小必須小於 8MB。"),!1;if(-1===n.type.indexOf("image"))return alert("您必須上傳圖片類型的檔案。"),!1;var o=function(){return alert("上傳照片失敗。"),!1},i=t(this);return i.val(""),t.get(config.api+"/uploadToken?title="+n.name,{},"json").done(function(a){if(!a)return o(),void 0;var i=new FormData;i.append("AWSAccessKeyId","AKIAIE3JKDD3NVIW67BA"),i.append("acl","public-read"),i.append("key",a.key),i.append("policy",a.policy),i.append("success_action_status","201"),i.append("signature",a.signature),i.append("Cache-Control","max-age=1209600"),i.append("Content-Type",a.contentType),i.append("file",n),t.ajax({url:"https://uploads-fanily-tw.s3.amazonaws.com",data:i,type:"POST",dataType:"xml",contentType:!1,processData:!1}).done(function(a){var n=a.getElementsByTagName("Location")[0].firstChild.nodeValue;n=n.replace(/%2F/g,"/");var o=parseInt(t(".comment-btn .num").text(),10);t(".comment-btn .num").text(o+1);var i=e("#template-new-comment",{avatars:t(".logout .avatars").attr("src"),display_name:t(".logout .avatars").attr("data-name"),comment:'<img src="'+n+'">',unixtime:moment().format("X")});if(d.emit("new message",{message:n,isImg:!0}),-1!==t.inArray(t.cookie("live-uid"),config.moderator_uid)){var r=t(i).addClass("announce");0!==t(".comment .announce").length&&t(".comment .announce").remove(),t(".chat-list").before(r),t(".chat-list .mention").removeClass("mention")}t(".chat-list").append(i).animate({scrollTop:t(".chat-list").prop("scrollHeight")},1e3)}).fail(o)}).fail(o),!1})});