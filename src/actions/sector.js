import {
    SECTOR_CREATING,
    SECTOR_CREATE_SUCCESS,
    SECTOR_CREATE_ERROR,
    SECTOR_UPDATING,
    SECTOR_UPDATE_SUCCESS,
    SECTOR_UPDATE_ERROR,
    SECTOR_LOADING,
    SECTOR_LOAD_SUCCESS,
    SECTOR_REQUESTING,
    SECTOR_REQUEST_SUCCESS,
    SECTOR_REQUEST_ERROR,
    SECTOR_CURRENT_CLEAR,
  } from '../actionTypes/sector'
  
  export const sectorCreate = function sectorCreate (user, sector) {
    return {
      type: SECTOR_CREATING,
      user,
      sector,
    }
  }
  
  export const sectorCreateSuccess = function sectorCreateSuccess (sector) {
    return {
      type: SECTOR_CREATE_SUCCESS,
      sector,
    }
  }
  
  export const sectorCreateError = function sectorCreateError (error) {
    return {
      type: SECTOR_CREATE_ERROR,
      error,
    }
  }

  export const sectorUpdate = function sectorUpdate (user, sector) {
    return {
      type: SECTOR_UPDATING,
      user,
      sector,
    }
  }
  
  export const sectorLoad = function sectorLoad(user, sector) {      
      return {
          type: SECTOR_LOADING,
          user,
          sector,
      }
  }

  export const sectorLoadSuccess = function sectorLoadSuccess(sector){
      return {
          type: SECTOR_LOAD_SUCCESS,
          sector
      }
  }

  export const sectorUpdateSuccess = function sectorUpdateSuccess (sector) {
    return {
      type: SECTOR_UPDATE_SUCCESS,
      sector,
    }
  }
  
  export const sectorUpdateError = function sectorUpdateError (error) {
    return {
      type: SECTOR_UPDATE_ERROR,
      error,
    }
  }
  
  export const sectorRequest = function sectorRequest (client) {
    return {
      type: SECTOR_REQUESTING,
      client,
    }
  }
  
  export const sectorRequestSuccess = function sectorRequestSuccess (sectors) {
    return {
      type: SECTOR_REQUEST_SUCCESS,
      sectors,
    }
  }
  
  export const sectorRequestError = function sectorRequestError (error) {
    return {
      type: SECTOR_REQUEST_ERROR,
      error,
    }
  }

  export const sectorCurrentClear = function sectorCurrentClear(user) {
      console.log('current clear')
      return {
          type: SECTOR_CURRENT_CLEAR,
          user
      }
  }
  