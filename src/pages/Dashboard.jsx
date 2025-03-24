import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import NavBar from '../components/NavBar';
import Profile from '../components/Profile';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50">
      {/* Navbar */}
      <NavBar />
      <Profile />

      <hr className="border-t border-gray-300 w-full mb-8" />

      {/* System Overview */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">System Overview</h1>

        <div className="flex justify-center gap-40 mb-5">
          {/* Overall Reports Card */}
          <div className="bg-yellow-300 p-6 rounded-lg w-[400px] h-44 shadow-md hover:shadow-lg transition">
            <p className="text-lg font-medium flex items-center text-gray-800">
              <span className="mr-2">ℹ️</span> Overall Reports
            </p>
            <p className="text-5xl font-bold text-center text-blue-500 mt-4">15</p>
          </div>

          {/* Registered Users Card */}
          <div className="bg-orange-400 p-6 rounded-lg w-[400px] h-44 shadow-md hover:shadow-lg transition">
            <p className="text-lg font-medium flex items-center text-gray-800">
              <span className="mr-2">👤</span> Registered Users
            </p>
            <p className="text-5xl font-bold text-center text-blue-500 mt-4">345</p>
          </div>
        </div>

        {/* Resolved Hazard Card */}
        <div className="flex justify-center">
          <div className="bg-lime-300 p-6 rounded-lg w-[400px] h-44 shadow-md hover:shadow-lg transition">
            <p className="text-lg font-medium flex items-center text-gray-800">
              <span className="mr-2">✔️</span> Resolved Hazard
            </p>
            <p className="text-5xl font-bold text-center text-blue-500 mt-4">120</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
