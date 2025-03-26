import React, {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import $ from "jquery"; 
import "datatables.net-dt/css/dataTables.dataTables.css"; 
import "datatables.net";

const AccessControl = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
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
  }, []);
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
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Jane Doe</td>
                        <td>jane@example.com</td>
                      </tr>
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
