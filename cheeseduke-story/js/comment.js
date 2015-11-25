jQuery(function(){
  init_comment();
  // check login status
   $.ajax({
     url: "https://m-denny.fanily.tw/auth/autologin",
     type: "POST",
     datatype: "json",
     async : false,
     xhrFields: {
       withCredentials: true
     }
   }).done(function(output){
       if( output.login ){
           $("#comment-for-login").hide();
           $("#session-login").attr("checked", "checked");
           $("#comment-for-form").show(function(){
             $(this).css("opacity","1");
             $(".comment-form").css("height", "110px");
             $(".comment-list").css("padding-bottom","100px");
           });
       } 
   });
   // fb login
  $('#facebook-login').click(function(e){
  		e.preventDefault();
  		FB.login(function(response) {
  			if (response.authResponse) {
  				window.location.replace('https://www.fanily.tw/auth/fblogin');
  			} else {
  				$('div.error-message').html('<div class="bg-danger">取得 Facebook 授權失敗。</div>');
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
   $('#comment-send').click(function(){
       var content = $('.comment-message').val();
       send_message(content);
   });
   setInterval(get_comment,3000);
});
