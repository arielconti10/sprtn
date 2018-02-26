/**
 * realiza a validaçāo de formulario de acordo com o plugin jQuery Validation
 * @param {String} selector seletor a ser utilizado
 * @param {String} method método a ser chamado pela API. Exemplos: POST, PUT, DELETE
 * @param {String} template do template a ser chamado caso a validacao ocorra corretamente
 * @return void
 */
function validateForm(selector, method, template)
{
    configureValidationMessages();
    $(selector).validate({
       errorClass: "has-error",
       submitHandler: function(form) {
            var action = $(form).attr("action");
            var data = $(form).serialize();
            submitAjax(action, data, method, template);
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
function configureSelect2(selector)
{
    $(selector).select2({
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
 * renderiza um template Mustache
 * @param String template template a ser chamado
 * @param Array response resposta json a ser renderizada
 * @param String seletor seletor que irá renderizar a view. Um ID ou classe, por exemplo
 * @param Function callback funçāo contendo ações a serem executadas após execucao dessa funcao
 * @return void
 */
function renderMustache(template, response, seletor ,callback) {
    $(seletor).empty();

    $.get(template, function(template) {
        var rendered = Mustache.render(template, response);
        $(seletor).html(rendered);
        if (callback !== undefined) {
            callback();
        }
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

/**
 * verifica a opcao selecionada em um selectbox
 * @param {Integer} id ID de comparacao
 * @param {Array} list de tipos a serem comparados
 * @return {boolean} selected flag dizendo se é o selecionado ou nao
 */
function verifySelected(id, list) {
    $.each(list, function(key,item){
        if (id == item.id) {
            $(item).attr("selected", true);
        }
    });
    return list;
}

/**
 * formata uma data para o padrāo brasileiro
 * @param String date_american data em formato americano. Exemplo: "2018-02-28"
 * @return String date_brazilian data em formato brasileiro. Exemplo: "28/02/2018"
 */
function formatDateToBrazilian(date_american)
{
    var date_split = date_american.toString().split("-");
    var date_brazilian = date_split[2]+"/"+date_split[1]+"/"+date_split[0];

    return date_brazilian;
}
