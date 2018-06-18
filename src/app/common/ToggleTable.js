/**
 * com base no evento disparado, verifica as checkbox do dropdown que estāo marcadas como check
 * @param {Object} target evento disparado no campo
 * @param {Array} initial_columns colunas da tabela a serem mapeadas
 * @return {Array} columns_map colunas selecionadas
 */
export function verifySelectChecked(target, initial_columns) {
    const columns_map = initial_columns;

    columns_map.map((item) => {
        if (item.accessor === target.value || item.id === target.value) {
            item.is_checked = !item.is_checked;
        }
    });

    return columns_map;
}

/**
 * adiciona ou remove colunas da tabela de acordo com o dropdown selecionado
 * @param {Array} initial_columns colunas da tabela a serem mapeadas
 * @return {Array} columns_map colunas selecionadas
 */
export function createTable(initial_columns) {
    const columns_map = initial_columns;
    const columns_filter = columns_map.filter((item) => item.is_checked === true || item.accessor == "" 
        || item.accessor == "visit_type_school_type");
    
    return columns_filter;
}