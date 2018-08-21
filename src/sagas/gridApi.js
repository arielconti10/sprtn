import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter, Redirect } from 'react-router-dom'

import Select, { Async } from 'react-select';
import { take, fork, cancel, call, put, cancelled, takeLatest, select } from 'redux-saga/effects'
import axios from '../app/common/axios';
import { verifySelectChecked, createTableToggle, savePreferences, verifyPreferences } from '../app/common/ToggleTable';

import { convertArrayOfObjectsToCSV } from '../app/common/GenerateCSV'

import {
    setColumns, setCreateTable, setDropdownStatus, setColumnsSelected, setInitialColumns, setSelectAll,
    setLoader, setTableInfo, setFilters, setDataAlternative, setCustomFilter, 
    setDropdownActionStatus, setExportData
} from '../actions/gridApi'

const gridUrl = `${process.env.API_URL}`;

/**
 * realiza a construçāo com a coluna de status
 * @param {Array} columns lista com as colunas
 * @return {Array} status_column lista incluindo a coluna de status
 */
function buildStatusColumn(columns, hideButtons) {
    let status_column = columns;
    if (!hideButtons) {
        status_column.unshift({
            Header: "Status",
            accessor: "",
            width: 100,
            headerClassName: 'text-left',
    
            sortable: false,
            Cell: (element) => (
                !element.value.deleted_at ?
                    <div><span className="alert-success grid-record-status">Ativo</span></div>
                    :
                    <div><span className="alert-danger grid-record-status">Inativo</span></div>
            )
        });
    }


    return status_column;
}

/**
 * realiza o "delete" na linha clicada
 * @param {Object} element detalhes do elemento/linha clicado
 * @param {String} apiSpartan classe da API que será chamada
 * @return void
 */
function onClickDelete(apiSpartan, element) {
    const { id, code, name } = element;

    return axios.delete(`${apiSpartan}/${id}`, {
        'code': code ? code.toUpperCase() : '',
        'name': name ? name : '',
        'active': false
    }).then(res => {
        if (res.status === 200) {
            return true;
        }
    }).catch(error => console.log(error));
}

/**
 * ativa um registro da gridapi que esteja inativo
 * @param {String} apiSpartan url a ser chamada
 * @param {Object} element dados a serem atualizados
 * @return void
 */
function onClickActive(apiSpartan, element) {
    const { id, code, name } = element;

    let updateData = {};
    for (var val in element) {
        if (val != 'created_at' && val != 'updated_at' && val != 'deleted_at') {
            updateData[val] = element[val];
        }
    }

    updateData.active = true;

    return axios.put(`${apiSpartan}/${id}`, updateData).then(res => {
        if (res.status === 200) {
            return true;
        }   
    }).catch(function (error) {
        console.log(error)
    });

}

/**
 * realiza a construçāo da tabela, incluindo a coluna de ações
 * @param {Array} columns colunas atuais
 * @param {Bool} hideButtons flag indicando se a tabela terá hideButtons
 * @param {String} urlLink link a ser chamado na URL de ediçāo e exclusāo
 * @return {Array} newColumns novas colunas
 */
function* buildActionColumn(columns, hideButtons, urlLink, apiSpartan) {
    let newColumns = columns;   

    if (!hideButtons) {
        let fields = ['id', 'code', 'name'];
        newColumns.unshift(
            {
                Header: "Ações", accessor: "", sortable: false, width: 80, headerClassName: 'text-center', Cell: (element) => (
                    !element.value.deleted_at ?
                        <div className="acoes">

                            <Link to={`${urlLink}/${element.value.id}`} params={{ id: element.value.id }} 
                                className={`btn btn-primary btn-sm`}
                            >
                                <i className='fa fa-pencil'></i>
                            </Link>
                            <button className='btn btn-danger btn-sm' 
                                onClick={() => {
                                    }
                                }>
                                <i className='fa fa-ban'></i>
                            </button>
                        </div>
                        :
                        <div>
                            <button className='btn btn-success btn-sm'>
                                <i className='fa fa-check-circle'></i>
                            </button>
                        </div>

                )
            }
        )
    }

    return newColumns;
}

