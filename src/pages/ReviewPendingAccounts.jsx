import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';

export default function ReviewPendingAccounts() {
  const navigate = useNavigate();
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
              <div className='row'>
                <div className="col-md-3 mb-4">
                  <h1 style={{ fontSize: '20px' }} className='fw-bold'>Pending Accounts</h1>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Client</th>
                          <th>Users</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="table-border-bottom-0">
                        <tr>
                          <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                          <td>Albert Cook</td>
                          <td>
                            Sample Data
                          </td>
                          <td><span className="badge bg-label-primary me-1">Active</span></td>
                          <td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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

