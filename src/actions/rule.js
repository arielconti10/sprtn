import {
    RULE_CREATING,
    RULE_CREATE_SUCCESS,
    RULE_CREATE_ERROR,
    RULE_UPDATING,
    RULE_UPDATE_SUCCESS,
    RULE_UPDATE_ERROR,
    RULE_LOADING,
    RULE_LOAD_SUCCESS,
    RULE_REQUESTING,
    RULE_REQUEST_SUCCESS,
    RULE_REQUEST_ERROR,
  } from '../actionTypes/rules'
  
  export const ruleCreate = function ruleCreate (user, rule) {
    return {
      type: RULE_CREATING,
      user,
      rule,
    }
  }
  
  export const ruleCreateSuccess = function ruleCreateSuccess (rule) {
    return {
      type: RULE_CREATE_SUCCESS,
      rule,
    }
  }
  
  export const ruleCreateError = function ruleCreateError (error) {
    return {
      type: RULE_CREATE_ERROR,
      error,
    }
  }

  export const ruleUpdate = function ruleUpdate (user, rule) {
    return {
      type: RULE_UPDATING,
      user,
      rule,
    }
  }
  
  export const ruleLoad = function ruleLoad(user, rule) {      
      return {
          type: RULE_LOADING,
          user,
          rule,
      }
  }

  export const ruleLoadSuccess = function ruleLoadSuccess(rule){
      return {
          type: RULE_LOAD_SUCCESS,
          rule
      }
  }

  export const ruleUpdateSuccess = function ruleUpdateSuccess (rule) {
    return {
      type: RULE_UPDATE_SUCCESS,
      rule,
    }
  }
  
  export const ruleUpdateError = function ruleUpdateError (error) {
    return {
      type: rule_UPDATE_ERROR,
      error,
    }
  }
  
  export const ruleRequest = function ruleRequest (client) {
    return {
      type: RULE_REQUESTING,
      client,
    }
  }
  
  export const ruleRequestSuccess = function ruleRequestSuccess (rules) {
    return {
      type: RULE_REQUEST_SUCCESS,
      rules,
    }
  }
  
  export const ruleRequestError = function ruleRequestError (error) {
    return {
      type: RULE_REQUEST_ERROR,
      error,
    }
  }
  