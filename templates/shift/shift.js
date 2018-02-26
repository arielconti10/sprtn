var url = "http://hapi.spartan.ftd.com.br/api/shift";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/shift/shift.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
