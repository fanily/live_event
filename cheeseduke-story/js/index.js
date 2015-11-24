jQuery(function($){
   	$('#clock').countdown('2015/11/27 12:00', function(event) {
 		$(this).html(event.strftime('%D天 %H:%M:%S'));
 	});
  if(window.matchMedia("screen and (min-device-width: 780px)").matches){
    $(".container").height($(window).height()-63);    
  }
});

