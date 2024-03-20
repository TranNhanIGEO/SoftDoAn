import './ChatPage.css'
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Contact from './Contact';
import { Welcome, ChatContainer} from './ChatContainer';
import { showContact } from 'src/redux/request/chatRequest';
import useAxiosJWT from 'src/hooks/useAxiosJWT';
import { io } from 'socket.io-client';
import { getUser } from 'redux/reducer/authSlice';
import { getContact } from 'src/redux/reducer/chatSlice';

const ChatPage = () => {
    const [currentChat, setCurrentChat] = useState()
    const currentUser = useSelector(getUser)
    const allContact = useSelector(getContact)
    const dispatch = useDispatch()
    const axiosJWT = useAxiosJWT();
    const accessToken = currentUser?.accessToken
    const socket = useRef()
    
    useEffect(() => {
        if (currentUser) {
            socket.current = io(`${process.env.REACT_APP_DOMAIN}`)
            socket.current.emit('add-user', currentUser.id)
        }
    }, [])

    useEffect(() => {
        showContact(accessToken, currentUser?.id, axiosJWT, dispatch)
    }, [currentUser])

    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }

    return (currentUser && allContact &&  
        <div className="chat">
            <div className="chat-container">
                <Contact contacts={allContact} currentUser={currentUser} onChangeChat={handleChatChange} />
                {currentChat 
                    ? <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} />
                    : <Welcome currentUser={currentUser} />
                }
            </div>
        </div>
    );
}
 
export default ChatPage;