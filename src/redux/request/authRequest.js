import { axiosAPI } from "src/utils/axiosConfig"
import {
    logOutFailed,
    logOutStart,
    logOutSuccess,
    loginFailed,
    loginStart,
    loginSuccess,
    registerFailed,
    registerStart,
    registerSuccess
} from "src/redux/reducer/authSlice"

const loginUser = async (getUser, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axiosAPI.post(`/v1/auth/login`, getUser)
        dispatch(loginSuccess(res.data))
    }
    catch (err) {
        dispatch(loginFailed(err.response.data))
    }
}
const registerUser = async (newUser, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        await axiosAPI.post(`/v1/auth/register`, newUser)
        dispatch(registerSuccess(newUser))
        navigate('/admin/login')
    } catch (err) {
        dispatch(registerFailed(err.response.data))
    }
}
const logOut = async (axiosJWT, dispatch) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post(`/v1/auth/logout`, {});
        dispatch(logOutSuccess());
    } catch (err) {
        dispatch(logOutFailed());
    }
}
const refreshToken = async ({ currentUser, dispatch }) => {
    try {
        const res = await axiosAPI.post(`/v1/auth/refresh`, {});
        dispatch(loginSuccess({...currentUser, accessToken: res.data.accessToken}));
        return res.data.accessToken;
    } catch (error) {
        dispatch(loginFailed(error.response.data))
    }
}

export {
    loginUser,
    registerUser,
    logOut,
    refreshToken
}