import { 
    updateScoreStart, 
    updateScoreSuccess, 
    updateScoreFailed,
    createScoreStart,
    createScoreSuccess,
    createScoreFailed,
    showScoreStart,
    showScoreSuccess,
    showScoreFailed
} from "src/redux/reducer/scoreSlice"

const showScore = async (layer, year, axiosJWT, dispatch) => {
    dispatch(showScoreStart())
    try {
        const res = await axiosJWT.get(`/v1/data/score?layer=${layer}&year=${year}`);
        dispatch(showScoreSuccess(res.data))
    }
    catch (err) {
        dispatch(showScoreFailed())
    }
}
const createScore = async (newScore, axiosJWT, dispatch) => {
    dispatch(createScoreStart())
    try {
        const res = await axiosJWT.post(`/v1/data/score/create`, newScore);
        dispatch(createScoreSuccess(res.data))
    }
    catch (err) {
        dispatch(createScoreFailed(err.response))
    }
}
const updateScore = async (id, updateScore, axiosJWT, dispatch) => {
    dispatch(updateScoreStart())
    try {
        const res = await axiosJWT.put(`/v1/data/score/${id}/update`, updateScore);
        dispatch(updateScoreSuccess(res.data))
    }
    catch (err) {
        dispatch(updateScoreFailed(err.response))
    }
}

export {
    showScore,
    createScore,
    updateScore
}