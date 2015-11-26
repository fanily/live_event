//comment-web's main function


jQuery(function(){
  init_comment();
  // check login status
  
   $.ajax({
     url: config.status_url,
     type: "POST",
     datatype: "text",
     async : false,
     xhrFields: {
       withCredentials: true
     }
   }).done(function(output){
     console.log(output);
     var result = JSON.parse(output);
     console.log(result);
     if( result.acl ){
           $("#comment-for-login").hide();
           $("#session-login").attr("checked", "checked");
           $("#comment-for-form").show(function(){
             $(this).css("opacity","1");
             $(".comment-form").css("height", "110px");
             $(".comment-list").css("padding-bottom","130px");
           });
       } 
   });

   // login event 
  $('#fblogin').click(function(e){
  		e.preventDefault();
  		FB.login(function(response) {
  			if (response.authResponse) {
            window.location.replace(config.fb_login_url);
  			}
      }, {
  			scope: 'user_about_me, user_birthday, user_friends, publish_actions, email'
  		});
  	});
    $('#login').click(function(){
           var account = $('#account').val();
           var password = $('#password').val();
           normal_login(account, password);
       });

    //events 
    $(document).keypress(function(e){
      if(e.which === 13){
        if( $("#comment-for-login").css("display") === "block" ){
          $("#login").click();
        }else{
          $("#comment-send").click();
        }
      }
    });

   $('#comment-send').click(function(){
     var content = $('.comment-message').val();
     send_message(content);
   });
   setInterval(get_comment,3000);
});
