var comment_mode = "auto";
var unread_comment = 0;

var MustacheTemplate = (function() {
	return function(id, data, partial) {
		var static_template = $(id).html();
		if (typeof(data) === "undefined") {
			return Mustache.render(static_template);
		} else {
			if (typeof(partial) === "undefined") {
				return Mustache.render(static_template, data);
			} else {
				return Mustache.render(static_template, data, partial);
			}
		}
	};
})();

var loadLiveInfo = function() {
	var now = moment().format("X");
	var start_time = moment(config.start_time).format("X");
	var template = MustacheTemplate('#template-info',{
		'title' : config.info.title,
		'date' : config.info.date,
		'content' : config.info.content,
		'fanily' : config.info.social.fanily,
		'facebook' : config.info.social.facebook,
		'twitter' : config.info.social.twitter,
		'google_plus' : config.info.social.google_plus,
		'weibo' : config.info.social.weibo,
	});
	$('.info-div').append(template).addClass('show').countdown(config.start_time, function(e){
		$('.countdown .date .count').text(e.strftime('%D'));
		$('.countdown .hour .count').text(e.strftime('%H'));
		$('.countdown .min .count').text(e.strftime('%M'));
		$('.countdown .sec .count').text(e.strftime('%S'));
	});

	var countdown_time = (start_time-now) * 1000;
	if(countdown_time !== 0) {
		setTimeout(function(){
			openLive();
		}, countdown_time);
	}
}
var openLive = function() {
	var now = moment().format("X");
	var end_time = moment(config.end_time).format("X");

	appendLive();
	$('.info-div').removeClass('show');
	$('.login-form').addClass('show');
	$('.comment').addClass('show');

	var countdown_time = (end_time-now) * 1000;
	if(countdown_time !== 0) {
		setTimeout(function(){
			closeLive();
		}, countdown_time);
	}
}
var closeLive = function() {
	var now = moment().format("X");
	var close_time = moment(config.close_time).format("X");

	appendLive();
	$('.info-div').removeClass('show');
	$('.login-form').addClass('show');
	$('.comment').addClass('show');

	var countdown_time = (close_time-now) * 1000;
	if(countdown_time !== 0) {
		setTimeout(function(){
			closeChat();
		}, countdown_time);
	}
}
var closeChat = function() {
	$(".live-info .user-btn").hide();
	$(".live-info .logout").hide();
	$('.login-form').removeClass('show');
	$(".add-chat").removeClass('show');
	$(".chat-list").css('padding-bottom',0);
}
var getLiveArticle = function() {
	var articleTemplate = MustacheTemplate('#template-article',{
		title : config.article.title,
		content : config.article.content
	});
	$('.article').append(articleTemplate);


	var castTemplate = MustacheTemplate('#template-cast', {cast:config.cast});
	$('.cast-list ul').append(castTemplate);
}
var getLoginForm = function() {
	var template = MustacheTemplate('#template-login-form',{
		title: config.login_title,
		api : config.api,
		redirect_url : window.location.origin+window.location.pathname
	});
	$('.login-form').append(template);
}
var appendLive = function() {
	var url = 'https://www.youtube.com/embed/'+config.live.id+'?autoplay=1';
	if (config.live.start_time !== '') {
		url += '&start='+config.live.start_time;
	}
	if (config.live.playlist !== '') {
		url += '&loop=1&playlist='+config.live.playlist;
	}
	$('.video-container iframe').attr('src', url);
}
var getCommentNum = function() {
	$.ajax({
		type: "GET",
		url: config.api+'/chatlog/count',
		dataType: 'json'
	}).done(function (output) {
		$(".live-info .comment-btn .num").text(output.count);
	});
}
var appendComment = function(output, from) {
	var comment_num = parseInt($('.comment-btn .num').text(), 10);
	$('.comment-btn .num').text(comment_num + 1);

	if (output.is_img == true) {
		output.message = '<img src="' + output.message + '">'
	} else {
		if (output.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig)) {
			output.message = linkify(output.message);
		}
		output.message = output.message.replace(/\n/g, '<br>')
	}

	var new_comment = MustacheTemplate('#template-new-comment', {
		'avatars': 'https://graph.facebook.com/' + output.uid + '/picture?width=50',
		'display_name': output.display_name,
		'comment': output.message,
		'time' :  moment().format("YYYY-MM-DD HH:mm"),
		'unixtime': output.time
	});

	var is_moderator = false;
	if (from == 'server') {
		if ($.inArray(output.uid, config.moderator_uid) !== -1) {
			is_moderator = true;
		}
	} else {
		if ($.inArray($.cookie('live-uid'), config.moderator_uid) !== -1) {
			is_moderator = true;
		}
	}

	if (is_moderator == true) {
		var $top_comment = $(new_comment).addClass('announce');
		if ($('.comment .announce').length !== 0) {
			$('.comment .announce').remove();
		}
		$('.chat-list').before($top_comment);
		$('.chat-list .mention').removeClass('mention');
	}

	$('.chat-list').append(new_comment);
	if (from !== 'server') {
		comment_mode = 'auto';
	}

	if (comment_mode == 'auto' || $.inArray($.cookie('live-uid'), config.moderator_uid) !== -1) {
		$('.chat-list').stop().animate({
			scrollTop: $('.chat-list').prop("scrollHeight")
		}, 700);

		unread_comment = 0;
		comment_mode = 'auto';
	} else {
		unread_comment++;
		if (unread_comment >= 3) {
			//顯示載入更多的留言
			$('.comment .show-more').css({
				'bottom' : 50,
				'right' : ($('.comment').width() - $('.comment .show-more').width()) / 2
			}).addClass('show');
		}
	}
}

