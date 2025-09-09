import { useEffect, useState } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from '../firebase/firebase';
import LoadingScreen from '../webview/LoadingScreen';
import { UserStatus } from '@enums';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Badge, Aside, NavBar } from '@components';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { UsersDetails } from "@components";
import { toast } from "react-toastify";
import { UserServices } from "@services";

export default function UserAccounts() {
    const [loading, setLoading] = useState(true);
    const handleNavbarToggle = () => { 
        const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    }

    // TODO: setting  up the users table
    const [rows, setRows] = useState([]);
    const statusOptions = {
        [UserStatus.PENDING]: 'info',
        [UserStatus.ACTIVE]: 'success',
        [UserStatus.BLOCKED]: 'danger',
    };
    const columns = [ 
        { field: 'index', headerName: '#', width: 30 },
        { field: 'id', headerName: 'Unique ID', width: 250 },
        { field: 'fullname', headerName: 'Full Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone #', width: 200 },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => <Badge status={statusOptions[params.value]} text={params.value} />,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    label={
                        <div className="hover:text-blue-500 text-sm">
                            <i className="fa-solid fa-eye mr-2"></i>
                            View
                        </div>
                    }
                    onClick={() => handleViewUser(params.row)}
                    showInMenu 
                />,
                <GridActionsCellItem
                    label={
                        <div className="hover:text-blue-500 text-sm">
                            <i className="fa-solid fa-lock-open mr-2"></i>
                            Unblock
                        </div>
                    }
                    onClick={() => handleUpdatingUserStatus(params.row.id, UserStatus.ACTIVE)}
                    showInMenu
                />,
                <GridActionsCellItem
                    label={
                        <div className="hover:text-blue-500 text-sm">
                            <i className="fa-solid fa-lock mr-2"></i>
                            Block
                        </div>
                    }
                    showInMenu
                    onClick={() => handleUpdatingUserStatus(params.row.id, UserStatus.BLOCKED)}
                />,
            ],
        }
    ];

    //TODO: handle table controls
    const [ openUserDetails, setOpenUserDetails ] = useState(false);
    const [ user, setUser ] = useState(null);
    const handleViewUser = (user) => {
        setUser(user);
        setOpenUserDetails(true);
    }

    const handleUpdatingUserStatus = async (userId, newStatus) => {
        const result = await UserServices.updateUserStatus(userId, newStatus);
        if (result.success) {
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === userId ? { ...row, status: newStatus } : row
                )
            );
            toast.success(`User has been ${newStatus.toLowerCase()} successfully.`);
        } else {
            toast.error("Failed to update user status. Please try again.");
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, "users");
                const q = query(
                    usersRef,
                    where("status", "in", [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.BLOCKED]),
                    where("role", "==", "3")
                );
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map((doc, index) => ({ index: index + 1, id: doc.id, ...doc.data() }));
                setRows(users);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="layout-wrapper layout-content-navbar">
            <UsersDetails
                user={user}
                isOpen={openUserDetails}
                onClose={() => setOpenUserDetails(false)}
            />

            <div className="layout-container">
                <Aside />
                <div className="layout-page">
                    <NavBar />
                    <div className='content-wrapper'>
                        <div className='container-xxl flex-grow-1 container-p-y'>
                            <div className='row'>
                                <div className="col-md-3 mb-4">
                                <h1 style={{ fontSize: '20px' }} className='fw-bold'>Pending Accounts</h1>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    {loading ? (<LoadingScreen /> ): (
                                        <Box sx={{ height: 400, width: '100%' }}>
                                            <DataGrid
                                                rows={rows}
                                                columns={columns}
                                                pageSizeOptions={[5, 10]}
                                                initialState={{
                                                    pagination: { paginationModel: { pageSize: 5 } },
                                                }}
                                                checkboxSelection={false}    
                                                disableRowSelectionOnClick
                                            />
                                        </Box>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
        </div>
    )
}