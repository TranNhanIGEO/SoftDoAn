import './Offcanvas.css'
import { animated, useTransition } from '@react-spring/web';
import { createContext, useContext } from 'react';
import Draggable from 'react-draggable';

const Offcanvas = ({children, isOpen, onClose, position, size, style}) => {
    const modalTransition = useTransition(isOpen, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        config: {duration: 200}
    })
    
    return modalTransition((transition, isOpen)=> isOpen && (
        <animated.div style={{...transition, ...size}} className={`offcanvas-wrapper ${position ?? ''}`}>
            <div className="offcanvas-dialog">
            <Draggable handle=".offcanvas-header">
                <div style={style} className="offcanvas-content">
                    <OffcanvasContext.Provider value={{onClose}}>
                        {children}
                    </OffcanvasContext.Provider>
                </div>
            </Draggable>
            </div>
        </animated.div>
    ))
}

const OffcanvasContext = createContext()
const OffcanvasDismiss = ({children, type, className, onClick}) => {
    const {onClose} = useContext(OffcanvasContext)
    const handleCloseOffCanvas = () => {
        onClose()
        onClick && onClick()
    }
    return (
        <button type={type} className={className} onClick={() => handleCloseOffCanvas()}> {children} </button>
    )
}

const OffcanvasButton = ({children, type, className, onClick}) => {
    return (
        <button type={type} className={className} onClick={onClick}> {children} </button>
    )
}

const OffcanvasHeader = ({children, onClick}) => {
    return (
        <div className="offcanvas-header">
            <div className="offcanvas-title">{children}</div>
            <OffcanvasDismiss type='button' className='offcanvas-close' onClick={onClick}> &times; </OffcanvasDismiss>
        </div>
    )
}

const OffcanvasBody = ({children}) => {
    return (
        <div className="offcanvas-body">{children}</div>
    )
}

Offcanvas.Header = OffcanvasHeader
Offcanvas.Body = OffcanvasBody
Offcanvas.Button = OffcanvasButton
Offcanvas.Dismiss = OffcanvasDismiss
 
export default Offcanvas;