import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from './reducers/user'
import login from './reducers/login'

const IndexReducer = combineReducers({
  user,
  login,
  form,
})

export default IndexReducer  