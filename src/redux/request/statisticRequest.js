import { 
    createStatisticFailed,
    createStatisticStart,
    createStatisticSuccess,
    showStatisticFailed, 
    showStatisticStart, 
    showStatisticSuccess, 
    updateStatisticFailed, 
    updateStatisticStart,
    updateStatisticSuccess
} from "src/redux/reducer/statisticSlice"

const showStatistic = async (layer, year, axiosJWT, dispatch) => {
    dispatch(showStatisticStart())
    try {
        const res = await axiosJWT.get(`/v1/data/statistic?layer=${layer}&year=${year}`);
        dispatch(showStatisticSuccess(res.data))
    }
    catch {
        dispatch(showStatisticFailed())
    }
}
const createStatistic = async (newStatistic, axiosJWT, dispatch) => {
    dispatch(createStatisticStart())
    try {
        const res = await axiosJWT.post(`/v1/data/statistic/create`, newStatistic);
        dispatch(createStatisticSuccess(res.data))
    }
    catch (err) {
        dispatch(createStatisticFailed(err.response))
    }
}
const updateStatistic = async (id, updateStatistic, axiosJWT, dispatch) => {
    dispatch(updateStatisticStart())
    try {
        const res = await axiosJWT.put(`/v1/data/statistic/${id}/update`, updateStatistic);
        dispatch(updateStatisticSuccess(res.data))
    }
    catch (err) {
        dispatch(updateStatisticFailed(err.response))
    }
}

export {
    showStatistic,
    createStatistic,
    updateStatistic
}