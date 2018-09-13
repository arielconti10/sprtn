import {
    SHIFT_CREATING,
    SHIFT_CREATE_SUCCESS,
    SHIFT_CREATE_ERROR,
    SHIFT_UPDATING,
    SHIFT_UPDATE_SUCCESS,
    SHIFT_UPDATE_ERROR,
    SHIFT_LOADING,
    SHIFT_LOAD_SUCCESS,
    SHIFT_REQUESTING,
    SHIFT_REQUEST_SUCCESS,
    SHIFT_REQUEST_ERROR,
    SHIFT_UNLOAD
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

  export const shiftUpdate = function shiftUpdate (user, shift) {
    return {
      type: SHIFT_UPDATING,
      user,
      shift,
    }
  }
  
  export const shiftLoad = function shiftLoad(user, shift) {      
      return {
          type: SHIFT_LOADING,
          user,
          shift,
      }
  }

  export const shiftLoadSuccess = function shiftLoadSuccess(shift){
      return {
          type: SHIFT_LOAD_SUCCESS,
          shift
      }
  }

  export const shiftUpdateSuccess = function shiftUpdateSuccess (shift) {
    return {
      type: SHIFT_UPDATE_SUCCESS,
      shift,
    }
  }
  
  export const shiftUpdateError = function shiftUpdateError (error) {
    return {
      type: SHIFT_UPDATE_ERROR,
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

  export function shiftUnload() {
      return {
          type: SHIFT_UNLOAD
      }
  }
  