import { useCallback, useContext, useReducer } from "react";
import { apiGetStatisticList, apiRenderChart } from 'src/redux//request/mapRequest';
import { useToast } from "src/contexts/ToastContext";
import { MapContext } from 'src/contexts/MapContext';
import Modal from "src/components/interfaces/Modal/Modal";
import { FormControl, FormLabel, FormAutoComplete, FormSelect, FormValidate } from "src/components/interfaces/Form/Form";
import reducer, { initState } from "./reducer";
import {setListSchoolName, setLayerStatistic, setSchoolStatistic, setLayerValidate, setSchoolValidate} from './actions'
import { ListLayerSelect } from "./data";
import { removeValDuplicates } from "src/utils/removeDuplicates";

const FormStatistic = () => {
    const [state, dispatched] = useReducer(reducer, initState)
    const {listSchoolName, layerStatistic, schoolStatistic, layerValidate, schoolValidate} = state
    
    const {isOpenModalStatistic, setIsOpenModalStatistic} = useContext(MapContext)
    const {setIsOpenOffCanvasStatistic} = useContext(MapContext)
    const {setDataResponseStatistic} = useContext(MapContext)
    const toast = useToast({autoClose: true, delayClose: 3000})

    // Handle set layer and call API to get school information from Database --- Form
    const handleSetLayer = async (e) => {
        const value = e.target.value
        dispatched(setLayerStatistic(value))
        dispatched(setLayerValidate(''))
        dispatched(setSchoolStatistic(''))
        const objParam = {layer: value}
        const params = '?' + new URLSearchParams(objParam).toString()
        const request = await apiGetStatisticList(params)
        handleListSchool(request)
    }

    // Get and set school list for autocomplete component
    const handleListSchool = (res) => {
        const schoolName = res.map((school) => (school.tentruong))
        dispatched(setListSchoolName(schoolName))
    }

    const handleSchoolSuggestion = (value) => {
        dispatched(setSchoolStatistic(value))
        dispatched(setSchoolValidate(''))
    }

    const handleSelectSuggestion = useCallback((val) => {
        dispatched(setSchoolValidate(''))
        dispatched(setSchoolStatistic(val))
    }, [setSchoolStatistic])

    // Handle reset form --- Form
    const handleResetForm = () => {
        dispatched(setListSchoolName([]))
        dispatched(setLayerStatistic(''))
        dispatched(setSchoolStatistic(''))
        dispatched(setLayerValidate(''))
        dispatched(setSchoolValidate(''))

        setIsOpenOffCanvasStatistic(false)
    }

    // Handle submit form --- Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!layerStatistic) return dispatched(setLayerValidate('Vui lòng chọn 1 loại hình để xem thống kê!'))
        if (!schoolStatistic) return dispatched(setSchoolValidate('Hãy nhập tên trường bạn muốn xem thống kê!'))
        const formData = {
            layer: layerStatistic,
            school: schoolStatistic
        }
        console.log(formData)
        const params = '?' + new URLSearchParams(formData).toString()
        const requets = await apiRenderChart(params)
        handleResponseData(requets)
    }

    // Handle response data
    const handleResponseData = (res) => {
        console.log(res)
        switch (res.status) {
            case 'success':
            setIsOpenOffCanvasStatistic(true)
            setIsOpenModalStatistic(false)
            setDataResponseStatistic(res.data)
            toast('success', 'Hiển thị thành công', 'Biểu đồ thống kê nguyện vọng 1')
            break;
        
            case 'error':
            default:
            dispatched(setSchoolValidate(res.msg))
            break;
        }
    }

    return (
        <Modal isOpen={isOpenModalStatistic} onClose={() => setIsOpenModalStatistic(false)}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Modal.Header>Chọn trường xem thống kê</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormLabel
                            htmlFor='layer'
                        >
                            Loại hình
                        </FormLabel>
                        <FormSelect 
                            id='layer'
                            name='layer' 
                            placeholder='---Chọn 1 loại hình---'
                            value={layerStatistic} 
                            onChange={(e) => handleSetLayer(e)} 
                        >
                            {ListLayerSelect.map((layer, index) => (
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

                    {layerStatistic &&
                        <FormControl>
                            <FormLabel
                                htmlFor='school'
                            >
                                Tên trường
                            </FormLabel>
                            <FormAutoComplete 
                                id='school'
                                name='school'
                                placeholder='Nhập tên trường' 
                                data={removeValDuplicates(listSchoolName)}
                                onClick={handleSelectSuggestion}
                                value={schoolStatistic}
                                onChange={handleSchoolSuggestion}
                            />
                            {schoolValidate &&
                                <FormValidate>
                                    {schoolValidate}
                                </FormValidate>
                            }
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
                        Xem thống kê
                    </Modal.Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
 
export default FormStatistic;
