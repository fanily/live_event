jQuery(function($){
   	$('#clock').countdown('2015/11/27 12:30', function(event) {
 		$(this).html(event.strftime('%D天 %H:%M:%S'));
 	});
});

