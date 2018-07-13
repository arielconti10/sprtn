import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { push } from 'react-router-redux';

// Helper for api errors
// import { handleApiErrors } from '../lib/api-errors'

// Our login constants
import {  
    LOGIN_REQUESTING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
  } from '../actionTypes/login'

// So that we can modify our Client piece of state
import {  
    setUser,
    unsetUser,
} from '../actions/user'

import {
    USER_UNSET
} from '../actionTypes/user'

const loginUrl = `${process.env.API_URL}/login`

function loginApi (username, password) {
    const grant_type = 'password';
    const client_id = '2';
    const client_secret = 'X2zabNZ1I8xThjTgfXXIfMZfWm84pLD4ITrE70Yx';

    return fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, grant_type, client_id, client_secret }),
      })
        .then(response => response.json())
        .then(json => json)
        .catch((error) => { throw error })
}

function* logout () {  
    // dispatches the CLIENT_UNSET action
    yield put(unsetUser())
  
    // remove our token
    localStorage.removeItem('access_token')
  
    // redirect to the /login screen
    yield put(push('/login'))
  }

function* loginFlow (username, password) {
    let token
    try {
      // try to call to our loginApi() function.  Redux Saga
      // will pause here until we either are successful or
      // receive an error
      token = yield call(loginApi, username, password)

      // inform Redux to set our client token, this is non blocking so...
      yield put(setUser(token))
  
      // .. also inform redux that our login was successful
      yield put({ type: LOGIN_SUCCESS })
  
      // set a stringified version of our token to localstorage on our domain
      localStorage.setItem('token', JSON.stringify(token))
  
      // redirect them to WIDGETS!
      yield put(push('#/dashboard/indicadores'))
    } catch (error) {
      // error? send it to redux
      yield put({ type: LOGIN_ERROR, error })
    } finally {
      // No matter what, if our `forked` `task` was cancelled
      // we will then just redirect them to login
      if (yield cancelled()) {
        yield put(push('/login'))
      }
    }

    // return the token for health and wealth
    return token
}

function* loginWatcher () {

    while(true){
        const { username, password } = yield take(LOGIN_REQUESTING)
        const task = yield fork(loginFlow, username, password)
        const action = yield take([USER_UNSET, LOGIN_ERROR])
        if (action.type === USER_UNSET) yield cancel(task)
        yield call(logout)

    }
}
export default loginWatcher  
