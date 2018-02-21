
function renderTpl(jsFile) {
    // var jsFile = 'templates/profile/' + tplName + '.js';
    $.getScript(jsFile);
}

$(document).ready(function(){
    $('ul.sidebar-menu li a').on('click', function(){
        renderTpl($(this).attr('id'));
    });

});
