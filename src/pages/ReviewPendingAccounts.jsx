import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import { useEffect, useState } from "react";
import { doc, getDocs, collection, where, query } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';
import LoadingScreen from '../webview/LoadingScreen';
import { Tooltip } from "react-tooltip";
import accountSetting from "../constants/account-setting.json";

export default function ReviewPendingAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

  const navigate = useNavigate();
  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("accountStatus", "==", 0));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(users);
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

            {loading ? ( <LoadingScreen /> ) : (
              <div className='content-wrapper'>
                <div className='container-xxl flex-grow-1 container-p-y'>
                  <div className='row'>
                    <div className="col-md-3 mb-4">
                      <h1 style={{ fontSize: '20px' }} className='fw-bold'>Pending Accounts</h1>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover text-nowrap" style={{fontSize: '13px'}}>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Full name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Barangay</th>
                              <th>Municipality</th>
                              <th>District</th>
                              <th>Registration Date</th>
                              <th>Valid ID (Front)</th>
                              <th>Valid ID (Back)</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody className="table-border-bottom-0">
                            {users.map((user, index) => (
                              <tr key={index}>
                                <td>{ (index) + 1}</td>
                                <td>{ user.fullname }</td>
                                <td>{ user.email }</td>
                                <td>{ accountSetting["role"][user.role] }</td>
                                <td>{ user.barangay ? user.barangay : 'N/A' }</td>
                                <td>{ user.municipality ? user.municipality : 'N/A' }</td>
                                <td>{ user.district ? user.district : 'N/A' }</td>
                                <td>
                                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })}
                                </td>
                                <td className='text-center'> 
                                  <button type="button" 
                                    className="btn rounded-pill btn-sm btn-outline-primary"
                                    onClick={() => {  handleImageClick(user.validIdFront, "Valid ID Front") }}
                                    >View Image
                                  </button>
                                </td>
                                <td className='text-center'> 
                                  <button type="button" 
                                    className="btn rounded-pill btn-sm btn-outline-primary"
                                     onClick={() => {  handleImageClick(user.validIdBack, "Valid ID Front") }}
                                    >View Image
                                  </button>
                                </td>
                                <td> <span class={ `badge bg-label-${accountSetting["pending_accounts_color"][user.accountStatus]} me-1` }>{ accountSetting["pending_accounts"][user.accountStatus] }</span></td>
                                <td>
                                  <div className='flex gap-2'>
                                    <button
                                      type="button"
                                      className={`btn btn-icon btn-outline-success`}
                                      data-tooltip-id="pendingAccount-tooltip"
                                      data-tooltip-content="Accept Account"
                                      style={{height: '25px', width: '25px'}}
                                    >
                                      <span className={`tf-icons bx bx-check`}></span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`btn btn-icon btn-outline-danger`}
                                      data-tooltip-id="pendingAccount-tooltip"
                                      data-tooltip-content="Block Account"
                                      style={{height: '25px', width: '25px'}}
                                    >
                                      <span className={`tf-icons bx bx-x`}></span>
                                    </button>
                                    <Tooltip id="pendingAccount-tooltip" />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            )}
          </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

