import { useEffect, useState } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from '../firebase/firebase';
import LoadingScreen from '../webview/LoadingScreen';
import { UserStatus } from '@enums';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Badge, Aside, NavBar } from '@components';
import { GridActionsCellItem } from '@mui/x-data-grid';

export default function UserAccounts() {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
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
                    icon={<i className="fa-solid fa-eye hover:text-blue-700"></i>}
                    label="View"
                    showInMenu 
                />,
                <GridActionsCellItem
                    icon={<i className="fa-solid fa-check hover:text-blue-700"></i>}
                    label={params.row.accountStatus == 0 ? "Approve" : "Unblock"}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<i className="fa-solid fa-ban hover:text-blue-700"></i>}
                    label="Block"
                    showInMenu
                />,
            ],
        }
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, "users");
                const q = query(
                    usersRef,
                    where("status", "in", [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.BLOCKED]),
                    where("role", "==", "4")
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

    //TODO: show loading screen while fetching data
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="layout-wrapper layout-content-navbar">
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