function getSchoolAndVisitValues(sub, old_value, column_value_changed, val) {
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

function buildAltColumns(columns) {
    const columnsAltFilter = columns.filter(item => item.sub && item.sub !== '');
    
    let promises = columnsAltFilter.map(item => {
        return axios.get(item.api)
        .then(response => {
            let dataAltAux = [];
            const dados = response.data.data;

            // dataAltAux.splice(item.seq, 0, dados);
            dataAltAux.splice(0, 0, dados);

            // if (dataAltAux && dataAltAux[0][0].code == "super") {
            //     dataAltAux[0].shift();
            // }

            if (response.status === 200) {
                return dataAltAux;
            }
        })
        // .then(final_response => final_response)
        .catch(err => console.log(err));
    })


    // yield put(setDataAlternative(dataAltAux));
    
    return promises;
    // return dataAltAux;
    
}

/**
 * realiza a construçāo de colunas da tabela
 * @param {Array} columns colunas atuais da tabela
 * @param {Boolean} hideButtons flag indicando se o campo de ações será escondido ou nāo
 * @return {Array} newColumns colunas a serem utilizadas
 */
function* buildColumns(columns, hideButtons, urlLink, apiSpartan) {
    let newColumns = columns;
    let newAltColumns = yield call (buildAltColumns, newColumns);
    let finalAltColumn = [];

    let result = yield Promise.all(newAltColumns).then(function(results) {
        finalAltColumn = results;
        // return results;
    })

    yield put(setDataAlternative(finalAltColumn));

    let status_column = buildStatusColumn(newColumns, hideButtons);
    let actions_column = yield call(buildActionColumn, status_column, hideButtons, urlLink, apiSpartan);

    return newColumns;
}

/**
 * seleciona todas as colunas do dropdown 
 * @param {Array} initialColumns lista com as colunas
 * @param {Bool} selectAll flag indicando se será selecionada todas as colunas
 * @return {Array} columnsMap colunas mapeadas de acordo com a flag
 */
function selectAllItems(initialColumns, selectAll) {
    const selectInverse = !selectAll;
    let columnsMap = initialColumns;

    if(columnsMap) {

        columnsMap.map((item) => {
                item.is_checked = selectInverse;
        });
    }

    return columnsMap;
}

/**
 * realiza a atualizaçāo de uma coluna alternativa, que possui select2
 * @param {String} apiSpartan endpoint a ser utilizado
 * @param {Integer} actionId ID da açāo a ser atualizada
 * @param {Array} updateData dados a serem atualizados
 * @return {Bool} updated se a atualizaçāo foi bem-sucedida
 */
function updateAltInfo(apiSpartan, actionId, updateData) {
    return axios.put(`${apiSpartan}/${actionId}`, updateData)
    .then(res => {
        if (res.status === 200) {
            return true;
        }
        
    }).catch(function (error) {
        console.log("ERRO", error)
    });
}

/**
 * obtem a URL a ser pesquisada, de acordo com paginaçāo, filtros e ordenaçāo
 * @param {Object} action objeto referente a uma açāo via react table
 * @return {String} baseURL url a ser retornada e pesquisada
 */
function getUrlSearch(action) {
    const apiSpartan = action.data_api;
    const pageSize = action.pageSize;
    const page = action.page + 1;
    const filtered = action.filtered;
    const customFiltered = action.customFiltered;
    const sorted = action.sorted;
    const defaultOrder = action.defaultOrder;

    let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}`;

    if (action.hidePaginate) {
        baseURL = `/${apiSpartan}?filter[active]=1`;
    }

    if (filtered && filtered.length > 0) {
        filtered.map(function (item, key) {    
            let filter_by = item.id;
            baseURL += `&filter[${filter_by}]=${item.value}`;
        })
    }

    if (defaultOrder && sorted.length === 0) {
        let order_by = defaultOrder;
        baseURL += "&order[" + order_by + "]=asc";
    }

    if (sorted) {
        for (let i = 0; i < sorted.length; i++) {
            let order_by = sorted[i]['id'];

            if (order_by !== "full_name" && order_by !== "school_type.name") {
                baseURL += "&order[" + order_by + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
            } else {
                baseURL += "&order[name]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
            }

        }
    }

    return baseURL;
}

/**
 * com base na URL, realiza a pesquisa dos dados
 * @param {String} baseURL url a ser pesquisada
 * @return {Object} object_return dados a serem retornados, como:
 * dados, total encontrado, número de páginas, etc
 */
function searchData(baseURL) {
    return axios.get(baseURL)
    .then((response) => {
        const dados = response.data.data;

        const object_return = {
            data: dados,
            totalSize: response.data.meta?response.data.meta.pagination.total:0,
            pages: response.data.meta?response.data.meta.pagination.last_page:0,
            page: response.data.meta?response.data.meta.pagination.current_page:0,
            pageSize: response.data.meta?parseInt(response.data.meta.pagination.per_page):0,
            // sorted: sorted,
            // filtered: filtered,
            loading: false
        }

        return object_return;

    })
    .catch(function (error) {
        console.log(error);
    });
}

/**
 * concatena as buscas realizadas
 * @param {Array} filtered lista com parâmetros utilizados na busca
 * @param {Object} filter novo filtro utilizado
 */
function concatFilter(filtered, filter, sameApi) {
    let concat_filter = [];

    if (!sameApi) {
        filtered = [];
    }

    if (filter.hasOwnProperty('id')) {
        concat_filter = filtered.filter(item => item.id !== filter.id);
        if (filter.value !== "") {
            concat_filter = concat_filter.concat(filter);
        }
    }

    return concat_filter;
}

/**
 * realiza o mapeamento de dados para que seja possível realizar a exportaçāo
 * @param {Array} data dados a serem percorridos
 * @return {Array} newData dados mapeados a serem exportados
 */
function mapToExport(data) {
    let newData = [];

    data.map(school => {
        let register = {};

        for (let i in school) {
            if (i != 'students' && i != 'events' && i != 'contacts' && i != 'users' && i != 'secretary' && i != 'marketshare') {
                let value;
                
                if (i == 'school_type' || i == 'subsidiary' || i == 'sector' || i == 'state' || i == 'chain' || i == 'profile' || i == 'congregation') {
                    school[i] ? value = school[i]['name'] : value = school[i];
                } else {
                    value = school[i];
                }

                register[i] = `'${value}`;
            }
        }

        newData.push(register);
    });

    return newData;
}

