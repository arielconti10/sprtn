import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from './reducers/user'
import login from './reducers/login'
import dropdown from './reducers/dropdown'
import marketshare from './reducers/marketshare'
import userSchool from './reducers/userSchool'
import indicators from './reducers/indicators'
import shifts from './reducers/shifts'
import localizations from './reducers/localization'
import sectors from './reducers/sector'
import chains from './reducers/chain'
import profiles from './reducers/profile'
import levels from './reducers/level'
import disciplines from './reducers/discipline'
import schoolTypes from './reducers/schoolTypes'
import gridApi from './reducers/gridApi'

const IndexReducer = combineReducers({
  user,
  login,
  form,
  dropdown,
  marketshare,
  userSchool,
  indicators,
  shifts,
  gridApi,
  localizations,
  sectors,
  chains,
  profiles,
  levels,
  disciplines,
  schoolTypes,
})

export default IndexReducer  