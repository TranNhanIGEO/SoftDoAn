import axios from "axios"
import { axiosAPI } from "src/utils/axiosConfig"
import { addSchoolInfos, setSchoolDocuments, setSchoolLists } from "src/redux/reducer/mapSlice"
import { pointSrc } from "src/pages/Home/components/Mapbox/source"

const apiGetListAddressDB = async (valueAddress) => {
    try {
        const res = valueAddress 
            ? await axiosAPI.get(`/v1/maps/getaddress?address=${valueAddress}`)
            : await axiosAPI.get(`/v1/maps/getaddress`)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetListAddressMB = async (valueAddress, params) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_MAPBOX_HOST}/geocoding/v5/mapbox.places/${valueAddress}.json` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiAdvisingEnrollment = async (params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/advisingenrollment` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetOneRoute = async (startPoint, endPoint, params) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_MAPBOX_HOST}/directions/v5/mapbox/driving/${startPoint};${endPoint}` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetMultiRoute = async (startPoint, endPoint, params) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_MAPBOX_HOST}/directions-matrix/v1/mapbox/driving/${startPoint};${endPoint}` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetStatisticList = async (params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/getlayerstatistic` + params)
        return res.data
    }
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiRenderChart = async (params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/renderchart` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetSchoolName = async (params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/getschoolname` + params)
        return res.data
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetSchoolList = async (dispatch) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/getschoolname`)
        const resData = pointSrc({
            name: "schools",
            data: res.data,
            attributes: ["tentruong", "diachi", "trangweb", "maloaihinh"],
        });
        dispatch(setSchoolLists(resData.data))
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetSchoolInfo = async (dispatch, params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/getschoolinfo` + params)
        dispatch(addSchoolInfos(res.data))
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

const apiGetSchoolDocument = async (dispatch, params) => {
    try {
        const res = await axiosAPI.get(`/v1/maps/getschooldocument` + params)
        dispatch(setSchoolDocuments(res.data))
    } 
    catch (err) {
        throw new Error (err.response.data)
    }
}

export {
    apiGetListAddressDB,
    apiGetListAddressMB,
    apiAdvisingEnrollment,
    apiGetOneRoute,
    apiGetMultiRoute,
    
    apiGetStatisticList,
    apiRenderChart,

    apiGetSchoolName,
    apiGetSchoolList,
    apiGetSchoolInfo,
    apiGetSchoolDocument,
}