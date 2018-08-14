import {
  CHAIN_CREATING,
  CHAIN_CREATE_SUCCESS,
  CHAIN_CREATE_ERROR,
  CHAIN_REQUESTING,
  CHAIN_REQUEST_SUCCESS,
  CHAIN_LOAD_SUCCESS,
  CHAIN_LOADING,
  CHAIN_REQUEST_ERROR,
  CHAIN_UPDATING,
  CHAIN_UPDATE_SUCCESS,
  CHAIN_CURRENT_CLEAR
} from '../actionTypes/chain'

const initialState = {
  list: [], 
  current_chain: null,
  requesting: false,
  successful: false,
  messages: [],
  errors: [],
}

const reducer = function chainReducer(state = initialState, action) {
  switch (action.type) {
    case CHAIN_CREATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        current_chain: null,
        messages: [{
          body: `chain: ${action.chain.name} being created...`,
          time: new Date(),
        }],
        errors: [],
      }


    case CHAIN_CREATE_SUCCESS:
      return {
        list: state.list.concat([action.chain]),
        requesting: false,
        successful: true,
        messages: [{
          body: `chain: ${action.chain.name} awesomely created!`,
          time: new Date(),
        }],
        errors: [],
      }

    case CHAIN_UPDATING:
      return {
        ...state,
        requesting: true,
        successful: false,
        messages: [{
          body: `chain: ${action.chain.name} being updated...`,
          time: new Date(),
        }],
        errors: [],
      }

    case CHAIN_UPDATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        messages: [{
          body: `chain: ${action.chain.name} updated!`,
          time: new Date(),
        }],
        errors: [],
      }
      

    case CHAIN_CREATE_ERROR:
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

    case CHAIN_REQUESTING:
      return {
        ...state, // ensure that we don't erase fetched ones
        requesting: false,
        successful: true,
        current_chain: null,        
        messages: [{
          body: 'Fetching chain...!',
          time: new Date(),
        }],
        errors: [],
      }

    case CHAIN_LOADING:
      return {
        ...state,
        current_chain: null,
        requesting: false,
        successful: true,
        messages: [{
          body: 'Fetching current chain',
          time: new Date()
        }],
        errors: []
      }

    case CHAIN_LOAD_SUCCESS:
      return {
        current_chain: {
          id: action.chain.data.id,
          name: action.chain.data.name,
          active: action.chain.data.deleted_at !== null ? false : true
        }, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'current chain awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case CHAIN_REQUEST_SUCCESS:
      return {
        list: action.chains, // replace with fresh list
        requesting: false,
        successful: true,
        messages: [{
          body: 'chains awesomely fetched!',
          time: new Date(),
        }],
        errors: [],
      }

    case CHAIN_REQUEST_ERROR:
      return {
        requesting: false,
        successful: false,
        messages: [],
        errors: state.errors.concat([{
          body: action.error.toString(),
          time: new Date(),
        }]),
      }

      case CHAIN_CURRENT_CLEAR:
        return {
            current_chain: null,
        }

    default:
      return state
  }
}

export default reducer