import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDatabase, ref, onValue, get, update, query, orderByChild, equalTo, set } from "firebase/database";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useTable } from "react-table";
import { auth, db, realtimeDb } from "../firebase/firebase";
import Aside from "../components/Aside";
import Navbar from "../components/NavBar";
import LoadingScreen from '../webview/LoadingScreen';
import { hazard_status } from "../constants/hazard-report";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { hazard_icons, hazard_color } from "../constants/hazard-report";
import districtSorted from "../constants/districts-sorted.json";
import districts from '../constants/districts.json'

const sendResponseTeam = async (hazard) => {
  //TODO: this function will set the hazard status to 1 (in progress)
  const hazardId = hazard?.id;
  console.log("Hazard object:", hazard);
  console.log("Hazard ID:", hazardId);

  if (!hazardId) {
    console.error("Invalid hazard data");
    toast.error("Hazard ID is missing");
    return;
  }

  try {
    const hazardQuery = query(
      ref(realtimeDb, "roadhazards"),
      orderByChild("id"),
      equalTo(hazardId)
    );

    const snapshot = await get(hazardQuery);
    if (!snapshot.exists()) {
      toast.error("Hazard not found in Realtime Database");
      return;
    }

    const hazardKey = Object.keys(snapshot.val())[0];
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardKey}`);

    await update(hazardRef, { status: 1 });
    toast.success("Hazard status updated to In Progress");
  } catch (error) {
    console.error("Error updating hazard status:", error);
    toast.error("Failed to update hazard status");
  }
};

const setHazardToResolved = async (hazard) => {
  //TODO: this function will set the hazard status to 2 (resolved)
  const hazardId = hazard?.id;

  if (!hazardId) {
    console.error("Invalid hazard data");
    toast.error("Hazard ID is missing");
    return;
  }

  try {
    const hazardQuery = query(
      ref(realtimeDb, "roadhazards"),
      orderByChild("id"),
      equalTo(hazardId)
    );

    const snapshot = await get(hazardQuery);
    if (!snapshot.exists()) {
      toast.error("Hazard not found in Realtime Database");
      return;
    }

    const hazardKey = Object.keys(snapshot.val())[0];
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardKey}`);

    await update(hazardRef, { status: 2 });
    toast.success("Hazard status updated to Resolved");
  } catch (error) {
    console.error("Error updating hazard status:", error);
    toast.error("Failed to update hazard status");
  }
};

const flagHazardAsNationalRoad = async (hazard, userData) => {
  const hazardId = hazard?.id;
  const municipality = userData?.municipality;
  const barangay = userData?.barangay;
  if (!hazardId) {
    console.error("Invalid hazard data");
    toast.error("Hazard ID is missing");
    return;
  }

  try {
    const hazardQuery = query(
      ref(realtimeDb, "roadhazards"),
      orderByChild("id"),
      equalTo(hazardId)
    );

    const snapshot = await get(hazardQuery);
    if (!snapshot.exists()) {
      toast.error("Hazard not found in Realtime Database");
      return;
    }

    const hazardKey = Object.keys(snapshot.val())[0];
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardKey}`);

    await update(hazardRef, { nationalRoadFlg: true, municipality: municipality, barangay: barangay });
    toast.success("Set as National Road Hazard");
  } catch (error) {
    console.error("Error updating hazard status:", error);
    toast.error("Failed to update hazard status");
  }
}

const useCurrentUserData = () => {
  //TODO: this function will get the current user data from firestore
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

const getUserAreaCoverage = (userData) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userData) return;

    const role = userData?.role;
    if (role == "0") {
      setData({ 
        status: 400, 
        errorId: "user_id_admin",
        message: "User role is not valid",
      });
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${userData?.barangay}, ${userData?.municipality}, Cebu&format=json`
    const userCoverage = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        setData({ status: 200, data: json[0]?.boundingbox });
      } catch (error) {
        console.error({
          status: 500,
          message: "Fetch failed",
          error: error.message,
        });
        setData({ status: 500, message: "Fetch failed" });
      }
    };

    userCoverage();
  }, [userData]);

  return data;
};

const getHazardArea = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Failed to get hazard area", error);
    return null;
  }
};

const isWithinDistrict = (hazardData, barangays) => {
  const listOfBarangays = barangays;
  const hazardBarangay = hazardData?.barangay;
  const hazardMunicipality = hazardData?.municipality;
  console.log("Districts Data:", {
    hazardBarangay: hazardBarangay,
    hazardMunicipality: hazardMunicipality,
    barangays: listOfBarangays,
  });
  if (!listOfBarangays) return false;
  
  return true;
};

