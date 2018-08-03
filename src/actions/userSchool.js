import { 
    LOAD_USER_SCHOOL, SET_USERS, SET_MESSAGE_ERROR, CHANGE_USER_FLOW, SET_USER_ID, SET_SUBSIDIARIES, CHANGE_SUBSIDIARY_FLOW,
    SET_SUBSIDIARY_ID, SET_SECTORS, CHANGE_SECTOR_FLOW, SET_SCHOOL_TYPE, CHANGE_SCHOOL_TYPE, SET_SCHOOL_TYPE_ID,
    SET_SECTOR_ID, SET_SCHOOLS, UPDATE_LOADER, SELECT_OPTION_FLOW, UPDATE_TOTAL_SELECTED, SET_WALLET_SCHOOLS,
    SELECT_WALLET_OPTION, UPDATE_WALLET_SELECTED, SELECT_SCHOOL_FLOW, REMOVE_WALLET_OPTION_FLOW
} from '../actionTypes/userSchool';

export function loadUserSchool() {
  return {
    type: LOAD_USER_SCHOOL,
  }
}

export function setUsers(users) {
    return {
        type: SET_USERS,
        users
    }
}

export function setMessageError(back_error) {
    return {
        type: SET_MESSAGE_ERROR,
        back_error
    }
}

export function changeUserFlow(user_id) {
    return {
        type: CHANGE_USER_FLOW,
        user_id
    }
}

export function setUserId(user_id) {
    return {
        type: SET_USER_ID,
        user_id
    }
}

export function setSubsidiaries(subsidiaries) {
    return {
        type: SET_SUBSIDIARIES,
        subsidiaries
    }
}

export function changeSubsidiaryFlow(subsidiary_id, sectors) {
    return {
        type: CHANGE_SUBSIDIARY_FLOW,
        subsidiary_id,
        sectors
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

export function changeSectorFlow(sector_id, subsidiary_id, school_type_id, schools, schools_wallet) {
    return {
        type: CHANGE_SECTOR_FLOW,
        sector_id,
        subsidiary_id, 
        school_type_id,
        schools, 
        schools_wallet
    }
}

export function setSchoolTypes(school_types) {
    return {
        type: SET_SCHOOL_TYPE,
        school_types
    }
}

export function changeSchoolType(school_type_id) {
    return {
        type: CHANGE_SCHOOL_TYPE,
        school_type_id
    }
}

export function setSchoolTypeId(school_type_id) {
    return {
        type: SET_SCHOOL_TYPE_ID,
        school_type_id
    }
}

export function setSectorId(sector_id) {
    return {
        type: SET_SECTOR_ID,
        sector_id
    }
}

export function setSchools(schools) {
    return {
        type: SET_SCHOOLS,
        schools
    }
}

export function updateLoader(ringLoad) {
    return {
        type: UPDATE_LOADER,
        ringLoad
    }
}

export function selectOptionFlow(total_selected_available) {
    return {
        type: SELECT_OPTION_FLOW,
        total_selected_available
    }

}

export function updateTotalSelected(total_selected_available) {
    return {
        type: UPDATE_TOTAL_SELECTED,
        total_selected_available
    }
}

export function setWalletSchools(wallet_schools) {
    return {
        type: SET_WALLET_SCHOOLS,
        wallet_schools
    }
}

export function selectWalletOption(total_selected_wallet) {
    return {
        type: SELECT_WALLET_OPTION,
        total_selected_wallet
    }
}

export function updateWalletSelected(total_selected_wallet) {
    return {
        type: UPDATE_WALLET_SELECTED,
        total_selected_wallet
    }
}

export function selectSchoolFlow(user_id, available_schools, schools, schools_wallet) {
    return {
        type: SELECT_SCHOOL_FLOW,
        user_id,
        available_schools,
        schools,
        schools_wallet
    }
}

export function removeWalletOptionFlow(deselected_options, wallet_schools, user_id, schools) {
    return {
        type: REMOVE_WALLET_OPTION_FLOW,
        deselected_options, 
        wallet_schools, 
        user_id,
        schools
    }
}