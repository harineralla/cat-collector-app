// src/redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';

import { configureStore } from '@reduxjs/toolkit';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { thunk } from 'redux-thunk';
import homePageReducer from '../store/homePage/reducers/index';
import headerReducer from './homePage/reducers';

const rootReducer = combineReducers({
  homePageReducer: homePageReducer,
  headerReducer: headerReducer
});

// const store = createStore(
//   rootReducer,
//   applyMiddleware(thunk)
// );

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    // middleware: applyMiddleware(thunk),
    devTools: process.env.NODE_ENV !== 'production',
  });

export default store;

