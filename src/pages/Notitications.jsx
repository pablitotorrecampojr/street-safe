import {  useEffect, useState } from "react";
import { NotificationServices } from '@services';
import { Badge, Aside, NavBar, HazardDetails } from '@components';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { LoadingScreen } from '@webview';

export default function Notifications() { 
    const [loading, setLoading] = useState(true);
    const handleNavbarToggle = () => { 
        const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    }
    
    //TODO: handle notifications table
    const [openHazardDetails, setOpenHazardDetails] = useState(false);
    const [rows, setRows] = useState([]);
    const [hazard, setHazard] = useState(null);
    const columns = [ 
        { field: 'index', headerName: '#', width: 30 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'message', headerName: 'Message', width: 200 },
        { field: 'timestamp', headerName: 'Date', width: 200 },
        { field: 'notified', headerName: 'Read', width: 100, 
            renderCell: (params) => (
                params.value ? <Badge status="success" text="Yes" /> : <Badge status="danger" text="No" />
            )
         },
        { field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
            renderCell: (params) => [
                <div className="hover:text-blue-500 text-sm" key={params.index}
                    onClick={() => {
                        setHazard(params.row);
                        setOpenHazardDetails(true);
                    }}
                >
                    <i className="fa-solid fa-eye mr-2"></i>
                </div>
            ]
         },
    ];
    useEffect(() => {
        const fetchNotifications = async () => {
            const result = await NotificationServices.getNotifications();
            console.log(result.data);
            setRows(
                result.data.map((notification, index) => ({
                    id: index + 1,
                    index: index + 1,
                    hazardId: notification.hazardId,
                    title: notification.title,
                    message: notification.message,
                    timestamp: new Date(notification.timestamp).toLocaleString(),
                }))
            );
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    return (
        <div className="layout-wrapper layout-content-navbar">
            <HazardDetails
                hazard={hazard}
                isOpen={openHazardDetails}
                onClose={() => setOpenHazardDetails(false)}
            />

            <div className="layout-container">
                <Aside />
                <div className="layout-page">
                    <NavBar />
                    <div className='content-wrapper'>
                        <div className='container-xxl flex-grow-1 container-p-y'>
                            <div className='row'>
                                <div className="col-md-3 mb-4">
                                <h1 style={{ fontSize: '20px' }} className='fw-bold'>User Accounts</h1>
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
    );
}