function loadData(page, event) {

    var url = "http://hapi.spartan.ftd.com.br/api/school?page=1";
    var data = [];

    $.getJSON(url, data, function(data){
        
        $.get('templates/school/school.html', function(template) {
            var rendered = Mustache.render(template, data);
            $('#content-wrapper').html(rendered);
        });

    });

}

$(document).ready(function(){

    loadData(1);

    $('.pagination a').on('click', function(){
        console.log($(this).data('dt-idx'));
        loadData($(this).data('dt-idx'));
    });

});