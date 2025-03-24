import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
          <Aside />
          <div className="layout-page">
          <Navbar />
         
          </div>
      </div>
      <div className="layout-overlay layout-menu-toggle"></div>
  </div>
  );
};

export default Dashboard;