var load_comment_when_scroll = function(timestamp){
  $.ajax({
	url: config.api + "/chatlog?timestamp=" + timestamp,
	dataType: "json",
	type: "GET"
  }).done(function(output){
  	if(output.length > 0) {
	  	var data = [];
		var moderator_lists = [];

		output.reverse();
		$.each(output, function(key, row) {
			var post_time = moment.utc(row.timestamp).local().format("X");
			var show_time = moment.unix(post_time).format("YYYY-MM-DD HH:mm");

			if (row.image !== '') {
				row.message = '<img src="'+row.image+'">';
			} else {
				if (row.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig)) {
					row.message = linkify(row.message);
				}
				row.message = row.message.replace(/\n/g, '<br>');
			}
			data.push({
				'avatars': 'https://graph.facebook.com/'+row.uid+'/picture?width=50',
				'display_name': row.display_name,
				'comment': row.message,
				'time': show_time,
				'unixtime': post_time
			});

			if ($.inArray(row.uid, config.moderator_uid) !== -1) {
				moderator_lists.push({
					'avatars': 'https://graph.facebook.com/'+row.uid+'/picture?width=50',
					'display_name': row.display_name,
					'comment': row.message,
					'time': show_time,
					'unixtime': post_time
				});
			}
		});

		var comment_list = MustacheTemplate('#template-comment-list', {
			list: data
		});
		$(".chat-list").prepend(comment_list).scrollTop(500);
	}
  })
}

