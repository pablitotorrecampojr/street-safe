import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Admin_AccessControl = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex border-b text-center shadow-md">
      <div
          className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/admin_dashboard')}
        >
          Dashboard
        </div>
        <div
          className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/admin_hazardreport')}
        >
          Hazard Report
        </div>
        <div className="w-1/3 bg-purple-500 text-white font-bold py-4">Access Control</div>
      </nav>
      <div className="min-h-screen bg-white flex flex-col items-center p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold my-8">Access Control</h1>

      {/* User Dropdown */}
     <div className="flex justify-start w-full max-w-4xl mb-4">
        <select className="bg-gray-300 text-black px-4 py-2 rounded-md">
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Authorities">Authorities</option>
        </select>
      </div>


      {/* Table */}
      <table className="w-full max-w-4xl border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-4">User Id</th>
            <th className="border p-4">Username</th>
            <th className="border p-4">Email</th>
            <th className="border p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1 */}
          <tr>
            <td className="border p-4">1001</td>
            <td className="border p-4 flex items-center space-x-2">
              <img src="https://via.placeholder.com/40" alt="John Doe" className="rounded-full w-10 h-10" />
              <span>John Doe</span>
            </td>
            <td className="border p-4">john@example.com</td>
            <td className="border p-4 flex space-x-2">
              <button className="bg-blue-400 text-white px-4 py-1 rounded-md">View</button>
              <button className="bg-green-400 text-white px-4 py-1 rounded-md">Edit</button>
            </td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td className="border p-4">1002</td>
            <td className="border p-4 flex items-center space-x-2">
              <img src="https://via.placeholder.com/40" alt="Jane Smith" className="rounded-full w-10 h-10" />
              <span>Jane Smith</span>
            </td>
            <td className="border p-4">steve@example.com</td>
            <td className="border p-4 flex space-x-2">
              <button className="bg-blue-400 text-white px-4 py-1 rounded-md">View</button>
              <button className="bg-green-400 text-white px-4 py-1 rounded-md">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Admin_AccessControl;
