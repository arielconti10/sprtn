import States from './SchoolsStates'

const INITIAL_STATE = { page: 1, data: [], sizePerPage: 10, totalSize: 0}

export default (state = INITIAL_STATE, action) => {
    
    switch(action.type) {
        case States.SCHOOLS_LIST_FETCHED:
            return { ...state, 
                     data: action.payload.data, 
                     page: action.payload.meta.pagination.current_page,
                     totalSize: action.payload.meta.pagination.total }
        default:
            return state
    }
}