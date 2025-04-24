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

export default function ReviewPendingAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="layout-wrapper layout-content-navbar">
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
                                <td>{ user.role }</td>
                                <td>{ user.barangay }</td>
                                <td>{ user.municipality }</td>
                                <td>{ user.district }</td>
                                <td>
                                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                  })}
                                </td>
                                <td><a href="#" className='btn-link'>Front Id</a></td>
                                <td><a href="#" className='btn-link'>Back Id</a></td>
                                <td>{ user.accountStatus }</td>
                                <td>
                                  <div className='flex gap-2'>
                                    <button
                                      type="button"
                                      className={`btn btn-icon btn-outline-success`}
                                      data-tooltip-id="hazard-tooltip"
                                      data-tooltip-content="Send Response Team"
                                    >
                                      <span className={`tf-icons bx bx-person`}></span>
                                    </button>
                                    <button
                                      type="button"
                                      className={`btn btn-icon btn-outline-danger`}
                                      data-tooltip-id="hazard-tooltip"
                                      data-tooltip-content="Send Response Team"
                                    >
                                      <span className={`tf-icons bx bx-person`}></span>
                                    </button>
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

