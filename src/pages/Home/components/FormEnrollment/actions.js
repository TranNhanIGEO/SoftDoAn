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

export const setIsNormalSchool = (payload) => {
    return {
        type: SET_IS_NORMALSCHOOL,
        payload: payload
    }
}

export const setCheckLocation = (payload) => {
    return {
        type: SET_CHECK_LOCATION,
        payload: payload
    }
}

export const setIsInputPosition = (payload) => {
    return {
        type: SET_IS_INPUTPOSITION,
        payload: payload
    }
}

export const setAddressSuggestion = (payload) => {
    return {
        type: SET_ADDRESSSUGGESTION,
        payload: payload
    }
}

export const setListAddressDB = (payload) => {
    return {
        type: SET_LISTADDRESSDB,
        payload: payload
    }
}

export const setListAddressMB = (payload) => {
    return {
        type: SET_LISTADDRESSMB,
        payload: payload
    }
}

export const setRangeDistance = (payload) => {
    return {
        type: SET_RANGE_DISTANCE,
        payload: payload
    }
}

export const setLastDistance = (payload) => {
    return {
        type: SET_LASTDISTANCE,
        payload: payload
    }
}

export const setMinScore = (payload) => {
    return {
        type: SET_MINSCORE,
        payload: payload
    }
}

export const setSumPriority = (payload) => {
    return {
        type: SET_SUMPRIORITY,
        payload: payload
    }
}

export const setCheckPriority = (payload) => {
    return {
        type: SET_CHECK_PRIORITY,
        payload: payload
    }
}

export const setUnCheckPriority = (payload) => {
    return {
        type: SET_UNCHECK_PRIORITY,
        payload: payload
    }
}

export const resetCheckPriority = () => {
    return {
        type: RESET_CHECK_PRIORITY
    }
}

export const setLayerEnrollment = (payload) => {
    return {
        type: SET_LAYERENROLLMENT,
        payload: payload
    }
}

export const setLngLatEnrollment = (payload) => {
    return {
        type: SET_LNGLATENROLLMENT,
        payload: payload
    }
}

export const setDistanceEnrollment = (payload) => {
    return {
        type: SET_DISTANCEENROLLMENT,
        payload: payload
    }
}

export const setScoreEnrollment = (payload) => {
    return {
        type: SET_SCOREENROLLMENT,
        payload: payload
    }
}

export const setLayerValidate = (payload) => {
    return {
        type: SET_LAYERVALIDATE,
        payload: payload
    }
}

export const setLngLatValidate = (payload) => {
    return {
        type: SET_LNGLATVALIDATE,
        payload: payload
    }
}

export const setDistanceValidate = (payload) => {
    return {
        type: SET_DISTANCEVALIDATE,
        payload: payload
    }
}

export const setScoreValidate = (payload) => {
    return {
        type: SET_SCOREVALIDATE,
        payload: payload
    }
}