import { 
    addMessageFailed, 
    addMessageStart, 
    addMessageSuccess, 
    showContactFailed, 
    showContactStart, 
    showContactSuccess, 
    showMessageFailed, 
    showMessageStart, 
    showMessageSuccess 
} from "src/redux/reducer/chatSlice"

const showContact = async (accessToken, id, axiosJWT, dispatch) => {
    dispatch(showContactStart())
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_DOMAIN}/v1/chat/getcontact/${id}`, {
            headers: { authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        })
        dispatch(showContactSuccess(res.data))
    } catch (error) {
        dispatch(showContactFailed())
    }
}
const addMessage = async (accessToken, newMessage, axiosJWT, dispatch) => {
    dispatch(addMessageStart())
    try {
        await axiosJWT.post(`${process.env.REACT_APP_DOMAIN}/v1/chat/addmessage`, newMessage, {
            headers: { authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        })
        dispatch(addMessageSuccess())
    } catch (error) {
        dispatch(addMessageFailed())
    }
}
const showMessage = async (accessToken, getMessage, axiosJWT, dispatch) => {
    dispatch(showMessageStart())
    try {
        const res = await axiosJWT.post(`${process.env.REACT_APP_DOMAIN}/v1/chat/getmessage`, getMessage, {
            headers: { authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        })
        dispatch(showMessageSuccess(res.data))
    } catch (error) {
        dispatch(showMessageFailed())
    }
}

export {
    showContact,
    addMessage,
    showMessage
}