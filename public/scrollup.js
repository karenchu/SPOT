$(document).ready(function() {
			// Swap retina-ready images
			$('img').retina();
			
			// Hide and show fixed navigation on scroll
			function scrollNav(){
				var headerSize;
				if ($('header.splash').length == 0) {
					headerSize=250;
				} else {
					headerSize=$('header.splash').height();
					headerSize=headerSize+54;
				}
				var win=$(window);
				var scrolled=win.scrollTop();
				if ($.browser.msie){
					if (scrolled>headerSize){
						$('.fixed-bar').fadeIn();
					} else {
						$('.fixed-bar').fadeOut();
					}
				}
				else{
					if (scrolled>headerSize-40){
						$('.fixed-bar').removeClass('fadeOutUp').show().addClass('fadeInDown');
					} else {
						$('.fixed-bar').removeClass('fadeInDown').addClass('fadeOutUp').one('webkitAnimationEnd animationend', function(){
						});
					}
				}
				if (scrolled>680){
					$('.about .capabilities').addClass('animate');
				}
				
			}
			$(window).scroll(function(){
				scrollNav();
			});
			
			// scroll body to top on click
			$('a#back-to-top').click(function () {
				$('body,html').animate({
					scrollTop: 0
				}, 800);
				return false;
			});
			
		    $('#back-link').click(function(){
		        parent.history.back();
		        return false;
		    });
			
		});

		jQuery.fn.retina = function(retina_part) {
			var settings = {'retina_part': '-2x'};
			if(retina_part) jQuery.extend(config, settings);
				
			if(window.devicePixelRatio >= 2) {
				this.each(function(index, element) {
					if(!$(element).attr('src')) return;
					
					var new_image_src = $(element).attr('src').replace(/(.+)(\.\w{3,4})$/, "$1"+ settings['retina_part'] +"$2");
					$.ajax({url: new_image_src, type: "HEAD", success: function() {
						$(element).attr('src', new_image_src);
					}});
				});
			}
			return this;
		}