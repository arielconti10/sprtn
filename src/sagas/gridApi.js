import React, { Component } from 'react';
import { Router, hashHistory, Link, browserHistory, withRouter, Redirect } from 'react-router-dom'

import { take, fork, cancel, call, put, cancelled, takeLatest, select } from 'redux-saga/effects'
import axios from '../app/common/axios';
import { verifySelectChecked, createTableToggle, savePreferences, verifyPreferences } from '../app/common/ToggleTable';

import {
    setColumns, setCreateTable, setDropdownStatus, setColumnsSelected, setInitialColumns, setSelectAll,
} from '../actions/gridApi'

const gridUrl = `${process.env.API_URL}`;

/**
 * realiza a construçāo com a coluna de status
 * @param {Array} columns lista com as colunas
 * @return {Array} status_column lista incluindo a coluna de status
 */
function buildStatusColumn(columns) {
    let status_column = columns;
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

/**
 * realiza a construçāo de colunas da tabela
 * @param {Array} columns colunas atuais da tabela
 * @param {Boolean} hideButtons flag indicando se o campo de ações será escondido ou nāo
 * @return {Array} newColumns colunas a serem utilizadas
 */
function* buildColumns(columns, hideButtons, urlLink, apiSpartan) {
    let newColumns = columns;
    let status_column = buildStatusColumn(newColumns);
    let actions_column = yield call(buildActionColumn, status_column, hideButtons, urlLink, apiSpartan);

    return actions_column;
}

function verifyFilter(filter_id, state, count, value, baseURL) {
    let filter_by = filter_id;

    //verifica se é uma coluna composta, por exemplo full_name (nome + sobrenome)
    //para escolher método de ordenaçāo
    const column_compare = state.columns.filter(function (column) {
        return column.accessor == filter_id;
    });

    if (column_compare[count]) {
        filter_by = column_compare[count].filter_by;
        if (filter_by) {
            if (value != "") {
                const value_split = value.split(/ (.*)/);
                baseURL += `&filter[name]=${value_split[0]}&filter[lastname]=${value_split[1]}`;
            }
            return baseURL;
        } else {
            return false;
        }
    }
}

/**
 * verifica a ordenaçāo a ser realizada
 * contempla validaçāo de coluna composta, quando é, por exemplo full_name (nome + sobrenome)
 * @param {String} sorted_id coluna que será ordenada 
 * @param {Object} state estado referente ao react table 
 * @param {Integer} count posiçāo atual dos filtros de ordenaçāo
 * @return {String} order_by valor que será ordenado 
 */
function verifyOrderBy(sorted_id, state, count, columns) {
    let order_by = sorted_id;

    //verifica se é uma coluna composta, por exemplo full_name (nome + sobrenome)
    //para escolher método de ordenaçāo
    if (columns) {
        
        const column_compare = columns.filter(function (column) {
            return column.accessor == sorted_id;
        });

        if(column_compare[count]) {
            if (column_compare[count].is_compost) {
                order_by = column_compare[count].order_by;
            }
        } else {
            order_by = "name";
        }
    }

    return order_by;
}

/**
 * seleciona todas as colunas do dropdown 
 * @param {Array} initialColumns lista com as colunas
 * @param {Bool} selectAll flag indicando se será selecionada todas as colunas
 * @return {Array} columnsMap colunas mapeadas de acordo com a flag
 */
function selectAllItems(initialColumns, selectAll) {
    const selectInverse = !selectAll;
    let columnsMap = [];

    if(!selectInverse) {
        columnsMap = initialColumns;

        columnsMap.map((item) => {
                item.is_checked = selectInverse;
        });
    }

    return columnsMap;
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
    const sorted = action.sorted;
    const defaultOrder = action.defaultOrder;

    let baseURL = `/${apiSpartan}?paginate=${pageSize}&page=${page}`;

    if (filtered) {
        filtered.map(function (item, key) {    
            let filter_by = item.id;
            baseURL += `&filter[${filter_by}]=${item.value}`;
        })
    }

    if (defaultOrder) {
        let order_by = defaultOrder;
        baseURL += "&order[" + order_by + "]=asc";
    }

    if (sorted) {
        for (let i = 0; i < sorted.length; i++) {
            let order_by = sorted[i]['id'];
            baseURL += "&order[" + order_by + "]=" + (sorted[i]['desc'] == false ? 'asc' : 'desc');
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
            totalSize: response.data.meta.pagination.total,
            pages: response.data.meta.pagination.last_page,
            page: response.data.meta.pagination.current_page,
            pageSize: parseInt(response.data.meta.pagination.per_page),
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

function* loadColumnsFlow(action) {
    const columns = yield call(buildColumns, action.columnsGrid, action.hideButtons, action.urlLink, action.apiSpartan);
    yield put(setInitialColumns(columns));
    yield put(setColumns(columns));
    yield put(setColumnsSelected(columns));
    yield put(setSelectAll(true));
}

function* fetchDataFlow(action) {
    const url_filter = yield call(getUrlSearch, action.table_state);
    const result_data = yield call(searchData, url_filter);


    yield put(setCreateTable(result_data));
}

function* deleteDataFlow(action) {
    const deleted = yield call(onClickDelete, action.apiSpartan, action.data.original);

    if (deleted) {
        const url_filter = yield call(getUrlSearch, action.table_state);
        const result_data = yield call(searchData, url_filter);
    
        yield put(setCreateTable(result_data));
    }

}

function* activeDataFlow(action) {
    const actived = yield call(onClickActive, action.apiSpartan, action.data.original);

    if (actived) {
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

function* selectColumnsFlow(action) {
    const columns_map = verifySelectChecked(action.field, action.columns);
    const columns_filter = createTableToggle(action.columns);
    const apiSpartan = action.apiSpartan;

    yield put(setColumns(columns_filter));
    yield put(setColumnsSelected(columns_map));

    savePreferences(`prefs_${apiSpartan}`, columns_filter);
}

function* selectAllFlow(action) {
    const select_inverse = !action.selectAll;
    const initialColumns = action.columsInitial;
    const selectAll = action.selectAll;
    const columns_map = yield call(selectAllItems, initialColumns, selectAll);
    const columns_filter = createTableToggle(initialColumns);

    console.log(columns_map);
    console.log(columns_filter);

    yield put(setSelectAll(select_inverse));
    yield put(setInitialColumns(columns_map));
    yield put(setColumns(columns_filter));    

    /*
                    const columns_filter = createTable(this.state.initial_columns);
                savePreferences("prefs_discipline", columns_filter);
                this.setState({ initial_columns: columns_map, table_columns: columns_filter, table_columns: columns_filter });
    */
}

// Our watcher (saga).  It will watch for many things.
function* gridApiWatcher() {
  yield [
    takeLatest("LOAD_COLUMNS_FLOW", loadColumnsFlow),
    takeLatest("ON_FETCH_DATA_FLOW", fetchDataFlow),
    takeLatest("ON_DELETE_DATA_FLOW", deleteDataFlow),
    takeLatest("ON_ACTIVE_DATA_FLOW", activeDataFlow),
    takeLatest("TOGGLE_DROPDOWN_FLOW", toggleDropdownFlow),
    takeLatest("SELECT_COLUMNS_FLOW", selectColumnsFlow),
    takeLatest("SELECT_ALL_FLOW", selectAllFlow)
  ]
}

export default gridApiWatcher;
