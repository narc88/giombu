

(function(){
	var input = $('#branch_partner');
	var formValidateUser = $('#validate-user');
	var checkIcon = $('#check-icon');
	var isUserValid = false;
	checkIcon.hide();
	var validateUser = function(){
		isUserValid = false;
		$.ajax({
			type 		: 'GET',
			url 		: '/users/validate/' + input.val(),
			success 	: function(response){
				isUserValid = response;
				if(response){
					formValidateUser.removeClass('has-error');
					formValidateUser.addClass('has-success');
					checkIcon.show();
				}else{
					formValidateUser.removeClass('has-success');
					formValidateUser.addClass('has-error');
					checkIcon.hide();
				}
			},
			error   : function(jqXHR, textStatus, errorThrown ){
					console.log('AJAX states - ' + textStatus + ' - ' + errorThrown);
				}
		});
	}
	input.keyup(validateUser);
	input.focusout(validateUser);
	$('#form_create_branch').submit(function(){
		return isUserValid;
	});
})();


