
function renderTpl(jsFile) {
    $.getScript(jsFile);
}

$(document).ready(function(){
    $('ul.sidebar-menu li a').on('click', function(){
        renderTpl($(this).attr('id'));
    });

});
