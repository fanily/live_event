var linkify = function(text){
	var url = text.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig);
	$.each(url , function(i , v){
		text = text.replace(v, '<a href="' + v + '" target="_target">' + v + '</a>')
	});
return text;
}

var get_comment = function(offset){
  //set default value for offset
  offset = typeof offset !== undefined ? 0 : offset;
  var api_url = config.get_comment_url + offset.toString();
  //get comment using ajax
  $.ajax({
    url: api_url,
    type: "GET",
    dataType: "text",
  }).done(function(output){
    // render comment
    // comment flag === false if there are the same comment out there
    var comment_list = JSON.parse(output);
    var last_comment = $(".comment-list .comment").last().find(".id").text();
    var comment_flag = false;
    var same_comment = 0;
    //check if there are the same comments in the comment list
    for( var key in comment_list ){
      var current_comment = comment_list[key];
      if( comment_list[key].id  === last_comment && comment_flag === false ){
          same_comment = parseInt(key);
          comment_flag = true;
      }
    }
    if( comment_flag === true && same_comment != 19 ){
       for( var i = same_comment+1; i <= 19 ; ++i ){
            var comment = $("#comment-template").clone();
            var c = comment_list[i]
            if(c.comment_avatar === '') {
              c.comment_avatar = 'https://www.fanily.tw/img/g_avatars.png';
            }
            c.date = moment.unix(c.comment_date).format('HH:mm');
            c.comment_content = c.comment_content.replace(/\n/g, '<br>');

            comment.find(".id").text(c.id);
            comment.find(".avatars").attr("src", c.comment_avatar);
            comment.find(".comment-author").text(c.comment_author);
            comment.find(".date").text(c.date);
						if( c.comment_content.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig)){
            	comment.find("p").html(linkify(c.comment_content));
						}else{
						 	comment.find("p").html(c.comment_content);
						}
            comment.attr("id", "");
            $(".comment-list").append(comment);
            comment.fadeIn(50);
            $(window).scrollTop($(document).height()+100);
       }
    }
  });
}

var init_comment = function(){
  var api_url = config.init_commet_url;
  $.ajax({
    url:api_url,
    type:"GET",
    dataType:"text"
  }).done(function(output){
      var comment_list = JSON.parse(output);
      for( var i = 0; i <= 19 ; i++ ){
          var comment = $("#comment-template").clone();
          var c = comment_list[i]
          if(c.comment_avatar === '') {
            c.comment_avatar = 'https://www.fanily.tw/img/g_avatars.png';
          }
          c.date = moment.unix(c.comment_date).format('HH:mm');
          c.comment_content = c.comment_content.replace(/\n/g, '<br>');

          comment.find(".id").text(c.id);
          comment.find(".avatars").attr("src", c.comment_avatar);
          comment.find(".comment-author").text(c.comment_author);
          comment.find(".date").text(c.date);
    			if( c.comment_content.match(/(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig)){
          	comment.find("p").html(linkify(c.comment_content));
					}else{
						comment.find("p").html(c.comment_content);
					}
          $(".comment-list").append(comment);
          comment.attr("id", "");
          comment.fadeIn(50);
        }
      $(window).scrollTop($(document).height()+100);
  });
}

var normal_login = function(account , password){
  if( account === "" ){
    alert('請輸入帳號');
    return;

  }else if (password == '') {
    alert('請輸入密碼');
    return;

  }else{
    $.ajax({
      type:"POST",
      data:{"account":account , "password":password},
      dataType:"json",
      url: config.login_url,
      xhrFields: {
       withCredentials: true
      }
    }).done(function(){
      window.location.reload();
    }).fail(function(){
      alert("登入失敗，請稍候再試");
    })
  }
}

var send_message = function(content){
  if (content == '') {
      alert('請輸入回應內容');
      return ;
  }
  $.ajax({
    url:config.send_url,
    data:{"message":content},
    type:"POST",
    xhrFields: {
       withCredentials: true
     },
     beforeSend : function() {
        $('#comment-send').attr('disabled', true);
        $(".comment-message").val('').prop('disabled', true).attr('rows', 1).css({'height':'auto'});
      }
  }).done(function(){
    $('#comment-send').attr('disabled', false);
    $(".comment-message").prop('disabled', false);
    get_comment();
  });

}


