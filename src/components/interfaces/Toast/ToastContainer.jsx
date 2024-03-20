import Toast from "./Toast";
import { useToastStateContext } from "src/contexts/ToastContext";

const ToastContainer = () => {
  const {toasts} = useToastStateContext()

  return (
    <div className="toast-container">
        {toasts && toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            id={toast.id} 
            type={toast.type} 
            title={toast.title} 
            message={toast.message} 
          />
        ))}
    </div>
  );
};

export default ToastContainer;