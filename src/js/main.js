var $ = jQuery.noConflict();
$(function(){
	$('.contactForm').submit(function(){
		$('.contact-loader').removeClass('hidden');
		var form = $(this);
		var formdata = $(this).serialize();
		$.ajax({
			url: '../contact.php',
			type: 'POST',
			data: formdata,
		})
		.done(function(res) {
			if(res=='Success'){
				form.find("input[type=text], textarea").val("");
				grecaptcha.reset();
				$('.contact-loader').addClass('hidden');
				$('.contact-response').removeClass('danger').addClass('success').html('Email Sent Successfully');
			}
			else{
				$('.contact-loader').addClass('hidden');
				$('.contact-response').removeClass('success').addClass('danger').html(res);
			}
		});
	});
});