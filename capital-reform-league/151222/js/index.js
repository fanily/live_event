jQuery(function(e){var t=moment().format("X"),o=moment(config.start_time).format("X"),a=moment(config.end_time).format("X"),n=moment(config.close_time).format("X");"undefined"!=typeof e.cookie("live-token")&&ajax_login(e.cookie("live-token"),"autologin"),getLiveArticle(),getLoginForm(),getComment(),o>t?loadLiveInfo():t>a?t>n?closeChat():closeLive():openLive(),-1!==e.inArray(e.cookie("live-uid"),config.moderator_uid)&&e("body").on("click",".chat",function(t){t.stopPropagation();var o=e(this).data("toggled");e(this).data("toggled",!o),o?(unmentionSomeone(e(this).attr("data-name")),e(this).removeClass("mention")):(mentionSomeone(e(this).attr("data-name")),e(this).addClass("mention"))}),e(".add-chat-input").textareaAutoSize(),e("body").on("keypress",".add-chat-input",function(t){return 13==t.which&&t.shiftKey!==!0?(e(".add-chat-btn").click(),!1):void 0}),e(".add-chat-btn").click(function(t){t.stopPropagation();var o=e.trim(e(".add-chat-input").val());""!==o&&(e(this).css("pointer-events","none"),e(".add-chat-input").prop("disabled",!0),socket.emit("new message",{message:o}),appendComment({is_img:!1,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:o},"client"),e(this).css("pointer-events","auto"),e(".add-chat-input").val("").prop("disabled",!1).attr("rows",1).css("height","auto"),e(".emojiPicker").is(":visible")&&e(".emoji-btn").click())}),e(".chat-list .show-more").click(function(t){t.stopPropagation(),e(this).removeClass("show"),e(".chat-list").animate({scrollTop:e(".chat-list").prop("scrollHeight")},1e3)}),e(".chat-list").scroll(function(){e(".chat-list .show-more").hasClass("show")&&e(".chat-list .show-more").removeClass("show")}),e(window).load(function(){var t=window.location.search.substring(1);if(""!==t){var o=t?JSON.parse('{"'+window.location.search.substring(1).replace(/&/g,'","').replace(/=/g,'":"')+'"}',function(e,t){return""===e?t:decodeURIComponent(t)}):{};o.hasOwnProperty("code")&&0!==o.code.length?ajax_login(o.code,"regular"):alert("取得 Facebook 授權失敗。")}e("head").append('<link rel="stylesheet" href="css/jquery.emojipicker.css" type="text/css" />'),e("head").append('<link rel="stylesheet" href="css/jquery.emojipicker.a.css" type="text/css" />'),e(".add-chat-input").emojiPicker({width:"300px",height:"200px",button:!1}),e(".emoji-btn").click(function(t){t.preventDefault(),e(".add-chat-input").emojiPicker("toggle")})}),e(".fb-login-btn").click(function(){e(this).html('<i class="fa fa-facebook"></i>登入中⋯⋯')}),e(".logout").click(function(){e(".logout").removeClass("show"),e(".logout .avatars").attr("src","images/avatars.png").removeAttr("data-name"),e(".login-form").addClass("show"),e.removeCookie("live-token"),e.removeCookie("live-fid"),e.removeCookie("live-uid"),socket.emit("user left");var t=parseInt(e(".user-btn .num").text(),10);e(".user-btn .num").text(t-1)}),socket.on("numUsers",function(t){0==t.numUsers&&"undefined"!=typeof e.cookie("live-token")?e(".live-info .user-btn .num").text(1):e(".live-info .user-btn .num").text(t.numUsers)}),socket.on("new message",function(e){appendComment({is_img:e.message.isImg,uid:e.user.uid,display_name:e.user.display_name,time:moment().format("X"),message:e.message.message},"server")}),socket.on("user joined",function(t){e(".live-info .user-btn .num").text(t.numUsers)}),socket.on("user left",function(t){e(".live-info .user-btn .num").text(t.numUsers)}),e(".upload-btn").click(function(t){t.preventDefault(),t.stopImmediatePropagation(),e("#add-photo-file").click()}),e("#add-photo-file").on("change",function(t){t.preventDefault(),t.stopImmediatePropagation();var o=this.files[0]||!1;if(!o)return!1;if(o.size>8388608)return alert("檔案大小必須小於 8MB。"),!1;if(-1===o.type.indexOf("image"))return alert("您必須上傳圖片類型的檔案。"),!1;var a=function(){return alert("上傳照片失敗。"),!1},n=e(this);return n.val(""),e.get(config.api+"/uploadToken?title="+o.name,{},"json").done(function(t){if(!t)return a(),void 0;var n=new FormData;n.append("AWSAccessKeyId","AKIAIE3JKDD3NVIW67BA"),n.append("acl","public-read"),n.append("key",t.key),n.append("policy",t.policy),n.append("success_action_status","201"),n.append("signature",t.signature),n.append("Cache-Control","max-age=1209600"),n.append("Content-Type",t.contentType),n.append("file",o),e.ajax({url:"https://uploads-fanily-tw.s3.amazonaws.com",data:n,type:"POST",dataType:"xml",contentType:!1,processData:!1}).done(function(t){var o=t.getElementsByTagName("Location")[0].firstChild.nodeValue;o=o.replace(/%2F/g,"/"),appendComment({is_img:!0,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:o},"client"),socket.emit("new message",{message:o,isImg:!0})}).fail(a)}).fail(a),!1})});