// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './index.css';

// const Notification = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen w-full font-sans bg-gray-50">
//       {/* Navbar */}
//       <nav className="flex border-b text-center shadow-md">
//         <div className="w-1/3 py-4 cursor-pointer" onClick={() => navigate('/')}>
//           Dashboard
//         </div>
//         <div className="w-1/3 py-4 cursor-pointer" onClick={() => navigate('/hazardreport')}>
//           Hazard Report
//         </div>
//         <div className="w-1/3 bg-purple-500 text-white font-bold py-4">Notification</div>
//       </nav>

//       {/* Create Notification */}
//       <div className="bg-white p-4 m-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-bold mb-4">Create Notification</h2>
//         <textarea className="w-full border rounded-lg p-2 mb-2" rows="4" placeholder="Enter notification message..."></textarea>
//         <div className="flex justify-start space-x-2">
//           <button className="bg-green-500 text-white px-4 py-1 rounded">Submit</button>
//           <button className="bg-green-300 text-white px-4 py-1 rounded">Save as Draft</button>
//         </div>
//       </div>

//       {/* Schedule Notification */}
//       <div className="bg-white p-4 m-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-bold mb-4">Schedule Notification</h2>
//         <label className="block text-left mb-2">Start Time</label>
//         <textarea className="w-full border rounded-lg p-2 mb-2" rows="4" placeholder="Enter Schedule notification message..."></textarea>
//         <div className="flex space-x-2 mb-2">
//           <input type="time" className="border rounded-lg p-2" />
//           <input type="date" className="border rounded-lg p-2" />
//         </div>
//         <div className="flex justify-start space-x-2">
//           <button className="bg-green-500 text-white px-4 py-1 rounded">Submit</button>
//           <button className="bg-green-300 text-white px-4 py-1 rounded">Save as Draft</button>
//         </div>
//       </div>

//       {/* Notification History */}
//       <div className="bg-white p-4 m-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-bold mb-4">Notification History</h2>
//         <textarea className="w-full border rounded-lg p-2" rows="6" readOnly placeholder="Notification history will be displayed here..."></textarea>
//       </div>
//     </div>
//   );
// };

// export default Notification;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Notification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 flex flex-wrap justify-center">
        <div className="w-72 h-72 bg-purple-500 opacity-30 rounded-full absolute top-10 left-10"></div>
        <div className="w-96 h-96 bg-purple-500 opacity-40 rounded-full absolute top-20 left-1/3"></div>
        <div className="w-72 h-72 bg-purple-500 opacity-30 rounded-full absolute top-10 right-10"></div>
      </div>

      {/* Navbar */}
      <nav className="flex border-b text-center shadow-md">
        <div className="w-1/3 py-4 cursor-pointer" onClick={() => navigate('/')}>
          Dashboard
        </div>
        <div className="w-1/3 py-4 cursor-pointer" onClick={() => navigate('/hazardreport')}>
          Hazard Report
        </div>
        <div className="w-1/3 bg-purple-500 text-white font-bold py-4">Notification</div>
      </nav>

      {/* Create Notification */}
      <div className="bg-white p-4 m-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Create Notification</h2>
        <textarea className="w-full border rounded-lg p-2 mb-2" rows="4" placeholder="Enter notification message..."></textarea>
        <div className="flex justify-start space-x-2">
          <button className="bg-green-500 text-white px-4 py-1 rounded">Submit</button>
          <button className="bg-green-300 text-white px-4 py-1 rounded">Save as Draft</button>
        </div>
      </div>

      {/* Schedule Notification */}
      <div className="bg-white p-4 m-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Schedule Notification</h2>
        <label className="block text-left mb-2">Start Time</label>
        <textarea className="w-full border rounded-lg p-2 mb-2" rows="4" placeholder="Enter Schedule notification message..."></textarea>
        <div className="flex space-x-2 mb-2">
          <input type="time" className="border rounded-lg p-2" />
          <input type="date" className="border rounded-lg p-2" />
        </div>
        <div className="flex justify-start space-x-2">
          <button className="bg-green-500 text-white px-4 py-1 rounded">Submit</button>
          <button className="bg-green-300 text-white px-4 py-1 rounded">Save as Draft</button>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white p-4 m-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Notification History</h2>
        <textarea className="w-full border rounded-lg p-2" rows="6" readOnly placeholder="Notification history will be displayed here..."></textarea>
      </div>
    </div>
  );
};

export default Notification;
