import {
    LOAD_CONTACTS_FLOW, SET_CONTACTS_LIST, SET_CONTACTS_COLUMNS, ON_DELETE_CONTACT_FLOW,
    ON_ACTIVE_CONTACT_FLOW, ADD_CONTACT_FLOW, SET_CONTACT_COLLAPSE, LOAD_CONTACT_INITIAL_FLOW,
    SET_CONTACT_JOB_TITLES, SELECT_JOB_FLOW, SET_CONTACT_JOB_TITLE, SET_CONTACT_STATES,
    SELECT_STATE_FLOW, SET_CONTACT_STATE_ID, SEARCH_CEP_FLOW, SET_CONTACT_INFO,
    SET_CONTACT_ERROR, UPDATE_AUTH_EMAIL_FLOW, SET_AUTHORIZE_EMAIL,
    UPDATE_FAVORITE_FLOW, SET_FAVORITE, UNLOAD_CONTACT, CONTACT_CREATE_FLOW
} from '../actionTypes/contact';

export function loadContactsFlow(user, contacts, collapse) {
    return {
        type: LOAD_CONTACTS_FLOW,
        user,
        contacts,
        collapse
    }
}

export function setContactsList(contactsList) {
    return {
        type: SET_CONTACTS_LIST,
        contactsList
    }
}

export function setContactsColumns(contactsColumns) {
    return {
        type: SET_CONTACTS_COLUMNS,
        contactsColumns
    }
}

export function onDeleteContactDataFlow(user, apiSpartan, rowInfo, school_id) {
    return {
        type: ON_DELETE_CONTACT_FLOW,
        user,
        apiSpartan,
        rowInfo,
        school_id
    }
}

export function onActiveContactDataFlow(user, apiSpartan, rowInfo, school_id) {
    return {
        type: ON_ACTIVE_CONTACT_FLOW,
        user,
        apiSpartan,
        rowInfo,
        school_id
    }
}

export function addContactFlow(collapse) {
    return {
        type: ADD_CONTACT_FLOW,
        collapse
    }
}

export function setContactCollapse(collapse) {
    return {
        type: SET_CONTACT_COLLAPSE,
        collapse
    }
}

export function loadContactInitialFlow(user) {
    return {
        type: LOAD_CONTACT_INITIAL_FLOW,
        user
    }
}

export function setContactJobTitles(jobTitles) {
    return {
        type: SET_CONTACT_JOB_TITLES,
        jobTitles
    }
}

export function selectJobFlow(user, jobTitleId) {
    return {
        type: SELECT_JOB_FLOW,
        user,
        jobTitleId
    }
}

export function setContactJobTitle(jobTitleId) {
    return {
        type: SET_CONTACT_JOB_TITLE,
        jobTitleId
    }
}

export function setContactStates(states) {
    return {
        type: SET_CONTACT_STATES,
        states
    }
}

export function selectStateFlow(stateId) {
    return {
        type: SELECT_STATE_FLOW,
        stateId
    }
}

export function setContactStateId(stateId) {
    return {
        type: SET_CONTACT_STATE_ID,
        stateId
    }
}

export function searchCepFlow(user, cep) {
    return {
        type: SEARCH_CEP_FLOW,
        user,
        cep
    }
}

export function setContactInfo(contactInfo) {
    return {
        type: SET_CONTACT_INFO,
        contactInfo
    }
}

export function setContactError(contactError) {
    return {
        type: SET_CONTACT_ERROR,
        contactError
    }
}

export function updateAuthEmailFlow(authorizeEmail) {
    return {
        type: UPDATE_AUTH_EMAIL_FLOW,
        authorizeEmail
    }
} 

export function setAuthorizeEmail(authorizeEmail) {
    return {
        type: SET_AUTHORIZE_EMAIL,
        authorizeEmail
    }
}

export function updateFavoriteFlow(favorite) {
    return {
        type: UPDATE_FAVORITE_FLOW,
        favorite
    }
}

export function setFavorite(favorite) {
    return {
        type: SET_FAVORITE,
        favorite
    }
}

export function unloadContact() {
    return {
        type: UNLOAD_CONTACT
    }
}

export function contactCreateFlow (user, contact, contactList) {
    return {
      type: CONTACT_CREATE_FLOW,
      user,
      contact,
      contactList
    }
  }