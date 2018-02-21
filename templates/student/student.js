var url = "http://hapi.spartan.ftd.com.br/api/student";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/student/student.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
