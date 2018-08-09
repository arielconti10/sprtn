import { LOAD_COLUMNS_FLOW, SET_COLUMNS, ON_FETCH_DATA_FLOW, SET_CREATE_TABLE, ON_DELETE_DATA_FLOW, ON_ACTIVE_DATA_FLOW,
    TOGGLE_DROPDOWN_FLOW, SET_DROPDOWN_STATUS, SELECT_COLUMNS_FLOW, SET_COLUMNS_SELECTED, SET_INITIAL_COLUMNS,
    SELECT_ALL, SELECT_ALL_FLOW, SET_LOADER, LOAD_FILTER_FLOW, SET_TABLE_INFO, SET_FILTERS, SET_DATA_ALTERNATIVE,
    SELECT_OPTION_FLOW
} from '../actionTypes/gridApi';

export function loadColumnsFlow(columnsGrid, hideButtons, urlLink, apiSpartan, columnsAlt, tableInfo, onFetchDataFlow) {
    return {
        type: LOAD_COLUMNS_FLOW,
        columnsGrid,
        hideButtons,
        urlLink,
        apiSpartan,
        columnsAlt,
        tableInfo,
        onFetchDataFlow
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

export function setLoader(loading) {
    return {
        type: SET_LOADER,
        loading
    }
}

export function loadFilterFlow(filter, filtered, tableInfo) {
    return {
        type: LOAD_FILTER_FLOW,
        filter,
        filtered,
        tableInfo
    }
}

export function setTableInfo(tableInfo) {
    return {
        type: SET_TABLE_INFO,
        tableInfo
    }
}

export function setFilters(filtered) {
    return {
        type: SET_FILTERS,
        filtered
    }
}

export function setDataAlternative(dataAlternative) {
    return {
        type: SET_DATA_ALTERNATIVE,
        dataAlternative
    }
}

export function selectOptionFlow(updatedData, apiSpartan, info_id, tableInfo) {
    return {
        type: SELECT_OPTION_FLOW,
        updatedData,
        apiSpartan,
        info_id,
        tableInfo
    }
}