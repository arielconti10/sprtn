function callConfigureMask()
{
    configureMask("#cnpj", "99.999.999/9999-99");
    configureMask("#zip_code", "99999-999");
    // configureMask("#phone", "(99) 9999-9999");
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

$(document).off('click').on("click", ".inserir-cadastro", function(event) {
    var school_types = listRecord("http://hapi.spartan.ftd.com.br/api/schooltype");
    var sectors = listRecord("http://hapi.spartan.ftd.com.br/api/sector");
    var subsidiaries = listRecord("http://hapi.spartan.ftd.com.br/api/subsidiary");
    var states = listRecord("http://hapi.spartan.ftd.com.br/api/state");
    var chains = listRecord("http://hapi.spartan.ftd.com.br/api/chain");
    var congregations = listRecord("http://hapi.spartan.ftd.com.br/api/congregation");
    var localizations = listRecord("http://hapi.spartan.ftd.com.br/api/localization");
    var profiles = listRecord("http://hapi.spartan.ftd.com.br/api/profile");

    //json a ser enviado para o mustache
    var params_mustache = {
        "school_types" : school_types.data,
        "sectors" : sectors.data,
        "subsidiaries" : subsidiaries.data,
        "states" : states.data,
        "chains" : chains.data,
        "congregations" : congregations.data,
        "localizations" : localizations.data,
        "profiles" : profiles.data,
        "is_insert" : 1
    };

    $(this).off('click');

    renderMustache("templates/school/form.html", params_mustache, function(){
        configureSelect2(".select2_class");
        callConfigureMask();
    });

});

$(document).on("click", ".btn-edit", function(event) {
    var id = $(this).data("id");
    var record = findRecord("http://hapi.spartan.ftd.com.br/api/school", id);
    var record_data = record.data;

    var school_types = listRecord("http://hapi.spartan.ftd.com.br/api/schooltype");
    var sectors = listRecord("http://hapi.spartan.ftd.com.br/api/sector");
    var subsidiaries = listRecord("http://hapi.spartan.ftd.com.br/api/subsidiary");
    var states = listRecord("http://hapi.spartan.ftd.com.br/api/state");
    var chains = listRecord("http://hapi.spartan.ftd.com.br/api/chain");
    var congregations = listRecord("http://hapi.spartan.ftd.com.br/api/congregation");
    var localizations = listRecord("http://hapi.spartan.ftd.com.br/api/localization");
    var profiles = listRecord("http://hapi.spartan.ftd.com.br/api/profile");

    //json a ser enviado para o mustache
    var params_mustache = {
        "record" : record_data,
        "school_types" : verifySelected(record_data.school_type_id, school_types.data),
        "sectors" : verifySelected(record_data.sector_id, sectors.data),
        "subsidiaries" : verifySelected(record_data.subsidiary_id, subsidiaries.data),
        "states" : verifySelected(record_data.state_id, states.data),
        "chains" : verifySelected(record_data.chain_id, chains.data),
        "congregations" : verifySelected(record_data.congregation_id, congregations.data),
        "localizations" : verifySelected(record_data.localization_type_id, localizations.data),
        "profiles" : verifySelected(record_data.profile_id, profiles.data),
        "is_edition" : 1
    };

    $(this).off('click');

    renderMustache("templates/school/form.html", params_mustache);
});

$(document).on("click", ".btn-update", function(event) {
    var template = "templates/school/school.js";
    validateForm("#schoolform", "PUT", template);
});

$(document).on("click", ".btn-insert", function(event) {
    var template = "templates/school/school.js";
    validateForm("#schoolform", "POST", template);
});

$(document).on("click", ".btn-delete", function(event) {
    event.preventDefault();
    var id = $(this).data("id");
    var resp = confirm("Deseja realmente excluir este registro?");

    if (resp == true) {
        var url = "http://hapi.spartan.ftd.com.br/api/school/" + id;
        var template = "templates/school/school.js";
        deleteRecord(url, template);
    }
});