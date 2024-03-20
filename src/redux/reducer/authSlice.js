import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        register: {
            getError: null,
            isFetching: false,
            isError: false,
        },
        login: {
            getUser: null,
            getError: null,
            isFetching: false,
            isError: false,
        }
    },
    reducers: {
        registerStart: (state) =>{
            state.register.isFetching = true;
        },
        registerSuccess: (state) =>{
            state.register.isFetching = false;
            state.register.getError = null;
        },
        registerFailed: (state, action) =>{
            state.register.isFetching = false;
            state.register.getError = action.payload
            state.register.isError = true
        },
        loginStart: (state) =>{
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) =>{
            state.login.isFetching = false;
            state.login.getUser = action.payload;
            state.login.getError = null;
        },
        loginFailed: (state, action) =>{
            state.login.isFetching = false;
            state.login.getError = action.payload
            state.login.isError = true
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.getUser = null;
            state.login.isError = false;
        },
        logOutFailed: (state) =>{
            state.login.isFetching = false;
            state.login.isError = true;
        },
        logOutStart: (state) =>{
            state.login.isFetching = true;
        }
    }
})

export const getUser = (state) => state.auth.login?.getUser

export const { 
    loginStart, 
    loginSuccess, 
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed
} = authSlice.actions

export default authSlice.reducer