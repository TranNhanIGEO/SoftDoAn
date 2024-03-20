import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import useAxiosJWT from "src/hooks/useAxiosJWT";
import {
  createStatistic,
  showStatistic,
  updateStatistic,
} from "src/redux/request/statisticRequest";
import {
  getStatistic,
  showStatisticSuccess,
} from "src/redux/reducer/statisticSlice";
import { io } from "socket.io-client";

export const layers = [
  { value: "00CTLT00", text: "Lớp thường" },
  { value: "00CTLC00", text: "Lớp chuyên" },
  { value: "00CTLTH0", text: "Lớp tích hợp" },
];

const yearLists = [
  { year: 2021 },
  { year: 2022 },
  { year: 2023 },
  { year: 2024 },
];

const StatisticTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const listData = useSelector(getStatistic);
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const socket = useRef();
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentYear] = useState(2024);

  useEffect(() => {
    if (!selectedLayer || !selectedYear) return;
    showStatistic(selectedLayer, selectedYear, axiosJWT, dispatch);
  }, [selectedLayer, selectedYear, axiosJWT, dispatch]);

  const handleSelectLayer = (e) => {
    setSelectedLayer(e.target.value);
  };

  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_DOMAIN}`);
    const updateStatistic = (data) => {
      switch (data.dml_action) {
        case "INSERT":
          const prevData = [ ...listData ];
          const newData = prevData.map((dt) => ({
            matruong: dt.matruong,
            manhom: dt.manhom,
            tentruong: dt.tentruong,
            ctieu: "",
            slnv1: "",
            namtuyensinh: currentYear,
          }));
          setSelectedYear(currentYear)
          dispatch(showStatisticSuccess(newData));
          break;

        case "UPDATE":
          showStatistic(selectedLayer, selectedYear, axiosJWT, dispatch);
          break;

        case "DELETE":
          showStatistic(selectedLayer, selectedYear, axiosJWT, dispatch);
          break;

        default:
          throw new Error(`Invalid action ${data.dml_action}`);
      }
    };
    socket.current.on("updated-statistic", updateStatistic);
    return () => socket.current.off("updated-statistic", updateStatistic);
  }, [listData, dispatch]);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "matruong",
        header: "Mã trường",
        size: 100,
        enableEditing: false,
      },
      { accessorKey: "tentruong", header: "Tên trường", enableEditing: false },
      { accessorKey: "ctieu", header: `Chỉ tiêu` },
      { accessorKey: "slnv1", header: `Số lượng NV1` },
    ];
  }, [listData]);

  const rows = useMemo(
    () =>
      listData?.map((statistic) => {
        return {
          matruong: statistic.matruong ?? "",
          tentruong: statistic.tentruong ?? "",
          ctieu: statistic.ctieu ?? "",
          slnv1: statistic.slnv1 ?? "",
        };
      }),
    [listData]
  );

  const handleCreateData = () => {
    const newData = {
      layer: selectedLayer,
      year: currentYear,
      schoolids: rows?.map((row) => row.matruong),
    };
    createStatistic(newData, axiosJWT, dispatch);
    showStatistic(selectedLayer, currentYear, axiosJWT, dispatch);
  };

  const handleUpdateData = ({ exitEditingMode, values }) => {
    const id = values.matruong;
    const editData = {
      layer: selectedLayer,
      year: currentYear,
      ctieu: Number(values.ctieu),
      slnv1: Number(values.slnv1),
    };
    updateStatistic(id, editData, axiosJWT, dispatch);
    exitEditingMode();
  };

  return (
    <Fragment>
      <MaterialReactTable
        columns={columns ?? []}
        data={rows ?? []}
        initialState={{ columnVisibility: { matruong: false } }}
        editingMode="modal"
        enableColumnOrdering
        enableColumnResizing
        enableColumnActions={false}
        enableEditing
        enableRowActions
        onEditingRowSave={handleUpdateData}
        positionActionsColumn="first"
        positionToolbarAlertBanner="bottom"
        localization={{ actions: "Chỉnh sửa" }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setModalOpen(true)}
            >
              Create Statistic {currentYear}
            </Button>
            <select value={selectedLayer} onChange={handleSelectLayer}>
              {!selectedLayer && <option>Chọn loại hình</option>}
              {layers.map((layer) => (
                <option key={layer.value} value={layer.value}>
                  {layer.text}
                </option>
              ))}
            </select>
            <select
              className="select-layer"
              value={selectedYear}
              onChange={handleSelectYear}
            >
              {!selectedYear && <option>Chọn năm</option>}
              {yearLists.map((type) => (
                <option key={type.year} value={type.year}>
                  {type.year}
                </option>
              ))}
            </select>
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
        onSubmit={handleCreateData}
      ></OpenModal>
    </Fragment>
  );
};
export const OpenModal = ({ open, onClose, onSubmit }) => {
  const [currentYear] = useState(2024);

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Statistic</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <span>Xác nhận tạo dữ liệu thống kê cho năm {currentYear}</span>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Statistic
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatisticTable;
