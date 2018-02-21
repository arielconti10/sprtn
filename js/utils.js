
function submitAjax(action, params)
{
    $(".form-group").find(".help-block").remove()
    $(".form-group").removeClass("has-error")
    $.ajax({
        url: action,
        method: "POST",
        dataType: 'json',
        data: params,
        success: function(response) {
            //fechar dialog aqui
            console.log(response);
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
 * realiza a validaçāo de formulario de acordo com o plugin jQuery Validation
 * @param  {String} selector seletor a ser utilizado
 * @return void
 */
function validateForm(selector)
{
    configureValidationMessages();
    $(selector).validate({
       errorClass: "has-error",
       submitHandler: function(form) {
            var action = $(form).attr("action");
            var data = $(form).serialize();
            submitAjax(action,data);
       }
    });
}

/**
 * realiza a configuracao de mascaras da aplicacao
 * @param  {selector} seletor ID ou classe a serem utilizados
 * @param  {format} format formato a ser utilizado de acordo com documentacao do plugin inputmask
 * @return void
 */
function configureMask(selector,format)
{
    $(selector).inputmask(format);  //static mask
}

/**
 * realiza a configuraçāo do select2
 * @param  {String} selector seletor a ser utilizado
 * @param  {String} modal_id seletor do modal, geralmente um ID, a ser utilizado
 * @return void
 */
function configureSelect2(selector,modal_id)
{
    $(selector).select2({
        dropdownParent: $(modal_id),
        width: 'resolve' // need to override the changed default
    });
}
/**
 * mostra o erro quando uma requisicao ajax nāo ocorre como o esperado
 * @param String elemento seletor, por exemplo "#teste"
 * @param  Object jqXHR informacoes do erro encontrado pelo Ajax
 * @return void
 */
function showAjaxError(elemento, jqXHR)
{
    var div = $(elemento).parent();
    var help_block = div.find(".help-block");
    var mensagem = "Ocorreu um erro - " + jqXHR.responseText;
    div.removeClass("has-success");
    div.addClass("has-error");
    help_block.removeClass("has-success");
    help_block.addClass("has-error");
    help_block.text(mensagem);
}

/**
 * mostra a mensagem de erro retornada pela API
 * @return {[type]} [description]
 */
function showErrorAPI(elemento, mensagem)
{
    var div = $(elemento).parent();
    var help_block = div.find(".help-block");
    var span = $("<span>").addClass('help-block has-error').text(mensagem);
    div.append(span);
    div.addClass("has-error");
}

/**
 * realiza a configuracao do plugin de paginacao
 * @param Object pagination propriedades de um obojeto pagination
 * @return void
 */
function configurePagination(pagination)
{
    $('.pagination-configure').twbsPagination({
        totalPages: pagination.last_page,
        visiblePages: 7,
        onPageClick: function (event, page) {
            var url = "http://hapi.spartan.ftd.com.br/api/school?page=";
            var template = "templates/school/school-table.html";
            loadPage(url, template, page);
        }
    });
}

/**
 * altera o total descrito na paginaçāo
 * @param {Object} paginacao dados do registro encontrado na busca da API
 * @return void
 */
function getNumbersPagination(paginacao)
{
    $(".from_page").text(paginacao.from);
    $(".to_page").text(paginacao.to);
    $(".total_page").text(paginacao.total);
}


/**
 * carrega os dados da selectbox enviada por parametro
 * @param String action açāo da API a ser chamada
 * @param String seletor seletor a ser enviado (no qual será preenchido pela funçāo)
 * @return void
 */
function loadSelectBox(action, selector) {
    var params = {};
    $(selector).find("option").remove();
    $.ajax({
        "url" :action,
        "data": params,
        "dataType":"json",
        "success": function(retorno) {
            $.each(retorno.data, function(key,val){
                var option = $("<option>").val(val.id).text(val.name);
                $(selector).append(option);
            });
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            showAjaxError(selector, jqXHR);
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
        $.get('templates/school/school-table.html', function(template) {
            var rendered = Mustache.render(template, data);
            $("tbody tr").remove();
            $(".table tbody").append(rendered);
            getNumbersPagination(data.meta.pagination);
        });
    });
}

/**
 * realiza a configuracao de mensagens do jqueryValidate
 * @return void
 */
function configureValidationMessages()
{
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo é de preenchimento obrigatório.",
    });
}