const HazardReport = () => {
  const navigate = useNavigate();
  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const userData = useCurrentUserData();
  const userCoverage = getUserAreaCoverage(userData);

  useEffect(() => {
    const db = getDatabase();
    const roadhazardsRef = ref(db, "roadhazards");
  
    const unsubscribe = onValue(
      roadhazardsRef,
      (snapshot) => {
        const processHazards = async () => {
          if (snapshot.exists()) {
            let data = Object.values(snapshot.val());
  
            if (userData?.role === "2") {
              data = data.filter((hazard) => !hazard.nationalRoadFlg);
            }
  
            if (userData?.role === "1") {
              data = data.filter((hazard) => hazard.nationalRoadFlg);
            }
  
            const sorted = data.sort(
              (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
            );
  
            let finalData = sorted;
  
            if (userData?.role === "2") {
              const filtered = await Promise.all(
                sorted.map(async (hazard) => {
                  const area = await getHazardArea(hazard.latitude, hazard.longitude);
                  const displayName = area?.display_name || "";
                  const isInCanduman = displayName.includes("Canduman") && displayName.includes("Mandaue");
                  return isInCanduman ? hazard : null;
                })
              );
  
              finalData = filtered.filter((h) => h !== null);
            }
  
            if (userData?.role === "1") {
              finalData = sorted.filter((hazard) => {
                return (
                  hazard.nationalRoadFlg &&
                  isWithinDistrict(hazard, districtSorted[districts.districts[userData?.district].district])
                );
              });
            }
  
            setRoadHazards(finalData);
          } else {
            setRoadHazards([]);
          }
          setLoading(false);
        };
  
        processHazards();
      },
      (error) => {
        toast.error("Error fetching roadhazards");
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
  }, [userCoverage, userData]);

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
      Cell: ({ value }) => {
        return (
          <span className={`badge rounded-pill bg-label-${hazard_color[value]}`}>
            {hazard_status[value]}
          </span>
        )
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const hazard = row.original;
        if (userData?.role === "1" || userData?.role === "2") {
          return (
            <div className="flex gap-2">
              
              {hazard.status === 0 && (
                /**
                 * TODO: show button when hazard is pending
                 * ? this will be used to send the hazard to the response team
                 */
                <button
                type="button"
                  className={`btn btn-icon btn-outline-${hazard_color[hazard.status+ 1]}`}
                  onClick={() => sendResponseTeam(hazard)}
                  data-tooltip-id="hazard-tooltip"
                  data-tooltip-content="Send Response Team"
                >
                  <span className={`tf-icons bx ${hazard_icons[hazard.status + 1]}`}></span>
                </button>
              )}

              {hazard.status === 1 && (
                /**
                 * TODO: show button when hazard is in progress
                 * ? this will used to update hazard to completed
                 */
                 <button
                 type="button"
                   className={`btn btn-icon btn-outline-${hazard_color[hazard.status + 1]}`}
                   onClick={() => setHazardToResolved(hazard)}
                   data-tooltip-id="hazard-tooltip"
                   data-tooltip-content="Set Hazard to Resolved"
                 >
                   <span className={`tf-icons bx ${hazard_icons[hazard.status + 1]}`}></span>
                 </button>
              )}
              {hazard.status === 2 && (
                /**
                 * TODO: this button will be used to show that the hazard is already resolved
                 */
                <button 
                  type="button"
                  className={`btn btn-icon btn-outline-${hazard_color[hazard.status]}`}
                  onClick={() => {
                    toast.info('Hazard is already resolved');
                  }}
                  data-tooltip-id="hazard-tooltip"
                  data-tooltip-content="Set Hazard to Resolved"
                >
                  <span className={`tf-icons bx ${hazard_icons[hazard.status]}`}></span>
                </button>
              )}
    
              <button
                type="button"
                className="btn btn-icon btn-outline-primary"
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
    
              {(userData?.role === "2" && !hazard.nationalRoadFlg == true) && (
                /**
                 * TODO: this button will be used to flag the hazard as national road hazard
                 * ? this will be used to send the hazard to the national road hazard team 
                 * ? This button will only be shown to the municipality role
                 */
                <button
                  type="button"
                  className="btn btn-icon btn-outline-danger"
                  onClick={() => flagHazardAsNationalRoad(hazard, userData)}
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
                <>
                  <div className="row mb-4 p-1">
                    <h1 style={{ fontSize: '20px' }} className='fw-bold'>Hazard Report</h1>
                  </div>
                  {userData?.role == '2' && (
                    <div className="card mb-4">
                      <div className="card-header">
                        <h5 className="card-title mb-0"><strong>Hazard Report Within: </strong> 📌 {userData?.barangay}, {userData?.municipality}, Cebu </h5>
                      </div>
                    </div>
                  )}
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive text-nowrap">
                        <table {...getTableProps()} className="table table-striped">
                          <thead>
                            {headerGroups.map((headerGroup) => (
                              <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                  <th key={column.id} {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                                    <td key={cell.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
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
