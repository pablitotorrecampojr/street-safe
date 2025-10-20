// src/main.jsx
import "@fortawesome/fontawesome-free/css/all.min.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './firebase/ProtectedRoute';
import PublicRoute from './firebase/PublicRoute';

//TODO: import pages
import SignIn from './auth/SignIn'; // Sign In component
import Dashboard from './pages/Dashboard'; // Dashboard component
import SignUp from './auth/SignUp'; // Sign Up component
import HazardReport from './pages/HazardReport'; 
import Notification from './pages/ReviewPendingAccounts';
import EditProfile from './pages/EditProfile';
import AccessControl from './pages/AccessControl';
import PageNotFound from './pages/PageNotFound';
import ReviewPendingAccounts from './pages/ReviewPendingAccounts';
import UserAccounts from './pages/UserAccounts';
import Notifications from './pages/Notitications';

//TODO: import web view components
import LoadingScreen from './webview/LoadingScreen';
import MapsFragment from './webview/MapsFragment';
import HazardFragment from './webview/HazardFragment';
import HazardDetails from './webview/HazardDetails';
import HomeFragment from './webview/HomeFragment';

//TODO: scripts
import InsertHazard from './firebase/InsertHazard';

// src/App.jsx
import {app} from './firebase/firebase';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* web view components */ }
        <Route path="/loading-screen" element={<LoadingScreen />} />
        <Route path="/maps-fragment" element={<MapsFragment />} />
        <Route path="/hazards-fragment" element={<HazardFragment />} />
        <Route path="/hazard-details" element={<HazardDetails />} />
        <Route path="/home-fragment" element={<HomeFragment />} />
        {/* public routes */}
        <Route path="/" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/insert-hazard" element={<InsertHazard />} />

        {/* private routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hazard-report"
            element={
              <ProtectedRoute>
                <HazardReport />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/access-control"
            element={
              <ProtectedRoute>
                <ReviewPendingAccounts />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/user-accounts"
            element={
              <ProtectedRoute>
                <UserAccounts />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          /> 
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
