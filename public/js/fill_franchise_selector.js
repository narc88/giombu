$(document).ready(function($){  
 
  $.ajax({
    url: '/franchises/complete_list',
    type: "post",
    success: function(json) {
      html = '';
      for (var i = json.length - 1; i >= 0; i--) {
            var franchise= json[i];
            html = html + '<span><a href="/users/change_franchise/'+franchise.slug+'"> ' + franchise.name + '</a></span><br>';
          }; 
          $('#collapseOne .accordion-inner').html(html)
    },
            
       error:function (xhr, ajaxOptions, thrownError) {
        //alert(thrownError);
      }
    
    
  });
});