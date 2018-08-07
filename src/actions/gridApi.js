import { LOAD_COLUMNS_FLOW, SET_COLUMNS, ON_FETCH_DATA_FLOW, SET_CREATE_TABLE, ON_DELETE_DATA_FLOW, ON_ACTIVE_DATA_FLOW,
    TOGGLE_DROPDOWN_FLOW, SET_DROPDOWN_STATUS, SELECT_COLUMNS_FLOW, SET_COLUMNS_SELECTED, SET_INITIAL_COLUMNS,
    SELECT_ALL, SELECT_ALL_FLOW 
} from '../actionTypes/gridApi';

export function loadColumnsFlow(columnsGrid, hideButtons, urlLink, apiSpartan) {
    return {
        type: LOAD_COLUMNS_FLOW,
        columnsGrid,
        hideButtons,
        urlLink,
        apiSpartan
    }
}

export function setColumns(columnsGrid, hideButtons) {
    return {
        type: SET_COLUMNS,
        columnsGrid,
        hideButtons
    }
}

export function onFetchDataFlow(table_state) {
    return {
        type: ON_FETCH_DATA_FLOW,
        table_state
    }
}

export function setCreateTable(params_table) {
    return {
        type: SET_CREATE_TABLE,
        params_table
    }
}

export function onDeleteDataFlow(apiSpartan, data, table_state) {
    return {
        type: ON_DELETE_DATA_FLOW,
        apiSpartan,
        data,
        table_state
    }
}

export function onActiveDataFlow(apiSpartan, data, table_state) {
    return {
        type: ON_ACTIVE_DATA_FLOW,
        apiSpartan,
        data,
        table_state
    }
}

export function toggleDropdownFlow(dropdownOpen) {
    return {
        type: TOGGLE_DROPDOWN_FLOW,
        dropdownOpen
    }
}

export function setDropdownStatus(dropdownOpen) {
    return {
        type: SET_DROPDOWN_STATUS,
        dropdownOpen
    }
}

export function selectColumnsFlow(field, columns, apiSpartan) {
    return {
        type: SELECT_COLUMNS_FLOW,
        field,
        columns,
        apiSpartan
    }
}

export function setColumnsSelected(columnsSelected) {
    return {
        type: SET_COLUMNS_SELECTED,
        columnsSelected
    }
}

export function setInitialColumns(columsInitial) {
    return {
        type: SET_INITIAL_COLUMNS,
        columsInitial
    }
}

export function setSelectAll(selectAll) {
    return {
        type: SELECT_ALL,
        selectAll
    }
}

export function selectAllFlow(selectAll, columsInitial) {
    return {
        type: SELECT_ALL_FLOW,
        selectAll,
        columsInitial
    }
}