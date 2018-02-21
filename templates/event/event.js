var url = "http://hapi.spartan.ftd.com.br/api/event";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/event/event.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
