import './MyMap.css'
import Sidebar from 'src/layouts/Sidebar/Sidebar';
import MapContainer from 'src/components/modules/Map/MapContainer';
import FormEnrollment from 'src/components/modules/Map/FormEnrollment/FormEnrollment';
import FormStatistic from 'src/components/modules/Map/FormStatistic/FormStatistic';

const MyMap = () => {
    return (  
        <div className='main'>
            <Sidebar />
            <MapContainer />
            <FormEnrollment />
            <FormStatistic />
        </div>
    );
}
 
export default MyMap;