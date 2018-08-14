import {
    ROLE_CREATING,
    ROLE_CREATE_SUCCESS,
    ROLE_CREATE_ERROR,
    ROLE_UPDATING,
    ROLE_UPDATE_SUCCESS,
    ROLE_UPDATE_ERROR,
    ROLE_LOADING,
    ROLE_LOAD_SUCCESS,
    ROLE_REQUESTING,
    ROLE_REQUEST_SUCCESS,
    ROLE_REQUEST_ERROR,
  } from '../actionTypes/roles'
  
  export const roleCreate = function roleCreate (user, role) {
    return {
      type: ROLE_CREATING,
      user,
      role,
    }
  }
  
  export const roleCreateSuccess = function roleCreateSuccess (role) {
    return {
      type: ROLE_CREATE_SUCCESS,
      role,
    }
  }
  
  export const roleCreateError = function roleCreateError (error) {
    return {
      type: ROLE_CREATE_ERROR,
      error,
    }
  }

  export const roleUpdate = function roleUpdate (user, role) {
    return {
      type: ROLE_UPDATING,
      user,
      role,
    }
  }
  
  export const roleLoad = function roleLoad(user, role) {      
      return {
          type: ROLE_LOADING,
          user,
          role,
      }
  }

  export const roleLoadSuccess = function roleLoadSuccess(role){
      return {
          type: ROLE_LOAD_SUCCESS,
          role
      }
  }

  export const roleUpdateSuccess = function roleUpdateSuccess (role) {
    return {
      type: ROLE_UPDATE_SUCCESS,
      role,
    }
  }
  
  export const roleUpdateError = function roleUpdateError (error) {
    return {
      type: ROLE_UPDATE_ERROR,
      error,
    }
  }
  
  export const roleRequest = function roleRequest (client) {
    return {
      type: ROLE_REQUESTING,
      client,
    }
  }
  
  export const roleRequestSuccess = function roleRequestSuccess (roles) {
    return {
      type: ROLE_REQUEST_SUCCESS,
      roles,
    }
  }
  
  export const roleRequestError = function roleRequestError (error) {
    return {
      type: ROLE_REQUEST_ERROR,
      error,
    }
  }
  