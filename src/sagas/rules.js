import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    RULE_CREATING,
    RULE_UPDATING,
    RULE_REQUESTING,
    RULE_LOADING 
  } from '../actionTypes/rules'
  
  import {
    ruleCreateSuccess,
    ruleCreateError,
    ruleRequestSuccess,
    ruleRequestError,
    ruleLoadSuccess,
    ruleUpdateSuccess,
  } from '../actions/rule'
  
  const rulesUrl = `${process.env.API_URL}`
  
  // We'll use this function to redirect to different routes based on cases
  import {
    createHashHistory
  } from 'history'
  
  export const history = createHashHistory()
  
  // Nice little helper to deal with the response
  // converting it to json, and handling errors
  function handleRequest(request) {
    return request
      .then(response => response.json())
      .then(json => json)
      .catch((error) => {
        throw error
      })
  }
  
  function ruleCreate(user, rule) {
    rule.active = true

    const final_array = [];
    const roles_id = rule.roles.map(function (item) {
        const role_object = {role_id : item};
        final_array.push(role_object);
    });

    rule.roles = [];
    
    rule.roles = final_array;

    console.log(rule);

    const url = `${rulesUrl}/rule`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
        // passes our token as an "Authorization" header in
        // every POST request.
        Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
      },
      body: JSON.stringify(rule),
    })
  
    return handleRequest(request)
  }
  
  function ruleUpdate(user, rule) {
  
    let data = {
      'name': rule.name,
      'code': rule.code,
      'active': rule.active
    }

    const final_array = [];
    const roles_id = rule.roles.map(function (item) {
        const role_object = {role_id : item};
        final_array.push(role_object);
    });

    data.roles = [];
    
    data.roles = final_array;
    
    const url = `${rulesUrl}/rule/${rule.id}`
    const request = fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
        Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
      },
      body: JSON.stringify(data),
    })
  
    return handleRequest(request)
  }
  
  function* ruleCreateFlow(action) {
    try {
      const {
        user,
        rule
      } = action
  
      if (rule.id !== undefined) {
        const updatedrule = yield call(ruleUpdate, user, rule)
        yield put(ruleUpdateSuccess(updatedrule))
      } else {
        const createdrule = yield call(ruleCreate, user, rule)
        yield put(ruleCreateSuccess(createdrule))
  
      }
  
      history.push('/config/permissoes')
  
    } catch (error) {
      // same with error
      yield put(ruleCreateError(error))
    }
  }

  function* ruleUpdateFlow(action) {
    try {
      const {
        user,
        rule
      } = action
  
    const updatedrule = yield call(ruleUpdate, user, rule)
    yield put(ruleUpdateSuccess(updatedrule))

  
      history.push('/config/permissoes')
  
    } catch (error) {
      // same with error
      yield put(ruleCreateError(error))
    }
  }
  
  function rulesRequest(user) {
    const url = `${rulesUrl}/rules`
    const request = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
    })
  
    return handleRequest(request)
  }
  
  function* ruleRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        rule
      } = action
  
      if(rule.id !== undefined){
        const current_rule = yield call(ruleLoad, user, rule)
        yield put(ruleLoadSuccess(current_rule))      
      } else {
        // call to our ruleRequestApi function with the user
        const rules = yield call(rulesRequest, user)
        yield put(ruleRequestSuccess(rules))
      }
      
      // dispatch the action with our rules!
    } catch (error) {
      yield put(ruleRequestError(error))
    }
  }
  
  function* ruleLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        rule
      } = action
      
      const current_rule = yield call(ruleLoad, user, rule);
      yield put(ruleLoadSuccess(current_rule))
  
      // dispatch the action with our rules!
    } catch (error) {
      yield put(ruleRequestError(error))
    }
  }
  
  function ruleLoad(user, rule) {
    const request = fetch(`${rulesUrl}/rule/${rule}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* rulesWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(RULE_CREATING, ruleCreateFlow),
      takeLatest(RULE_REQUESTING, ruleRequestFlow),
      takeLatest(RULE_LOADING, ruleLoadFlow),
      takeLatest(RULE_UPDATING, ruleUpdateFlow),
    ]
  }
  
  export default rulesWatcher