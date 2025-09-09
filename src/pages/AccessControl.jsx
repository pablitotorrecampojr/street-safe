import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import accountSetting from "../constants/account-setting.json";
import districtLists from "../constants/districts.json";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Aside, Badge, NavBar } from "@components";
import LoadingScreen from "../webview/LoadingScreen";

const AccessControl = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const columns = [
    { field: "index", headerName: "#", width: 30 },
    { field: "id", headerName: "Unique ID", width: 90 },
    { field: "fullname", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => accountSetting.role[params.value] || "N/A",
    },
    {
      field: "municipality",
      headerName: "Municipality",
      width: 180,
      renderCell: (params) =>
        params.row.barangay ? params.row.municipality : "N/A",
    },
    {
      field: "barangay",
      headerName: "Barangay",
      width: 180,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "district",
      headerName: "District",
      width: 220,
      renderCell: (params) =>
        params.value
          ? `${districtLists.districts[params.value]?.district || "N/A"} / ${
              districtLists.districts[params.value]?.code || "N/A"
            }`
          : "N/A",
    },
    {
      field: "createdAt",
      headerName: "Registration Date",
      width: 200,
      renderCell: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const month = date.toLocaleString("en-US", { month: "long" });
          const day = String(date.getDate()).padStart(2, "0");
          const year = date.getFullYear();
          return `${month} ${day}, ${year}`;
        }
        return "N/A";
      },
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc, index) => ({
          index: index + 1,
          id: doc.id,
          ...doc.data(),
        }));
        setRows(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Aside />
        <div className="layout-page">
          <NavBar />

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-3 mb-4">
                  <h1 style={{ fontSize: "20px" }} className="fw-bold">
                    Access Control
                  </h1>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  {loading ? (<LoadingScreen />) : (
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
      <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  );
};

export default AccessControl;