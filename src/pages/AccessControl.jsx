import React, {useEffect, useRef, useState} from 'react';
import { doc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import $ from "jquery"; 
import "datatables.net-dt/css/dataTables.dataTables.css"; 
import "datatables.net";
import accountSetting from '../constants/account-setting.json';

const AccessControl = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  useEffect(() => {
    if (tableRef.current) {
      $(tableRef.current).DataTable(); // Initialize DataTable
    }
  })
  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const usersCollection = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserData(usersList);
      } catch (error) {
          console.error("Error fetching users:", error);
      }
    };

  fetchUsers(); // Call function on mount
  }, []);

  let filteredUsers;
    userData && userData.forEach((user) => { 
       filteredUsers = user.fullname;
    });

    console.log(filteredUsers);
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
          <Aside />
          <div className="layout-page">
          <Navbar />

          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              <div className='row'>
                <div className="col-md-3 mb-4">
                  <h1 style={{ fontSize: '20px' }} className='fw-bold'>Access Control</h1>
                </div>
              </div>
              <div className='card'>
                <div className='card-body'>
                  <table ref={tableRef} className="display">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Barangay</th>
                        <th>District</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                     {userData && userData.map((user, index) => {
                        return (
                          <tr>
                            <td>{ (index) + 1 }</td>
                            <td>{ user.fullname }</td>
                            <td>{ user.email }</td>
                            <td>{ user.role }</td>
                            <td>{ user.barangay }</td>
                            <td>{ user.district }</td>
                            <td>{ new Date(user.createdAt.toDate()).toLocaleString() }</td>
                          </tr>
                        )
                     })}
                    </tbody>
                  </table>
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

export default AccessControl;
