import { LOAD_COLUMNS_FLOW, SET_COLUMNS, ON_FETCH_DATA_FLOW, SET_CREATE_TABLE, ON_DELETE_DATA_FLOW, ON_ACTIVE_DATA_FLOW, 
    TOGGLE_DROPDOWN_FLOW, SET_DROPDOWN_STATUS, SELECT_COLUMNS_FLOW, SET_COLUMNS_SELECTED, SET_INITIAL_COLUMNS,
    SELECT_ALL, SELECT_ALL_FLOW, SET_LOADER, LOAD_FILTER_FLOW, SET_TABLE_INFO, SET_FILTERS, SET_DATA_ALTERNATIVE,
    SELECT_OPTION_FLOW, SET_CUSTOM_FILTER
} from "../actionTypes/gridApi";

const initialState = {
    columnsGrid: [],
    page: 1,
    pageSize: 10,
    data: [],
    filtered: [],
    sorted: [],
    loading: false,
    dropdownOpen: false,
    columnsSelected: [],
    columnsAlt: [],
    dataAlternative:[]
};

const reducer = function gridApiReducer (state = initialState, action) {
    switch (action.type) {
        case LOAD_COLUMNS_FLOW:
            return {
                ...state
            }
        case SET_COLUMNS:
            const columnsGrid = action.columnsGrid;

            return {
                ...state,
                columnsGrid
            }
        case ON_FETCH_DATA_FLOW:
            return {
                ...state
            }
        case SET_CREATE_TABLE:
            const params_table = action.params_table;
            const data = params_table.data;
            const page = params_table.page;
            const pages = params_table.pages;
            const pageSize = params_table.pageSize;
            const totalSize = params_table.totalSize;
            
            return {
                ...state,
                data,
                page,
                pages,
                pageSize,
                totalSize
            }
        case ON_DELETE_DATA_FLOW:
            return {
                ...state
            }
        case ON_ACTIVE_DATA_FLOW:
            return {
                ...state
            }
        case TOGGLE_DROPDOWN_FLOW:
            return {
                ...state
            }
        case SET_DROPDOWN_STATUS:
            const dropdownOpen = action.dropdownOpen;

            return {
                ...state,
                dropdownOpen    
            }
        case SELECT_COLUMNS_FLOW:
            return {
                ...state
            }
        case SET_COLUMNS_SELECTED:
            const columnsSelected = action.columnsSelected;    

            return {
                ...state,
                columnsSelected
            }
        case SET_INITIAL_COLUMNS:
            const columsInitial = action.columsInitial;
            return {
                ...state,
                columsInitial
            }
        case SELECT_ALL:
            const selectAll = action.selectAll;
            return {
                ...state,
                selectAll
            }
        case SELECT_ALL_FLOW:
            return {
                ...state
            }
        case SET_LOADER:
            const loading = action.loading;
            return {
                ...state,
                loading
            }
        case LOAD_FILTER_FLOW:
            return {
                ...state
            }
        case SET_TABLE_INFO:
            const tableInfo = action.tableInfo;

            if (state.filtered.length > 0 && (tableInfo.sorted.length > 0 || tableInfo.page >= 0)
                && tableInfo.data_api === tableInfo.api_filtered) {
                tableInfo.filtered = state.filtered;
            } else {
                tableInfo.filtered = [];
            }
            
            return {
                ...state,
                tableInfo
            }
        case SET_FILTERS:
            const filtered = action.filtered;
            const apiFiltered = action.apiFiltered;
            return {
                ...state,
                filtered,
                apiFiltered
            }
        case SET_DATA_ALTERNATIVE:
            const dataAlternative = action.dataAlternative;
            return {
                ...state,
                dataAlternative
            }
        case SELECT_OPTION_FLOW:
            return {
                ...state
            }
        case SET_CUSTOM_FILTER:
            const customFilter = action.customFilter;
            return {
                ...state,
                customFilter
            }
        default:
            return state
    }
}

  export default reducer
  