import {
  call,
  put,
  takeLatest
} from 'redux-saga/effects'
import {
  USER_CREATING,
  USER_UPDATING,
  USER_REQUESTING,
  USER_LOADING,
} from '../actionTypes/user'

import {
  userCreateSuccess,
  userCreateError,
  userRequestSuccess,
  userRequestError,
  userLoadSuccess,
  userUpdateSuccess,
  setRoles,
  setRoleId,
  setSubsidiaries,
  setSubsidiaryId,
  setSectors,
  setSectorId, 
  updateLoader,
  setStatus,
  setSuperiorList,
} from '../actions/user'

const usersUrl = `${process.env.API_URL}`

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

function userCreate(userCurrent, user) {
    const userSave = user;

    if (userSave.sector_id) {
        userSave.sector_id = user.sector_id.value;
    }

    if (userSave.subsidiary_id) {
        userSave.subsidiary_id = user.subsidiary_id.value;
    }

    if (userSave.role_id) {
        userSave.role_id = user.role_id.value;
    }
    
    const url = `${usersUrl}/user`
    const request = fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        
        // passes our token as an "Authorization" header in
        // every POST request.
        Authorization: 'Bearer ' + userCurrent.access_token || undefined, // will throw an error if no login
        },
        body: JSON.stringify(userSave),
    })

    return handleRequest(request);
}

function listRoles(userCurrent) {
    const url = `${usersUrl}/role`
    const request = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + userCurrent.access_token || undefined,
      },
    })
  
    return handleRequest(request)
}

function userUpdate(userCurrent, user) {

    let data = user;

    if (user.sector_id) {
        data.sector_id = user.sector_id.value;
    }

    if (user.subsidiary_id) {
        data.subsidiary_id = user.subsidiary_id.value;
    }

    if (user.role_id) {
        data.role_id = user.role_id.value;
    }

    const url = `${usersUrl}/user/${user.id}`
    const request = fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
        Authorization: 'Bearer ' + userCurrent.access_token || undefined, // will throw an error if no login
      },
      body: JSON.stringify(data),
    })
  
    return handleRequest(request)
  }

function* userCreateFlow(action) {
  try {
    const {
      userCurrent,
      user
    } = action

    if (user.id !== undefined) {
      const updateduser = yield call(userUpdate, userCurrent, user)
      yield put(userUpdateSuccess(updateduser))
    } else {
      const createduser = yield call(userCreate, userCurrent, user)
    //   yield put(userCreateSuccess(createduser))

    }

    history.push('/config/usuarios')

  } catch (error) {
    // same with error
    yield put(userCreateError(error))
  }
}

function* userUpdateFlow(action) {
    try {
      const {
        userCurrent,
        user
      } = action
  
      
    const updateduser = yield call(userUpdate, userCurrent, user)
    
    // yield put(userUpdateSuccess(updateduser))
      
  
      history.push('/config/usuarios')
  
    } catch (error) {
      // same with error
      yield put(userCreateError(error))
    }
  }

function getUrlSearch(input_name) {
    let new_url = `${usersUrl}/user?paginate=10&page=1`;
    const lastname_exists = input_name !== "" && input_name.indexOf(" ") !== -1;

    if (input_name.length > 0) {
        if (!lastname_exists) {
            new_url = new_url + `&filter[name]=${input_name}`;
        } else {
            const firts_name = input_name.substr(0,input_name.indexOf(' '));
            const last_name = input_name.substr(input_name.indexOf(' ')+1);
            new_url = new_url + `&filter[name]=${firts_name}&filter[lastname]=${last_name}`;
        }
    }

    new_url = new_url + "&order[name]=asc";
    return new_url;
}

