import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './index.css';

const HazardReport = () => {
  const navigate = useNavigate(); // ✅ useNavigate inside the component

  const reports = [
    { location: 'Main St & 5th Ave', type: 'Pothole', numberReported: 2, status: 'Pending' },
    { location: 'Park Lane', type: 'Debris', numberReported: 10, status: 'On Progress' }
  ];

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50">
      
      {/* Navbar */}
      <nav className="flex border-b text-center shadow-md">
        <div
          className="w-1/3 py-4 cursor-pointer"
          onClick={() => navigate('/dashboard')} // ✅ Fixed navigation
        >
          Dashboard
        </div>
            <div className="w-1/3 bg-purple-500 text-white font-bold py-4">Hazard Report</div>
        <div
          className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/notification')} // ✅ Added working navigation
        >
          Notification
        </div>
      </nav>

      





      {/* Header */}
      <h1 className="text-3xl text-center font-bold my-8">Hazard Reports</h1>

      {/* Table */}
      <div className="flex justify-center">
        <table className="border-collapse border border-gray-400 w-3/4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-6 py-3">Location</th>
              <th className="border border-gray-400 px-6 py-3">Hazard Type</th>
              <th className="border border-gray-400 px-6 py-3">Number Reported</th>
              <th className="border border-gray-400 px-6 py-3">Status</th>
              <th className="border border-gray-400 px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-400 px-6 py-3">{report.location}</td>
                <td className="border border-gray-400 px-6 py-3">{report.type}</td>
                <td className="border border-gray-400 px-6 py-3">{report.numberReported}</td>
                <td className="border border-gray-400 px-6 py-3">{report.status}</td>
                <td className="border border-gray-400 px-6 py-3 space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-1 rounded">View</button>
                  <button className="bg-green-500 text-white px-4 py-1 rounded">Update</button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HazardReport;
