branches = {};
(function(){

	$('#tags').tagsInput();
	$('#start_time').timepicker({
		minuteStep: 15,
		template: 'dropdown',
		showSeconds: false,
		showMeridian: false,
		defaultTime: '00:00'
	});
	$('#end_time').timepicker({
		minuteStep: 15,
		template: 'dropdown',
		showSeconds: false,
		showMeridian: false,
		defaultTime: '00:00'
	});


	$('#store_selector').click(function(){

		$.ajax({
			type 		: 'GET',
			url 		: '/stores/branches/' + $(this).val() + '.json',
			success 	: function(branches){
				branches = branches;
				var branchesList = $('#branches_list');
				branchesList.empty();

				for (var i = branches.length - 1; i >= 0; i--) {
					var checkbox = $('<div class="checkbox"></div>');
					var label = $('<label><input value="' + branches[i]._id + '", name="deal[branches]['+ i +']",  type="checkbox" />' +
						branches[i].name + ' - ' + branches[i].franchise.name + '</label>');

					checkbox.append(label);
					branchesList.append(checkbox);

				};
			}
		});
	});



})();