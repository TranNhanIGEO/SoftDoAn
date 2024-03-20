import { useCallback, useEffect, useContext, useReducer } from 'react';
import { apiAdvisingEnrollment, apiGetListAddressDB, apiGetListAddressMB, apiGetMultiRoute, apiGetOneRoute } from 'src/redux//request/mapRequest';
import { useToast } from 'src/contexts/ToastContext';
import { MapContext } from 'src/contexts/MapContext';
import Modal from 'src/components/interfaces/Modal/Modal';
import { FormControl, FormLabel, FormAutoComplete, FormCheckboxDropdown, FormDropdown, FormNumber, FormRadio, FormSelect, FormValidate, FormRange } from "src/components/interfaces/Form/Form";
import {ListSelectLayer, ListRadioLocation, ListCheckPriority} from './data'
import reducer, { initState } from './reducer';
import { setIsNormalSchool, setCheckLocation, setIsInputPosition, setAddressSuggestion, setListAddressDB, setListAddressMB, setRangeDistance, setLastDistance, setMinScore, setSumPriority, setCheckPriority, setUnCheckPriority, resetCheckPriority, setLayerEnrollment, setLngLatEnrollment, setDistanceEnrollment, setScoreEnrollment, setLayerValidate, setLngLatValidate, setDistanceValidate, setScoreValidate } from './actions'
import { useMap } from 'react-map-gl/dist/esm/components/use-map';

