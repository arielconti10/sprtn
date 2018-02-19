var view = {
    name: "Marcos",
    occupation: "Web Developer"
};

function loadtemp() {
    // var output = Mustache.render("{{name}} is a  {{occupation}}", view);
    // document.getElementById('content-wrapper').innerHTML = output;

    $.get('templates/profile/profile.html', function(template) {
        var rendered = Mustache.render(template, { name: "Marcos Tavares" });
        $('#content-wrapper').html(rendered);
    });

}

loadtemp();