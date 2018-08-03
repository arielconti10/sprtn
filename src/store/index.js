import "regenerator-runtime/runtime";
import { applyMiddleware, createStore, compose } from 'redux'  
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Import the index reducer and sagas
import IndexReducer from '../index-reducers'  
import IndexSagas from '../index-sagas'

// Setup the middleware to watch between the Reducers and the Actions
const sagaMiddleware = createSagaMiddleware()

const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&  
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */

const persistConfig = { 
  key: 'root',
  storage,
  blacklist: ['marketshare', 'userSchool'] // navigation will not be persisted
}

const persistedReducer = persistReducer(persistConfig, IndexReducer)

const store = createStore(  
  persistedReducer,
  composeSetup(applyMiddleware(sagaMiddleware)), // allows redux devtools to watch sagas
)
const persistor = persistStore(store);

sagaMiddleware.run(IndexSagas)

export {store, persistor}

/*
const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['navigation']
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
*/