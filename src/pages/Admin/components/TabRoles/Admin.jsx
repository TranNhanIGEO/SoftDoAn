import { useRef, useMemo, useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import useAxiosJWT from "src/hooks/useAxiosJWT";
import { showAllUsers, deleteUser, createUser, updateUser } from 'src/redux/request/userRequest';
import { io } from 'socket.io-client';
import { showUserSuccess } from 'src/redux/reducer/userSlice';
import { getAllUsers } from 'src/redux/reducer/userSlice';

const AdminTable = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const listUsers = useSelector(getAllUsers)
    const dispatch = useDispatch()
    const axiosJWT = useAxiosJWT()
    const socket = useRef()
    const prevListUsers = useRef()

    useEffect(() => {
        showAllUsers(axiosJWT, dispatch)
    }, [axiosJWT, dispatch]);

    useEffect(() => {
        if (listUsers && prevListUsers.current !== listUsers) {
            socket.current = io(`${process.env.REACT_APP_DOMAIN}`)
            socket.current.on('updated-user', (data) => {
                const currentListUser = prevListUsers.current 
                    ? [...prevListUsers.current] 
                    : [...listUsers]
                switch (data.dml_action) {
                    case 'INSERT':
                        const hasUser = currentListUser.some((element) => element.id.includes(data.id))
                        !hasUser && currentListUser.push(data)
                        prevListUsers.current = currentListUser
                        dispatch(showUserSuccess(currentListUser))  
                        break;
                        
                    case 'UPDATE':
                        const indexSchoolUpdate = currentListUser.findIndex((element) => element.id.includes(data.id))
                        currentListUser.splice(indexSchoolUpdate, 1, data)
                        prevListUsers.current = currentListUser
                        dispatch(showUserSuccess(currentListUser)) 
                        break;
                        
                    case 'DELETE':
                        const indexSchoolDelete = currentListUser.findIndex((element) => element.id.includes(data.id))
                        currentListUser.splice(indexSchoolDelete, 1)
                        prevListUsers.current = currentListUser
                        dispatch(showUserSuccess(currentListUser))   
                        break;
                
                    default:
                        throw new Error(`Invalid action ${data.dml_action}`)
                }
            })
        }
    }, [listUsers, dispatch])

    const columns = useMemo(() => [
        { accessorKey: 'number', header: 'STT', size: 100, enableEditing: false },
        { accessorKey: 'id', header: 'ID', enableEditing: false },
        { accessorKey: 'username', header: 'Tài khoản' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'password', header: 'Mật khẩu' },
        { accessorKey: 'role', header: 'Quyền', enableEditing: false }
    ], []);

    const rows = useMemo(() => {
        return listUsers?.map((user, index) => {
            const role = (role) => {
                if (role.includes("schoolData") && role.includes("scoreData") && role.includes("statisticData")) {return 'Quản lý trường học, dữ liệu tuyển sinh, dữ liệu thống kê'}
                else if (role.includes("schoolData") && role.includes("scoreData")) {return 'Quản lý trường học, dữ liệu tuyển sinh'}
                else if (role.includes("schoolData") && role.includes("statisticData")) {return 'Quản lý trường học, dữ liệu thống kê'}
                else if (role.includes("scoreData") && role.includes("statisticData")) {return 'Quản lý dữ liệu tuyển sinh, dữ liệu thống kê'}
                else if (role.includes("schoolData")) {return 'Quản lý trường học'}
                else if (role.includes("scoreData")) {return 'Quản lý dữ liệu tuyển sinh'}
                else if (role.includes("statisticData")) {return 'Quản lý dữ liệu thống kê'}
            }
            return ({
                number: index + 1,
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                role: role(user.role)
            })
        })
    }, [listUsers])

    const handleCreateUser = (values) => {
        const newUser = {
            username: values.username,
            email: values.email,
            password: values.password,
            role: values.role
        }
        createUser(newUser, axiosJWT, dispatch)
    };

    const handleUpdateUser = ({ exitEditingMode, values }) => {
        const editUser = {
            username: values.username,
            email: values.email,
            password: values.password
        }
        updateUser(values.id, editUser, axiosJWT, dispatch)
        exitEditingMode()
    }
    
    const handleDeleteUser = (rows) => {
        rows.map((row) => {
            const id = row.original.id
            return deleteUser(id, axiosJWT, dispatch)
        })
    }

    return (
        listUsers && <Fragment>
            <MaterialReactTable
                columns={columns}
                data={rows}
                initialState={{ columnVisibility: { password: false } }}
                editingMode='modal'
                enableColumnOrdering
                enableColumnResizing
                enableColumnActions={false}
                enableEditing
                enableRowActions
                enableRowSelection
                onEditingRowSave={handleUpdateUser}
                positionActionsColumn='first'
                positionToolbarAlertBanner='bottom'
                localization={{actions: 'Chỉnh sửa'}}
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => setModalOpen(true)}>
                            Create Account
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                            onClick={() => handleDeleteUser(table.getSelectedRowModel().rows)}>
                            Delete User
                        </Button>
                    </Box>
                )}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="right" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            >
            </MaterialReactTable>
            <OpenModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateUser}>
            </OpenModal>
        </Fragment>
    );
}
export const OpenModal = ({ open, onClose, onSubmit }) => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        role: []
    });

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };
    const columnsCreate = useMemo(() => [
        { accessorKey: 'username', header: 'Username' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'password', header: 'Password' }
    ], []);

    const [schoolData, setSchoolData] = useState(false)
    const [scoreData, setScoreData] = useState(false)
    const [statisticData, setStatisticData] = useState(false)
    const handleCheckbox = (e) => {
        if (e.target.id === 'scoreData') {setScoreData(!scoreData)} 
        else if (e.target.id === 'statisticData') {setStatisticData(!statisticData)} 
        else if (e.target.id === 'schoolData') {setSchoolData(!schoolData)}
        e.target.checked === true
            ? setValues({ ...values, role: [...values.role, e.target.id] })
            : setValues({ ...values, role: values.role.filter(r => r !== e.target.id) })
    }
    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack sx={{ width: '100%', minWidth: { xs: '300px', sm: '360px', md: '400px' }, gap: '1.5rem' }}>
                        {columnsCreate.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}>
                            </TextField>
                        ))}
                        <Fragment>
                            <div className='check-role'>
                                <input type="checkbox" id="schoolData" checked={schoolData} onChange={handleCheckbox} />
                                <label htmlFor="schoolData">Quyền quản lý dữ liệu trường học</label>
                            </div>
                            <div className='check-role'>
                                <input type="checkbox" id="scoreData" checked={scoreData} onChange={handleCheckbox} />
                                <label htmlFor="scoreData">Quyền quản lý dữ liệu tuyển sinh</label>
                            </div>
                            <div className='check-role'>
                                <input type="checkbox" id="statisticData" checked={statisticData} onChange={handleCheckbox} />
                                <label htmlFor="statisticData">Quyền quản lý dữ liệu thống kê</label>
                            </div>
                        </Fragment>
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">Create New Account</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminTable;