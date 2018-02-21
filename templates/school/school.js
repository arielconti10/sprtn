function callConfigureMask()
{
    configureMask("#cnpj", "99.999.999/9999-99");
    configureMask("#zip_code", "99999-999");
    // configureMask("#phone", "(99) 9999-9999");
}

function callLoadSelect()
{
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/schooltype", "#school_type_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/subsidiary", "#subsidiary_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/sector", "#sector_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/state", "#state_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/chain", "#chain_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/congregation", "#congregation_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/localization", "#type_locatization_id");
    loadSelectBox("http://hapi.spartan.ftd.com.br/api/profile", "#profile_id");
}

$(document).ready(function(){
    var url = "http://hapi.spartan.ftd.com.br/api/school?page=1";
    var template = "templates/school/school.html";
    loadInitial(url, template);
});

$(document).on("click",".paginate_button a",function (event){
    event.preventDefault();
    var elemento = $(this);
    var page = elemento.data("dt-idx");
    loadData(page);
});

$(document).on("click", ".inserir-cadastro", function(event) {
    $.get('templates/school/modal.html', function(template) {
        var rendered = Mustache.render(template);
        $(".content").append(rendered);
        $('#insereCadastro').modal('show');
        callLoadSelect();
        configureSelect2(".select2_class", "#insereCadastro");
        callConfigureMask();
        validateForm("#schoolform");
    });
});