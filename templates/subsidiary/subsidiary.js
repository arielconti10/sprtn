var url = "http://hapi.spartan.ftd.com.br/api/subsidiary";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/subsidiary/subsidiary.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