const FormEnrollment = () => {
    const [state, dispatched] = useReducer(reducer, initState)
    const {isNormalSchool, checkLocation, isInputPosition, addressSuggestion, listAddressDB, listAddressMB, rangeDistance, lastDistance, minScore, sumPriority, checkPriority, layerEnrollment, lnglatEnrollment, distanceEnrollment, scoreEnrollment, layerValidate, lnglatValidate, distanceValidate, scoreValidate} = state
    
    const {isOpenModalEnrollment, setIsOpenModalEnrollment} = useContext(MapContext)
    const {setEnrollmentLastLayer} = useContext(MapContext)
    const {setEnrollmentCoords} = useContext(MapContext)
    const {setDataResponseEnrollment} = useContext(MapContext)
    const {setIsOpenOffCanvasEnrollment} = useContext(MapContext)
    const {setIsOpenOffCanvasCompare} = useContext(MapContext)
    const {setIsOpenOffCanvasStatistic} = useContext(MapContext)
    const {mapbox: map} = useMap()
    const {directionCurrent} = useContext(MapContext)
    const {markerSearch} = useContext(MapContext)
    const toast = useToast({autoClose: true, delayClose: 10000})
    
    const removeLayer = () => {
        map?.getLayer('inlinebuffer') && map?.getMap().removeLayer('inlinebuffer')
        map?.getLayer('outlinebuffer') && map?.getMap().removeLayer('outlinebuffer')
        map?.getLayer('markerschoolpoint') && map?.getMap().removeLayer('markerschoolpoint')
        map?.hasImage('icon-schoolpoint') && map?.getMap().removeImage('icon-schoolpoint')
        map?.getSource('pointjson') && map?.getMap().removeSource('pointjson')
        map?.getSource('bufferjson') && map?.getMap().removeSource('bufferjson')
        directionCurrent.current && directionCurrent.current.clearDestination()
    }

    // Handle set layer --- Form
    const handleSetLayer = (e) => {
        const value = e.target.value
        dispatched(setLayerValidate(''))
        dispatched(setLayerEnrollment(value))
        e.target.value === '00LTKC00'
            ? dispatched(setIsNormalSchool(true))
            : dispatched(setIsNormalSchool(false))
    }

    // Call API get address from Database or Mapbox API
    const getListAddressDB = async () => {
        const request = await apiGetListAddressDB()
        handleListAddressDB(request)
    }

    const getListAddressMB = async (value) => {
        const objParams = {types: 'address,neighborhood,poi', language: 'vi', country: 'VN', limit: 5, access_token: process.env.REACT_APP_MAPBOX_ACCESS_KEY}
        const params = '?' + new URLSearchParams(objParams).toString()
        const request = await apiGetListAddressMB(value, params)
        handleListAddressMB(request.features)
    }

    // Get and set address for list autocomplete
    const handleListAddressDB = (res) => {
        const addressNames = res.map((address) => (address.diachi))
        dispatched(setListAddressDB(addressNames))
    }

    const handleListAddressMB = (res) => {
        const addressNames = res.map((address) => (address.place_name))
        dispatched(setListAddressMB(addressNames))
    }

    const getCurrentPosition = useCallback(() => {
        const success = (position) => {
            const lng = position.coords.longitude
            const lat = position.coords.latitude
            dispatched(setLngLatEnrollment([lng, lat]))
            setEnrollmentCoords([lng, lat])
        }
        const error = () => alert('Geolocation is not supported by this browser.')
        navigator.geolocation.getCurrentPosition(success, error)
    }, [setEnrollmentCoords])

    const getAddressPositionDB = useCallback((res) => {
        const [addressCoord] = res
        const lng = addressCoord.lon
        const lat = addressCoord.lat
        dispatched(setLngLatEnrollment([lng, lat]))
        setEnrollmentCoords([lng, lat])
    }, [setEnrollmentCoords])

    const getAddressPositionMB = useCallback((res) => {
        const [addressCoord] = res
        const lng = addressCoord.geometry.coordinates[0]
        const lat = addressCoord.geometry.coordinates[1]
        dispatched(setLngLatEnrollment([lng, lat]))
        setEnrollmentCoords([lng, lat])
    }, [setEnrollmentCoords])

    // Handle check for location --- Form
    const handleCheckLocation = (e) => {
        const value = e.target.value
        const checked = e.target.checked
        dispatched(setCheckLocation(value))
        switch (true) {
            case checked && value === 'address_position':
            dispatched(setLngLatEnrollment([]))
            dispatched(setIsInputPosition(!isInputPosition))
            getListAddressDB()
            break;
                
            case checked && value === 'current_position':
            default:
            dispatched(setIsInputPosition(!isInputPosition))
            getCurrentPosition()
            break;
        }
    }

    // Set address list for autocomplete component
    const handleAddressSuggestion = (value) => {
        dispatched(setAddressSuggestion(value))
    }

    const handleSelectSuggestion = useCallback( async (val) => {
        dispatched(setLngLatValidate(''))
        switch (listAddressDB.includes(val)) {
            case true:
            const requestDB = await apiGetListAddressDB(val)
            getAddressPositionDB(requestDB)
            break;
        
            default:
            const objParams = {types: 'address,neighborhood,poi', language: 'vi', country: 'VN', limit: 1, access_token: process.env.REACT_APP_MAPBOX_ACCESS_KEY}
            const params = '?' + new URLSearchParams(objParams).toString()
            const requestMB = await apiGetListAddressMB(val, params)
            getAddressPositionMB(requestMB.features)
            break;
        }
    }, [listAddressDB, getAddressPositionDB, getAddressPositionMB])

    // Handle range for distance --- Form
    const handleRangeDistance = (e) => {
        const value = e.target.value
        dispatched(setDistanceEnrollment(value))
        dispatched(setRangeDistance(value))
        Number(lastDistance) < Number(value * 1000) && dispatched(setDistanceValidate(''))
        Number(value) > 5 
            ? dispatched(setDistanceValidate("Nên chọn trường dưới 5km để thuận tiện di chuyển!"))
            : dispatched(setDistanceValidate(''))
    }

    // Handle enter score --- Form
    const handleSetScore = (e) => {
        const value = e.target.value
        minScore <= value && dispatched(setScoreValidate(''))
        dispatched(setScoreEnrollment(value))
    }

    // Handle checkbox for priority score --- Form
    const handleCheckPriority = (e) => {
        const value = e.target.value
        const checked = e.target.checked
        switch (checked) {
            case true:
            const totalPriority = Number(sumPriority) + Number(value)
            if (totalPriority > 3) {return (
                toast("warning", "Cảnh báo", "Tối đa không quá 3 điểm!"),
                dispatched(resetCheckPriority()),
                dispatched(setSumPriority('')))
            }
            dispatched(setCheckPriority(value))
            dispatched(setSumPriority(totalPriority))
            break;
        
            default:
            dispatched(setUnCheckPriority(value))
            dispatched(setSumPriority(Number(sumPriority) - Number(value)))
            break;
        }
    }

    // Handle reset form --- Form
    const handleResetForm = () => {
        dispatched(setIsNormalSchool(false))
        dispatched(setCheckLocation('current_position'))
        dispatched(setIsInputPosition(false))
        dispatched(setListAddressDB([]))
        dispatched(setListAddressMB([]))
        dispatched(setRangeDistance('5'))
        dispatched(setLastDistance(''))
        dispatched(setMinScore(''))
        dispatched(resetCheckPriority())
        dispatched(setSumPriority(''))
        
        dispatched(setLayerEnrollment(''))
        dispatched(setDistanceEnrollment('5'))
        dispatched(setScoreEnrollment(''))
        getCurrentPosition()
        dispatched(setLayerValidate(''))
        dispatched(setLngLatValidate(''))
        dispatched(setDistanceValidate(''))
        dispatched(setScoreValidate(''))

        setIsOpenOffCanvasEnrollment(false)
        setIsOpenOffCanvasCompare(false)
        setIsOpenOffCanvasStatistic(false)
        setEnrollmentLastLayer('')
        setDataResponseEnrollment([])
        removeLayer()
    }

    // Handle submit form --- Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatched(setDistanceValidate(''))
        if (!layerEnrollment) return dispatched(setLayerValidate('Vui lòng chọn 1 loại hình xét tuyển!'))
        if (!lnglatEnrollment.length) return dispatched(setLngLatValidate('Địa chỉ không hợp lệ, vui lòng chọn theo gợi ý!'))
        if (!scoreEnrollment) return dispatched(setScoreValidate('Vui lòng nhập điểm để nhận được tư vấn tốt nhất!'))
        const formData = {
            layer: layerEnrollment,
            distance: Number(distanceEnrollment) * 1000,
            score: Number(scoreEnrollment) + Number(sumPriority),
            longitude: lnglatEnrollment[0],
            latitude: lnglatEnrollment[1]
        }
        console.log(formData)
        const params = '?' + new URLSearchParams(formData).toString()
        const request = await apiAdvisingEnrollment(params)
        markerSearch.current && markerSearch.current.remove()
        handleResponseData(request)
    }

    // Handle response data
    const handleResponseData = (res) => {
        console.log(res)
        switch (res.status) {
            case 'success':
            setIsOpenModalEnrollment(false)
            setIsOpenOffCanvasEnrollment(true)
            setIsOpenOffCanvasCompare(true)
            setEnrollmentLastLayer(res.layer)
            setEnrollmentCoords(lnglatEnrollment)
            handleSchoolPoint(res.data)
            const selectedLayer = ListSelectLayer.find((lyr) => lyr.value === layerEnrollment).layer
            const sumScore = Number(scoreEnrollment) + Number(sumPriority)
            toast('success', 'Tư vấn tuyển sinh thành công', `Bạn có thể trúng tuyển vào loại hình ${selectedLayer} của các trường bên dưới với tổng điểm xét tuyển là: ${sumScore} điểm`)
            break;
        
            case 'error':
            default:
            setIsOpenOffCanvasEnrollment(false)
            setDataResponseEnrollment([])
            switch (res.type) {
                case 'score':
                dispatched(setScoreValidate(res.msg))
                dispatched(setMinScore(res.data))
                break;
                
                case 'distance':
                default:
                dispatched(setDistanceValidate(res.msg))
                dispatched(setLastDistance(res.data))
                break;
            }
            break;
        }
    }

    const concatStringByNumber = (numm) => {
        let concatString = 1
        for (var i = 2; i <= numm; i++) {concatString += ';' + i}
        return concatString
    }

    const concatStringByArray = (arr) => {
        let concatString = ''
        arr.forEach((item) => {concatString += item.toString() + ';'})
        return concatString.slice(0, concatString.length - 1)
    }

    const handleSchoolPoint = async (data) => {
        const coordSchoolPoint = data.map(school => school.pointjson.coordinates)
        const lengthCoordinates = coordSchoolPoint.length
        const startPoint = lnglatEnrollment.toString()
        const endPoint = concatStringByArray(coordSchoolPoint)
        const countEndPoint = concatStringByNumber(lengthCoordinates)
        switch (lengthCoordinates === 1 ) {
            case true:
            const objParamOneRoute = {steps: false, access_token: process.env.REACT_APP_MAPBOX_ACCESS_KEY}
            const paramsOneRoute = '?' + new URLSearchParams(objParamOneRoute).toString()
            const requestOneRoute = await apiGetOneRoute(startPoint, endPoint, paramsOneRoute)
            handleGetOneRoute(requestOneRoute, data)
            break;
        
            default:
            const objParamMultiRoute = { sources: 0, destinations: countEndPoint, annotations: 'distance,duration', access_token: process.env.REACT_APP_MAPBOX_ACCESS_KEY}
            const paramsMultiRoute = '?' + new URLSearchParams(objParamMultiRoute).toString()
            const requestMultiRoute = await apiGetMultiRoute(startPoint, endPoint, paramsMultiRoute)
            handleGetMultiRoute(requestMultiRoute, data)
            break;
        }
    }
    
    const handleGetOneRoute = (route, data) => {
        const [prevObj] = data
        const [routes] = route.routes
        const distance = routes.distance
        const duration = routes.duration
        setDataResponseEnrollment([{
            ...prevObj, 
            distance: distance, 
            duration: duration
        }])
    }
    
    const handleGetMultiRoute = (route, data) => {
        const [distance] = route.distances
        const [duration] = route.durations
        setDataResponseEnrollment(data.map((preObj, index) => ({
            ...preObj, 
            distance: distance[index], 
            duration: duration[index]
        })))
    }

    useEffect(() => {
        checkLocation === 'current_position' && getCurrentPosition()
    }, [checkLocation, getCurrentPosition])

    return (
        <Modal isOpen={isOpenModalEnrollment} onClose={() => setIsOpenModalEnrollment(false)}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Modal.Header>Điền thông tin tư vấn</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormLabel
                            htmlFor='layer'
                        >
                            Loại hình
                        </FormLabel>
                        <FormSelect 
                            id="layer"
                            name="layer" 
                            placeholder='---Chọn 1 loại hình---'
                            value={layerEnrollment} 
                            onChange={(e) => handleSetLayer(e)} 
                        >
                            {ListSelectLayer.map((layer, index) => (
                                <FormSelect.Option 
                                    key={index} 
                                    id={layer.id}
                                    value={layer.value}
                                > 
                                    {layer.layer} 
                                </FormSelect.Option>
                            ))}
                        </FormSelect>
                        {layerValidate && 
                            <FormValidate>
                                {layerValidate}
                            </FormValidate>
                        }
                    </FormControl>

                    <FormControl>
                        <FormLabel
                            htmlFor='position'
                        >
                            Nơi ở hiện tại của học sinh
                        </FormLabel>
                        {ListRadioLocation.map((location, index) => (
                            <FormRadio 
                                key={index} 
                                id={location.id}
                                checked={checkLocation === location.value} 
                                value={location.value} 
                                onChange={(e) => handleCheckLocation(e)}
                            > 
                                {location.location} 
                            </FormRadio>                    
                        ))}
                        {isInputPosition && 
                            <FormAutoComplete 
                                id='position'
                                name='position' 
                                placeholder='VD: 176, Hai Bà Trưng, Đa Kao' 
                                data={[...listAddressDB, ...listAddressMB]} 
                                onClick={handleSelectSuggestion} 
                                value={addressSuggestion}
                                onChange={handleAddressSuggestion}
                                getDataAlt={getListAddressMB} 
                            />
                        }
                        {lnglatValidate &&
                            <FormValidate>
                                {lnglatValidate}
                            </FormValidate>
                        }
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel
                            htmlFor='distance'
                        >
                            Phạm vi bán kính từ nơi ở đến trường
                        </FormLabel>
                        <FormRange 
                            id="distance"
                            name="distance"
                            min="1" 
                            max="20" 
                            step="1" 
                            titleMin='1km' 
                            titleMax='20km' 
                            slider={{'left': rangeDistance * 5 - 4 + '%'}} 
                            value={rangeDistance} 
                            onChange={(e) => handleRangeDistance(e)} 
                        />
                        {distanceValidate && 
                            <FormValidate>
                                {distanceValidate}
                            </FormValidate>
                        }                          
                    </FormControl>

                    <FormControl>
                        <FormLabel
                            htmlFor='score'
                        >
                            Điểm thi dự kiến
                        </FormLabel>
                        <FormNumber 
                            id="score"
                            name="score" 
                            placeholder="Nhập tổng điểm thí sinh dự đoán đạt được trong kỳ thi" 
                            value={scoreEnrollment} 
                            onChange={(e) => handleSetScore(e)} 
                        />
                        {scoreValidate && 
                            <FormValidate>
                                {scoreValidate}
                            </FormValidate>
                        }
                    </FormControl>

                    {isNormalSchool && 
                        <FormControl>
                            <FormLabel
                                htmlFor='priority'
                            >
                                Điểm ưu tiên
                            </FormLabel>
                            <FormDropdown 
                                id = 'priority'
                                placeholder={sumPriority !== 0 && sumPriority !== '' ? sumPriority : "---Chọn điểm ưu tiên (nếu có)---"}
                            >
                                {ListCheckPriority.map((priority, index) => (
                                    <FormCheckboxDropdown 
                                        key={index} 
                                        id={priority.id}
                                        checked={checkPriority.includes(priority.value)} 
                                        value={priority.value} 
                                        onChange={(e) => handleCheckPriority(e)}
                                    > 
                                        {priority.priority} 
                                    </FormCheckboxDropdown>                                
                                ))}
                            </FormDropdown>
                        </FormControl>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Button 
                        type='button' 
                        className='btn btn-failed' 
                        onClick={() => handleResetForm()}
                    >
                        Nhập lại thông tin
                    </Modal.Button>
                    <Modal.Button 
                        type='submit' 
                        className='btn btn-success'
                    >
                        Tìm trường
                    </Modal.Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
 
export default FormEnrollment;
