import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from '../slice/AuthSlice';
import searchSlice from '../slice/SearchSlice';


const persistConfiguration ={
    key:'root',
    version: 1,
    storage,
    whitelist: ['Auth'], 
}

const rootReducer = combineReducers({
    Auth: authSlice.reducer,
    search: searchSlice.reducer
})

const persistedReducer = persistReducer(persistConfiguration, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE, REGISTER],
            }
        })
})

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;