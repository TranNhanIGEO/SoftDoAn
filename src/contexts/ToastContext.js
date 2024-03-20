import { createContext, useContext, useReducer } from "react";

const ToastStateContext = createContext({toast: []})
const ToastDispatchContext = createContext(null)

const ToastReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST":
            return {...state, toasts: [...state.toasts, action.toast]}
        case "REMOVE_TOAST":
            return {...state, toasts: state.toasts.filter(el => el.id !== action.id)}
        default:
            throw new Error('Invalid action')
      }
}

export const ToastProvider = ({children}) => {
    const [state, dispatch] = useReducer(ToastReducer, {toasts: []})
    return (
        <ToastStateContext.Provider value={state}>
            <ToastDispatchContext.Provider value={dispatch}>
                {children}
            </ToastDispatchContext.Provider>
        </ToastStateContext.Provider>
    )
}

export const useToastStateContext = () => useContext(ToastStateContext)
export const useToastDispatchContext = () => useContext(ToastDispatchContext)

export const useToast = (props) => {
    const {autoClose, delayClose} = props
    const dispatchToast = useToastDispatchContext()
    const toast = (type, title, message) => {
        const toastID = Math.random().toString(36).substring(2, 9)
        dispatchToast({
            type: "ADD_TOAST",
            toast: {
                id: toastID,
                type: type,
                title: title,
                message: message
            }
        })
        autoClose && setTimeout(() => {
            dispatchToast({
                type: "REMOVE_TOAST",
                id: toastID
            })
        }, delayClose)
    }
    return toast
}