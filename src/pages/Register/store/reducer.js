import { 
    SET_EMAIL, 
    SET_PASSWORD, 
    SET_USERNAME, 
    SET_CONFIRMPASSWORD,
    SET_USERNAME_VALIDATE,
    SET_PASSWORD_VALIDATE,
    SET_CONFIRMPASSWORD_VALIDATE,
    SET_EMAIL_VALIDATE
} from "./contains";

export const initState = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    usernameValidate: '',
    passwordValidate: '',
    confirmPasswordValidate: '',
    emailValidate: ''
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
                        
        case SET_CONFIRMPASSWORD:
            return {
                ...state,
                confirmPassword: actions.payload
            }
    
        case SET_EMAIL:
            return {
                ...state,
                email: actions.payload
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
            
        case SET_CONFIRMPASSWORD_VALIDATE:
            return {
                ...state,
                confirmPasswordValidate: actions.payload
            }
            
        case SET_EMAIL_VALIDATE:
            return {
                ...state,
                emailValidate: actions.payload
            }

        default:
            throw new Error(`Invalid action ${actions.type}`)
    }
}
 
export default reducer;