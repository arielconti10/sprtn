import States from './SchoolsStates'

const INITIAL_STATE = { list: [], page: 1, totalSize: 30}

export default (state = INITIAL_STATE, action) => {
    
    switch(action.type) {
        case States.SCHOOLS_LIST_FETCHED:
        console.log('action', action)
            return { ...state, 
                     list: action.payload.data, 
                     //page: action.payload.meta.pagination.current_page,
                     totalSize: action.payload.meta.pagination.total }
        default:
            return state
    }
}