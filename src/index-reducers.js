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
import congregations from './reducers/congregation'
import subsidiarys from './reducers/subsidiary'
import job_titles from './reducers/job_title'
import schoolTypes from './reducers/schoolTypes'
import gridApi from './reducers/gridApi'
import roles from './reducers/roles'
import rules from './reducers/rules'
import schools from './reducers/school';
import schoolDash from './reducers/schoolDash';
import contact from './reducers/contact';
import students from './reducers/students';
import event from './reducers/events';
import distribution from './reducers/distribution'
import meeting from './reducers/meeting'

const IndexReducer = combineReducers({
  user,
  login,
  form,
  dropdown,
  marketshare,
  subsidiarys,
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
  congregations,
  job_titles,
  schoolTypes,
  roles,
  rules,
  schools,
  schoolDash,
  contact,
  students,
  event,
  distribution,
  meeting
})

export default IndexReducer  