import { createSlice } from "@reduxjs/toolkit";

const schoolSlice = createSlice({
    name: 'school',
    initialState: {
        show: {
            getAllData: null,
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
        },
        newSchoolName: null,
    },
    reducers: {
        showSchoolStart: (state) => {
            state.show.isFetching = true;
        },
        showSchoolSuccess: (state, action) => {
            state.show.getAllData = action.payload;
            state.show.isFetching = false;
        },
        showSchoolFailed: (state) => {
            state.show.isFetching = false;
            state.show.isError = true;
        },
        createSchoolStart: (state) => {
            state.create.isFetching = true;
        },
        createSchoolSuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
        },
        createSchoolFailed: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
            state.create.isError = true;
        },
        updateSchoolStart: (state) => {
            state.update.isFetching = true;
        },
        updateSchoolSuccess: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
        },
        updateSchoolFailed: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
            state.update.isError = true;
        },
        deleteSchoolStart: (state) => {
            state.delete.isFetching = true;
        },
        deleteSchoolSuccess: (state) => {
            state.delete.isFetching = false;
        },
        deleteSchoolFailed: (state, action) => {
            state.delete.isFetching = false;
            state.delete.isError = true;
            state.delete.msgStatus = action.payload;
        },
        setNewSchoolName: (state, actions) => {
            state.newSchoolName = actions.payload;
        },
    }
})

export const getAllSchool = (state) => state.school.show?.getAllData
export const newSchoolName = (state) => state.school.newSchoolName;

export const { 
    showSchoolStart, 
    showSchoolSuccess, 
    showSchoolFailed,
    createSchoolStart, 
    createSchoolSuccess, 
    createSchoolFailed,
    updateSchoolStart, 
    updateSchoolSuccess, 
    updateSchoolFailed,
    deleteSchoolStart, 
    deleteSchoolSuccess, 
    deleteSchoolFailed,
    setNewSchoolName,
} = schoolSlice.actions

export default schoolSlice.reducer