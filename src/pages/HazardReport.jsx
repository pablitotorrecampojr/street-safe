import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import { getDatabase, ref, get } from "firebase/database";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

const HazardReport = () => {
  const navigate = useNavigate();
  
  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const roadhazardsRef = ref(db, 'roadhazards');
        const snapshot = await get(roadhazardsRef);

        if (snapshot.exists()) {
          setRoadHazards(Object.values(snapshot.val())); 
        } else {
          toast.error("No roadhazards found");
        }
      } catch (error) {
        toast.error("Error fetching roadhazards");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(!loading) {
      $(document).ready(function() {
        $(".display").DataTable();
      });
    }
  }), [];

  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Aside />
        <div className="layout-page">
          <Navbar />

          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              {loading ? (
                <div>
                  <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
                    <div className="demo-inline-spacing">
                      <div className="spinner-border spinner-border-lg text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <div className="row">
                        <div className="col-md-3 mb-4">
                          <h1 style={{ fontSize: "20px" }} className="fw-bold">
                            Hazard Report
                          </h1>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <table className="display">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Barangay</th>
                                <th>District</th>
                                <th>Municipality</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>----</td>
                                  <td>----</td>
                                  <td>----</td>
                                  <td>----</td>
                                  <td>----</td>
                                  <td>----</td>
                                </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

export default HazardReport;