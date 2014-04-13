
$(document).ready(function() {
	/*$('.typeahead').typeahead({                              
	  name: 'users',    
	  remote: 'http://localhost:3000/users/all',                                                    
	  prefetch: 'http://localhost:3000/users/all',
	  limit: 5                                     
	});*/
	$.ajax({
		  url:'/users/all', success:function(result){strReturn = result;}, async:false,type: "get",
		 });
	$('.typeahead').typeahead({name: 'users', local: strReturn})
});