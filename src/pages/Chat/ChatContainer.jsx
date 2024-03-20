import './ChatContainer.css'
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addMessage, logOut, showMessage } from 'src/redux/request/chatRequest';
import useAxiosJWT from 'src/hooks/useAxiosJWT';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import { showMessageSuccess } from 'src/redux/reducer/chatSlice';

const ChatContainer = ({currentChat, currentUser, socket}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState({})
    const getMessages = useSelector(state => state.chat.showMessage?.getMessage)
    const dispatch = useDispatch();
    const axiosJWT = useAxiosJWT();
    const accessToken = currentUser.accessToken;
    const scrollRef = useRef()

    const handleLogout = () => {
        logOut(accessToken, axiosJWT, dispatch);
    }

    const handleToggleEmojiPicker = () => {
        setShowEmojiPicker(prev => !prev)
    }

    const handleClickEmoji = (emoji) => {
        setInputMessage(pre => pre += emoji.emoji)
    }

    const handleInputMessage = (value) => {
        setInputMessage(value)
    }

    const handleSendChat = (e) => {
        e.preventDefault();
        if (inputMessage) {
            setInputMessage('')
            const newMessage = { message: inputMessage, from: currentUser.id, to: currentChat.id }
            addMessage(accessToken, newMessage, axiosJWT, dispatch)
            socket.current.emit('send-msg', {
                from: currentUser.id,
                to: currentChat.id,
                message: inputMessage
            })
            const msgs = {fromSelf: true, message: inputMessage}
            dispatch(showMessageSuccess([...getMessages, msgs]))
        }
    }

    useEffect(() => {
        socket.current.on('msg-receive', (msg) => {
            setArrivalMessage({fromSelf: false, message: msg})
        })
    }, [])
    
    useEffect(() => {
        arrivalMessage && getMessages && dispatch(showMessageSuccess([...getMessages, arrivalMessage]))
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: 'smooth'})
    }, [getMessages])

    useEffect(() => {
        const getMessage = { from: currentUser.id, to: currentChat.id }
        showMessage(accessToken, getMessage, axiosJWT, dispatch)
    }, [currentUser, currentChat])

    return (
        <div className="message-container">
            <div className="message-header">
                <div className="message-header-details">
                    <div className="message-user-avatar">
                        <img src={currentChat.avatar} alt={currentChat.avatar} />
                    </div>
                    <div className="message-user-username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Link to='/admin/logout' className="message-header-logout" onClick={() => handleLogout()}> 
                    <LogoutIcon titleAccess='Đăng xuất' /> 
                </Link>
            </div>
            <div className="message-content">
                {getMessages?.map((message, index) => (
                    <div key={index} ref={scrollRef} className={`message-content-typeuser ${message.fromSelf ? 'sended': 'received'}`}>
                        <div className="message-content-text">
                            <span>{message.message}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-keyin">
                <div className="message-keyin-emoji">
                    <div className="message-emoji-button">
                        <InsertEmoticonIcon onClick={() => handleToggleEmojiPicker()} />
                        {showEmojiPicker && <EmojiPicker onEmojiClick={(emoji) => handleClickEmoji(emoji)} />}
                    </div>
                </div>
                <form className="message-keyin-form" onClick={(e) => handleSendChat(e)}>
                    <input type="text" placeholder='Nhập tin nhắn của bạn' value={inputMessage} onChange={(e) => handleInputMessage(e.target.value)} />
                    <button type='submit'>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}

const Welcome = ({currentUser}) => {
    return (
        <div className="message-welcome">
            <img src='/imgs/robot-hello.gif' alt='robot-hello' />
            <h1>Xin chào, <span>{currentUser.username}!</span></h1>
            <h2>Vui lòng chọn một người dùng để bắt đầu tư vấn!</h2>
        </div>
    )
}
 
export {ChatContainer, Welcome};