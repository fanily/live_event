(function(window, undefined){
    var $ = window.jQuery
      , getComment = function(offset, callback){
            var api = 'http://comment-api.fanily.com.tw/comment?video_id=' + window.videoId
              ;
            offset = offset || '';
            callback = callback || function(){};
            $.getJSON(api + '&offset=' + offset).done(function(data){
                if (data.error == '' && data.status == 200) {
                    if (data.offset != '') {
                        nextOffset = data.offset;
                    }
                    if (data.comments.length > 0) {
                        $.each(data.comments, function(k,v){
                            if (!commentCache.hasOwnProperty(v.comment_id)) {
                                commentCache[v.comment_id] = v;
                                commentList.push(v.comment_id);
                            }
                        });
                        commentList.sort(function(a,b){
                            return commentCache[b].timestamp - commentCache[a].timestamp;
                        });
                    }
                }
            }).done(renderComment).done(callback);
        }
      , renderComment = function(){
            var p = $('.comment-list')
              , c = p.find('.comment')
              , i
              , html = ''
              ;
            i = 0;
            firstID = c.eq(0).attr('id');
            $.each(commentList, function(k,v){
                var vv = commentCache[v];
                html += '<div class="comment" id="'+v+'"> <span class="author"> <img src="'+vv.avatar+'" /> <span>'+vv.display_name+'</span> </span> 說：<span class="date">'+vv.time+'</span> <p>'+vv.content+'</p></div>'
            });
            p.html(html);
            if (commentList[0] && firstID != commentList[0]) {
                $(window).scrollTop(0);
            }
        }
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

