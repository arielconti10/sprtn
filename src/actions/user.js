import { USER_SET, PICTURE_SET, USER_UNSET, GET_PERMISSIONS,
    USER_CREATING,
    USER_CREATE_SUCCESS,
    USER_CREATE_ERROR,
    USER_UPDATING,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_ERROR,
    USER_LOADING,
    USER_LOAD_SUCCESS,
    USER_REQUESTING,
    USER_REQUEST_SUCCESS,
    USER_REQUEST_ERROR,
    ROLE_LIST_FLOW, 
    SET_ROLES,
    CHANGE_ROLE_FLOW,
    SET_ROLE_ID,
    GET_SUBSIDIARIES_FLOW,
    SET_SUBSIDIARIES,
    CHANGE_SUBSIDIARY_FLOW,
    SET_SUBSIDIARY_ID,
    SET_SECTORS,
    CHANGE_SECTOR_FLOW,
    SET_SECTOR_ID,
    UPDATE_LOADER,
    CHANGE_STATUS_FLOW,
    SET_STATUS,
    SEARCH_BY_NAME_FLOW,
    SET_SUPERIOR_LIST,
    SUPERIOR_UPDATE_FLOW,
    UNLOAD_USER
} from '../actionTypes/user';

export function setUser(token) {
  return {
    type: USER_SET,
    token,
  }
}

export function setUserPicture(picture) {
  return { 
    type: PICTURE_SET,
    picture
  }
}

export function unsetUser() {
  return {
    type: USER_UNSET,
  }
}

export function permissionsRequest(nav_itens) {

  return {
    type: GET_PERMISSIONS,
    nav_itens
  }
}
  
export const userCreate = function userCreate (user, userCurrent) {
    return {
        type: USER_CREATING,
        userCurrent,
        user,
    }
}

export const userCreateSuccess = function userCreateSuccess (user) {
    return {
        type: USER_CREATE_SUCCESS,
        user,
    }
}

export const userCreateError = function userCreateError (error) {
    return {
        type: USER_CREATE_ERROR,
        error,
    }
}

export const userUpdate = function userUpdate (user, userCurrent) {
    return {
        type: USER_UPDATING,
        userCurrent,
        user,
    }
}

export const userLoad = function userLoad(userCurrent, user_id) {      
    return {
        type: USER_LOADING,
        userCurrent,
        user_id,
    }
}

export const userLoadSuccess = function userLoadSuccess(userSearch){
    return {
        type: USER_LOAD_SUCCESS,
        userSearch
    }
}

export const userUpdateSuccess = function userUpdateSuccess (user) {
    return {
        type: USER_UPDATE_SUCCESS,
        user,
    }
}

export const userUpdateError = function userUpdateError (error) {
    return {
        type: USER_UPDATE_ERROR,
        error,
    }
}

export const userRequest = function userRequest (client) {
    return {
        type: USER_REQUESTING,
        client,
    }
}

export const userRequestSuccess = function userRequestSuccess (users) {
    return {
        type: USER_REQUEST_SUCCESS,
        users,
    }
}

export const userRequestError = function userRequestError (error) {
    return {
        type: USER_REQUEST_ERROR,
        error,
    }
}

export function roleListFlow(userCurrent) {
    return {
        type: ROLE_LIST_FLOW,
        userCurrent
    }
}

export function setRoles(roles) {
    return {
        type: SET_ROLES,
        roles
    }
}

export function changeRoleFlow(role_info) {
    return {
        type: CHANGE_ROLE_FLOW,
        role_info
    }
}

export function setRoleId(role_id) {
    return {
        type: SET_ROLE_ID,
        role_id
    }
}

export function getSubsidiariesFlow(userCurrent) {
    return {
        type: GET_SUBSIDIARIES_FLOW,
        userCurrent
    }
}

export function setSubsidiaries(subsidiaries) {
    return {
        type: SET_SUBSIDIARIES,
        subsidiaries
    }
}

export function changeSubsidiaryFlow(subsidiary_info, userCurrent) {
    return {
        type: CHANGE_SUBSIDIARY_FLOW,
        subsidiary_info,
        userCurrent
    }
}

export function setSubsidiaryId(subsidiary_id) {
    return {
        type: SET_SUBSIDIARY_ID,
        subsidiary_id
    }
}

export function setSectors(sectors) {
    return {
        type: SET_SECTORS,
        sectors
    }
}

export function changeSectorFlow(sector_info, userCurrent) {
    return {
        type: CHANGE_SECTOR_FLOW,
        sector_info,
        userCurrent
    }
}

export function setSectorId(sector_id) {
    return {
        type: SET_SECTOR_ID,
        sector_id
    }
}

export function updateLoader(ringLoad) {
    return {
        type: UPDATE_LOADER,
        ringLoad
    }
}

export function changeStatusFlow(status) {
    return {
        type: CHANGE_STATUS_FLOW,
        status
    }
}

export function setStatus(status) {
    return {
        type: SET_STATUS,
        status
    }
}

export function searchByNameFlow(input_info, userCurrent) {
    return {
        type: SEARCH_BY_NAME_FLOW,
        input_info,
        userCurrent
    }
}

export function setSuperiorList(superiors) {
    return {
        type: SET_SUPERIOR_LIST,
        superiors
    }
}

export function userUpdateWithSuperior(superior_id, user, userCurrent) {
    return {
        type: SUPERIOR_UPDATE_FLOW,
        superior_id,
        user,
        userCurrent
    }
}

export function unloadUser() {
    return {
        type: UNLOAD_USER
    }
}