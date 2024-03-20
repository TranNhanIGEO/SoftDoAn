import { createSlice } from "@reduxjs/toolkit";

const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        show: {
            getScore: null,
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
        }
    },
    reducers: {
        showScoreStart: (state) => {
            state.show.isFetching = true;
        },
        showScoreSuccess: (state, action) => {
            state.show.getScore = action.payload;
            state.show.isFetching = false;
        },
        showScoreFailed: (state) => {
            state.show.isFetching = false;
            state.show.isError = true;
        },
        createScoreStart: (state) => {
            state.create.isFetching = true;
        },
        createScoreSuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
        },
        createScoreFailed: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
            state.create.isError = true;
        },
        updateScoreStart: (state) => {
            state.update.isFetching = true;
        },
        updateScoreSuccess: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
        },
        updateScoreFailed: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
            state.update.isError = true;
        }
    }
})

export const getScore = (state) => state.score.show?.getScore

export const { 
    showScoreStart, 
    showScoreSuccess, 
    showScoreFailed,
    createScoreStart,
    createScoreSuccess,
    createScoreFailed,
    updateScoreStart, 
    updateScoreSuccess, 
    updateScoreFailed,
} = scoreSlice.actions

export default scoreSlice.reducer