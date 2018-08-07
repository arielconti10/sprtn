
import {
  INDICATORS_REQUESTING,
  INDICATORS_REQUEST_SUCCESS,
  INDICATORS_REQUEST_ERROR,
} from '../actionTypes/indicators'


export const indicatorsRequest = function indicatorsRequest (client) {
  return {
    type: INDICATORS_REQUESTING,
    client,
  }
}

export const indicatorsRequestSuccess = function indicatorsRequestSuccess (indicators, schools) {
  return {
    type: INDICATORS_REQUEST_SUCCESS,
    indicators,
    schools
  }
}

export const indicatorsRequestError = function indicatorsRequestError (error) {
  return {
    type: INDICATORS_REQUEST_ERROR,
    error,
  }
}
