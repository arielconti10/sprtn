var url = "http://hapi.spartan.ftd.com.br/api/contact";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/contact/contact.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