function userLoad(userCurrent, user_id) {
    const request = fetch(`${usersUrl}/user/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + userCurrent.access_token || undefined,
        },
      })
      return handleRequest(request)
  }

function listSubsidiaries(userCurrent) {
    const url = `${usersUrl}/subsidiary?order[name]=asc`
    const request = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + userCurrent.access_token || undefined,
      },
    })
  
    return handleRequest(request)
}

function mapToSelect(array_data) {
    let final_map = [];

    array_data.map(item => {
        const label = `${item.code} - ${item.name}`;
        const object_map = {value: item.id, label};
        final_map.push(object_map);
    })
    
    return final_map;
}

function findSubsidiary(subsidiary_id, userCurrent) {
    const url = `${usersUrl}/subsidiary/${subsidiary_id}`
    const request = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + userCurrent.access_token || undefined,
      },
    })
  
    return handleRequest(request)
}

function searchUser(urlSearch, userCurrent) {
    const request = fetch(urlSearch, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // passe our token as an "Authorization" header
        Authorization: 'Bearer ' + userCurrent.access_token || undefined,
      },
    })
  
    return handleRequest(request)
}

function searchSuperior(superior_id, userCurrent) {
    const urlSearch = `${usersUrl}/user/${superior_id.value}`

    const request = fetch(urlSearch, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // passe our token as an "Authorization" header
          Authorization: 'Bearer ' + userCurrent.access_token || undefined,
        },
      })
    
      return handleRequest(request)
}

function* userRequestFlow(action) {
  try {
    // grab the user from our action
    const {
      userCurrent,
      user
    } = action

    if(user.id !== undefined){
      const current_user = yield call(userLoad, userCurrent, user)
      yield put(userLoadSuccess(current_user))      
    } else {
      // call to our userRequestApi function with the userCurrent
      const users = yield call(usersRequest, userCurrent)
      yield put(userRequestSuccess(users))
    }
    
    // dispatch the action with our shifts!
  } catch (error) {
    yield put(userRequestError(error))
  }
}

function* roleListFlow(action) {
  try {
    // grab the user from our action
    const {
      userCurrent
    } = action
    
    const roles = yield call(listRoles, userCurrent);
    let roles_map = [];

    roles.data.map(item => {
        const object_map = {value: item.id, label: item.name};
        roles_map.push(object_map);
    })
    
    yield put(setRoles(roles_map));

    // dispatch the action with our users!
  } catch (error) {
    yield put(userRequestError(error))
  }
}

function* changeRoleFlow(action) {
    const role_info = action.role_info;
    yield put(setRoleId(role_info));
} 

function* changeSectorFlow(action) {
    const sector_info = action.sector_info;
    yield put(setSectorId(sector_info));
}

function* changeSubsidiaryFlow(action) {
    const subsidiary_info = action.subsidiary_info;
    const userCurrent = action.userCurrent;
    yield put(setSubsidiaryId(subsidiary_info));

    // if (subsidiary_info && subsidiary_info !== null) {
    // if (subsidiary_info) {
    const subsidiary = yield call(findSubsidiary, subsidiary_info.value, userCurrent);
    const sectorsMap = yield call(mapToSelect, subsidiary.data.sectors);
    yield put(setSectors(sectorsMap));
    // }    
}

function* getSubsidiariesFlow(action) {
    try {
        // grab the user from our action
        const {
          userCurrent
        } = action
        
        const subsidiaries = yield call(listSubsidiaries, userCurrent);
        const subsidiariesMap = yield call(mapToSelect, subsidiaries.data);

        yield put(setSubsidiaries(subsidiariesMap));
      } catch (error) {
        yield put(userRequestError(error))
      }
}

function* userLoadFlow(action) {
    yield put(updateLoader(true));
    try {
      // grab the user from our action
      const {
        userCurrent,
        user_id
      } = action
      
      const current_user = yield call(userLoad, userCurrent, user_id);
      yield put(userLoadSuccess(current_user.data));
      yield put(setSectorId(current_user.data.sector_id));
  
    } catch (error) {
      yield put(userRequestError(error))
    }
    yield put(updateLoader(false));
  }

function* changeStatusFlow(action) {
    yield put(setStatus(action.status));
}

function* updateSuperior(superior_data, user, userCurrent) {
    const userUpdate = user;

    userUpdate.superior_registration = superior_data.registration;
    userUpdate.parent_id = superior_data.id;
    userUpdate.superior_name = superior_data.full_name;

    return userUpdate;
}

function* searchByNameFlow(action) {
    const search_url = yield call(getUrlSearch, action.input_info);
    const users_search = yield call(searchUser, search_url, action.userCurrent);

    yield put(setSuperiorList(users_search.data));
}

function* userUpdateWithSuperior(action) {
    const superior_data = yield call(searchSuperior, action.superior_id, action.userCurrent);
    const user_data = yield call(updateSuperior, superior_data.data, action.user, action.userCurrent);
    const updateduser = yield call(userUpdate, action.userCurrent, user_data)      
    history.push('/config/usuarios')
}

function* userWatcher() {
  yield [
    takeLatest('ROLE_LIST_FLOW', roleListFlow),
    takeLatest("CHANGE_ROLE_FLOW", changeRoleFlow),
    takeLatest("GET_SUBSIDIARIES_FLOW", getSubsidiariesFlow),
    takeLatest("CHANGE_SUBSIDIARY_FLOW", changeSubsidiaryFlow),
    takeLatest("CHANGE_SECTOR_FLOW", changeSectorFlow),
    takeLatest("USER_CREATING", userCreateFlow),
    takeLatest("USER_LOADING", userLoadFlow),
    takeLatest("CHANGE_STATUS_FLOW", changeStatusFlow),
    takeLatest("USER_UPDATING", userUpdateFlow),
    takeLatest("SEARCH_BY_NAME_FLOW", searchByNameFlow),
    takeLatest("SUPERIOR_UPDATE_FLOW", userUpdateWithSuperior)
  ]
}

export default userWatcher