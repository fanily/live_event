(function(f, k, m) {
    var e = f.jQuery,
        g = m,
        l = [],
        n = function(a, d, c) {
            var b = new Date;
            b.setTime(b.getTime() + 864E5 * c);
            c = "expires=" + b.toUTCString();
            k.cookie = a + "=" + d + "; " + c
        },
        h = function(a) {
            a += "=";
            for (var d = k.cookie.split(";"), c = 0; c < d.length; c++) {
                for (var b = d[c];
                    " " == b.charAt(0);) b = b.substring(1);
                if (0 == b.indexOf(a)) return b.substring(a.length, b.length)
            }
            return ""
        }("tick");
    "" === h ? (n("tick", "0", 1), h = 0) : (h = parseInt(h, 10), n("tick", 1 - h, 1));
    e(".bg2").find("a").attr("href", ["http://shop.fanily.com.tw/fanilyShop/drama.do?id=20141114123507770559",
        "http://storywork.fanily.com.tw/detail.do?id=1014781694654724"
    ][h]).find("img").attr("src", "img/" + h.toString() + ".jpg");
    e('input[name="section-control"]').change(function(a) {
        e(f).scrollTop(0);
        a = e('label[for="video-' + e(a.target).val() + '-cb"]').parent().addClass("active");
        e("#nav li").not(a).removeClass("active");
        ga("send", "event", "page", "change", {
            page: "/" + this.value
        });
        for (var d in l) l[d].pauseVideo()
    });
    e.getJSON("playlist.json", function(a) {
        g = a.youtube;
        ga("send", "event",
            "page", "loaded", {
                page: "/playlist.json"
            })
    });
    f.onYouTubeIframeAPIReady = function() {
        if (g === m) setTimeout(f.onYouTubeIframeAPIReady, 100);
        else {
            for (var a in g) {
                var d = e('a[data-scene="video-' + a + '"]'),
                    c = e("#video-" + a),
                    b = g[a];
                d.find("span").text(b.title);
                d.find("img").attr("src", b.img);
                // d.find("img").attr("src", b.thumbnails["default"].url);
                c.find("h3").text(b.title);
                b.end ? c.find("div.video-inner").css("background", "#000 url(" + b.img + ") scroll no-repeat 50% 50%").css("background-size", "100% auto") : c.find("div.video-inner").html('<div id="yt-player-' +
                    b.id + '"></div>');
                c.find(".comment").html('<div class="fb-comments" data-href="http://megaport.fanily.com.tw/page/' + a + '" data-width="800" data-numposts="5" data-colorscheme="light"></div>')
            }
            c = k.getElementsByTagName("script")[0];
            k.getElementById("facebook-jssdk") || (d = k.createElement("script"), d.id = "facebook-jssdk", d.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.0", c.parentNode.insertBefore(d, c));
            for (a in g) 0 == g[a].end && (b = g[a], l[a] = new YT.Player("yt-player-" + b.id, {
                height: "388",
                width: "639",
                videoId: b.id,
                playerVars: {
                    autoplay: 0 == a ? 1 : 0,
                    controls: 2,
                    disablekb: 0,
                    fs: 1,
                    hl: "zh-tw",
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                    onPlaybackQualityChange: onPlaybackQualityChange,
                    onPlaybackRateChange: onPlaybackRateChange
                }
            }))
        }
    };
    f.onPlayerReady = function(a) {
        a.target.setVolume(100);
        ga("send", "event", "video", "Ready", a.target.getVideoUrl(), {
            nonInteraction: 1
        })
    };
    f.onPlayerStateChange = function(a) {
        ga("send", "event", "video", "StateChange", a.target.getVideoUrl(),
            a.data);
        ga("send", "event", "video", "Quality", a.target.getVideoUrl(), a.target.getPlaybackQuality(), {
            nonInteraction: 1
        });
        ga("send", "event", "video", "LoadedFraction", a.target.getVideoUrl(), a.target.getVideoLoadedFraction(), {
            nonInteraction: 1
        })
    };
    f.onPlaybackQualityChange = function(a) {
        ga("send", "event", "video", "QualityChange", a.target.getVideoUrl(), a.data)
    };
    f.onPlaybackRateChange = function(a) {
        ga("send", "event", "video", "RateChange", a.target.getVideoUrl(), a.data)
    }
})(this, this.document);