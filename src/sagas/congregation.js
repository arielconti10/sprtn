import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    CONGREGATION_CREATING,
    CONGREGATION_UPDATING,
    CONGREGATION_REQUESTING,
    CONGREGATION_LOADING 
  } from '../actionTypes/congregation'
  
  import {
    congregationCreateSuccess,
    congregationCreateError,
    congregationRequestSuccess,
    congregationRequestError,
    congregationLoadSuccess,
    congregationUpdateSuccess,
  } from '../actions/congregation'
  
  const apiUrl = `${process.env.API_URL}/congregation`
  
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
  
  function congregationCreate(user, congregation) {
    congregation.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(congregation),
    })
  
    return handleRequest(request)
  }
  
  function congregationUpdate(user, congregation, active) {
      
    let data = {
      'name': congregation.name,
      'active': congregation.active,
      'code': congregation.code,
    }

    const url = `${apiUrl}/${congregation.id}`
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
  
  function* congregationCreateFlow(action) {
    try {
      const {
        user,
        congregation,
      } = action
      if (congregation.id !== undefined) {
        const updatedcongregation = yield call(congregationUpdate, user, congregation)
        yield put(congregationUpdateSuccess(updatedcongregation))
      } else {
        const createdcongregation = yield call(congregationCreate, user, congregation)
        yield put(congregationCreateSuccess(createdcongregation))
  
      }
  
      history.push('/cadastro/congregacoes')
  
    } catch (error) {
      // same with error
      yield put(congregationCreateError(error))
    }
  }
  
  function congregationRequest(user) {
    const url = `${apiUrl}`
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
  
  function* congregationRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        congregation
      } = action
  
      if(congregation.id !== undefined){
        const current_congregation = yield call(congregationLoad, user, congregation)
        yield put(congregationLoadSuccess(current_congregation))      
      } else {
        const congregation = yield call(congregationRequest, user)
        yield put(congregationRequestSuccess(congregation))
      }
      
    } catch (error) {
      yield put(congregationRequestError(error))
    }
  }
  
  function* congregationLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        congregation
      } = action
      
      const current_congregation = yield call(congregationLoad, user, congregation)
      yield put(congregationLoadSuccess(current_congregation))
    } catch (error) {
      yield put(congregationRequestError(error))
    }
  }
  
  function congregationLoad(user, congregation) {
    const request = fetch(`${apiUrl}/${congregation}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* congregationWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(CONGREGATION_CREATING, congregationCreateFlow),
      takeLatest(CONGREGATION_UPDATING, congregationCreateFlow),
      takeLatest(CONGREGATION_REQUESTING, congregationRequestFlow),
      takeLatest(CONGREGATION_LOADING, congregationLoadFlow),
    ]
  }
  
  export default congregationWatcher