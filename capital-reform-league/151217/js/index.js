jQuery(function(e){var t=moment().format("X"),n=moment(config.start_time).format("X"),o=moment(config.end_time).format("X");"undefined"!=typeof e.cookie("live-token")&&ajax_login(e.cookie("live-token"),"autologin"),getLiveArticle(),getLoginForm(),getComment(),n>=t?(getLiveInfo(),e(".comment").hide(),e(".info-div").on("finish.countdown",function(){window.location.reload()}),e(".hide-countdown").on("finish.countdown",function(){appendLive()})):t>=o?(e(".info-div").hide(),e(".live-info .user-btn").hide(),appendLive()):(appendLive(),e(".info-div").hide(),e(".login-form").addClass("show"),-1!==e.inArray(e.cookie("live-uid"),config.moderator_uid)&&e("body").on("click",".chat",function(t){t.stopPropagation();var n=e(this).data("toggled");e(this).data("toggled",!n),n?(unmentionSomeone(e(this).attr("data-name")),e(this).removeClass("mention")):(mentionSomeone(e(this).attr("data-name")),e(this).addClass("mention"))}),e("body").on("keypress",".add-chat-input",function(t){return 13==t.which&&t.shiftKey!==!0?(e(".add-chat-btn").click(),!1):void 0}),e(".add-chat-input").textareaAutoSize().emojiPicker({width:"300px",height:"200px",button:!1}),e(".emoji-btn").click(function(t){t.preventDefault(),e(".add-chat-input").emojiPicker("toggle")}),e(".add-chat-btn").click(function(t){t.stopPropagation();var n=e.trim(e(".add-chat-input").val());""!==n&&(e(this).css("pointer-events","none"),e(".add-chat-input").prop("disabled",!0),socket.emit("new message",{message:n}),appendComment({is_img:!1,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:n},"client"),e(this).css("pointer-events","auto"),e(".add-chat-input").val("").prop("disabled",!1).attr("rows",1).css("height","auto"))}),e(".hide-countdown").countdown(config.end_time,function(t){e(".hide-countdown").text(t.strftime("%D-%H:%M:%S"))}),e(".hide-countdown").on("finish.countdown",function(){window.location.reload()})),e(window).load(function(){var e=window.location.search.substring(1);if(""!==e){var t=e?JSON.parse('{"'+window.location.search.substring(1).replace(/&/g,'","').replace(/=/g,'":"')+'"}',function(e,t){return""===e?t:decodeURIComponent(t)}):{};t.hasOwnProperty("code")&&0!==t.code.length?(window.location.search="",ajax_login(t.code,"regular")):alert("取得 Facebook 授權失敗。")}}),e(".logout").click(function(){e(".logout").removeClass("show"),e(".logout .avatars").attr("src","images/avatars.png").removeAttr("data-name"),e(".login-form").addClass("show"),e.removeCookie("live-token"),e.removeCookie("live-fid"),e.removeCookie("live-uid"),socket.emit("user left");var t=parseInt(e(".user-btn .num").text(),10);e(".user-btn .num").text(t-1)}),socket.on("numUsers",function(t){0==t.numUsers&&"undefined"!=typeof e.cookie("live-token")?e(".live-info .user-btn .num").text(1):e(".live-info .user-btn .num").text(t.numUsers)}),socket.on("new message",function(e){appendComment({is_img:e.message.isImg,uid:e.user.uid,display_name:e.user.display_name,time:moment().format("X"),message:e.message.message},"server")}),socket.on("user joined",function(t){e(".live-info .user-btn .num").text(t.numUsers)}),socket.on("user left",function(t){e(".live-info .user-btn .num").text(t.numUsers)}),t>=n&&o>=t&&setInterval(function(){updateComment()},6e4),e(".upload-btn").click(function(t){t.preventDefault(),t.stopImmediatePropagation(),e("#add-photo-file").click()}),e("#add-photo-file").on("change",function(t){t.preventDefault(),t.stopImmediatePropagation();var n=this.files[0]||!1;if(!n)return!1;if(n.size>8388608)return alert("檔案大小必須小於 8MB。"),!1;if(-1===n.type.indexOf("image"))return alert("您必須上傳圖片類型的檔案。"),!1;var o=function(){return alert("上傳照片失敗。"),!1},i=e(this);return i.val(""),e.get(config.api+"/uploadToken?title="+n.name,{},"json").done(function(t){if(!t)return o(),void 0;var i=new FormData;i.append("AWSAccessKeyId","AKIAIE3JKDD3NVIW67BA"),i.append("acl","public-read"),i.append("key",t.key),i.append("policy",t.policy),i.append("success_action_status","201"),i.append("signature",t.signature),i.append("Cache-Control","max-age=1209600"),i.append("Content-Type",t.contentType),i.append("file",n),e.ajax({url:"https://uploads-fanily-tw.s3.amazonaws.com",data:i,type:"POST",dataType:"xml",contentType:!1,processData:!1}).done(function(t){var n=t.getElementsByTagName("Location")[0].firstChild.nodeValue;n=n.replace(/%2F/g,"/"),appendComment({is_img:!0,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:n},"client"),socket.emit("new message",{message:n,isImg:!0})}).fail(o)}).fail(o),!1})});