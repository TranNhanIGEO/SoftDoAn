import './Modal.css'
import { useSpring, animated, useTransition } from '@react-spring/web';
import { createContext, useContext, useEffect } from 'react';
import Draggable from 'react-draggable';

const Modal = ({children, isOpen, onClose}) => {
    const handleEnter = (e) => {
        e.key === 'Escape' && onClose()
    }
    
    useEffect(() => {
        document.addEventListener('keydown', handleEnter)
        return () => document.removeEventListener('keydown', handleEnter)
    })

    const modalTransition = useTransition(isOpen, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        config: {duration: 300}
    })

    const transform = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(10%)' : 'translateY(-100%)',
        config: {duration: 300}
    })
    
    return modalTransition((transition, isOpen)=> isOpen && (
        <animated.div style={transition} className="modal-overlay" onClick={onClose}>
            <animated.div style={transform} className="modal-dialog" onClick={e => e.stopPropagation()}>
            <Draggable handle=".modal-header">
                <div className="modal-content">
                    <ModalContext.Provider value={{onClose}}>
                        {children}
                    </ModalContext.Provider>
                </div>
            </Draggable>
            </animated.div>
        </animated.div>
    ))
}

const ModalContext = createContext()
const ModalDismiss = ({children, type, className}) => {
    const {onClose} = useContext(ModalContext)
    return (
        <button type={type} className={className} onClick={onClose}> {children} </button>
    )
}

const ModalButton = ({children, type, className, onClick}) => {
    return (
        <button type={type} className={`modal-button ${className}`} onClick={onClick}> {children} </button>
    )
}

const ModalHeader = ({children}) => {
    return (
        <div className="modal-header">
            <div className="modal-title">{children}</div>
            <ModalDismiss type='button' className='modal-close'> &times; </ModalDismiss>
        </div>
    )
}

const ModalBody = ({children}) => {
    return (
        <div className="modal-body">{children}</div>
    )
}

const ModalFooter = ({children}) => {
    return (
        <div className="modal-footer">{children}</div>
    )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter
Modal.Button = ModalButton
Modal.Dismiss = ModalDismiss
 
export default Modal;