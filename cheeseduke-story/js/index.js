jQuery(function($){
  $('#clock').countdown( config.start_time , function(event) {
 	  $(this).html(event.strftime('%D天 %H:%M:%S'));
 	});
  $("#clock").on("finish.countdown", function(){
    $("#cover").hide();
  });
  // to remove white border of desktop view
  if(window.matchMedia("screen and (min-device-width: 780px)").matches){
    $(".container").height($(window).height()-63);    
  }
  });

