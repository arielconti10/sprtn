var url = "http://hapi.spartan.ftd.com.br/api/profile";
var data = [];

$.getJSON(url, data, function(data){
    
    $.get('templates/profile/profile.html', function(template) {
        var rendered = Mustache.render(template, data);
        $('#content-wrapper').html(rendered);
    });

});

// renderTpl('templates/discipline/discipline.js');
// renderTpl('templates/chain/chain.js');