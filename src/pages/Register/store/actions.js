import {
    SET_EMAIL, 
    SET_PASSWORD, 
    SET_USERNAME, 
    SET_CONFIRMPASSWORD,
    SET_USERNAME_VALIDATE,
    SET_PASSWORD_VALIDATE,
    SET_CONFIRMPASSWORD_VALIDATE,
    SET_EMAIL_VALIDATE
} from "./contains"

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

export const setConfirmPassword = (payload) => {
    return {
        type: SET_CONFIRMPASSWORD,
        payload: payload
    }
}

export const setEmail = (payload) => {
    return {
        type: SET_EMAIL,
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

export const setConfirmPasswordValidate = (payload) => {
    return {
        type: SET_CONFIRMPASSWORD_VALIDATE,
        payload: payload
    }
}

export const setEmailValidate = (payload) => {
    return {
        type: SET_EMAIL_VALIDATE,
        payload: payload
    }
}