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

$(document).on("click", ".inserir-cadastro", function(event) {
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

    renderMustache("templates/school/form.html", params_mustache, '#content-wrapper' ,function(){
        configureSelect2(".select2_class");
        callConfigureMask();
    });

    $(document).off("click", ".inserir-cadastro");

});

/**
 * verifica se o status será mostrado como "Ativo" ou "Inativo"
 * @param Integer status
 * @return String status_text o status em formato de texto 
 */
function checkStatusActive(status) {
    var status_text = "Ativo";
    if (status == 0) {
        status_text = "Inativo";
    }
    return status_text;
}

/**
 * verifica o ícone a ser mostrado pelo status
 * @param Integer status código do status
 * @return String status_icon o status em formato de ícone 
 */
function checkIconActive(status) {
    var status_icon = "fa fa-check-circle text-success";
    if (status == 0) {
        status_icon = "fa fa-times-circle text-error";
    }
    return status_icon;
}

function filterPhone(phones, type) {
    var strPhones = "Nāo informado";

    if (phones.length > 0) {
        strPhones = "";
        $.each(phones, function(key,phone){
            if (phone.phone_type == type) {
                strPhones = strPhones + phone.phone_extension + " " + phone.phone_number + " , ";
            }
        });
        strPhones = strPhones.trim();
        strPhones = strPhones.replace(/,+$/, "");
    }

    return strPhones;
}

/**
 * preenche informações complementares ao contato, como por exemplo o cargo exercido
 * @param Array contacts lista de contatos
 * @return Array contacts_new lista com dados atualizados 
 */
function findContacts(contacts) {
    var contacts_new = new Array();

    $.each(contacts, function(key,contact){
        var result = new Array();
        var contact = findRecord("http://hapi.spartan.ftd.com.br/api/contact", contact.id);
        var phones = contact.data.phones;
        contact['work'] = filterPhone(phones, "work");
        contact['mobile'] = filterPhone(phones, "mobile");
        contacts_new.push(contact);
    });

    return contacts_new;
} 

/**
 * verifica qual o último evento ocorrido
 * @param Array events lista de eventos ocorridos
 * @return Array last_event dados do último evento
*/
function findLastEvent(events)
{
    var array_size = events.length;
    var last_event = new Array();

    if (array_size > 0) {
        var index = array_size - 1;
        var last_event = events[index];
    }

    return last_event;
}

/**
 * retorna a data em formato brasileiro, caso seja encontrada
 * @param String start_date data, caso encontrada
 * @return String data formatada ou texto de nāo encontrado
 */
function verifyDateEvent(start_date) {
    var datestr = "Nāo encontrado";

    if (start_date !== undefined) {
        datestr = formatDateToBrazilian(start_date);
    }

    return datestr;
}

/**
 * captura o próximo evento
 * @param Array events lista de eventos encontrados
 * @return Array nextEvent dados do próximo evento
 */
function getNextEvent(events)
{
    var actual_date = new Date();
    var actualtimetotal = actual_date.getTime();
    var nextEvent = new Array();

    $.each(events, function(key, event){
        var datestr = event.start_date + "T" + event.start_time +"Z";
        var date_format = new Date(datestr);
        var timetotal = date_format.getTime();
        if (timetotal >= actualtimetotal) {
            nextEvent = event;
            return false;
        }
    });

    return nextEvent;
}

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

    var last_event = findLastEvent(record_data.events);
    var next_event = getNextEvent(record_data.events);

    //json a ser enviado para o mustache
    var params_mustache = {
        "record" : record_data,
        "total_contacts" : record_data.contacts.length,
        "total_students" : record_data.students.length,
        "last_event" : verifyDateEvent(last_event.start_date),
        "next_event" : verifyDateEvent(next_event.start_date),
        "contacts" : findContacts(record_data.contacts),
        "school_types" : verifySelected(record_data.school_type_id, school_types.data),
        "sectors" : verifySelected(record_data.sector_id, sectors.data),
        "subsidiaries" : verifySelected(record_data.subsidiary_id, subsidiaries.data),
        "states" : verifySelected(record_data.state_id, states.data),
        "chains" : verifySelected(record_data.chain_id, chains.data),
        "congregations" : verifySelected(record_data.congregation_id, congregations.data),
        "localizations" : verifySelected(record_data.localization_type_id, localizations.data),
        "profiles" : verifySelected(record_data.profile_id, profiles.data),
        "is_edition" : 1,
        "active_text" : checkStatusActive(record_data.active),
        "active_icon" : checkIconActive(record_data.active)
    };

    renderMustache("templates/school/edit.html", params_mustache, "#content-wrapper", function(){
        renderMustache("templates/school/form.html", params_mustache, ".formulario-edicao", function(){
            callConfigureMask();
        });
    });

    $(document).off("click", ".btn-edit");

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

    if (resp === true) {
        var url = "http://hapi.spartan.ftd.com.br/api/school/" + id;
        var template = "templates/school/school.js";
        deleteRecord(url, template);
    }

    // $(document).off("click", ".btn-delete");
});