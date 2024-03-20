import {
    SET_LISTSCHOOLNAME,
    SET_LAYERSTATISTIC,
    SET_SCHOOLSTATISTIC,
    SET_LAYERVALIDATE,
    SET_SCHOOLVALIDATE
} from './contains'

export const setListSchoolName = (payload) => {
    return {
        type: SET_LISTSCHOOLNAME,
        payload: payload
    }
}

export const setLayerStatistic = (payload) => {
    return {
        type: SET_LAYERSTATISTIC,
        payload: payload
    }
}

export const setSchoolStatistic = (payload) => {
    return {
        type: SET_SCHOOLSTATISTIC,
        payload: payload
    }
}

export const setLayerValidate = (payload) => {
    return {
        type: SET_LAYERVALIDATE,
        payload: payload
    }
}

export const setSchoolValidate = (payload) => {
    return {
        type: SET_SCHOOLVALIDATE,
        payload: payload
    }
}