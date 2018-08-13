import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    SUBSIDIARY_CREATING,
    SUBSIDIARY_UPDATING,
    SUBSIDIARY_REQUESTING,
    SUBSIDIARY_LOADING 
  } from '../actionTypes/subsidiary'
  
  import {
    subsidiaryCreateSuccess,
    subsidiaryCreateError,
    subsidiaryRequestSuccess,
    subsidiaryRequestError,
    subsidiaryLoadSuccess,
    subsidiaryUpdateSuccess,
  } from '../actions/subsidiary'
  
  const apiUrl = `${process.env.API_URL}/subsidiary`
  
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
  
  function subsidiaryCreate(user, subsidiary) {
    subsidiary.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(subsidiary),
    })
  
    return handleRequest(request)
  }
  
  function subsidiaryUpdate(user, subsidiary, active) {
      
    let data = {
      'name': subsidiary.name,
      'active': subsidiary.active,
      'code': subsidiary.code,
      'sectors': subsidiary.sectors
    }

    const url = `${apiUrl}/${subsidiary.id}`
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
  
  function* subsidiaryCreateFlow(action) {
    try {
      const {
        user,
        subsidiary,
      } = action
      if (subsidiary.id !== undefined) {
        const updatedsubsidiary = yield call(subsidiaryUpdate, user, subsidiary)
        yield put(subsidiaryUpdateSuccess(updatedsubsidiary))
      } else {
        const createdsubsidiary = yield call(subsidiaryCreate, user, subsidiary)
        yield put(subsidiaryCreateSuccess(createdsubsidiary))
  
      }
  
      history.push('/cadastro/filiais')
  
    } catch (error) {
      // same with error
      yield put(subsidiaryCreateError(error))
    }
  }
  
  function subsidiaryRequest(user) {
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
  
  function* subsidiaryRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        subsidiary
      } = action
  
      if(subsidiary.id !== undefined){
        const current_subsidiary = yield call(subsidiaryLoad, user, subsidiary)
        yield put(subsidiaryLoadSuccess(current_subsidiary))      
      } else {
        const subsidiary = yield call(subsidiaryRequest, user)
        yield put(subsidiaryRequestSuccess(subsidiary))
      }
      
    } catch (error) {
      yield put(subsidiaryRequestError(error))
    }
  }
  
  function* subsidiaryLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        subsidiary
      } = action
      
      const current_subsidiary = yield call(subsidiaryLoad, user, subsidiary)

      yield put(subsidiaryLoadSuccess(current_subsidiary))
    } catch (error) {
      yield put(subsidiaryRequestError(error))
    }
  }
  
  function subsidiaryLoad(user, subsidiary) {
    const request = fetch(`${apiUrl}/${subsidiary}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* subsidiaryWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(SUBSIDIARY_CREATING, subsidiaryCreateFlow),
      takeLatest(SUBSIDIARY_UPDATING, subsidiaryCreateFlow),
      takeLatest(SUBSIDIARY_REQUESTING, subsidiaryRequestFlow),
      takeLatest(SUBSIDIARY_LOADING, subsidiaryLoadFlow),
    ]
  }
  
  export default subsidiaryWatcher