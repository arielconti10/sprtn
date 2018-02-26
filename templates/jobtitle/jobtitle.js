var url = "http://hapi.spartan.ftd.com.br/api/jobtitle";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/jobtitle/jobtitle.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
