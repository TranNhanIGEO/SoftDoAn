import "./ResultEnrollment.css";
import { useMemo, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import { apiRenderChart } from "src/redux//request/mapRequest";
import { MapContext } from "src/contexts/MapContext";
import Offcanvas from "src/components/interfaces/Offcanvas/Offcanvas";
import { useMap } from "react-map-gl";

const ResultEnrollment = () => {
  const { isOpenOffCanvasEnrollment, setIsOpenOffCanvasEnrollment } =
    useContext(MapContext);
  const { enrollmentLastLayer } = useContext(MapContext);
  const { dataResponseEnrollment } = useContext(MapContext);
  const { setIsOpenOffCanvasCompare } = useContext(MapContext);
  const { setIsOpenOffCanvasStatistic } = useContext(MapContext);
  const { setDataResponseStatistic } = useContext(MapContext);
  const { mapbox: map } = useMap();
  const { directionCurrent } = useContext(MapContext);
  const [currentID, setCurrentID] = useState(null);

  const removeLayer = () => {
    map?.getLayer("inlinebuffer") && map?.getMap().removeLayer("inlinebuffer");
    map?.getLayer("outlinebuffer") &&
      map?.getMap().removeLayer("outlinebuffer");
    map?.getLayer("markerschoolpoint") &&
      map?.getMap().removeLayer("markerschoolpoint");
    map?.hasImage("icon-schoolpoint") &&
      map?.getMap().removeImage("icon-schoolpoint");
    map?.getSource("pointjson") && map?.getMap().removeSource("pointjson");
    map?.getSource("bufferjson") && map?.getMap().removeSource("bufferjson");
    directionCurrent.current && directionCurrent.current.clearDestination();
  };

  const handleRowResult = async (
    lastLayer,
    schoolID,
    schoolName,
    schoolCoords
  ) => {
    switch (lastLayer) {
      case "00LTKC00":
        lastLayer = "00CTLT00";
        break;

      case "00LTHC00":
        lastLayer = "00CTLTH0";
        break;

      default:
        lastLayer = "00CTLC00";
        break;
    }
    const objParam = { layer: lastLayer, school: schoolName };
    const params = "?" + new URLSearchParams(objParam).toString();
    const requets = await apiRenderChart(params);
    setIsOpenOffCanvasStatistic(true);
    setCurrentID(schoolID);
    setDataResponseStatistic(requets.data);
    directionCurrent.current?.setDestinationFromCoordinates(schoolCoords);
  };

  const initialColumnData = useMemo(() => {
    switch (enrollmentLastLayer) {
      case "00LTKC00":
        return [
          { field: "tentruong", headerName: "Tên trường", width: 150 },
          { field: "nv1", headerName: "Nguyện vọng 1", width: 50 },
          { field: "nv2", headerName: "Nguyện vọng 2", width: 50 },
          { field: "nv3", headerName: "Nguyện vọng 3", width: 50 },
          { field: "ctieu", headerName: "Chỉ tiêu", width: 50 },
          { field: "distance", headerName: "Khoảng cách (km)", width: 90 },
          { field: "duration", headerName: "Thời gian (phút)", width: 80 },
        ];

      default:
        return [
          { field: "tentruong", headerName: "Tên trường", width: 150 },
          { field: "nv1", headerName: "Nguyện vọng 1", width: 50 },
          { field: "nv2", headerName: "Nguyện vọng 2", width: 50 },
          { field: "ctieu", headerName: "Chỉ tiêu", width: 50 },
          { field: "distance", headerName: "Khoảng cách (km)", width: 90 },
          { field: "duration", headerName: "Thời gian (phút)", width: 80 },
        ];
    }
  }, [enrollmentLastLayer]);

  const columnDataResponse = useMemo(() => {
    return (
      <TableRow>
        {initialColumnData.map((column) => (
          <TableCell
            key={column.field}
            sx={{ width: column.width }}
            align="center"
          >
            {column.headerName}
          </TableCell>
        ))}
      </TableRow>
    );
  }, [initialColumnData]);

  const rowDataResponse = useMemo(() => {
    switch (enrollmentLastLayer) {
      case "00LTKC00":
        return (
          <>
            {dataResponseEnrollment.map((row) => (
              <TableRow
                key={row.matruong}
                selected={row.matruong === currentID}
                onClick={() =>
                  handleRowResult(
                    enrollmentLastLayer,
                    row.matruong,
                    row.tentruong,
                    row.pointjson.coordinates
                  )
                }
              >
                <TableCell align="center">{row.tentruong}</TableCell>
                <TableCell align="center">{row.nv1}</TableCell>
                <TableCell align="center">{row.nv2}</TableCell>
                <TableCell align="center">{row.nv3}</TableCell>
                <TableCell align="center">{row.ctieu}</TableCell>
                <TableCell align="center">
                  {(row.distance / 1000).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {(row.duration / 60).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </>
        );

      default:
        return (
          <>
            {dataResponseEnrollment.map((row) => (
              <TableRow
                key={row.matruong}
                selected={row.matruong === currentID}
                onClick={() =>
                  handleRowResult(
                    enrollmentLastLayer,
                    row.matruong,
                    row.tentruong,
                    row.pointjson.coordinates
                  )
                }
              >
                <TableCell align="center">{row.tentruong}</TableCell>
                <TableCell align="center">{row.nv1}</TableCell>
                <TableCell align="center">{row.nv2}</TableCell>
                <TableCell align="center">{row.ctieu}</TableCell>
                <TableCell align="center">
                  {(row.distance / 1000).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {(row.duration / 60).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </>
        );
    }
  }, [enrollmentLastLayer, dataResponseEnrollment, handleRowResult]);

  const handleCloseOffCanvas = () => {
    removeLayer();
    setIsOpenOffCanvasCompare(false);
    setIsOpenOffCanvasStatistic(false);
  };

  return (
    <Offcanvas
      isOpen={isOpenOffCanvasEnrollment}
      onClose={() => setIsOpenOffCanvasEnrollment(false)}
      position={"bottom"}
      size={{ height: "30vh", width: "100%" }}
      style={{ overflowY: "auto" }}
    >
      <Offcanvas.Header onClick={() => handleCloseOffCanvas()}>
        Thông tin xét tuyển các trường THPT đạt yêu cầu
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Table sx={{ tableLayout: "auto" }} stickyHeader={true}>
          <TableHead>{columnDataResponse}</TableHead>
          <TableBody>{rowDataResponse}</TableBody>
        </Table>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ResultEnrollment;
