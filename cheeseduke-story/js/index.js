(function() {
	var $ = window.jQuery;

	if (window.matchMedia("screen and (max-width: 667px)").matches) {
		$.browser = 'mobile';
	} else if (window.matchMedia("screen and (min-width: 668px) and (max-width: 1024px)").matches) {
		$.browser = 'pad';
	} else {
		$.browser = 'desktop';
	}

	$('#clock').countdown(config.start_time, function(event) {
		$(this).html(event.strftime('%D天 %H:%M:%S'));
	});
	$("#clock").on("finish.countdown", function(){
		$("#cover").hide();
	});
})();
