import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import { Edit } from "@mui/icons-material";
import useAxiosJWT from "src/hooks/useAxiosJWT";
import {
  showAllSchool,
  deleteSchool,
  createSchool,
  updateSchool,
} from "src/redux/request/schoolRequest";
import {
  getAllSchool,
  setNewSchoolName,
  showSchoolSuccess,
} from "src/redux/reducer/schoolSlice";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import { io } from "socket.io-client";

const schoolTypes = [
  { id: "00LTKC00", name: "Lớp không chuyên (trường thường)" },
  { id: "00LTHC00", name: "Lớp tích hợp" },
  { id: "00LCTT00", name: "Lớp chuyên toán" },
  { id: "00LCVH00", name: "Lớp chuyên văn" },
  { id: "00LCHH00", name: "Lớp chuyên hóa" },
  { id: "00LCVL00", name: "Lớp chuyên lý" },
  { id: "00LCSH00", name: "Lớp chuyên sinh" },
  { id: "00LCLS00", name: "Lớp chuyên sử" },
  { id: "00LCĐL00", name: "Lớp chuyên địa" },
  { id: "00LCTH00", name: "Lớp chuyên tin" },
  { id: "00LCJP00", name: "Lớp chuyên tiếng Nhật" },
  { id: "00LCFR00", name: "Lớp chuyên tiếng Pháp" },
  { id: "00LCEN00", name: "Lớp chuyên tiếng Anh" },
  { id: "00LCCN00", name: "Lớp chuyên tiếng Trung" },
];

const SchoolTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const listData = useSelector(getAllSchool);
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const socket = useRef();

  useEffect(() => {
    showAllSchool(axiosJWT, dispatch);
  }, [axiosJWT, dispatch]);

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_DOMAIN}`);
    const updateSchool = (data) => {
      switch (data.dml_action) {
        case "INSERT":
          const hasSchool = listData.some((element) =>
            element.matruong.includes(data.matruong)
          );
          !hasSchool && listData.push(data);
          dispatch(showSchoolSuccess(listData));
          break;

        case "UPDATE":
          const indexSchoolUpdate = listData.findIndex((element) =>
            element.matruong.includes(data.matruong)
          );
          listData.splice(indexSchoolUpdate, 1, data);
          dispatch(showSchoolSuccess(listData));
          break;

        case "DELETE":
          const indexSchoolDelete = listData.findIndex((element) =>
            element.matruong.includes(data.matruong)
          );
          listData.splice(indexSchoolDelete, 1);
          dispatch(showSchoolSuccess(listData));
          break;

        default:
          throw new Error(`Invalid action ${data.dml_action}`);
      }
    };
    socket.current.on("updated-school", updateSchool);
    return () => socket.current.off("updated-school", updateSchool);
  }, [listData, dispatch]);

  const columns = useMemo(
    () => [
      { accessorKey: "number", header: "STT", size: 100, enableEditing: false },
      {
        accessorKey: "matruong",
        header: "Mã trường",
        size: 100,
        enableEditing: false,
      },
      { accessorKey: "tentruong", header: "Tên trường" },
      { accessorKey: "diachi", header: "Địa chỉ" },
      { accessorKey: "trangweb", header: "Trang web" },
    ],
    []
  );

  const rows = useMemo(() => {
    return listData?.map((user, index) => ({
      number: index + 1,
      matruong: user.matruong,
      tentruong: user.tentruong,
      diachi: user.diachi,
      trangweb: user.trangweb,
    }));
  }, [listData]);

  const handlecreateSchool = (values) => {
    const newData = {
      layer: values.loaihinh,
      id: values.matruong,
      name: values.tentruong,
      address: values.diachi,
      web: values.trangweb,
      long: values.long,
      lat: values.lat,
    };
    createSchool(newData, axiosJWT, dispatch);
    dispatch(setNewSchoolName(values.tentruong));
  };

  const handleupdateSchool = ({ exitEditingMode, values }) => {
    const id = values.matruong;
    const editSchool = {
      name: values.tentruong,
      address: values.diachi,
      web: values.trangweb,
    };
    updateSchool(id, editSchool, axiosJWT, dispatch);
    exitEditingMode();
  };

  const handledeleteSchool = (rows) => {
    rows.map((row) => {
      const id = row.original.matruong;
      return deleteSchool(id, axiosJWT, dispatch);
    });
  };

  return (
    listData && (
      <Fragment>
        <MaterialReactTable
          columns={columns}
          data={rows}
          editingMode="modal"
          enableColumnOrdering
          enableColumnResizing
          enableColumnActions={false}
          enableEditing
          enableRowActions
          enableRowSelection
          onEditingRowSave={handleupdateSchool}
          positionActionsColumn="first"
          positionToolbarAlertBanner="bottom"
          localization={{ actions: "Chỉnh sửa" }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setModalOpen(true)}
              >
                Create School
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handledeleteSchool(table.getSelectedRowModel().rows)
                }
              >
                Delete School
              </Button>
            </Box>
          )}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="right" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        ></MaterialReactTable>
        <OpenModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handlecreateSchool}
        ></OpenModal>
      </Fragment>
    )
  );
};
export const OpenModal = ({ open, onClose, onSubmit }) => {
  const [isShowMap, setShowMap] = useState(false);
  const [values, setValues] = useState({
    loaihinh: [],
    matruong: "",
    tentruong: "",
    diachi: "",
    trangweb: "",
    long: "",
    lat: "",
  });

  const handleSelectType = (e) => {
    setValues((prev) => ({ ...prev, loaihinh: e.target.value }));
  };

  const handleCreateSchool = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const columnsCreate = useMemo(
    () => [
      { accessorKey: "matruong", header: "Mã trường" },
      { accessorKey: "tentruong", header: "Tên trường" },
      { accessorKey: "diachi", header: "Địa chỉ" },
      { accessorKey: "trangweb", header: "Trang web" },
      { accessorKey: "long", header: "Kinh độ" },
      { accessorKey: "lat", header: "Vĩ độ" },
    ],
    []
  );

  const handleSelectPosition = () => {
    setShowMap((prev) => !prev);
  };

  const onMarkerClick = useCallback((event) => {
    setValues((prev) => ({
      ...prev,
      long: event.lngLat.lng,
      lat: event.lngLat.lat,
    }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    setValues((prev) => ({
      ...prev,
      long: event.lngLat.lng,
      lat: event.lngLat.lat,
    }));
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New School</DialogTitle>
      <DialogContent>
        {!isShowMap ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
                fontSize: "1.4rem",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="loaihinh-label">Loại hình đào tạo</InputLabel>
                <Select
                  labelId="loaihinh-label"
                  id="loaihinh"
                  name="loaihinh"
                  multiple
                  input={<OutlinedInput label="loaihinh-label" />}
                  value={values.loaihinh}
                  onChange={(e) => handleSelectType(e)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {schoolTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Checkbox checked={values.loaihinh.includes(type.id)} />
                      <ListItemText primary={type.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {columnsCreate.map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onChange={(e) => handleCreateSchool(e)}
                />
              ))}
              <Button sx={{ gap: "0.75rem" }} onClick={handleSelectPosition}>
                <EditLocationAltIcon />
                <span>Chọn vị trí từ bản đồ</span>
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack
            sx={{
              height: "600px",
              width: "100%",
              minWidth: { xs: "300px", sm: "400px", md: "500px" },
            }}
          >
            <Map
              id="map-createschool"
              language="vi"
              attributionControl={false}
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_KEY}
              mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
              style={{ width: "100%", height: "100%" }}
              initialViewState={{
                longitude: 106.6860544,
                latitude: 10.7773952,
                zoom: 10,
              }}
              onClick={onMarkerClick}
            >
              <Marker
                longitude={values.long}
                latitude={values.lat}
                anchor="bottom"
                draggable
                onDrag={onMarkerDrag}
              >
                <img
                  src="imgs/pin-school.png"
                  alt=""
                  width="36px"
                  height="36px"
                />
              </Marker>
              <NavigationControl
                position={"top-right"}
                showZoom={true}
                showCompass={false}
              />
              <GeolocateControl
                position={"bottom-right"}
                trackUserLocation={true}
                showUserLocation={true}
              />
            </Map>
            <ControlPanel values={values} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Thoát</Button>
        {!isShowMap ? (
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Thêm mới
          </Button>
        ) : (
          <Button
            color="secondary"
            onClick={handleSelectPosition}
            variant="contained"
          >
            Chọn vị trí
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SchoolTable;

export const ControlPanel = ({ values }) => {
  const round = (value) => {
    return (Math.round(value * 1e5) / 1e5).toFixed(5);
  };

  return (
    <div className="control-panel">
      <div className="control-panel-container">
        <h3>Vị trí trường học</h3>
        <div>
          <strong>Tọa độ: </strong>
          {values.long && values.lat ? (
            `${round(values.long)}, ${round(values.lat)}`
          ) : (
            <em>null</em>
          )}
        </div>
        <div>
          <strong>Sử dụng: </strong>
          <span>Nhấn chọn vị trí trên bản đồ hoặc kéo thả icon</span>
          <img src="imgs/pin-school.png" alt="" />
        </div>
      </div>
    </div>
  );
};
