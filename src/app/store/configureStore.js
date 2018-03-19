/**
 * Created by griga on 11/17/16.
 */

import {createStore, combineReducers,  applyMiddleware} from 'redux'
import promise from 'redux-promise'
import multi from 'redux-multi'
import thunk from 'redux-thunk'
import {routerReducer} from 'react-router-redux'

import {config} from '../config/config'
import {handleBodyClasses, dumpLayoutToStorage, layoutReducer} from '../components/layout'

import navigationReducer from '../components/navigation/navigationReducer'
import {userReducer, requestUserInfo} from '../components/user'
import {chatReducer, chatInit} from '../components/chat'
import {eventsReducer} from '../components/calendar'
import outlookReducer from '../routes/outlook/outlookReducer'

import {voiceReducer, VoiceMiddleware} from '../components/voice-control'
import {voiceControlOn} from "../components/voice-control/VoiceActions";

import schoolsReducer from '../routes/spartan/schools/containers/SchoolsReducer'

export const rootReducer = combineReducers(
  {
    routing: routerReducer,
    layout: layoutReducer,
    navigation: navigationReducer,
    outlook: outlookReducer,
    user: userReducer,
    chat: chatReducer,
    events: eventsReducer,
    voice: voiceReducer,

    schoolsList: schoolsReducer 
  }
);

const store =  createStore(rootReducer,
  applyMiddleware(
    multi,
    thunk,
    promise,
    handleBodyClasses,
    dumpLayoutToStorage,
    VoiceMiddleware
  )
);

store.dispatch(requestUserInfo());
store.dispatch(chatInit());

if(config.voice_command_auto){
  store.dispatch(voiceControlOn());
}


export default store;