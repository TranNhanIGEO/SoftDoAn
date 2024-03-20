import './Toast.css'
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useToastDispatchContext } from 'src/contexts/ToastContext';

const Toast = ({type, title, message, id}) => {
    const toastIcons = {
        success: <CheckCircleIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />
    }
    const toastIcon = toastIcons[type] || null
    const dispatchToast = useToastDispatchContext()

    const handleCloseToast = () => {
        dispatchToast({
            type: "REMOVE_TOAST", 
            id: id
        })
    }

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast-icon">{toastIcon}</div>
            <div className="toast-body">
                <h3 className="toast-title">{title}</h3>
                <p className="toast-message">{message}</p>
            </div>
            <div className="toast-close"><CloseIcon onClick={() => handleCloseToast()} /></div> 
        </div>
      )
}

export default Toast