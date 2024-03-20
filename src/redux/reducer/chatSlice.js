import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        showContact: {
            getContact: null,
            isFetching: false,
            isError: false,
        },
        addMessage: {
            isFetching: false,
            isError: false,
        },
        showMessage: {
            getMessage: null,
            isFetching: false,
            isError: false,
        }
    },
    reducers: {
        showContactStart: (state) => {
            state.showContact.isFetching = true;
        },
        showContactSuccess: (state, action) => {
            state.showContact.isFetching = false;
            state.showContact.getContact = action.payload;
            state.showContact.isError = false;
        },
        showContactFailed: (state) => {
            state.showContact.isFetching = false;
            state.showContact.isError = true
        },
        addMessageStart: (state) => {
            state.addMessage.isFetching = true;
        },
        addMessageSuccess: (state) => {
            state.addMessage.isFetching = false;
            state.addMessage.isError = false;
        },
        addMessageFailed: (state) => {
            state.addMessage.isFetching = false;
            state.addMessage.isError = true
        },
        showMessageStart: (state) => {
            state.showMessage.isFetching = true;
        },
        showMessageSuccess: (state, action) => {
            state.showMessage.isFetching = false;
            state.showMessage.getMessage = action.payload;
            state.showMessage.isError = false;
        },
        showMessageFailed: (state) => {
            state.showMessage.isFetching = false;
            state.showMessage.isError = true
        },
    }
})

export const getContact = (state) => state.chat.showContact?.getContact

export const { 
    showContactStart, 
    showContactSuccess, 
    showContactFailed,
    addMessageStart,
    addMessageSuccess,
    addMessageFailed,
    showMessageStart,
    showMessageSuccess,
    showMessageFailed
} = chatSlice.actions

export default chatSlice.reducer