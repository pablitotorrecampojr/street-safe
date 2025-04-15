import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDatabase, ref, onValue, get, update } from "firebase/database";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useTable } from "react-table";
import { auth, db, realtimeDb } from "../firebase/firebase";
import Aside from "../components/Aside";
import Navbar from "../components/NavBar";
import LoadingScreen from '../webview/LoadingScreen';
import { hazard_status } from "../constants/hazard-report";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const sendResponseTeam = async (hazard) => {
  const hazardId = hazard?.id;
  console.log("Hazard object:", hazard);
  console.log("Hazard ID:", hazardId);

  if (!hazardId) {
    console.error("Invalid hazard data");
    toast.error("Hazard ID is missing");
    return;
  }

  try {
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardId}`);
    const snapshot = await get(hazardRef);

    if (!snapshot.exists()) {
      toast.error("Hazard not found in Realtime Database");
      return;
    }

    await update(hazardRef, { status: 1 });
    toast.success("Hazard status updated to In Progress");
  } catch (error) {
    console.error("Error updating hazard status:", error);
    toast.error("Failed to update hazard status");
  }
};

const useCurrentUserData = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("No user document found");
        }
      }
    };

    fetchUserData();
  }, []);

  return userData;
};

const HazardReport = () => {
  const navigate = useNavigate();
  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const userData = useCurrentUserData();

  // Fetch hazard reports from Firebase Realtime DB
  useEffect(() => {
    const db = getDatabase();
    const roadhazardsRef = ref(db, "roadhazards");

    const unsubscribe = onValue(roadhazardsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const sorted = data.sort(
          (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
        );
        toast.success("New Road Hazard Report!");
        setRoadHazards(sorted);
      } else {
        setRoadHazards([]);
      }
      setLoading(false);
    }, (error) => {
      toast.error("Error fetching roadhazards");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Columns for react-table
  const columns = React.useMemo(() => [
    {
      Header: "#",
      accessor: "index",
    },
    {
      Header: "Image",
      accessor: "roadHazard",
      Cell: ({ value, row }) => (
        <button
          className="btn btn-link text-left"
          onClick={() => {
            setModalImageUrl(`data:image/jpeg;base64,${row.original.imageUrl}`);
            setModalVisible(true);
            setModalTitle(row.original.roadHazard);
          }}
        >
          {value}
        </button>
      ),
    },
    {
      Header: "Full Address",
      accessor: "fullAddress",
      Cell: ({ value }) => value.replace("Address:", ""),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => hazard_status[value],
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const hazard = row.original;
        if (userData?.role === "1" || userData?.role === "2") {
          return (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-icon btn-outline-primary"
                onClick={() => sendResponseTeam(hazard)}
                data-tooltip-id="hazard-tooltip"
                data-tooltip-content="Update Status"
              >
                <span className="tf-icons bx bx-pie-chart-alt"></span>
              </button>
    
              <button
                type="button"
                className="btn btn-icon btn-outline-warning"
                onClick={() =>
                  window.open(
                    `/maps-fragment?selectedLat=${hazard.latitude}&selectedLng=${hazard.longitude}&fromAdmin=true`
                  )
                }
                data-tooltip-id="hazard-tooltip"
                data-tooltip-content="View location on map"
              >
                <span className="tf-icons bx bx-navigation"></span>
              </button>
    
              {userData?.role === "2" && (
                <button
                  type="button"
                  className="btn btn-icon btn-outline-danger"
                  onClick={() =>
                    navigate("/hazard-report-details", { state: { hazard } })
                  }
                  data-tooltip-id="hazard-tooltip"
                  data-tooltip-content="Flag as National Road Hazard"
                >
                  <span className="tf-icons bx bx-traffic-cone"></span>
                </button>
              )}
    
              <Tooltip id="hazard-tooltip" />
            </div>
          );
        }
    
        return <i>Admins can only view Hazard Reports</i>;
      },
    }
  ], [roadHazards, userData, navigate]);

  const data = React.useMemo(() =>
    roadHazards.map((hazard, index) => ({
      index: index + 1,
      id: hazard.id,
      roadHazard: hazard.roadHazard,
      imageUrl: hazard.imageUrl,
      fullAddress: hazard.fullAddress,
      status: hazard.status,
      action: "---",
      latitude: hazard.latitude,
      longitude: hazard.longitude,
    }))
  , [roadHazards]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    document.body.style.overflow = modalVisible ? "hidden" : "auto";
  }, [modalVisible]);

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
          <Navbar />

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {loading ? (
                <LoadingScreen loadingText="Fetching Hazard Report..." />
              ) : (
                <div className="card">
                  <div className="card-body">
                    <table {...getTableProps()} className="table table-striped">
                      <thead>
                        {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  );
};

export default HazardReport;
