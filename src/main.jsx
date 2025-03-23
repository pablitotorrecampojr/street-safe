// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './auth/App'; // Sign In component
import Dashboard from './auth/Dashboard'; // Dashboard component
import SignUp from './auth/SignUp'; // Sign Up component
import HazardReport from './auth/HazardReport'; 
import Notification from './auth/Notification';
import Admin_Dashboard from './admin/Admin_Dashboard';
import Admin_HazardReport from './admin/Admin_HazardReport';
import Admin_AccessControl from './admin/Admin_AccessControl';
// src/App.jsx
import {app} from './firebase';

console.log("Firebase App Initialized:", app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/hazardreport" element={<HazardReport />} /> 
        <Route path="/notification" element={<Notification />} /> 
        <Route path="/admin_dashboard" element={<Admin_Dashboard />} /> 
        <Route path="/admin_accesscontrol" element={<Admin_AccessControl />} />
        <Route path="/admin_hazardreport" element={<Admin_HazardReport />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
