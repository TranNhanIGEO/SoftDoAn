import './Contact.css'
import { useState } from "react";

const Contact = ({contacts, currentUser, onChangeChat}) => {
    const [currentSelected, setCurrentSelected] = useState()

    const handleChangeCurrentChat = (contact, index) => {
        setCurrentSelected(index)
        onChangeChat(contact)
    }
    
    return (
        <div className="contact-container">
            <div className="contact-brand">
                <img src="/imgs/tuyensinh.png" alt="logo" />
                <h1>Chat</h1>
            </div>
            <div className="contact-ortheruser">
                {contacts.map((contact, index) => (
                    <div key={index} className={`contact-ortheruser-select ${index === currentSelected ? 'selected' : ''}`} onClick={() => handleChangeCurrentChat(contact, index)}>
                        <div className="contact-ortheruser-avatar">
                            <img src={contact.avatar} alt={contact.avatar} />
                        </div>
                        <div className="contact-ortheruser-username">
                            <h3>{contact.username}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <div className="contact-currentuser">
                <div className="contact-currentuser-avatar">
                    <img src={currentUser.avatar} alt={currentUser.avatar} />
                </div>
                <div className="contact-currentuser-username">
                    <h3>{currentUser.username}</h3>
                </div>
            </div>
        </div>
    )
}
 
export default Contact;