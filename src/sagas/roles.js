import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    ROLE_CREATING,
    ROLE_UPDATING,
    ROLE_REQUESTING,
    ROLE_LOADING 
  } from '../actionTypes/roles'
  
  import {
    roleCreateSuccess,
    roleCreateError,
    roleRequestSuccess,
    roleRequestError,
    roleLoadSuccess,
    roleUpdateSuccess,
  } from '../actions/role'
  
  const rolesUrl = `${process.env.API_URL}`
  
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
  
  function roleCreate(user, role) {
    role.active = true
    const url = `${rolesUrl}/role`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
        // passes our token as an "Authorization" header in
        // every POST request.
        Authorization: 'Bearer ' + user.access_token || undefined, // will throw an error if no login
      },
      body: JSON.stringify(role),
    })
  
    return handleRequest(request)
  }
  
  function roleUpdate(user, role) {
  
    let data = {
      'name': role.name,
      'code': role.code,
      'active': role.active
    }
  
    const url = `${rolesUrl}/role/${role.id}`
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
  
  function* roleCreateFlow(action) {
    try {
      const {
        user,
        role
      } = action
  
      if (role.id !== undefined) {
        const updatedrole = yield call(roleUpdate, user, role)
        yield put(roleUpdateSuccess(updatedrole))
      } else {
        const createdrole = yield call(roleCreate, user, role)
        yield put(roleCreateSuccess(createdrole))
  
      }
  
      history.push('/config/regras')
  
    } catch (error) {
      // same with error
      yield put(roleCreateError(error))
    }
  }

  function* roleUpdateFlow(action) {
    try {
      const {
        user,
        role
      } = action
  
        const updatedrole = yield call(roleUpdate, user, role)
        yield put(roleUpdateSuccess(updatedrole))

  
      history.push('/config/regras')
  
    } catch (error) {
      // same with error
      yield put(roleCreateError(error))
    }
  }
  
  function rolesRequest(user) {
    const url = `${rolesUrl}/roles`
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
  
  function* roleRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        role
      } = action
  
      if(role.id !== undefined){
        const current_role = yield call(roleLoad, user, role)
        yield put(roleLoadSuccess(current_role))      
      } else {
        // call to our roleRequestApi function with the user
        const roles = yield call(rolesRequest, user)
        yield put(roleRequestSuccess(roles))
      }
      
      // dispatch the action with our roles!
    } catch (error) {
      yield put(roleRequestError(error))
    }
  }
  
  function* roleLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        role
      } = action
      
      const current_role = yield call(roleLoad, user, role);
      yield put(roleLoadSuccess(current_role))
  
      // dispatch the action with our roles!
    } catch (error) {
      yield put(roleRequestError(error))
    }
  }
  
  function roleLoad(user, role) {
    const request = fetch(`${rolesUrl}/role/${role}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* rolesWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(ROLE_CREATING, roleCreateFlow),
      takeLatest(ROLE_REQUESTING, roleRequestFlow),
      takeLatest(ROLE_LOADING, roleLoadFlow),
      takeLatest(ROLE_UPDATING, roleUpdateFlow),
    ]
  }
  
  export default rolesWatcher