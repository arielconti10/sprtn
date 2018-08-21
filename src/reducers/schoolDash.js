import {
    LOAD_DASH_FLOW, SET_YEARS, CHANGE_YEAR_FLOW, SET_YEAR_PARAM, SET_PUBLISHERS,
    UPDATE_LOADER, SET_COLECTIONS
} from '../actionTypes/schoolDash'
  
  const initialState = {
    publishers: [
        ['Editoras', '%']
    ],
    colections: [
        ['Coleções', '%', { 'role': 'style' }],['',0,'']
    ]
  }
  
  const reducer = function schoolDashReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_DASH_FLOW:
            return {
                ...state
            }
        case SET_YEARS:
            const years = action.years;
            return {
                ...state,
                years
            }
        case CHANGE_YEAR_FLOW:
            return {
                ...state
            }
        case SET_YEAR_PARAM:
            const year_param = action.year_param;
            return {
                ...state,
                year_param
            }
        case SET_PUBLISHERS:
            const publishers = action.publishers;
            return {
                ...state,
                publishers
            }
        case UPDATE_LOADER:
            const ringLoad = action.ringLoad;
            return {
                ...state,
                ringLoad
            }
        case SET_COLECTIONS:
            const colections = action.colections;
            return {
                ...state,
                colections
            }
      default:
        return state
    }
  }
  
  export default reducer