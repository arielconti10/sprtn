/**
 * realiza o envio de um Ajax com o método POST
 * @param {String} action   açāo da API a ser chamada
 * @param {Object} params parâmetros da requisiçāo
 * @param {String} modal_id seletor do modal, geralmente um ID
 * @param {String} class_template classe do template a ser chamada
 * @return void
 */
function submitAjax(action, params, method, class_template)
{
    $(".form-group").find(".help-block").remove();
    $(".form-group").removeClass("has-error");

    $.ajax({
        url: action,
        method: method,
        dataType: 'json',
        data: params,
        success: function(response) {
            var params = {
                success: true
            };
            renderTpl(class_template);
        }, error: function(jqXHR, textStatus, errorThrown) {
            var errors = jqXHR.responseJSON.errors;
            $.each(errors, function(key,val) {
                var elemento = "#" + key;
                var mensagem = val;
                showErrorAPI(elemento, mensagem)
            })
        }
    });
}

/**
 * realiza o carregamento de dados inicial
 * @param String url açāo da API a ser chamada
 * @param String template url da template a ser chamada
 * @return void
 */
function loadInitial(url, template) {

   var data = [];

   $('#content-wrapper').empty();
   
   $.getJSON(url, data, function(data){
       $.get(template, function(template) {
            var rendered = Mustache.render(template, data);
            $('#content-wrapper').html(rendered);
            configurePagination(data.meta.pagination);
            getNumbersPagination(data.meta.pagination);
        });
    });
}

/**
 * realiza o carregamento de dados, de acordo com a página enviada
 * @param {String} url action da API a ser chamada
 * @param {String} template action do template a ser chamado
 * @param  {Integer} page número da página a ser buscada na API
 * @return void
 */
function loadPage(url, template, page) {

   var complete_url = url + page;
   var data = [];

    $.getJSON(complete_url, data, function(data){
        $.get(template, function(template) {
            var rendered = Mustache.render(template, data);
            $("tbody tr").remove();
            $(".table tbody").append(rendered);
            getNumbersPagination(data.meta.pagination);
        });
    });
}

/**
 * realiza a procura de um registro na API de acordo com o seu ID
 * @param {String} url action a ser procurada na API
 * @param {Integer} id ID do registro procurado
 * @return Array record registro encontrado
 */
function findRecord(url, id) {
   var action = url + "/" + id;
   var record = new Array();

   $.ajax({
        url: action,
        method: "GET",
        dataType: 'json',
        async: false,
        success: function(response) {
            record = response;
        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

   return record;
}

/**
 * realiza a listagem de registros encontrados na API
 * @param  {String} url action a ser procurada na API
 * @return Array records registros encontrados
 */
function listRecord(url) {
   var action = url;
   var record = new Array();

   $.ajax({
        url: action,
        method: "GET",
        dataType: 'json',
        async: false,
        success: function(response) {
            record = response;
        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

   return record;
}


/**
 * realiza a exclusāo de um registro da API
 * @param  {String} url action a ser executada na API
 * @param  {String} class_template template a ser renderizado caso tenha sucesso
 * @return void
 */
function deleteRecord(url, class_template) {
    var action = url;
    var record = new Array();

   $.ajax({
        url: action,
        method: "DELETE",
        dataType: 'json',
        async: false,
        success: function(response) {
            record = response;
            renderTpl(class_template);
        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

   return record;

}