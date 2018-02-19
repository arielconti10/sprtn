var url = "http://hapi.spartan.ftd.com.br/api/chain";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/chain/chain.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});
