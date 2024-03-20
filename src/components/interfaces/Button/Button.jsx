import './Button.css'

const Button = (props) => {
    return (  
        <button type={props.type} className={`btn ${props.className}`}>{props.children}</button>
    );
}
 
export default Button;