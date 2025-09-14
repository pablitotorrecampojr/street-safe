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
import { GridActionsCellItem } from '@mui/x-data-grid';
import { set } from "firebase/database";

export default function ReviewPendingAccounts() {
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
      width: 120,
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
      width: 120,
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
      width: 120, 
      renderCell: (params) => (
        <Badge status={accountSetting.pending_accounts_color[Number(params.value)]} text={accountSetting.pending_accounts[Number(params.value)]} />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          label= { 
            <div className="hover:text-blue-500 text-sm">
              <i className="tf-icons bx bx-check mr-2"></i> Approve
            </div>
          }
          showInMenu
          onClick={() => handleApproveAccount(params.row.uid)}
        />,
        <GridActionsCellItem
          label={
            <div className="hover:text-blue-500 text-sm">
              <i className="tf-icons bx bx-x mr-2"></i> Block
            </div>
          }
          showInMenu
          onClick={() => handleBlockAccount(params.row.uid)}
        />,
      ],
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "not-in", ["3", "0"]));
        const querySnapshot = await getDocs(q)
        const users = querySnapshot.docs.map((doc, index) => ({ 
          id: index + 1, 
          ...doc.data() 
        }));
        setRows(users);
        setAllUsers(users);
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

  const handleApproveAccount = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { accountStatus: 1 }, { merge: true });
      toast.success("Account approved successfully");
      setRows(prevUsers => {
        const updated = prevUsers.map(user =>
          user.uid === userId ? { ...user, accountStatus: 1 } : user
        );
        setAllUsers(updated); 
        return updated;
      });
    } catch (error) {
      console.error("Error approving account:", error);
      toast.error("Error approving account");
    }
  };

  const handleBlockAccount = async (userId) => { 
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { accountStatus: 2 }, { merge: true });
      toast.success("Account blocked successfully");
      setRows(prevUsers => {
        const updated = prevUsers.map(user =>
          user.uid === userId ? { ...user, accountStatus: 2 } : user
        );
        setAllUsers(updated); 
        return updated;
      });
    } catch (error) {
      console.error("Error blocked account:", error);
      toast.error("Error blocking account");
    }
  }

  //TODO: handle filter dropdown
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState({ role: null, status: null });
  const handleChangeRole = (role) => {
    setFilter({ ...filter, role });
    setRows(allUsers.filter(user => user.role == String(accountSetting.role.indexOf(role))));
    setRoleOpen(false);
  }
  const handleChangeStatus = (status) => {
    setFilter({ ...filter, status });
    setRows(allUsers.filter(user => user.accountStatus == String(accountSetting.pending_accounts.indexOf(status))));
    setStatusOpen(false);
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
                    <h1 style={{ fontSize: '20px' }} className='fw-bold'>Access Control</h1>
                  </div>
                </div>

                <div className="mb-2 w-full p-2">
                  <div className="flex gap-x-4 justify-end">
                  <div className="relative">
                    <button className="btn btn-info btn-sm" onClick={() => {
                      setRows(allUsers);
                      setFilter({ role: null, status: null });
                    }}>
                      <i className="fa-solid fa-rotate-left"></i>
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setRoleOpen(!roleOpen);
                        setStatusOpen(false);
                      }}
                    >
                      {filter.role ? filter.role : "Filter Role"}
                    </button>
                    {roleOpen && (
                      <div className="absolute right-0  mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        {accountSetting.role.filter(role => !["User", "Admin"].includes(role)).map((role) => (
                          <button
                            key={role}
                            className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => handleChangeRole(role)}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setStatusOpen(!statusOpen);
                        setRoleOpen(false);
                      }}
                    >
                      {filter.status ? filter.status : "Filter Status"}
                    </button>
                    {statusOpen && (
                      <div className="absolute right-0  mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        {accountSetting.pending_accounts.map((status) => (
                          <button
                            key={status}
                            className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => handleChangeStatus(status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    {loading ? ( <LoadingScreen /> ) : (
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
};

