jQuery(function(e){var t=moment().format("X"),a=moment(config.start_time).format("X"),o=moment(config.end_time).format("X"),i=moment(config.close_time).format("X");getLiveArticle(),getLoginForm(),getComment(),a>t?loadLiveInfo():t>o?t>i?closeChat():closeLive():openLive(),-1!==e.inArray(e.cookie("live-uid"),config.moderator_uid)&&e("body").on("click",".chat",function(t){t.stopPropagation();var a=e(this).data("toggled");e(this).data("toggled",!a),a?(unmentionSomeone(e(this).attr("data-name")),e(this).removeClass("mention")):(mentionSomeone(e(this).attr("data-name")),e(this).addClass("mention"))}),e(".add-chat-input").textareaAutoSize(),e("body").on("keypress",".add-chat-input",function(t){return 13==t.which&&t.shiftKey!==!0?(e(".add-chat-btn").click(),!1):void 0}),e(".add-chat-btn").click(function(t){t.stopPropagation();var a=e.trim(e(".add-chat-input").val());""!==a&&(e(this).css("pointer-events","none"),e(".add-chat-input").prop("disabled",!0),appendComment({is_img:!1,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:a},"client"),e(this).css("pointer-events","auto"),e(".add-chat-input").val("").prop("disabled",!1).attr("rows",1).css("height","auto"),e(".emojiPicker").is(":visible")&&e(".emoji-btn").click())}),e(".chat-list .show-more").click(function(t){t.stopPropagation(),e(this).removeClass("show"),e(".chat-list").animate({scrollTop:e(".chat-list").prop("scrollHeight")},1e3)}),e(".chat-list").scroll(function(){e(".chat-list .show-more").hasClass("show")&&e(".chat-list .show-more").removeClass("show")}),e(window).load(function(){var t=window.location.search.substring(1);if(""!==t){var a=t?JSON.parse('{"'+window.location.search.substring(1).replace(/&/g,'","').replace(/=/g,'":"')+'"}',function(e,t){return""===e?t:decodeURIComponent(t)}):{};a.hasOwnProperty("code")&&0!==a.code.length?ajax_login(a.code,"regular"):alert("取得 Facebook 授權失敗。")}e("head").append('<link rel="stylesheet" href="css/jquery.emojipicker.css" type="text/css" />'),e("head").append('<link rel="stylesheet" href="css/jquery.emojipicker.a.css" type="text/css" />'),e(".add-chat-input").emojiPicker({width:"300px",height:"200px",button:!1}),e(".emoji-btn").click(function(t){t.preventDefault(),e(".add-chat-input").emojiPicker("toggle")})}),e(".fb-login-btn").click(function(){e(this).html('<i class="fa fa-facebook"></i>登入中⋯⋯')}),e(".logout").click(function(){e(".live-info .logout").hide(),e(".logout .avatars").attr("src","images/avatars.png").removeAttr("data-name"),e(".login-form").addClass("show"),e.removeCookie("live-token"),e.removeCookie("live-fid"),e.removeCookie("live-uid");var t=parseInt(e(".user-btn .num").text(),10);e(".user-btn .num").text(t-1)}),e(".upload-btn").click(function(t){t.preventDefault(),t.stopImmediatePropagation(),e("#add-photo-file").click()}),e("#add-photo-file").on("change",function(t){t.preventDefault(),t.stopImmediatePropagation();var a=this.files[0]||!1;if(!a)return!1;if(a.size>8388608)return alert("檔案大小必須小於 8MB。"),!1;if(-1===a.type.indexOf("image"))return alert("您必須上傳圖片類型的檔案。"),!1;var o=function(){return alert("上傳照片失敗。"),!1},i=e(this);return i.val(""),e.get(config.api+"/uploadToken?title="+a.name,{},"json").done(function(t){if(!t)return o(),void 0;var i=new FormData;i.append("AWSAccessKeyId","AKIAIE3JKDD3NVIW67BA"),i.append("acl","public-read"),i.append("key",t.key),i.append("policy",t.policy),i.append("success_action_status","201"),i.append("signature",t.signature),i.append("Cache-Control","max-age=1209600"),i.append("Content-Type",t.contentType),i.append("file",a),e.ajax({url:"https://uploads-fanily-tw.s3.amazonaws.com",data:i,type:"POST",dataType:"xml",contentType:!1,processData:!1}).done(function(t){var a=t.getElementsByTagName("Location")[0].firstChild.nodeValue;a=a.replace(/%2F/g,"/"),appendComment({is_img:!0,uid:e.cookie("live-uid"),display_name:e(".logout .avatars").attr("data-name"),time:moment().format("X"),message:a},"client")}).fail(o)}).fail(o),!1})});