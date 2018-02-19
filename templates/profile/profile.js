

var url = "hapi.spartan.ftd.com.br/api/profile";
var data = [];

$.ajax(url, data, function(data){
    
    $.get('templates/profile/profile.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});


