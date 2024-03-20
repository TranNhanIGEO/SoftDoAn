import {
    createUserFailed,
    createUserStart,
    createUserSuccess,
    deleteUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    showUserFailed,
    showUserStart,
    showUserSuccess,
    updateUserFailed,
    updateUserStart,
    updateUserSuccess
} from "src/redux/reducer/userSlice"

const showAllUsers = async (axiosJWT, dispatch) => {
    dispatch(showUserStart())
    try {
        const res = await axiosJWT.get(`/v1/users`);
        dispatch(showUserSuccess(res.data))
    }
    catch {
        dispatch(showUserFailed())
    }
}
const createUser = async (newUser, axiosJWT, dispatch) => {
    dispatch(createUserStart())
    try {
        const res = await axiosJWT.post(`/v1/users/create`, newUser);
        dispatch(createUserSuccess(res.data))
    }
    catch (err) {
        dispatch(createUserFailed(err.response))
    }
}
const updateUser = async (id, updateUser, axiosJWT, dispatch) => {
    dispatch(updateUserStart())
    try {
        const res = await axiosJWT.put(`/v1/users/${id}/update`, updateUser);
        dispatch(updateUserSuccess(res.data))
    }
    catch (err) {
        dispatch(updateUserFailed(err.response))
    }
}
const deleteUser = async (id, axiosJWT, dispatch) => {
    dispatch(deleteUserStart())
    try {
        await axiosJWT.delete(`/v1/users/${id}`);
        dispatch(deleteUserSuccess())
    }
    catch (err) {
        dispatch(deleteUserFailed(err.response))
    }
}

export {
    showAllUsers,
    createUser,
    updateUser,
    deleteUser
}