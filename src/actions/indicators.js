
import {
  INDICATORS_REQUESTING,
  INDICATORS_REQUEST_SUCCESS,
  INDICATORS_REQUEST_ERROR,
} from '../actionTypes/indicators'


export const indicatorsRequest = function indicatorsRequest (user) {
  return {
    type: INDICATORS_REQUESTING,
    user,
  }
}

export const indicatorsRequestSuccess = function indicatorsRequestSuccess (
    indicators, 
    schools, 
    schoolTypes, 
    studentTypes,
    contacts,
    actions,
    coverage,
    total_schools,
    total_students,
    dataSchoolTypes,
    dataCoverage,
){
  return {
    type: INDICATORS_REQUEST_SUCCESS,
    indicators,
    schools, 
    schoolTypes,
    studentTypes,
    contacts,
    actions,
    coverage,
    total_schools,
    total_students,
    dataSchoolTypes,
    dataCoverage,
  }
}

export const indicatorsRequestError = function indicatorsRequestError (error) {

  return {
    type: INDICATORS_REQUEST_ERROR,
    error,
  }
}
