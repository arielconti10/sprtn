import {
    call,
    put,
    takeLatest
  } from 'redux-saga/effects'
  // import { handleApiErrors } from '../lib/api-errors'
  import {
    CHAIN_CREATING,
    CHAIN_UPDATING,
    CHAIN_REQUESTING,
    CHAIN_LOADING 
  } from '../actionTypes/chain'
  
  import {
    chainCreateSuccess,
    chainCreateError,
    chainRequestSuccess,
    chainRequestError,
    chainLoadSuccess,
    chainUpdateSuccess,
  } from '../actions/chain'
  
  const apiUrl = `${process.env.API_URL}/chain`
  
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
  
  function chainCreate(user, chain) {
    chain.active = true
    const url = `${apiUrl}`
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token || undefined,
      },
      body: JSON.stringify(chain),
    })
  
    return handleRequest(request)
  }
  
  function chainUpdate(user, chain, active) {
      
    let data = {
      'name': chain.name,
      'active': chain.active,
    }

    const url = `${apiUrl}/${chain.id}`
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
  
  function* chainCreateFlow(action) {
    try {
      const {
        user,
        chain,
      } = action
      if (chain.id !== undefined) {
        const updatedchain = yield call(chainUpdate, user, chain)
        yield put(chainUpdateSuccess(updatedchain))
      } else {
        const createdchain = yield call(chainCreate, user, chain)
        yield put(chainCreateSuccess(createdchain))
  
      }
  
      history.push('/cadastro/redes')
  
    } catch (error) {
      // same with error
      yield put(chainCreateError(error))
    }
  }
  
  function chainRequest(user) {
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
  
  function* chainRequestFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        chain
      } = action
  
      if(chain.id !== undefined){
        const current_chain = yield call(chainLoad, user, chain)
        yield put(chainLoadSuccess(current_chain))      
      } else {
        const chains = yield call(chainRequest, user)
        yield put(chainRequestSuccess(chain))
      }
      
    } catch (error) {
      yield put(chainRequestError(error))
    }
  }
  
  function* chainLoadFlow(action) {
    try {
      // grab the user from our action
      const {
        user,
        chain
      } = action
      
      const current_chain = yield call(chainLoad, user, chain)
      yield put(chainLoadSuccess(current_chain))
    } catch (error) {
      yield put(chainRequestError(error))
    }
  }
  
  function chainLoad(user, chain) {
    const request = fetch(`${apiUrl}/${chain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + user.access_token || undefined,
        },
      })
      return handleRequest(request)
  }
  
  function* chainWatcher() {
    // each of the below RECEIVES the action from the .. action
    yield [
      takeLatest(CHAIN_CREATING, chainCreateFlow),
      takeLatest(CHAIN_UPDATING, chainCreateFlow),
      takeLatest(CHAIN_REQUESTING, chainRequestFlow),
      takeLatest(CHAIN_LOADING, chainLoadFlow),
    ]
  }
  
  export default chainWatcher