function* loadColumnsFlow(action) {
    const columns = yield call(buildColumns, action.columnsGrid, action.hideButtons, action.urlLink, action.apiSpartan);
    yield put(setInitialColumns(columns));
    yield put(setColumns(columns));
    yield put(setColumnsSelected(columns));
    yield put(setSelectAll(true));

    const table_preference = verifyPreferences(columns, `prefs_${action.apiSpartan}`);
    const columns_filter = createTableToggle(table_preference);
    
    if (columns_filter.length === 2) {
        yield put(setSelectAll(false));
    }

    if (columns_filter.length === columns.length) {
        yield put(setSelectAll(true));
    }

    yield put(setColumns(columns_filter));
    yield put(setFilters([], action.tableInfo))
}

function* fetchDataFlow(action) {
    yield put(setLoader(true));
    yield put(setTableInfo(action.table_state));

    const url_filter = yield call(getUrlSearch, action.table_state);
    const result_data = yield call(searchData, url_filter);

    yield put(setCreateTable(result_data));
    yield put(setLoader(false));
}

function* exportTableFlow(action) {
    yield put(setLoader(true));
    
    action.tableInfo.hidePaginate = true;
    const url_filter = yield call(getUrlSearch, action.tableInfo);
    const result_data = yield call(searchData, url_filter);
    const maped_data = yield call(mapToExport, result_data.data);

    convertArrayOfObjectsToCSV({ data: maped_data, fileName: 'spartan_escolas' });

    yield put(setExportData(maped_data));

    yield put(setLoader(false));
}

function* deleteDataFlow(action) {
    const deleted = yield call(onClickDelete, action.apiSpartan, action.data.original);

    if (deleted) {
        yield put(setTableInfo(action.table_state));

        const url_filter = yield call(getUrlSearch, action.table_state);
        const result_data = yield call(searchData, url_filter);
    
        yield put(setCreateTable(result_data));
    }

}

