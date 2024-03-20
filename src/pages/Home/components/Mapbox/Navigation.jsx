import mapboxgl from "mapbox-gl";
import { useMap } from "react-map-gl";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
// import DirectionsIcon from "@mui/icons-material/Directions";
import { MapContext } from "src/contexts/MapContext";
import {
  apiGetSchoolDocument,
  apiGetSchoolInfo,
  apiGetSchoolName,
} from "src/redux//request/mapRequest";
import {
  schoolLists,
  setSchoolTypes,
  setThisSchool,
} from "src/redux/reducer/mapSlice";

const Navigation = ({ directionRef }) => {
  const [valueAutoComplete, setValueAutoComplete] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isShowGeocoding, setIsShowGeocoding] = useState(true);
  const [listSchool, setListSchool] = useState([]);
  const { setIsOpenOffCanvasSchoolList } = useContext(MapContext);
  // const { enrollmentCoords } = useContext(MapContext);
  const { markerSearch } = useContext(MapContext);
  const { mapbox: map } = useMap();
  const schoolList = useSelector(schoolLists);
  const dispatch = useDispatch();

  const handleAutoComplete = (e) => {
    const value = e.target.value;
    setValueAutoComplete(value);
  };

  const setAutoComplete = useCallback(
    async (val) => {
      setValueAutoComplete(val);
      setShowAutoComplete(false);
      const objParams = { school: val };
      const params = "?" + new URLSearchParams(objParams).toString();
      const request = await apiGetSchoolName(params);
      const [response] = request;
      const schoolCoords = response.json.coordinates;
      markerSearch.current && markerSearch.current.remove();
      map.flyTo({ center: schoolCoords, zoom: 15, curve: 1, speed: 0.5 });
      const schoolMarker = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(schoolCoords)
        .addTo(map.getMap());
      markerSearch.current = schoolMarker;
      setIsOpenOffCanvasSchoolList(true);
      dispatch(setThisSchool(response.tentruong));
      dispatch(
        setSchoolTypes({
          name: response.tentruong,
          type: response.maloaihinh,
        })
      );
      response.maloaihinh.forEach((layer) => {
        const objParam = { layer: layer, school: response.tentruong };
        const params = "?" + new URLSearchParams(objParam).toString();
        apiGetSchoolInfo(dispatch, params);
      });
      const objParam = { school: response.tentruong };
      const param = "?" + new URLSearchParams(objParam).toString();
      apiGetSchoolDocument(dispatch, param);
    },
    [map, markerSearch]
  );

  const ListAutoComplete = useMemo(() => {
    const vi_to_en = require("src/utils/convertVi_En");
    if (!showAutoComplete) return [];
    return listSchool
      .filter((val) => vi_to_en(val).includes(vi_to_en(valueAutoComplete)))
      .slice(0, 5)
      .map((val) => (
        <li key={val} onClick={() => setAutoComplete(val)}>
          <span>{val}</span>
        </li>
      ));
  }, [showAutoComplete, valueAutoComplete, setAutoComplete, listSchool]);

  useEffect(() => {
    const response = schoolList?.features?.map(
      (school) => school.properties.tentruong
    );
    setListSchool(response);
  }, [schoolList]);

  // const handleShowDirection = useCallback(async () => {
  //   setIsShowGeocoding((prev) => !prev);
  //   if (!directionRef.current) return;
  //   switch (map.hasControl(directionRef.current.directions)) {
  //     case true:
  //       map.removeControl(directionRef.current.directions);
  //       break;

  //     case false:
  //     default:
  //       map.addControl(directionRef.current.directions, "top-left");
  //       directionRef.current.directions.actions.setOriginFromCoordinates(
  //         enrollmentCoords
  //       );
  //       break;
  //   }
  // }, [directionRef, enrollmentCoords, map]);

  return (
    <div className="mapboxgl-ctrl-custom">
      {isShowGeocoding && (
        <div className="mapboxgl-ctrl-top-left">
          <div className="mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-geocoder">
            <SearchIcon className="mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-search" />
            <input
              type="text"
              className="mapboxgl-ctrl-geocoder--input"
              placeholder="Nhập tên trường"
              onChange={(e) => handleAutoComplete(e)}
              onFocus={() => setShowAutoComplete(true)}
              onBlur={() => setTimeout(() => setShowAutoComplete(false), 150)}
              value={valueAutoComplete}
            />
            <div className="suggestions-wrapper">
              <ul className="suggestions">{ListAutoComplete}</ul>
            </div>
          </div>
        </div>
      )}

      {/* <div className="mapboxgl-ctrl-bottom-right">
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button onClick={() => handleShowDirection()}>
            {isShowGeocoding ? (
              <DirectionsIcon titleAccess="Chỉ đường" />
            ) : (
              <SearchIcon titleAccess="Tìm kiếm" />
            )}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Navigation;
