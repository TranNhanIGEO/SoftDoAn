import { MapProvider } from "react-map-gl";
import {
  MyMap,
  SchoolList,
  ResultEnrollment,
  ResultStatistic,
  ResultCompare,
} from "./";

const MapContainer = () => {
  return (
    <div className="map-container">
      <MapProvider>
        <MyMap />
        <ResultStatistic />
        <ResultEnrollment />
        <ResultCompare />
        <SchoolList />
      </MapProvider>
    </div>
  );
};

export default MapContainer;
