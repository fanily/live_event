jQuery(function($){
  $('#clock').countdown('2015/11/27 12:30', function(event) {
 	  $(this).html(event.strftime('%D天 %H:%M:%S'));
 	});
  $("#clock").on("finish.countdown", function(){
    $("#cover").hide();
  });
  if(window.matchMedia("screen and (min-device-width: 780px)").matches){
    $(".container").height($(window).height()-63);    
  }
});

