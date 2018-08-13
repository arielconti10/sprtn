import {
    CHAIN_CREATING,
    CHAIN_CREATE_SUCCESS,
    CHAIN_CREATE_ERROR,
    CHAIN_UPDATING,
    CHAIN_UPDATE_SUCCESS,
    CHAIN_UPDATE_ERROR,
    CHAIN_LOADING,
    CHAIN_LOAD_SUCCESS,
    CHAIN_REQUESTING,
    CHAIN_REQUEST_SUCCESS,
    CHAIN_REQUEST_ERROR,
    CHAIN_CURRENT_CLEAR,
  } from '../actionTypes/chain'
  
  export const chainCreate = function chainCreate (user, chain) {
    return {
      type: CHAIN_CREATING,
      user,
      chain,
    }
  }
  
  export const chainCreateSuccess = function chainCreateSuccess (chain) {
    return {
      type: CHAIN_CREATE_SUCCESS,
      chain,
    }
  }
  
  export const chainCreateError = function chainCreateError (error) {
    return {
      type: CHAIN_CREATE_ERROR,
      error,
    }
  }

  export const chainUpdate = function chainUpdate (user, chain, active) {
    return {
      type: CHAIN_UPDATING,
      user,
      chain,
      active
    }
  }
  
  export const chainLoad = function chainLoad(user, chain) {  

      return {
          type: CHAIN_LOADING,
          user,
          chain,
      }
  }

  export const chainLoadSuccess = function chainLoadSuccess(chain){
      return {
          type: CHAIN_LOAD_SUCCESS,
          chain
      }
  }

  export const chainUpdateSuccess = function chainUpdateSuccess (chain) {
    return {
      type: CHAIN_UPDATE_SUCCESS,
      chain,
    }
  }
  
  export const chainUpdateError = function chainUpdateError (error) {
    return {
      type: CHAIN_UPDATE_ERROR,
      error,
    }
  }
  
  export const chainRequest = function chainRequest (client) {
    return {
      type: CHAIN_REQUESTING,
      client,
    }
  }
  
  export const chainRequestSuccess = function chainRequestSuccess (chains) {
    return {
      type: CHAIN_REQUEST_SUCCESS,
      chains,
    }
  }
  
  export const chainRequestError = function chainRequestError (error) {
    return {
      type: CHAIN_REQUEST_ERROR,
      error,
    }
  }

  export const chainCurrentClear = function chainCurrentClear(user) {
      return {
          type: CHAIN_CURRENT_CLEAR,
          user
      }
  }
  