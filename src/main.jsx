// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//TODO: import pages
import SignIn from './auth/SignIn'; // Sign In component
import Dashboard from './pages/Dashboard'; // Dashboard component
import SignUp from './auth/SignUp'; // Sign Up component
import HazardReport from './pages/HazardReport'; 
import Notification from './pages/Notification';
import Admin_Dashboard from './admin/Admin_Dashboard';
import Admin_HazardReport from './admin/Admin_HazardReport';
import Admin_AccessControl from './admin/Admin_AccessControl';

// src/App.jsx
import {app} from './firebase/firebase';
import './index.css';

console.log("Firebase App Initialized:", app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/sign-up" element={<SignUp />} /> 
        <Route path="/hazardreport" element={<HazardReport />} /> 
        <Route path="/notification" element={<Notification />} /> 
        <Route path="/admin_dashboard" element={<Admin_Dashboard />} /> 
        <Route path="/admin_accesscontrol" element={<Admin_AccessControl />} />
        <Route path="/admin_hazardreport" element={<Admin_HazardReport />} /> 
      </Routes>
    </BrowserRouter>
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  </React.StrictMode>
);
