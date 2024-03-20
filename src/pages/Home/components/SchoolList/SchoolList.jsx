import "./SchoolList.css";
import { Fragment, useCallback, useContext, useEffect } from "react";
import Offcanvas from "src/components/interfaces/Offcanvas/Offcanvas";
import { MapContext } from "src/contexts/MapContext";
import { useMap } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "src/components/interfaces/Button/Button";
import {
  apiGetSchoolDocument,
  apiGetSchoolInfo,
} from "src/redux/request/mapRequest";
import {
  currentSchool,
  removeSchoolInfos,
  schoolDocuments,
  schoolInfos,
  schoolLists,
  schoolTypes,
  setSchoolTypes,
  setThisSchool,
} from "src/redux/reducer/mapSlice";

export const ListLayer = [
  {
    id: "00LTKC00",
    layer: "Lớp thường",
  },
  {
    id: "00LTHC00",
    layer: "Lớp tích hợp",
  },
  {
    id: "00LCTT00",
    layer: "Lớp chuyên Toán",
  },
  {
    id: "00LCVH00",
    layer: "Lớp chuyên Văn",
  },
  {
    id: "00LCHH00",
    layer: "Lớp chuyên Hóa",
  },
  {
    id: "00LCVL00",
    layer: "Lớp chuyên Lý",
  },
  {
    id: "00LCSH00",
    layer: "Lớp chuyên Sinh",
  },
  {
    id: "00LCLS00",
    layer: "Lớp chuyên Sử",
  },
  {
    id: "00LCĐL00",
    layer: "Lớp chuyên Địa",
  },
  {
    id: "00LCTH00",
    layer: "Lớp chuyên Tin",
  },
  {
    id: "00LCEN00",
    layer: "Lớp chuyên Tiếng Anh",
  },
  {
    id: "00LCFR00",
    layer: "Lớp chuyên Tiếng Pháp",
  },
  {
    id: "00LCJP00",
    layer: "Lớp chuyên Tiếng Nhật",
  },
  {
    id: "00LCCN00",
    layer: "Lớp chuyên Tiếng Trung",
  },
];

