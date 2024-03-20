import './Form.css'
import { useMemo, useState, useEffect } from 'react'
import vi_to_en from 'src/utils/convertVi_En'

const FormControl = (props) => {
    return (
        <div className="form-group">{props.children}</div>
    )
}

const FormLabel = (props) => {
    return (
        <label className="form-label" htmlFor={props.htmlFor}> {props.children} </label>
    )
}

const FormNumber = (props) => {
    return (
        <input type="number" className="form-input" id={props.id} name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
    )
}

const FormText = (props) => {
    return (
        <input type="text" className="form-input" id={props.id} name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} autoComplete={'on'} />
    )
}

const FormPassword = (props) => {
    return (
        <input type="password" className="form-input" id={props.id} name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
    )
}

const FormRange = (props) => {
    return (
        <div className="form-range">
            <div className="form-range-slider" style={props.slider}><span>{props.value}</span></div>
            <div className="form-range-field">
                <div className="form-range-value value-left">{props.titleMin}</div>
                <input type="range" id={props.id} min={props.min} max={props.max} value={props.value} steps={props.step} onChange={props.onChange} />
                <div className="form-range-value value-right">{props.titleMax}</div>
            </div>
        </div>
    )
}

const FormRadio = (props) => {
    return (
        <div className='form-radio'>
            <label htmlFor={props.id}>
                <input type='radio' id={props.id} name={props.name} value={props.value} checked={props.checked} onChange={props.onChange} />
                <span> {props.children} </span>
            </label>
        </div>
    )
}

const FormCheckbox = (props) => {
    return (
        <div className='form-checkbox'>
            <label htmlFor={props.id}>
                <input type='checkbox' id={props.id} name={props.name} value={props.value} checked={props.checked} onChange={props.onChange} />
                <span> {props.children} </span>
            </label>
        </div>
    )
}

const FormAutoComplete = (props) => {
        const [isShowSuggestions, setIsShowSuggestions] = useState(false)
        const {data, onClick, value, onChange, getDataAlt} = props
    
        const onChangeSuggestions = (e) => {
            const value = e.target.value
            onChange && onChange(value)
        }
    
        const onClickSuggestion = (value) => {
            setIsShowSuggestions(false)
            onChange && onChange(value)
            onClick && onClick(value)
        }
        
        const onKeyUpSuggestion = () => {
            setIsShowSuggestions(true)
        }
    
        const onBlurSuggestion = () => {
            setTimeout(() => setIsShowSuggestions(false), 150)
        }

        useEffect(() => {
            if (value && getDataAlt && !data.includes(value)) getDataAlt(value)
        }, [value])
        
        const ListAutoComplete = useMemo(() => {
            if (!isShowSuggestions) return []
            return data
                .filter((val) => vi_to_en(val).includes(vi_to_en(value)))
                .slice(0, 50)
                .map((val) => (<button key={val} onClick={() => onClickSuggestion(val)}> {val} </button>))
        }, [onClickSuggestion, isShowSuggestions, value, data])

    return (
        <div className="form-autocomplete-wrapper">
            <input className='form-autocomplete' id={props.id} name={props.name} placeholder={props.placeholder} value={value} onChange={(e) => onChangeSuggestions(e)} onKeyUp={() => onKeyUpSuggestion()} onBlur={() => onBlurSuggestion()} autoComplete='off' />
            <div className="form-autocomplete-list">{ListAutoComplete}</div>
        </div>
    )
}

const FormDropdown = (props) => {
    const [isShowDropdowns, setIsShowDropdowns] = useState(false)

    const onClickDropdown = () => {
        setIsShowDropdowns(!isShowDropdowns)
    }

    return (
        <div className="form-dropdown-wrapper">
            <div className={`form-dropdown ${isShowDropdowns ? 'active' : ''}`} id={props.id} name={props.name} onClick={() => onClickDropdown()} >{props.placeholder} </div>
            {isShowDropdowns && <ul className="form-dropdown-list">{props.children}</ul>}
        </div>
    )
}

const FormCheckboxDropdown = (props) => {
    return (
        <li className="form-checkbox-dropdown">
            <label htmlFor={props.id}>
                <input type="checkbox" id={props.id} name={props.name} value={props.value} checked={props.checked} onChange={props.onChange} />
                <span> {props.children} </span>
            </label>
        </li>
    )
}

const FormValidate = (props) => {
    return (
        <span className='form-validate'>{props.children}</span>
    )
}

const FormSelect = (props) => {
    return (
        <select className="form-select" id={props.id} name={props.name} value={props.value} onChange={props.onChange}>
            {props.value 
                ? <option disabled>{props.placeholder}</option>
                : <option>{props.placeholder}</option>}
            {props.children}
        </select>
    )
}

const FormOptionGroup = (children) => {
    return (<>
        {[children].map((child, index) => (
            <optgroup key={index} label={child.label}>
                {child.children}
            </optgroup >
        ))}
    </>)
}

const FormOption = (children) => {
    return (<>
        {[children].map((child, index) => (
            <option key={index} value={child.value} disabled={child.disabled}>
                {child.children}
            </option>
        ))}
    </>)
}

FormSelect.OptionGroup = FormOptionGroup
FormSelect.Option = FormOption

export { 
    FormControl, 
    FormLabel, 
    FormText, 
    FormNumber, 
    FormPassword,
    FormRange,
    FormRadio, 
    FormCheckbox, 
    FormAutoComplete, 
    FormDropdown, 
    FormCheckboxDropdown, 
    FormSelect, 
    FormValidate 
};