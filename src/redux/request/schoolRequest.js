import {
    createSchoolFailed,
    createSchoolStart,
    createSchoolSuccess,
    deleteSchoolFailed,
    deleteSchoolStart,
    deleteSchoolSuccess,
    showSchoolFailed,
    showSchoolStart,
    showSchoolSuccess,
    updateSchoolFailed,
    updateSchoolStart,
    updateSchoolSuccess
} from "src/redux/reducer/schoolSlice"

const showAllSchool = async (axiosJWT, dispatch) => {
    dispatch(showSchoolStart())
    try {
        const res = await axiosJWT.get(`/v1/data`);
        dispatch(showSchoolSuccess(res.data))
    }
    catch {
        dispatch(showSchoolFailed())
    }
}
const createSchool = async (newData, axiosJWT, dispatch) => {
    dispatch(createSchoolStart())
    try {
        const res = await axiosJWT.post(`/v1/data/create`, newData);
        dispatch(createSchoolSuccess(res.data))
    }
    catch (err) {
        dispatch(createSchoolFailed(err.response))
    }
}
const updateSchool = async (id, editSchool, axiosJWT, dispatch) => {
    dispatch(updateSchoolStart())
    try {
        const res = await axiosJWT.put(`/v1/data/${id}/update`, editSchool);
        dispatch(updateSchoolSuccess(res.data))
    }
    catch (err) {
        dispatch(updateSchoolFailed(err.response))
    }
}
const deleteSchool = async (id, axiosJWT, dispatch) => {
    dispatch(deleteSchoolStart())
    try {
        await axiosJWT.delete(`/v1/data/${id}/delete`);
        dispatch(deleteSchoolSuccess())
    }
    catch (err) {
        dispatch(deleteSchoolFailed(err.response))
    }
}

export {
    showAllSchool,
    createSchool,
    updateSchool,
    deleteSchool
}