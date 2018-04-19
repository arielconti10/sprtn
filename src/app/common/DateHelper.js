/**
 * recebe uma data em formato brasileiro e formata para o padrāo americano
 * Exemplo: 26/05/1995 será 1995-05-26
 * @param String date_brazilian
 * @return String date_american
 */
export const formatDateToAmerican=(date_brazilian)=>{
    let date_american = "";
    if (date_brazilian.indexOf("/") !== -1) {
        let date_explode = date_brazilian.split("/");
        date_american = `${date_explode[2]}-${date_explode[1]}-${date_explode[0]}`;
    }
    return date_american;
}

/**
 * recebe uma data em formato americano e formata para o padrāo brasileiro
 * Exemplo: 26/05/1995 será 1995-05-26
 * @param String date_american
 * @return String date_bralizian
 */
export const formatDateToBrazilian=(date_american)=>{
    let date_brazilian = "";
    
    if (date_american !== undefined && date_american !== null && date_american.indexOf("-") !== -1) {
        let date_explode = date_american.split("-");
        date_brazilian = `${date_explode[2]}/${date_explode[1]}/${date_explode[0]}`;
    }
    return date_brazilian;
}