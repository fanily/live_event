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
          console.log(same_comment);
      }
    }
    if( comment_flag === true && same_comment != 19 ){
       for( var i = same_comment+1; i <= 19 ; ++i ){
            var comment = $("#comment-template").clone();
            comment.find(".id").text(comment_list[i].id);
            comment.find(".author img").attr("src", comment_list[i].comment_avatar);
            comment.find(".author span").text(comment_list[i].comment_author);
            comment.find("p").text(comment_list[i].comment_content);
            comment.find(".date").text(comment_list[i].show_date);
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
          comment.find(".id").text(comment_list[i].id);
          comment.find(".author img").attr("src", comment_list[i].comment_avatar);
          comment.find(".author span").text(comment_list[i].comment_author);
          comment.find("p").text(comment_list[i].comment_content);
          comment.find(".date").text(comment_list[i].show_date);
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
     }
  }).done(function(){
    $(".comment-message").val("");
    get_comment();
  });
  
}


