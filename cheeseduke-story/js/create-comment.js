var get_comment = function(offset){
  //set default value for offset
  offset = typeof offset !== undefined ? 0 : offset;
  var api_url = "https://denny.fanily.tw/post/11e58e954b72daf4ac5d42010af020f7/comment?offset=" + offset.toString();

  //get comment using ajax 
  $.ajax({
    url: api_url,
    type: "GET",
    dataType: "text"
  }).done(function(output){
    //render comment  
    var comment_list = Json.parse(output);
    var last_comment = $(".comment-list").last().find(".id").text();
    var comment_flag = false;
    var same_comment = 0;
    //check if there are the same comments in the comment list 
    for( var key in comment_list ){
      var current_comment = comment_list[key];
      if( comment_list[key].id i === last_comment && comment_flag === false ){
          same_comment = key;
          comment_flag = true;
      }
    }
    if( comment_flag === true ){
        for( var i = same_comment; i < 19 ; i++ ){
          var comment = $("#comment-template").clone();
          comment.find(".id").text(comment_list[i].id);
          comment.find(".author img").attr("src", comment_list[i].comment_avatar);
          comment.find(".author span").text(comment_list[i].comment_author);
          comment.find("p").text(comment_list[i].comment_content);
          comment.find(".date").text(comment_list[i].show_date);
          comment.show();
          $(".comment-list").append(comment);
        }
    }else{
        for( var i = 0; i < 19 ; i++ ){
          var comment = $("#comment-template").clone();
          comment.find(".id").text(comment_list[i].id);
          comment.find(".author img").attr("src", comment_list[i].comment_avatar);
          comment.find(".author span").text(comment_list[i].comment_author);
          comment.find("p").text(comment_list[i].comment_content);
          comment.find(".date").text(comment_list[i].show_date);
          comment.show();
          $(".comment-list").append(comment);
        }
    }
  });  
}

var fb_login = function(){

}


(function(window, undefined){
    var $ = window.jQuery
      , commentCache = {}
      , commentList = []
      , nextOffset = ''
      , firstID = ''
      , authToken = ''
      , loginfb = function(){
        var link = 'http://comment-api.fanily.com.tw/fb?return_url=' + encodeURIComponent(window.top.location);
        window.top.location.href = link;
      }
      , login = function(account, password) {
            if (account == '') {
                alert('請輸入帳號');
                return;
            }
            if (password == '') {
                alert('請輸入密碼');
                return;
            }
              $.post('https://denny.fanily.tw/auth/login',
                {account: account, password: password}).done(function(data){
                    console.log(data);
                    if (data.error) {
                        alert('系統錯誤');
                        return;
                    }
                    authToken = data.token;
                    $('#comment-for-home label').attr('for', 'section-control-form');
                    $('#section-control-form').click();
                }).fail(function(){
                    alert('帳號密碼錯誤');
                    $('#password').val('');
                });
        }
      , send = function(content) {
            if (content == '') {
                alert('請輸入回應內容');
                return ;
            }
            $.post('http://comment-api.fanily.com.tw/comment', {
                content:content,
                token: authToken,
                video_id: window.videoId}).done(function(data){
                    if (data.token) {
                        authToken = data.token;
                    }
                $('.comment-message').val('');
                $(window).scrollTop();
                $('#section-control-home').click();
            });
        }
      ;
    (function(){
        $('input[name="section-control"]:radio').change(function() {
            var id = $('input[name="section-control"]:checked').attr("id");
            if (id == 'section-control-home') {
                $('.comment-form').css('height', '50px');
                $('.comment-list').css('padding-button', '40px');
                $('#account').val('');
                $('#password').val('');
            } else if (id == 'section-control-login') {
                //$('.comment-form').css('height', '110px');
                //$('.comment-list').css('padding-button', '100px');
                $('#account').focus();
            } else if (id == 'section-control-form') {
                $('.comment-form').css('height', '100px');
                $('.comment-list').css('padding-button', '100px');
            }
        });
        $('#fblogin').click(function(){
            loginfb();
        });
        $('#login').click(function(){
            var account = $('#account').val();
            var password = $('#password').val();
            login(account, password);
        });
        $('#comment-send').click(function(){
            var content = $('.comment-message').val();
            send(content);
        });
        setTimeout(function(){
            getComment('', function(data){
                if (data.offset != '') {
                    getComment(data.offset, arguments.callee);
                }
            });
            setTimeout(arguments.callee, 3000);
        }, 3000);
    });
    
})(this);

