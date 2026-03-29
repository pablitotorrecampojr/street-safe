import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Admin_Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to Sign In page
  };


  return (
    <div className="min-h-screen w-full font-sans bg-gray-50">
      {/* Navbar */}
      <nav className="flex border-b text-center shadow-md">
        <div className="w-1/3 bg-purple-500 text-white font-bold py-4">Dashboard</div>
        <div
          className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/admin_hazardreport')}
        >
          Hazard Report
        </div>
        <div
          className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/admin_accesscontrol')}
        >
          Notification
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex items-center py-2 px-10 bg-white shadow-md rounded-lg m-1">
        <img src="/bg.png" alt="Profile" className="w-20 h-20 rounded-full border-2 border-gray-300" />
        <div className="ml-6">
          <h2 className="text-10 font-bold text-gray-800">Admin Sean Kyle Ceniza</h2>
          <p className=" text-10 text-gray-600 mb-4">cenizaseankyle0@gmail.com</p>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-6 py-1 rounded-full text-sm font-medium hover:bg-green-600">
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

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

export default Admin_Dashboard;
