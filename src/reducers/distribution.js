import {
    LOAD_DISTRIBUTION_LIST_FLOW, SET_DISTRIBUTION_LIST
} from '../actionTypes/distribution'
  
  const initialState = {
    distributionList: []
  }
  
  const reducer = function distributionReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_DISTRIBUTION_LIST_FLOW:
            return {
                ...state
            }
        case SET_DISTRIBUTION_LIST:
            const distributionList = action.distributionList;
            return {
                ...state,
                distributionList
            }
        default:
            return state
    }
  }
  
  export default reducer