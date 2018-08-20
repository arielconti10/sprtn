import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    PROFILE_CREATING,
    PROFILE_UPDATING,
    PROFILE_REQUESTING,
    PROFILE_LOADING 
  } from '../actionTypes/profile'
  
  import {
    profileCreateSuccess,
    profileCreateError,
    profileRequestSuccess,
    profileRequestError,
    profileLoadSuccess,
    profileUpdateSuccess,
  } from '../actions/profile'
  
  const apiUrl = `${process.env.API_URL}/profile`
  
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
  
  function profileCreate(user, profile) {
    profile.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(profile),
    })
  
    return handleRequest(request)
  }
  
  function profileUpdate(user, profile, active) {
      
    let data = {
      'name': profile.name,
      'active': profile.active,
      'code': profile.code,
    }

    const url = `${apiUrl}/${profile.id}`
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
  
  function* profileCreateFlow(action) {
    try {
      const {
        user,
        profile,
      } = action
      if (profile.id !== undefined) {
        const updatedprofile = yield call(profileUpdate, user, profile)
        yield put(profileUpdateSuccess(updatedprofile))
      } else {
        const createdprofile = yield call(profileCreate, user, profile)
        yield put(profileCreateSuccess(createdprofile))
  
      }
  
      history.push('/cadastro/perfis')
  
    } catch (error) {
      // same with error
      yield put(profileCreateError(error))
    }
  }
  
  function profileRequest(user) {
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
  
  function* profileRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        profile
      } = action
  
      if(profile.id !== undefined){
        const current_profile = yield call(profileLoad, user, profile)
        yield put(profileLoadSuccess(current_profile))      
      } else {
        const profiles = yield call(profileRequest, user)
        yield put(profileRequestSuccess(profile))
      }
      
    } catch (error) {
      yield put(profileRequestError(error))
    }
  }
  
  function* profileLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        profile
      } = action
      
      const current_profile = yield call(profileLoad, user, profile)
      yield put(profileLoadSuccess(current_profile))
    } catch (error) {
      yield put(profileRequestError(error))
    }
  }
  
  function profileLoad(user, profile) {
    const request = fetch(`${apiUrl}/${profile}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* profileWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(PROFILE_CREATING, profileCreateFlow),
      takeLatest(PROFILE_UPDATING, profileCreateFlow),
      takeLatest(PROFILE_REQUESTING, profileRequestFlow),
      takeLatest(PROFILE_LOADING, profileLoadFlow),
    ]
  }
  
  export default profileWatcher