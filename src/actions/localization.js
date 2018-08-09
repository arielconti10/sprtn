import {
    LOCALIZATION_CREATING,
    LOCALIZATION_CREATE_SUCCESS,
    LOCALIZATION_CREATE_ERROR,
    LOCALIZATION_UPDATING,
    LOCALIZATION_UPDATE_SUCCESS,
    LOCALIZATION_UPDATE_ERROR,
    LOCALIZATION_LOADING,
    LOCALIZATION_LOAD_SUCCESS,
    LOCALIZATION_REQUESTING,
    LOCALIZATION_REQUEST_SUCCESS,
    LOCALIZATION_REQUEST_ERROR,
  } from '../actionTypes/localization'
  
  export const localizationCreate = function localizationCreate (user, localization) {
    return {
      type: LOCALIZATION_CREATING,
      user,
      localization,
    }
  }
  
  export const localizationCreateSuccess = function localizationCreateSuccess (localization) {
    return {
      type: LOCALIZATION_CREATE_SUCCESS,
      localization,
    }
  }
  
  export const localizationCreateError = function localizationCreateError (error) {
    return {
      type: LOCALIZATION_CREATE_ERROR,
      error,
    }
  }

  export const localizationUpdate = function localizationUpdate (user, localization) {
    return {
      type: LOCALIZATION_UPDATING,
      user,
      localization,
    }
  }
  
  export const localizationLoad = function localizationLoad(user, localization) {      
      return {
          type: LOCALIZATION_LOADING,
          user,
          localization,
      }
  }

  export const localizationLoadSuccess = function localizationLoadSuccess(localization){
      console.log(localization)
      return {
          type: LOCALIZATION_LOAD_SUCCESS,
          localization
      }
  }

  export const localizationUpdateSuccess = function localizationUpdateSuccess (localization) {
    return {
      type: LOCALIZATION_UPDATE_SUCCESS,
      localization,
    }
  }
  
  export const localizationUpdateError = function localizationUpdateError (error) {
    return {
      type: LOCALIZATION_UPDATE_ERROR,
      error,
    }
  }
  
  export const localizationRequest = function localizationRequest (client) {
    return {
      type: LOCALIZATION_REQUESTING,
      client,
    }
  }
  
  export const localizationRequestSuccess = function localizationRequestSuccess (localizations) {
    return {
      type: LOCALIZATION_REQUEST_SUCCESS,
      localizations,
    }
  }
  
  export const localizationRequestError = function localizationRequestError (error) {
    return {
      type: LOCALIZATION_REQUEST_ERROR,
      error,
    }
  }
  