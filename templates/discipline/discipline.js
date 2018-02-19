var url = "http://hapi.spartan.ftd.com.br/api/discipline";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/discipline/discipline.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
