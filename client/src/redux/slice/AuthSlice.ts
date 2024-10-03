import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Datas {
    _id: string | null;
    email: string | null;
    userName: string | null;
    phone?: string | null;
    role: string | null;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    authdata: Datas | null;
}

const initialState : AuthState = {
    isAuthenticated:false,
    token: null,
    authdata:null
}


const authSlice = createSlice({
    name: 'AuthSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{token:string, authdata: Datas}>) =>{
            state.isAuthenticated=true;
            state.token=action.payload.token;
            state.authdata= action.payload.authdata;
        },

        logout: (state) =>{
            state.isAuthenticated =false;
            state.token = null;
            state.authdata=null;
        }
    }
})

export const {login, logout} = authSlice.actions;
export default authSlice;