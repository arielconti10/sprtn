
// $(document).ready(function(event){

	var url = "http://dapi.spartan.ftd.com.br:81/api/profile";
	var data = {};

	$.getJSON(url, data, function(retorno){

	    $.get('templates/profile/profile.html', function(template) {
	        var rendered = Mustache.render(template, retorno, {
	        	templateRef: template
	        });
	        $('#content-wrapper').html(rendered);
	    }, 'text');

	});
	// event.preventDefault();
// });

