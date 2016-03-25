jQuery(function($){
	var now = moment().format("X");
	var start_time = moment(config.start_time).format("X");
	var end_time = moment(config.end_time).format("X");
	var close_time = moment(config.close_time).format("X");

	if(typeof($.cookie('live-token')) !== 'undefined' && now <= close_time){
		ajax_login($.cookie('live-token'), 'autologin');
	}

	//init
	getLiveArticle();
	getLoginForm();
	getCommentNum();
	getComment();

	if (now < start_time) {
		//直播尚未開始
		loadLiveInfo();
		appendVideo();
	} else if (now > end_time) {
		//直播已經結束
		closeLive();
		if (now > close_time) {
			//聊天時間已過
			closeChat();
		}
	} else {
		//直播中
		openLive();
	}

	//mention, unmention
	if ($.inArray($.cookie('live-uid'), config.moderator_uid) !== -1){
		$('body').on('click', '.chat', function(e){
			e.stopPropagation();

			var toggled = $(this).data('toggled');
			$(this).data('toggled', !toggled);
			if (!toggled) {
				mentionSomeone($(this).attr('data-name'));
				$(this).addClass('mention');
			} else {
				unmentionSomeone($(this).attr('data-name'));
				$(this).removeClass('mention');
			}
		});
	}

	//訊息輸入框支援 autosize
	$('.add-chat-input').textareaAutoSize();
	//add message
	$('body').on('keypress', '.add-chat-input', function(e){
		//enter 送出， shift+enter 換行
		if(e.which == 13 && e.shiftKey !== true){
			$('.add-chat-btn').click();
			return false;
		}
	});
	$('.add-chat-btn').click(function(e){
		e.stopPropagation();
		var comment = $.trim($('.add-chat-input').val());

		if (comment !== '') {
			$(this).css("pointer-events", "none");
			$('.add-chat-input').prop('disabled', true);

			socket.emit('new message', {
				"message" : comment
			});

			appendComment({
				is_img : false,
				uid : $.cookie('live-uid'),
				display_name : $('.logout .avatars').attr('data-name'),
				time : moment().format("X"),
				message : comment
			}, 'client');

			$(this).css("pointer-events", "auto");
			$('.add-chat-input').val('').prop('disabled', false).attr('rows', 1).css('height','auto');

			if($('.emojiPicker').is(":visible")) {
				$('.emoji-btn').click();
			}
		}
	});

	$('.comment .show-more').click(function(e){
		e.stopPropagation();
		$(this).removeClass('show');
		$('.chat-list').animate({
			scrollTop: $('.chat-list').prop("scrollHeight")
		}, 700);
	});
	$('.chat-list').scroll(function(e){
		if( $(".chat-list").scrollTop() == 0 ){
			load_comment_when_scroll($(".chat").first().attr("data-value"));
		}
		if($('.chat-list').prop("scrollHeight") - $('.chat-list').scrollTop() - $('.chat-list').innerHeight() == 0 ) {
			comment_mode = 'auto';
			if ($('.comment .show-more').hasClass('show')) {
				$('.comment .show-more').removeClass('show');
			}
		} else {
			comment_mode = 'read';
		}
	});

	$(document).ready(function() {
		//取得 API 丟過來的 Facebook Token
        var search = window.location.search.substring(1);
		if( search !== '') {
			var query = search ? JSON.parse('{"' + window.location.search.substring(1).replace(/&/g, '","').replace(/=/g,'":"') + '"}',
	            function(key, value) {
	                return key === "" ? value : decodeURIComponent(value)
	            }
	        ) : {};
	        if (query.hasOwnProperty('code') && query.code.length !== 0) {
	        	ajax_login(query.code, 'regular');
	        } else {
	        	alert('取得 Facebook 授權失敗。');
	        }
		}
    });

	$(window).load(function() {
		//emoji
		$('head').append('<link rel="stylesheet" href="css/jquery.emojipicker.css" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="css/jquery.emojipicker.a.css" type="text/css" />');
		$('.add-chat-input').emojiPicker({
			width: '300px',
			height: '200px',
			button: false
		});
		//emoji click event
		$('.emoji-btn').click(function(e) {
			e.preventDefault();
			$('.add-chat-input').emojiPicker('toggle');
		});
	});

	//登入改按鈕文字
	$('.fb-login-btn').click(function(e) {
		e.stopImmediatePropagation();
		$(this).html('<i class="fa fa-facebook"></i>登入中⋯⋯');
	});

	//登出
	$('.logout').click(function(e){
		$('.live-info .logout').hide();
		$('.logout .avatars').attr('src', 'images/avatars.png').removeAttr('data-name');
		$('.fb-login-btn').show();
		$('.login-form').addClass('show');

		$.removeCookie('live-token');
		$.removeCookie('live-fid');
		$.removeCookie('live-uid');
		socket.emit('user left');

		var user_num = parseInt($('.user-btn .num').text(), 10);
		$('.user-btn .num').text(user_num - 1);
	});

	//接收 server 丟出來的 event
	socket.on('numUsers', function(output){
		if (output.numUsers == 0 && typeof($.cookie('live-token')) !== 'undefined') {
			$(".live-info .user-btn .num").text(1);
		} else {
			$(".live-info .user-btn .num").text(output.numUsers);
		}
	});
	socket.on('new message', function(output){
		appendComment({
			is_img : output.message.isImg,
			uid : output.user.uid,
			display_name : output.user.display_name,
			time : moment().format("X"),
			message : output.message.message
		}, 'server');
	});
	socket.on('user joined', function(output){
		$(".live-info .user-btn .num").text(output.numUsers);
	});
	socket.on('user left', function(output){
		$(".live-info .user-btn .num").text(output.numUsers);
	});

	//上傳圖片
	$('.upload-btn').click(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		$('#add-photo-file').click();
	});
	$('#add-photo-file').on('change', function(e) {
	  e.preventDefault();
	  e.stopImmediatePropagation();
	  var file = this.files[0] || false;
	  if(!file) {
		return false;
	  }
	  if(file.size > 8 * 1024 * 1024) {
		alert('檔案大小必須小於 8MB。');
		return false;
	  }
	  if(file.type.indexOf('image') === -1) {
		alert('您必須上傳圖片類型的檔案。');
		return false;
	  }
	  var fail = function (jqXHR, textStatus) {
		alert('上傳照片失敗。');
		return false;
	  };
	  var obj = $(this);
	  obj.val('');
	  $.get(config.api+'/uploadToken?title=' + file.name, {}, 'json').done(function(fields){
		if (!fields) {
		  fail();
		  return;
		}
		var data = new FormData();
		data.append('AWSAccessKeyId', 'AKIAIE3JKDD3NVIW67BA');
		data.append('acl', 'public-read');
		data.append('key', fields.key);
		data.append('policy', fields.policy);
		data.append('success_action_status', '201');
		data.append('signature', fields.signature);
		data.append('Cache-Control', 'max-age=1209600');
		data.append('Content-Type', fields.contentType);
		data.append('file', file);
		$.ajax({
		  url: 'https://uploads-fanily-tw.s3.amazonaws.com',
		  data: data,
		  type: 'POST',
		  dataType: 'xml',
		  contentType: false,
		  processData: false
		}).done(function(output){
		  var url = output.getElementsByTagName('Location')[0].firstChild.nodeValue;
		  url = url.replace(/%2F/g, '/');

		  appendComment({
			is_img : true,
			uid : $.cookie('live-uid'),
			display_name : $('.logout .avatars').attr('data-name'),
			time : moment().format("X"),
			message : url
		  }, 'client');

		  socket.emit('new message', {
			"message" : url,
			"isImg" : true
		  });
		}).fail(fail);
	  }).fail(fail);
	  return false;
	});
});