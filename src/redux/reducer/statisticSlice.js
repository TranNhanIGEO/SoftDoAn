import { createSlice } from "@reduxjs/toolkit";

const statisticSlice = createSlice({
    name: 'statistic',
    initialState: {
        show: {
            getStatistic: null,
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
        showStatisticStart: (state) => {
            state.show.isFetching = true;
        },
        showStatisticSuccess: (state, action) => {
            state.show.getStatistic = action.payload;
            state.show.isFetching = false;
        },
        showStatisticFailed: (state) => {
            state.show.isFetching = false;
            state.show.isError = true;
        },
        createStatisticStart: (state) => {
            state.create.isFetching = true;
        },
        createStatisticSuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
        },
        createStatisticFailed: (state, action) => {
            state.create.isFetching = false;
            state.create.msgStatus = action.payload;
            state.create.isError = true;
        },
        updateStatisticStart: (state) => {
            state.update.isFetching = true;
        },
        updateStatisticSuccess: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
        },
        updateStatisticFailed: (state, action) => {
            state.update.isFetching = false;
            state.update.msgStatus = action.payload;
            state.update.isError = true;
        }
    }
})

export const getStatistic = (state) => state.statistic.show?.getStatistic

export const { 
    showStatisticStart, 
    showStatisticSuccess, 
    showStatisticFailed,
    createStatisticStart, 
    createStatisticSuccess, 
    createStatisticFailed,
    updateStatisticStart, 
    updateStatisticSuccess, 
    updateStatisticFailed
} = statisticSlice.actions

export default statisticSlice.reducer