import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { createHashHistory } from 'history'

export const history = createHashHistory()

import nav from '../template/components/Sidebar/_nav';

// Our login constants
import {
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../actionTypes/login'

// So that we can modify our Client piece of state
import {
  setUser,
  setUserPicture,
  unsetUser,
  permissionsRequest
} from '../actions/user'

import { USER_UNSET } from '../actionTypes/user';

const loginUrl = `${process.env.API_URL}/login`
const nav_itens = nav.items;

function loginApi(username, password) {
  const grant_type = 'password'
  const client_id = '2'
  const client_secret = 'X2zabNZ1I8xThjTgfXXIfMZfWm84pLD4ITrE70Yx'
  return fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, grant_type, client_id, client_secret }),
  })
    // .then(handleApiErrors)
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

function getUserPhoto(username, key) {
  // const key = this.props.user.sso_token;
  // const user = this.props.user.username;
  let base64
  const sso_token = key
  const user = username
  const baseURL = `https://login.ftd.com.br/api/photo/${sso_token}/${user}`
  const image = new Image()

  image.crossOrigin = 'Anonymous'
  image.src = baseURL

  toDataURL(baseURL, function (dataUrl) {
    base64 = dataUrl
  })

  return fetch(baseURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response = base64)
    .catch((error) => { throw error })
}

function loadPermissions(rules) {
  // const array_permissions = [];
  nav_itens.map(item => {
    const children_actions = item.children.map(children => children.action);

    children_actions.map(action => {
      const index = rules.find(rule => rule.code == action);

      if (index === undefined) {
        const index_action = children_actions.indexOf(action);
        let childrens = item.children;
        delete childrens[index_action];
      }
    });
  });

  
  nav_itens.map((item, key) => {

    item.children = item.children.filter(function (n) { return n != undefined });
    
    if (item.children.length == 0) {
      delete nav_itens[key];
      delete nav_itens.key;
    }
  })

  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  nav_itens.clean(null)
  nav_itens.clean(undefined)
  sessionStorage.setItem('rules', rules)
  return nav_itens;
}
function* logout() {
  // dispatches the USER_UNSET action
  yield put(unsetUser())

  // remove our token
  sessionStorage.removeItem('access_token')

  // redirect to the /login screen
  history.push('/login')
}

function* loginFlow(username, password) {
  let token
  let picture
  let rules
  let nav_itens
  try {

    // try to call to our loginApi() function.  Redux Saga
    // will pause here until we either are successful or
    // receive an error
    token = yield call(loginApi, username, password)

    // try to call to our getUserphoto() function.  Redux Saga
    // will pause here until we either are successful or
    // receive an error
    picture = yield call(getUserPhoto, username, token.sso_token)

    // inform Redux to set our client token, this is non blocking so...
    yield put(setUser(token))

    // .. also inform redux that our login was successful
    yield put({ type: LOGIN_SUCCESS })

    yield put(setUserPicture(picture))

    // try to call to our getPermissions() function.  Redux Saga
    // will pause here until we either are successful or
    // receive an error
    nav_itens = yield call(loadPermissions, token.user.role.rules)

    yield put(permissionsRequest(nav_itens))

    // set a stringified version of our token to localstorage on our domain
    sessionStorage.setItem('access_token', token.access_token)

    // redirect them to WIDGETS!
    history.push('/dashboard/indicadores')
  } catch (error) {
    // error? send it to redux
    yield put({ type: LOGIN_ERROR, error })
  } finally {
    // No matter what, if our `forked` `task` was cancelled
    // we will then just redirect them to login
    if (yield cancelled()) {
      history.push('/login')
    }
  }

  // return the token for health and wealth
  return token
}

// Our watcher (saga).  It will watch for many things.
function* loginWatcher() {
  // Generators halt execution until their next step is ready/occurring
  // So it's not like this loop is firing in the background 1000/sec
  // Instead, it says, "okay, true === true", and hits the first step...
  while (true) {
    //
    // ... and in this first it sees a yield statement with `take` which
    // pauses the loop.  It will sit here and WAIT for this action.
    //
    // yield take(ACTION) just says, when our generator sees the ACTION
    // it will pull from that ACTION's payload that we send up, its
    // username and password.  ONLY when this happens will the loop move
    // forward...
    const { username, password } = yield take(LOGIN_REQUESTING)

    // ... and pass the username and password to our loginFlow() function.
    // The fork() method spins up another "process" that will deal with
    // handling the loginFlow's execution in the background!
    // Think, "fork another process".
    //
    // It also passes back to us, a reference to this forked task
    // which is stored in our const task here.  We can use this to manage
    // the task.
    //
    // However, fork() does not block our loop.  It's in the background
    // therefore as soon as our loop executes this it mores forward...
    const task = yield fork(loginFlow, username, password)

    // ... and begins looking for either USER_UNSET or LOGIN_ERROR!
    // That's right, it gets to here and stops and begins watching
    // for these tasks only.  Why would it watch for login any more?
    // During the life cycle of this generator, the user will login once
    // and all we need to watch for is either logging out, or a login
    // error.  The moment it does grab either of these though it will
    // once again move forward...
    const action = yield take([USER_UNSET, LOGIN_ERROR])

    // ... if, for whatever reason, we decide to logout during this
    // cancel the current action.  i.e. the user is being logged
    // in, they get impatient and start hammering the logout button.
    // this would result in the above statement seeing the USER_UNSET
    // action, and down here, knowing that we should cancel the
    // forked `task` that was trying to log them in.  It will do so
    // and move forward...
    if (action.type === USER_UNSET) yield cancel(task)

    // ... finally we'll just log them out.  This will unset the client
    // access token ... -> follow this back up to the top of the while loop
    yield call(logout)
  }
}

export default loginWatcher
