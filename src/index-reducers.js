import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from './reducers/user'
import login from './reducers/login'
import dropdown from './reducers/dropdown'
import marketshare from './reducers/marketshare'

const IndexReducer = combineReducers({
  user,
  login,
  form,
  dropdown,
  marketshare
})

export default IndexReducer  