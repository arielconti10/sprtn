import {
    SHIFT_CREATING,
    SHIFT_CREATE_SUCCESS,
    SHIFT_CREATE_ERROR,
    SHIFT_REQUESTING,
    SHIFT_REQUEST_SUCCESS,
    SHIFT_REQUEST_ERROR,
  } from '../actionTypes/shifts'
  
  export const shiftCreate = function shiftCreate (user, shift) {
    return {
      type: SHIFT_CREATING,
      user,
      shift,
    }
  }
  
  export const shiftCreateSuccess = function shiftCreateSuccess (shift) {
    return {
      type: SHIFT_CREATE_SUCCESS,
      shift,
    }
  }
  
  export const shiftCreateError = function shiftCreateError (error) {
    return {
      type: SHIFT_CREATE_ERROR,
      error,
    }
  }
  
  export const shiftRequest = function shiftRequest (client) {
    return {
      type: SHIFT_REQUESTING,
      client,
    }
  }
  
  export const shiftRequestSuccess = function shiftRequestSuccess (shifts) {
    return {
      type: SHIFT_REQUEST_SUCCESS,
      shifts,
    }
  }
  
  export const shiftRequestError = function shiftRequestError (error) {
    return {
      type: SHIFT_REQUEST_ERROR,
      error,
    }
  }
  