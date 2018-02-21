var url = "http://hapi.spartan.ftd.com.br/api/sector";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/sector/sector.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
