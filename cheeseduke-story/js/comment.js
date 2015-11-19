(function(w, undefined){
  var p = (function(qs) {
      qs = qs.split("+").join(" ");
      var p = {}, t,
          re = /[?&]?([^=]+)=([^&]*)/g;
      while (t = re.exec(qs)) {
          p[decodeURIComponent(t[1])]
              = decodeURIComponent(t[2]);
      }
      return p;
  })(w.location.search);
  w.videoId=p['id']||'';
  w.token=p['token']||'';
})(this);

