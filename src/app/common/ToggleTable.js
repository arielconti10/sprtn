export function getSchoolAndVisitValues(sub, old_value, column_value_changed, val) {
    let newArrayData = [];

    column_value_changed.map(item => {
        if (val.length) {
            val.map(register => {
                let values = {};

                if (old_value.length > column_value_changed.length) {
                    if (register[sub] === item) {
                        values['school_type_id'] = register['school_type_id'];
                        values['visit_type_id'] = register['visit_type_id'];

                        newArrayData.push(values);
                    }
                }
                else {
                    if (sub === 'school_type_id') {
                        values['school_type_id'] = item;
                        values['visit_type_id'] = register['visit_type_id'];
                    } else {
                        values['school_type_id'] = register['school_type_id'];
                        values['visit_type_id'] = item;
                    }

                    newArrayData.push(values);
                }
            });
        } else {
            let values = {};

            if (sub === 'school_type_id') {
                values['school_type_id'] = item;
                values['visit_type_id'] = 1;
            } else {
                values['school_type_id'] = 1;
                values['visit_type_id'] = item;
            }

            newArrayData.push(values);
        }
    });

    newArrayData = newArrayData.filter((item, index, self) =>
        index === self.findIndex((obj) => (
            obj.school_type_id === item.school_type_id && obj.visit_type_id === item.visit_type_id
        ))
    )

    return newArrayData;
}

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
export function createTableToggle(initial_columns) {
    const columns_map = initial_columns;
    const columns_filter = columns_map.filter((item) => item.is_checked === true || item.accessor === "" 
        || item.accessor == "visit_type_school_type" || item.accessor == "roles");

    return columns_filter;
}

/**
 * adiciona ou remove colunas da tabela de acordo com o dropdown selecionado
 * @param {Array} initial_columns colunas da tabela a serem mapeadas
 * @return {Array} columns_map colunas selecionadas
 */
export function createTable(initial_columns) {
    const columns_map = initial_columns;
    const columns_filter = columns_map.filter((item) => item.is_checked === true || item.accessor === "" 
        || item.accessor == "visit_type_school_type" || item.accessor == "roles");

    return columns_filter;
}

/**
 * salva as colunas de preferência do usuário, de acordo com a tela
 * o objetivo é carregar as colunas selecionadas no último acesso
 * @param {String} session_name nome da chave de sessāo
 * @param {Array} columns_filter lista com colunas filtradas 
 * @return void
 */
export function savePreferences(session_name, columns_filter, filter_by = ''){
    const columns_selected = columns_filter;
    let columns_storage = '';

    if (filter_by !== "") {
        columns_storage = columns_selected.map(item => item.id !== null?item.id:"");
    } else {
        columns_storage = columns_selected.map(item => item.accessor);
    }

    

    localStorage.setItem(session_name, JSON.stringify(columns_storage));
}

/**
 * verifica as preferências do usuário
 * @param {Array} columns_table lista com as colunas da tabela 
 */
export function verifyPreferences(columns_table, pref_key, filter_by = '') {
    const columns_preferences = JSON.parse(localStorage.getItem(pref_key));
    let table_preference = columns_table;

    if (columns_preferences) {
        if (filter_by !== "") {
            table_preference.map(item => {
                const has_index = columns_preferences.indexOf(item.id) !== -1 || item.accessor === "" 
                    || item.id === "roles" || item.id === "visit_type_school_type";
                item.is_checked = has_index?true:false;
            });
        } else {
            table_preference.map(item => {
                const has_index = columns_preferences.indexOf(item.accessor) !== -1 || item.accessor === "" 
                    || item.accessor === "roles" || item.accessor === "visit_type_school_type";
                item.is_checked = has_index?true:false;
            });
        }

    }

    return table_preference;
}