import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./Store/userSlice"
import{persistStore,persistReducer} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const persistConfig={
    key:"root",
    storage,
}

const rootReducer=combineReducers({
    user:userReducer,
})

const persistedReducer=persistReducer(persistConfig,rootReducer)

const store=configureStore({
    reducer:persistedReducer,
})

const persistor=persistStore(store);

export{store,persistor}