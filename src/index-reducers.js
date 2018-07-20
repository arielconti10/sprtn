import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from './reducers/user'
import login from './reducers/login'
import dropdown from './reducers/dropdown'

const IndexReducer = combineReducers({
  user,
  login,
  form,
  dropdown
})

export default IndexReducer  