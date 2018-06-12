/**
 * formata o número para milhar e caso especificado, para monetário
 * Exemplo: 999999 será 999.999
 * @param { Float } number_str número a ser formatado
 * @return { Float } number_format número após formataçāo
 */
export const formatNumber=(number_str)=> {
    if (number_str.toString().length == 1) {
        return `0${number_str}`;
    }

    return number_str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}