function* activeDataFlow(action) {
    const actived = yield call(onClickActive, action.apiSpartan, action.data.original);

    if (actived) {
        yield put(setTableInfo(action.table_state));

        const url_filter = yield call(getUrlSearch, action.table_state);
        const result_data = yield call(searchData, url_filter);
    
        yield put(setCreateTable(result_data));
    }
} 

function* toggleDropdownFlow(action) {
    const status = action.dropdownOpen;
    const status_dropdown = !status;

    yield put(setDropdownStatus(status_dropdown));
}

function* toggleDropdownActionFlow(action) {
    const status = action.dropdownActionsOpen;
    const status_dropdown = !status;

    yield put(setDropdownActionStatus(status_dropdown));
}

function* selectColumnsFlow(action) {
    const columns_map = verifySelectChecked(action.field, action.columns);
    const columns_filter = createTableToggle(action.columns);
    const apiSpartan = action.apiSpartan;

    yield put(setColumns(columns_filter));
    yield put(setColumnsSelected(columns_map));

    savePreferences(`prefs_${apiSpartan}`, columns_filter);
}

function* selectOptionFlow(action) {
    yield put(setLoader(true));
    const updated = yield call(updateAltInfo, action.apiSpartan, action.info_id, action.updatedData);
    if (updated) {
        const url_filter = yield call(getUrlSearch, action.tableInfo);
        const result_data = yield call(searchData, url_filter);
        yield put(setTableInfo(action.tableInfo));
        yield put(setCreateTable(result_data));
        yield put(setLoader(false));

    }
}

function* selectAllFlow(action) {
    const select_inverse = !action.selectAll;
    const initialColumns = action.columsInitial;
    const selectAll = action.selectAll;
    const columns_map = yield call(selectAllItems, initialColumns, selectAll);
    const columns_filter = createTableToggle(initialColumns);
    
    yield put(setSelectAll(select_inverse));
    yield put(setColumnsSelected(columns_map));
    yield put(setColumns(columns_filter));
}

function* loadFilterFlow(action) {
    yield put(setLoader(true));
    const filtered = action.filtered;
    const filter = action.filter;
    const tableInfo = action.tableInfo;

    const sameApi = tableInfo.data_api === action.apiFiltered || !action.apiFiltered;

    let concat_filter = yield call(concatFilter, filtered, filter, sameApi);
    tableInfo.filtered = concat_filter;

    let compostSearch = action.filter.id.indexOf(".");

    if (compostSearch === -1 && action.filter.id !== "status") {
        tableInfo.sorted = [{id: filter.id, desc: false}];
    }
    

    const url_filter = yield call(getUrlSearch, tableInfo);
    const result_data = yield call(searchData, url_filter);

    yield put(setFilters(concat_filter, tableInfo.data_api))
    yield put(setCreateTable(result_data));
    yield put(setLoader(false));

}

// Our watcher (saga).  It will watch for many things.
function* gridApiWatcher() {
  yield [
    takeLatest("LOAD_COLUMNS_FLOW", loadColumnsFlow),
    takeLatest("ON_FETCH_DATA_FLOW", fetchDataFlow),
    takeLatest("ON_DELETE_DATA_FLOW", deleteDataFlow),
    takeLatest("ON_ACTIVE_DATA_FLOW", activeDataFlow),
    takeLatest("TOGGLE_DROPDOWN_FLOW", toggleDropdownFlow),
    takeLatest("TOGGLE_DROPDOWN_ACTION_FLOW", toggleDropdownActionFlow),
    takeLatest("SELECT_COLUMNS_FLOW", selectColumnsFlow),
    takeLatest("SELECT_ALL_FLOW", selectAllFlow),
    takeLatest("LOAD_FILTER_FLOW", loadFilterFlow),
    takeLatest("SELECT_OPTION_FLOW", selectOptionFlow),
    takeLatest("EXPORT_TABLE_FLOW", exportTableFlow)
  ]
}

export default gridApiWatcher;