var getComment = function(timestamp) {
	// var url = config.api +"/chatlog";
	// if(timestamp !== '') {
	// 	url += '?timestamp='+timestamp;
	// }

	$.ajax({
		type: "GET",
		url: "comment.json",
		dataType: 'json'
	}).done(function(output) {
		if ($.isEmptyObject(output)) {
			return ;
		}

		$(".live-info .comment-btn .num").text(output.length);

		var data = [];
		var moderator_lists = [];
		output.reverse();
		$.each(output, function(key, row) {
			var post_time = moment.utc(row.timestamp).local().format("X");
			var show_time = moment.unix(post_time).format("YYYY-MM-DD HH:mm");

			if (row.image !== '') {
				row.message = '<img src="'+row.image+'">';
			} else {
				if (row.message.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig)) {
					row.message = linkify(row.message);
				}
				row.message = row.message.replace(/\n/g, '<br>');
			}
			data.push({
				'avatars': 'https://graph.facebook.com/'+row.uid+'/picture?width=50',
				'display_name': row.display_name,
				'comment': row.message,
				'time': show_time,
				'unixtime': post_time
			});

			if ($.inArray(row.uid, config.moderator_uid) !== -1) {
				moderator_lists.push({
					'avatars': 'https://graph.facebook.com/'+row.uid+'/picture?width=50',
					'display_name': row.display_name,
					'comment': row.message,
					'time': show_time,
					'unixtime': post_time
				});
			}
		});

		var comment_list = MustacheTemplate('#template-comment-list', {
			list: data
		});
		if(moderator_lists.length > 0) {
			//主持人最新一則留言
			var moderator_comment = MustacheTemplate('#template-new-comment', moderator_lists[moderator_lists.length-1]);
			var $moderator_comment = $(moderator_comment).addClass('announce');
			if ($('.comment .announce').length !== 0) {
				$('.comment .announce').remove();
			}
			$('.chat-list').before($moderator_comment);

		}

		$(".chat-list").append(comment_list);
		$(".chat-list").animate({
			scrollTop: $('.chat-list').prop("scrollHeight")
		}, 1000);
		comment_mode = 'auto';
	});
}

var linkify = function(text) {
	var url = text.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig);
	$.each(url, function(i, v) {
		text = text.replace(v, '<a href="' + v + '" target="_target">' + v + '</a>')
	});
	return text;
}

var mentionSomeone = function(name) {
	var val = $('.add-chat-input').val();
	var mention_string = $('.add-chat-input').attr('data-name');
	if (typeof(mention_string) === "undefined") {
		$('.add-chat-input').attr('data-name', name);
		$('.add-chat-input').val('@' + name + ' ' + val);
	} else {
		var mention_list = mention_string.split(" ");
		if ($.inArray(name, mention_list) == -1) {
			$('.add-chat-input').attr('data-name', mention_string + ' ' + name);
			$('.add-chat-input').val('@' + name + ' ' + val);
		}
	}
}

var unmentionSomeone = function(name) {
	var mention_list = $('.add-chat-input').attr('data-name').split(" ");
	if ($.inArray(name, mention_list) !== -1) {
		var val = $('.add-chat-input').val().replace('@' + name + '', '');

		mention_list = $.grep(mention_list, function(value) {
			return value != name;
		});
		$('.add-chat-input').attr('data-name', mention_list.join(' '));
		$('.add-chat-input').val($.trim(val));
	}
}

var ajax_login = function(accessToken, type) {
	var now = moment().format("X");
	var start_time = moment(config.start_time).format("X");
	var close_time = moment(config.close_time).format("X");
	$.ajax({
		type: "GET",
		url: config.api + '/profile?access_token=' + accessToken,
		dataType: 'json',
		beforeSend : function() {
			$('.fb-login-btn').html('<i class="fa fa-facebook"></i>登入中⋯⋯');
		}
	}).done(function(data) {
		$('.fb-login-btn').html('<i class="fa fa-facebook"></i>登入');
		var avatars = 'https://graph.facebook.com/' + data.uid + '/picture?width=50';

		if (now > start_time && now < close_time) {
			$('.add-chat').addClass('show');
		}
		$('.login-form').removeClass('show');
		$('.logout .avatars').attr('src', avatars).attr('data-name', data.display_name);
		$('.live-info .logout').show();

		var user_num = parseInt($('.user-btn .num').text(), 10);
		$('.user-btn .num').text(user_num + 1);

		$.cookie('live-token', accessToken, {
			expires: 7
		});
		$.cookie('live-fid', data.id, {
			expires: 7
		});
		$.cookie('live-uid', data.uid, {
			expires: 7
		});

		window.history.replaceState({}, document.title ,window.location.pathname);
	}).fail(function(jqXHR, textStatus) {
		if (type == 'autologin') {
			$.removeCookie('live-token');
		}
		alert('取得 Facebook 授權失敗。');
	});
}
