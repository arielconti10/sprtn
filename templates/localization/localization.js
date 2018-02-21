var url = "http://hapi.spartan.ftd.com.br/api/localization";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/localization/localization.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
