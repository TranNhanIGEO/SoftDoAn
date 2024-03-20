import { SET_USERNAME, SET_PASSWORD, SET_USERNAME_VALIDATE, SET_PASSWORD_VALIDATE } from './contains'

export const setUsername = (payload) => {
    return {
        type: SET_USERNAME,
        payload: payload
    }
}

export const setPassword = (payload) => {
    return {
        type: SET_PASSWORD,
        payload: payload
    }
}

export const setUsernameValidate = (payload) => {
    return {
        type: SET_USERNAME_VALIDATE,
        payload: payload
    }
}

export const setPasswordValidate = (payload) => {
    return {
        type: SET_PASSWORD_VALIDATE,
        payload: payload
    }
}