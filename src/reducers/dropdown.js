import { DROPDOWN_SHOW, DROPDOWN_HIDE } from '../actionTypes/dropdown'

const initialState = {
  dropdownOpen: false,
}

const reducer = function dropdownReducer(state = initialState, action) {
  switch (action.type) {
    case DROPDOWN_SHOW:
      return {
        dropdownOpen: true
      }

    case DROPDOWN_HIDE:
      return {
        dropdownOpen: false

      }

    default:
      return state
  }
}

export default reducer