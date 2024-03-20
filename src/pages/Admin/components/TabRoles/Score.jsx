import { Fragment, useEffect, useState, useMemo, useRef } from "react";
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
  createScore,
  showScore,
  updateScore,
} from "src/redux/request/scoreRequest";
import { getScore, showScoreSuccess } from "src/redux/reducer/scoreSlice";
import { io } from "socket.io-client";
import { newSchoolName } from "src/redux/reducer/schoolSlice";

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

const yearLists = [
  { year: 2021 },
  { year: 2022 },
  { year: 2023 },
  { year: 2024 },
];

const ScoreTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const listData = useSelector(getScore);
  const newSchool = useSelector(newSchoolName);
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const socket = useRef();
  const prevListData = useRef();
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentYear] = useState(2024);

  useEffect(() => {
    if (!selectedLayer || !selectedYear) return;
    showScore(selectedLayer, selectedYear, axiosJWT, dispatch);
  }, [selectedLayer, selectedYear, axiosJWT, dispatch]);

  const handleSelectLayer = (e) => {
    setSelectedLayer(e.target.value);
  };

  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_DOMAIN}`);
    const updateScore = (data) => {
      switch (data.dml_action) {
        case "INSERT":
          const prevData = [ ...listData ];
          const newData = prevData.map((dt) => ({
            matruong: dt.matruong,
            maloaihinh: dt.maloaihinh,
            tentruong: dt.tentruong,
            nv1: "",
            nv2: "",
            nv3: "",
            namtuyensinh: currentYear,
          }));
          setSelectedYear(currentYear)
          dispatch(showScoreSuccess(newData));
          break;

        case "UPDATE":
          showScore(selectedLayer, selectedYear, axiosJWT, dispatch);
          break;

        case "DELETE":
          showScore(selectedLayer, selectedYear, axiosJWT, dispatch);
          break;

        default:
          throw new Error(`Invalid action ${data.dml_action}`);
      }
    };
    socket.current.on("updated-score", updateScore);
    return () => socket.current.off("updated-score", updateScore);
  }, [listData, dispatch]);

  const columns = useMemo(() => {
    let scoreColumn = "";
    if (selectedLayer === "00LTKC00") {
      scoreColumn = [
        { accessorKey: "nv1", header: `Nguyện vọng 1`, size: 160 },
        { accessorKey: "nv2", header: `Nguyện vọng 2`, size: 160 },
        { accessorKey: "nv3", header: `Nguyện vọng 3`, size: 160 },
      ];
    } else {
      scoreColumn = [
        { accessorKey: "nv1", header: `Nguyện vọng 1`, size: 160 },
        { accessorKey: "nv2", header: `Nguyện vọng 2`, size: 160 },
      ];
    }
    return [
      {
        accessorKey: "matruong",
        header: "Mã trường",
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "tentruong",
        header: "Tên trường",
        size: 180,
        enableEditing: false,
      },
      ...scoreColumn,
    ];
  }, [selectedLayer, listData]);

  const rows = useMemo(
    () =>
      listData?.map((data) => {
        if (selectedLayer === "00LTKC00") {
          return {
            matruong: data.matruong,
            tentruong: data.tentruong,
            nv1: data.nv1 ?? "",
            nv2: data.nv2 ?? "",
            nv3: data.nv3 ?? "",
          };
        } else {
          return {
            matruong: data.matruong,
            tentruong: data.tentruong,
            nv1: data.nv1 ?? "",
            nv2: data.nv2 ?? "",
          };
        }
      }),
    [selectedLayer, listData]
  );

  const handleCreateData = () => {
    const newData = {
      layer: selectedLayer,
      year: currentYear,
      schoolids: rows?.map((row) => row.matruong),
    };
    createScore(newData, axiosJWT, dispatch);
    showScore(selectedLayer, currentYear, axiosJWT, dispatch);
  };

  const handleUpdateData = ({ exitEditingMode, values }) => {
    const id = values.matruong;
    let editScore = {};
    if (selectedLayer === "00LTKC00") {
      editScore = {
        layer: selectedLayer,
        nv1: Number(values.nv1),
        nv2: Number(values.nv2),
        nv3: Number(values.nv3),
      };
    } else {
      editScore = {
        layer: selectedLayer,
        nv1: Number(values.nv1),
        nv2: Number(values.nv2),
      };
    }
    updateScore(id, editScore, axiosJWT, dispatch);
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
        displayColumnDefOptions={{ "mrt-row-actions": { size: 90 } }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setModalOpen(true)}
            >
              Create Score {currentYear}
            </Button>
            <select
              className="select-layer"
              value={selectedLayer}
              onChange={handleSelectLayer}
            >
              {!selectedLayer && <option>Chọn loại hình</option>}
              {schoolTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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

const OpenModal = ({ open, onClose, onSubmit }) => {
  const [currentYear] = useState(2024);

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Score</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <span>Xác nhận tạo dữ liệu điểm chuẩn cho năm {currentYear}</span>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Score
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScoreTable;
