import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from './reducers/user'
import login from './reducers/login'
import dropdown from './reducers/dropdown'
import marketshare from './reducers/marketshare'
import userSchool from './reducers/userSchool'
import indicators from './reducers/indicators'
import shifts from './reducers/shifts'

const IndexReducer = combineReducers({
  user,
  login,
  form,
  dropdown,
  marketshare,
  userSchool,
  indicators,
  shifts
})

export default IndexReducer  