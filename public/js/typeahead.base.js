
$(document).ready(function() {
	$.ajax({
		  url:'/users.json', success:function(result){strReturn = result;}, async:false,type: "get",
		 });
	$('.typeahead').typeahead({name: 'users', local: strReturn})
});