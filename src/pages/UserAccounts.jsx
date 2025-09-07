import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import { useEffect, useState } from "react";
import { doc, getDocs, collection, where, query, setDoc, queryEqual } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';
import LoadingScreen from '../webview/LoadingScreen';
import { Tooltip } from "react-tooltip";
import accountSetting from "../constants/account-setting.json";
import districts from "../constants/districts.json";
import { UserStatus } from '@enums';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function UserAccounts() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleNavbarToggle = () => { 
        const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    }

    // TODO: setting  up the users table
    const [rows, setRows] = useState([]);
    const columns = [ 
        { field: 'id', headerName: 'Unique ID', width: 250 },
        { field: 'fullname', headerName: 'Full Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone #', width: 200 },
        { field: 'status', headerName: 'Status', width: 200 },
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
                const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                    <Navbar />
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
                                            loading={loading} // 👈 DataGrid shows spinner while loading
                                            pageSizeOptions={[5, 10]}
                                            initialState={{
                                            pagination: { paginationModel: { pageSize: 5 } },
                                            }}
                                            checkboxSelection
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