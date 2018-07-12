import "regenerator-runtime/runtime";
import { applyMiddleware, createStore, compose } from 'redux'  
import createSagaMiddleware from 'redux-saga'

// Import the index reducer and sagas
import IndexReducer from '../index-reducers'  
import IndexSagas from '../index-sagas'

// Setup the middleware to watch between the Reducers and the Actions
const sagaMiddleware = createSagaMiddleware()

const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&  
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */

const store = createStore(  
  IndexReducer,
  composeSetup(applyMiddleware(sagaMiddleware)), // allows redux devtools to watch sagas
)

sagaMiddleware.run(IndexSagas)

export default store
