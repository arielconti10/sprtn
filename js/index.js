function loadTpl() {

    $.get('templates/profile/profile.html', function(template) {
        var rendered = Mustache.render(template);
        $('#content-wrapper').html(rendered);
    });

}

loadTpl();

