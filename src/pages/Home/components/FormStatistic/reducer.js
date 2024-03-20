import {
    SET_LISTSCHOOLNAME,
    SET_LAYERSTATISTIC,
    SET_SCHOOLSTATISTIC,
    SET_LAYERVALIDATE,
    SET_SCHOOLVALIDATE
} from './contains'

export const initState = {
    listSchoolName: [],
    layerStatistic: '',
    schoolStatistic: '',
    layerValidate: '',
    schoolValidate: ''
}

const reducer = (state, actions) => {
    switch (actions.type) {
        case SET_LISTSCHOOLNAME:
            return {
                ...state,
                listSchoolName: actions.payload
            }
    
        case SET_LAYERSTATISTIC:
            return {
                ...state,
                layerStatistic: actions.payload
            }
    
        case SET_SCHOOLSTATISTIC:
            return {
                ...state,
                schoolStatistic: actions.payload
            }
    
        case SET_LAYERVALIDATE:
            return {
                ...state,
                layerValidate: actions.payload
            }
    
        case SET_SCHOOLVALIDATE:
            return {
                ...state,
                schoolValidate: actions.payload
            }
    
        default:
            throw new Error(`Invalid type ${actions.type}`)
    }
}
 
export default reducer;