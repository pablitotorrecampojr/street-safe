import { toast } from "react-toastify";
import { Aside, NavBar, Badge } from '@components';
import { useEffect, useState } from "react";
import { doc, getDocs, collection, where, query, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import LoadingScreen from '../webview/LoadingScreen';
import accountSetting from "../constants/account-setting.json";
import districts from "../constants/districts.json"; 
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Tooltip } from "react-tooltip";

export default function ReviewPendingAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  //TODO: handle mui table
  const [rows, setRows] = useState([]);
  const columns = [
    { field: 'id', headerName: '#', width: 30 },
    { field: "uid", headerName: "Unique ID", width: 80 },
    { field: "fullname", headerName: "Full name", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { 
      field: "role", 
      headerName: "Role", 
      width: 150,
      renderCell: (params) => accountSetting.role[params.value] || "N/A",
    },
    {
      field: "barangay",
      headerName: "Barangay",
      width: 180,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "municipality",
      headerName: "Municipality",
      width: 180,
      renderCell: (params) =>
        params.row.barangay ? params.value : "N/A",
    },
    { 
      field: "district", 
      headerName: "District", 
      width: 200, 
      renderCell: (params) => 
        params.value 
          ? `${districts.districts[params.value]?.district || "N/A"} ,
            ${districts.districts[params.value]?.code || "N/A"} , 
            ${districts.districts[params.value]?.name || "N/A"}` 
          : "N/A"
    },
    { field: "createdAt", headerName: "Registration Date", width: 200 },
    { 
      field: "validIdFront", 
      headerName: "Valid ID (Front)", 
      width: 200,
      renderCell: (params) => (
        <button
          type="button"
          className="btn rounded-pill btn-sm btn-outline-primary"
          onClick={() => handleImageClick(params.value, "Valid ID Front")}
        >
          View Image
        </button>
      )
    },
    { 
      field: "validIdBack", 
      headerName: "Valid ID (Back)", 
      width: 200,
      renderCell: (params) => (
        <button
          type="button"
          className="btn rounded-pill btn-sm btn-outline-primary"
          onClick={() => handleImageClick(params.value, "Valid ID Back")}
        >
          View Image
        </button>
      )
    },
    { 
      field: "accountStatus", 
      headerName: "Status", 
      width: 150, 
      renderCell: (params) => (
        <Badge status={accountSetting.pending_accounts_color[params.value]} text={accountSetting.pending_accounts[params.value]} />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div className="inline-flex gap-2 items-center px-3 py-1 rounded-full text-sm font-medium">
          <button
            type="button"
            className="btn btn-icon btn-outline-success"
            data-tooltip-id="pendingAccount-tooltip"
            data-tooltip-content={params.row.accountStatus == 0 ? "Approve Account" : "Unblock Account"}
            style={{ height: '25px', width: '25px' }}
            onClick={() => approveAccount(params.row.id)}
          >
            <span className="tf-icons bx bx-check"></span>
          </button>
          {params.row.accountStatus == 0 && (
            <button
              type="button"
              className="btn btn-icon btn-outline-danger"
              data-tooltip-id="pendingAccount-tooltip"
              data-tooltip-content="Block Account"
              style={{ height: '25px', width: '25px' }}
              onClick={() => blockAccount(params.id)}
            >
              <span className="tf-icons bx bx-x"></span>
            </button>
          )}
          <Tooltip id="pendingAccount-tooltip" />
        </div>
      )
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("accountStatus", "in", [0, 2]));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc, index) => ({ 
          id: index + 1, 
          ...doc.data() 
        }));
        setRows(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleImageClick = (imageUrl, title) => { 
    setModalImageUrl(imageUrl);
    setModalTitle(title);
    setModalVisible(true);
  }

  const approveAccount = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { accountStatus: 1 }, { merge: true });
      toast.success("Account approved successfully");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error approving account:", error);
      toast.error("Error approving account");
    }
  };

  const blockAccount = async (userId) => { 
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { accountStatus: 2 }, { merge: true });
      toast.success("Account blocked successfully");
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error blocked account:", error);
      toast.error("Error blocking account");
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      {modalVisible && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalVisible(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body d-flex justify-content-center align-items-center">
                <img src={modalImageUrl} alt="Hazard Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  );
};

