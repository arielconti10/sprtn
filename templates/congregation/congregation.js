var url = "http://hapi.spartan.ftd.com.br/api/congregation";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/congregation/congregation.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
