import { SET_USERNAME, SET_PASSWORD, SET_USERNAME_VALIDATE, SET_PASSWORD_VALIDATE } from './contains'

export const initState = {
    username: '',
    password: '',
    usernameValidate: '',
    passwordValidate: ''
}

const reducer = (state, actions) => {
    switch (actions.type) {
        case SET_USERNAME:
            return {
                ...state,
                username: actions.payload
            }
    
        case SET_PASSWORD:
            return {
                ...state,
                password: actions.payload
            }
    
        case SET_USERNAME_VALIDATE:
            return {
                ...state,
                usernameValidate: actions.payload
            }
    
        case SET_PASSWORD_VALIDATE:
            return {
                ...state,
                passwordValidate: actions.payload
            }
    
        default:
            throw new Error(`Invalid type ${actions.type}`)
    }
}
 
export default reducer;