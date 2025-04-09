import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import { getDatabase, ref, get, onValue } from "firebase/database";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { hazard_status } from '../constants/hazard-report';

const HazardReport = () => {
  const navigate = useNavigate();
  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const roadhazardsRef = ref(db, 'roadhazards');
    const unsubscribe = onValue(roadhazardsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const sortedDescending = data.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
        toast.success("New Road Hazard Report!");
  
        setRoadHazards(sortedDescending);
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
  
  useEffect(() => {
    if (!loading) {
      const table = $('.display').DataTable();
  
      return () => {
        table.destroy(); 
      };
    }
  }, [roadHazards, loading]);  

  useEffect(() => {
    if(!loading) {
      $(document).ready(function() {
        $(".display").DataTable();
      });
    }
  }), [];

  useEffect(() => {
    document.body.style.overflow = modalVisible ? 'hidden' : 'auto';
  }, [modalVisible]);

  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
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
                <img
                  src={modalImageUrl}
                  alt="Hazard Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
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
                                <th>Full Address</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                            {roadHazards.map((hazard, index) => {
                              const imageUrl = `data:image/jpeg;base64,${hazard.imageUrl}`;
                              return (
                                <tr key={index}>
                                  <td>{(index) + 1}</td>
                                  <td>
                                    <button
                                      key={index}
                                      className="btn btn-link text-left"
                                      data-toggle="modal"
                                      data-target="#exampleModal"
                                      onClick={() => {
                                        setModalImageUrl(`data:image/jpeg;base64,${hazard.imageUrl}`);
                                        setModalVisible(true);
                                        setModalTitle(hazard.roadHazard);
                                      }}
                                    >
                                      {hazard.roadHazard}
                                    </button>
                                  </td>
                                  <td className='text-wrap' data-latitude={hazard.latitude} data-longitude={hazard.longitude} >{hazard.fullAddress.replace("Address:","")}</td>
                                  <td>{hazard_status[hazard.status]}</td>
                                  <td>---</td>
                                </tr>
                              );
                            })}
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