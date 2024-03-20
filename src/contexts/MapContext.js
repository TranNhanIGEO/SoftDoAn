import { useRef, useState, createContext } from 'react';

const MapContext = createContext()

const MapProvider = ({children}) => {
    const [isCloseSidebar, setIsCloseSidebar] = useState(true)
    const [isOpenModalEnrollment, setIsOpenModalEnrollment] = useState(false)
    const [isOpenModalStatistic, setIsOpenModalStatistic] = useState(false)
    const [isOpenOffCanvasEnrollment, setIsOpenOffCanvasEnrollment] = useState(false)
    const [isOpenOffCanvasStatistic, setIsOpenOffCanvasStatistic] = useState(false)
    const [isOpenOffCanvasCompare, setIsOpenOffCanvasCompare] = useState(false)
    const [isOpenOffCanvasSchoolList, setIsOpenOffCanvasSchoolList] = useState(false)
    const [enrollmentCoords, setEnrollmentCoords] = useState([])
    const [enrollmentLastLayer, setEnrollmentLastLayer] = useState('')
    const [dataResponseEnrollment, setDataResponseEnrollment] = useState([])
    const [dataResponseStatistic, setDataResponseStatistic] = useState([])
    const directionCurrent = useRef(null)
    const markerSearch = useRef(null)

    const globalMapValue = {
        isCloseSidebar, setIsCloseSidebar, 
        isOpenModalEnrollment, setIsOpenModalEnrollment,
        isOpenModalStatistic, setIsOpenModalStatistic,
        isOpenOffCanvasEnrollment, setIsOpenOffCanvasEnrollment, 
        isOpenOffCanvasStatistic, setIsOpenOffCanvasStatistic,
        isOpenOffCanvasCompare, setIsOpenOffCanvasCompare,
        isOpenOffCanvasSchoolList, setIsOpenOffCanvasSchoolList,
        enrollmentCoords, setEnrollmentCoords, 
        enrollmentLastLayer, setEnrollmentLastLayer,
        dataResponseEnrollment, setDataResponseEnrollment,
        dataResponseStatistic, setDataResponseStatistic,
        directionCurrent, markerSearch
    }
    
    return (
        <MapContext.Provider value={globalMapValue}>
            {children}
        </MapContext.Provider>
    )
}

export { MapContext, MapProvider }