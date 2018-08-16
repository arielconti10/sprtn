import {
    RULE_CREATING,
    RULE_CREATE_SUCCESS,
    RULE_CREATE_ERROR,
    RULE_REQUESTING,
    RULE_REQUEST_SUCCESS,
    RULE_LOAD_SUCCESS,
    RULE_LOADING,
    RULE_REQUEST_ERROR,
    RULE_UPDATE_SUCCESS,
    UNLOAD_RULE
  } from '../actionTypes/rules'
  
  const initialState = {
    list: [], // where we'll store rules
    current_rule: null,
    requesting: false,
    successful: false,
    messages: [],
    errors: [],
  }
  
  const reducer = function ruleReducer(state = initialState, action) {
    switch (action.type) {
      case RULE_CREATING:
        return {
          ...state,
          requesting: true,
          successful: false,
          messages: [{
            body: `rule: ${action.rule.name} being created...`,
            time: new Date(),
          }],
          errors: [],
        }
  
        // On success include the new rule into our list
      case RULE_CREATE_SUCCESS:
        return {
          list: state.list.concat([action.rule]),
          requesting: false,
          successful: true,
          messages: [{
            body: `rule: ${action.rule.name} awesomely created!`,
            time: new Date(),
          }],
          errors: [],
        }
  
      case RULE_CREATING:
        return {
          ...state,
          requesting: true,
          successful: false,
          messages: [{
            body: `rule: ${action.rule.name} being updated...`,
            time: new Date(),
          }],
          errors: [],
        }
  
      case RULE_UPDATE_SUCCESS:
        return {
          ...state,
          requesting: false,
          successful: true,
          messages: [{
            body: `rule: ${action.rule.name} updated!`,
            time: new Date(),
          }],
          errors: [],
        }
        
  
      case RULE_CREATE_ERROR:
        return {
          ...state,
          requesting: false,
          successful: false,
          messages: [],
          errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
          }]),
        }
  
      case RULE_REQUESTING:
        return {
          ...state, // ensure that we don't erase fetched ones
          requesting: false,
          successful: true,
          messages: [{
            body: 'Fetching rules...!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case RULE_LOADING:
        return {
          ...state,
          current_rule: null,
          requesting: false,
          successful: true,
          messages: [{
            body: 'Fetching current rule',
            time: new Date()
          }],
          errors: []
        }
  
      case RULE_LOAD_SUCCESS:
        return {
          current_rule: {
            id: action.rule.data.id,
            name: action.rule.data.name,
            code: action.rule.data.code,
            roles: action.rule.data.roles,
            active: action.rule.data.deleted_at !== null ? false : true
          }, // replace with fresh list
          requesting: false,
          successful: true,
          messages: [{
            body: 'current rule awesomely fetched!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case RULE_REQUEST_SUCCESS:
        return {
          list: action.rules, // replace with fresh list
          requesting: false,
          successful: true,
          messages: [{
            body: 'rules awesomely fetched!',
            time: new Date(),
          }],
          errors: [],
        }
  
      case RULE_REQUEST_ERROR:
        return {
          requesting: false,
          successful: false,
          messages: [],
          errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
          }]),
        }

      case UNLOAD_RULE:
        state.current_rule = {};
        
        return {
            ...state
        }
  
      default:
        return state
    }
  }
  
  export default reducer