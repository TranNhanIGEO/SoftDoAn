import {
    SET_IS_NORMALSCHOOL,
    SET_CHECK_LOCATION,
    SET_IS_INPUTPOSITION,
    SET_ADDRESSSUGGESTION,
    SET_LISTADDRESSDB,
    SET_LISTADDRESSMB,
    SET_RANGE_DISTANCE,
    SET_LASTDISTANCE,
    SET_MINSCORE,
    SET_SUMPRIORITY,
    SET_CHECK_PRIORITY,
    SET_UNCHECK_PRIORITY,
    RESET_CHECK_PRIORITY,
    SET_LAYERENROLLMENT,
    SET_LNGLATENROLLMENT,
    SET_DISTANCEENROLLMENT,
    SET_SCOREENROLLMENT,
    SET_LAYERVALIDATE,
    SET_LNGLATVALIDATE,
    SET_DISTANCEVALIDATE,
    SET_SCOREVALIDATE
} from './contains'

export const initState = {
    isNormalSchool: false,
    checkLocation: 'current_position',
    isInputPosition: false,
    addressSuggestion: '',
    listAddressDB: [],
    listAddressMB: [],
    rangeDistance: '5',
    lastDistance: '',
    minScore: '',
    sumPriority: '',
    checkPriority: [],

    layerEnrollment: '',
    lnglatEnrollment: [],
    distanceEnrollment: '5',
    scoreEnrollment: '',
    layerValidate: '',
    lnglatValidate: '',
    distanceValidate: '',
    scoreValidate: '',
}

const reducer = (state, actions) => {
    switch (actions.type) {
        case SET_IS_NORMALSCHOOL:
            return {
                ...state,
                isNormalSchool: actions.payload
            }
    
        case SET_CHECK_LOCATION:
            return {
                ...state,
                checkLocation: actions.payload
            }
    
        case SET_IS_INPUTPOSITION:
            return {
                ...state,
                isInputPosition: actions.payload
            }
    
        case SET_ADDRESSSUGGESTION:
            return {
                ...state,
                addressSuggestion: actions.payload
            }
    
        case SET_LISTADDRESSDB:
            return {
                ...state,
                listAddressDB: actions.payload
            }
    
        case SET_LISTADDRESSMB:
            return {
                ...state,
                listAddressMB: actions.payload
            }

        case SET_RANGE_DISTANCE:
            return {
                ...state,
                rangeDistance: actions.payload
            }
    
        case SET_LASTDISTANCE:
            return {
                ...state,
                lastDistance: actions.payload
            }
    
        case SET_MINSCORE:
            return {
                ...state,
                minScore: actions.payload
            }
    
        case SET_SUMPRIORITY:
            return {
                ...state,
                sumPriority: actions.payload
            }
    
        case SET_CHECK_PRIORITY:
            const checkPriority = [...state.checkPriority]
            checkPriority.push(actions.payload)
            return {
                ...state,
                checkPriority: checkPriority
            }
        
        case SET_UNCHECK_PRIORITY:
            const prevCheckPriority = [...state.checkPriority]
            const unCheckPriority = prevCheckPriority.filter((check) => check !== actions.payload)
            return {
                ...state,
                checkPriority: unCheckPriority
            }
            
        case RESET_CHECK_PRIORITY:
            return {
                ...state,
                checkPriority: []
            }
    
        case SET_LAYERENROLLMENT:
            return {
                ...state,
                layerEnrollment: actions.payload
            }
    
        case SET_LNGLATENROLLMENT:
            return {
                ...state,
                lnglatEnrollment: actions.payload
            }
    
        case SET_DISTANCEENROLLMENT:
            return {
                ...state,
                distanceEnrollment: actions.payload
            }
    
        case SET_SCOREENROLLMENT:
            return {
                ...state,
                scoreEnrollment: actions.payload
            }
    
        case SET_LAYERVALIDATE:
            return {
                ...state,
                layerValidate: actions.payload
            }
    
        case SET_LNGLATVALIDATE:
            return {
                ...state,
                lnglatValidate: actions.payload
            }
    
        case SET_DISTANCEVALIDATE:
            return {
                ...state,
                distanceValidate: actions.payload
            }
    
        case SET_SCOREVALIDATE:
            return {
                ...state,
                scoreValidate: actions.payload
            }
    
        default:
            throw new Error(`Invalid action ${actions.type}`);
    }
}
 
export default reducer;