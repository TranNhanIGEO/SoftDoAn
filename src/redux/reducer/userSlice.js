import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'users',
    initialState: {
        show: {
            getAllUsers: null,
            isFetching: false,
            isError: false
        },
        create: {
            msgStatus: '',
            isFetching: false,
            isError: false        
        },
        update: {
            msgStatus: '',
            isFetching: false,
            isError: false        
        },
        delete: {
            msgStatus: '',
            isFetching: false,
            isError: false        
        }
    },
    reducers: {
        showUserStart: (state) => {
            state.show.isFetching = true;
        },
        showUserSuccess: (state, action) => {
            state.show.getAllUsers = action.payload;
            state.show.isFetching = false;
        },
        showUserFailed: (state) => {
            state.show.isFetching = false;
            state.show.isError = true;
        },
        createUserStart: (state) => {
            state.create.isFetching = true;
        },
        createUserSuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
        },
        createUserFailed: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
            state.create.isError = true;
        },
        updateUserStart: (state) => {
            state.update.isFetching = true;
        },
        updateUserSuccess: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
        },
        updateUserFailed: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
            state.update.isError = true;
        },
        deleteUserStart: (state) => {
            state.delete.isFetching = true;
        },
        deleteUserSuccess: (state) => {
            state.delete.isFetching = false;
        },
        deleteUserFailed: (state, action) => {
            state.delete.isFetching = false;
            state.delete.isError = true;
            state.delete.msgStatus = action.payload;
        }
    }
})

export const getAllUsers = (state) => state.users.show?.getAllUsers

export const { 
    showUserStart, 
    showUserSuccess, 
    showUserFailed,
    createUserStart, 
    createUserSuccess, 
    createUserFailed,
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailed,
    deleteUserStart, 
    deleteUserSuccess, 
    deleteUserFailed
} = userSlice.actions

export default userSlice.reducer