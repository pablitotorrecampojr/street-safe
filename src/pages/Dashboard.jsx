import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import UsersView from '../components/UsersView';

const Dashboard = () => {
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
                  <h1 style={{ fontSize: '20px' }} className='fw-bold'>Dashboard</h1>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-3 mb-4'>
                  <UsersView icon="faUser" color="success" role="0" />
                </div>
                <div className='col-md-3 mb-4'>
                  <UsersView icon="faUsersGear" color="warning" role="1" />
                </div>
                <div className='col-md-3 mb-4'>
                  <UsersView icon="faUsers" color="primary" role="2" />
                </div>
                <div className='col-md-3 mb-4'>
                  <UsersView icon="faUserTie" color="danger" role="3" />
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

export default Dashboard;
