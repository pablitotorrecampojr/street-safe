// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './firebase/ProtectedRoute';

//TODO: import pages
import SignIn from './auth/SignIn'; // Sign In component
import Dashboard from './pages/Dashboard'; // Dashboard component
import SignUp from './auth/SignUp'; // Sign Up component
import HazardReport from './pages/HazardReport'; 
import Notification from './pages/Notification';
import Admin_Dashboard from './admin/Admin_Dashboard';
import Admin_HazardReport from './admin/Admin_HazardReport';
import Admin_AccessControl from './admin/Admin_AccessControl';
import PageNotFound from './pages/PageNotFound';

// src/App.jsx
import {app} from './firebase/firebase';
import './index.css';

console.log("Firebase App Initialized:", app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        //* public routes
        <Route path="/" element={<SignIn />} /> 
        <Route path="/sign-up" element={<SignUp />} /> 
        //* private routes
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/hazard-report" element={<HazardReport />} /> 
        <Route path="/notification" element={<Notification />} /> 
        <Route path="/admin-dashboard" element={<Admin_Dashboard />} /> 
        <Route path="/admin-accesscontrol" element={<Admin_AccessControl />} />
        <Route path="/admin-hazardreport" element={<Admin_HazardReport />} /> 
        <Route path="*" element={<PageNotFound />} />
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
