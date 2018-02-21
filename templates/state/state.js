var url = "http://hapi.spartan.ftd.com.br/api/state";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/state/state.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