const SchoolList = () => {
  const { setIsOpenOffCanvasSchoolList } = useContext(MapContext);
  const { isOpenOffCanvasSchoolList } = useContext(MapContext);
  const { isOpenModalEnrollment } = useContext(MapContext);
  const { isOpenModalStatistic } = useContext(MapContext);
  const { markerSearch } = useContext(MapContext);
  const thisSchool = useSelector(currentSchool);
  const schoolType = useSelector(schoolTypes);
  const { mapbox: map } = useMap();
  const dispatch = useDispatch();
  const schoolList = useSelector(schoolLists);
  const schoolInfo = useSelector(schoolInfos);
  const schoolDocument = useSelector(schoolDocuments);

  const handleCloseOffCanvas = () => {
    setIsOpenOffCanvasSchoolList(false);
    markerSearch.current && markerSearch.current.remove();
  };

  const showMarker = useCallback(
    (coords) => {
      markerSearch.current && markerSearch.current.remove();
      const schoolMarker = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(coords)
        .addTo(map.getMap());
      markerSearch.current = schoolMarker;
    },
    [map]
  );

  const handleFlyToSchool = (coords) => {
    map.flyTo({
      center: coords,
      zoom: 15,
      curve: 1,
      speed: 0.5,
    });
    showMarker(coords);
  };

  const handleClickSchool = (properties) => {
    const propertiesIDs =
      typeof properties.maloaihinh === "string"
        ? properties.maloaihinh
            .split(/[",.,!,?,;]/)
            .filter((str) => str.length > 1)
        : properties.maloaihinh;
    dispatch(setThisSchool(properties.tentruong));
    dispatch(
      setSchoolTypes({
        name: properties.tentruong,
        type: propertiesIDs,
      })
    );
    propertiesIDs.forEach((layer) => {
      const objParam = { layer: layer, school: properties.tentruong };
      const params = "?" + new URLSearchParams(objParam).toString();
      apiGetSchoolInfo(dispatch, params);
    });
    const objParam = { school: properties.tentruong };
    const params = "?" + new URLSearchParams(objParam).toString();
    apiGetSchoolDocument(dispatch, params);
  };

  const handleBackSchoolList = () => {
    dispatch(
      setSchoolTypes({
        name: "",
        type: "",
      })
    );
    dispatch(removeSchoolInfos());
    markerSearch.current && markerSearch.current.remove();
  };

  useEffect(() => {
    isOpenModalEnrollment &&
      markerSearch.current &&
      markerSearch.current.remove();
    isOpenModalStatistic &&
      markerSearch.current &&
      markerSearch.current.remove();
  }, [isOpenModalEnrollment, isOpenModalStatistic]);

  useEffect(() => {
    if (!map) return;
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["allschool"],
      });
      if (!features.length) return;
      const pointProperties = features[0].properties;
      const pointCoords = features[0].geometry.coordinates;
      handleBackSchoolList();
      handleClickSchool(pointProperties);
      showMarker(pointCoords);
      setIsOpenOffCanvasSchoolList(true);
    });
  }, [map]);

  const ListType = (type) => {
    const matchType = ListLayer.map(
      (layer) => layer.id.includes(type) && layer.layer
    );
    return (
      <Fragment>
        <span>&#8680;</span>
        <span>{matchType}</span>
      </Fragment>
    );
  };

  const SchoolTable = (type) => {
    return (
      <Fragment>
        {schoolInfo?.map(
          (info, idx) =>
            info.maloaihinh === type && (
              <table key={idx} className="schoolscores">
                <thead>
                  <tr>
                    <th>NV1 - {info.namtuyensinh}</th>
                    <th>NV2 - {info.namtuyensinh}</th>
                    {info.nv3 && <th>NV3 - {info.namtuyensinh}</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{info.nv1}</td>
                    <td>{info.nv2}</td>
                    {info.nv3 && <td>{info.nv3}</td>}
                  </tr>
                </tbody>
              </table>
            )
        )}
      </Fragment>
    );
  };

  return (
    <Offcanvas
      isOpen={isOpenOffCanvasSchoolList}
      onClose={() => setIsOpenOffCanvasSchoolList(false)}
      position={"centerright"}
      size={{ height: "55vh", width: "40vw" }}
      style={{ overflowY: "auto" }}
    >
      <Offcanvas.Header onClick={() => handleCloseOffCanvas()}>
        {schoolType.name && schoolType.type ? (
          <Fragment>Trường {schoolType.name}</Fragment>
        ) : (
          <Fragment>Danh sách trường học</Fragment>
        )}
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="schoollist">
          {schoolType.name && schoolType.type ? (
            <Fragment>
              <Button className="schoollist-back">
                <ArrowBackIcon
                  titleAccess="Quay lại"
                  onClick={handleBackSchoolList}
                />
              </Button>
              <div className="schoolitem-container">
                <h3>Loại hình đào tạo</h3>
                <div className="schooltypes">
                  {schoolType.type.map((type) => (
                    <div key={type} className="schooltype">
                      {ListType(type)}
                      {SchoolTable(type)}
                    </div>
                  ))}
                </div>
                <div className="schoolitem-document">
                  <h3>Cam kết chất lượng giáo dục</h3>
                  <div className="schoolitem-link">
                    {schoolDocument?.map((doc, idx) => (
                      <a
                        key={idx}
                        target={doc.ckclgd && "_blank"}
                        href={doc.ckclgd ? doc.ckclgd : "#"}
                      >
                        <img
                          src={
                            doc.ckclgd
                              ? "/imgs/icon-pdf.png"
                              : "/imgs/icon-pdf-failed.png"
                          }
                          alt=""
                        />
                        <span>
                          {doc.namtuyensinh}-{doc.namtuyensinh + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="schoolitem-document">
                  <h3>Cơ sở vật chất</h3>
                  <div className="schoolitem-link">
                    {schoolDocument?.map((doc, idx) => (
                      <a
                        key={idx}
                        target={doc.csvc && "_blank"}
                        href={doc.csvc ? doc.csvc : "#"}
                      >
                        <img
                          src={
                            doc.csvc
                              ? "/imgs/icon-pdf.png"
                              : "/imgs/icon-pdf-failed.png"
                          }
                          alt=""
                        />
                        <span>
                          {doc.namtuyensinh}-{doc.namtuyensinh + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="schoolitem-document">
                  <h3>Chất lượng giáo dục thực tế</h3>
                  <div className="schoolitem-link">
                    {schoolDocument?.map((doc, idx) => (
                      <a
                        key={idx}
                        target={doc.clgd && "_blank"}
                        href={doc.clgd ? doc.clgd : "#"}
                      >
                        <img
                          src={
                            doc.clgd
                              ? "/imgs/icon-pdf.png"
                              : "/imgs/icon-pdf-failed.png"
                          }
                          alt=""
                        />
                        <span>
                          {doc.namtuyensinh - 1}-{doc.namtuyensinh}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {schoolList?.features?.map((school, index) => (
                <div
                  key={index}
                  className={`schoollist-item ${
                    school.properties.tentruong === thisSchool ? "active" : ""
                  }`}
                  onClick={() => handleClickSchool(school.properties)}
                >
                  <div
                    className="schoollist-title"
                    onClick={() =>
                      handleFlyToSchool(school.geometry.coordinates)
                    }
                  >
                    {school.properties.tentruong}
                  </div>
                </div>
              ))}
            </Fragment>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SchoolList;
