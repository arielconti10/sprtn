import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

import {
    DROPDOWN_SHOW,
    DROPDOWN_HIDE
} from '../actionTypes/dropdown'

import { 
    showDropdown, hideDropdown
} from '../actions/dropdown'

function toggle(dropdown){
    return !dropdown
}

function* toggleFlow() {
    let dropdown
    try{
        dropdown = yield call(toggle(dropdown))
        
        if(dropdown){
            yield put({ type: DROPDOWN_SHOW })
        } else {
            yield put({ type: DROPDOWN_HIDE })

        }
    } catch (error) {
        console.log(error)
    }

    return dropdown
}

export default toggleFlow