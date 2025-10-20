import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Aside, NavBar, Divider, HazardsView } from '@components';
import { UsersOverview } from '@components';
import { Hazards } from '@services';

const Dashboard = () => {
  const navigate = useNavigate();
  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [hazards, setHazards] = useState([]);
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('userData')));

    const unsubscribe = Hazards.subscribe((data) => {
      setHazards(data);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []); 

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
          <Aside />
          <div className="layout-page">
            <NavBar />
            <div className='content-wrapper'>
              <div className='container-xxl flex-grow-1 container-p-y'>
                <div className='row'>
                  <div className="col-md-3 mb-4">
                    <h1 style={{ fontSize: '20px' }} className='fw-bold'>Dashboard</h1>
                  </div>
                </div>

                <div className='w-full flex flex-row gap-2'>
                  <UsersOverview />

                  <div className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800">Users Overview</h2>
                      <p className="text-gray-600 mt-2">
                        This is a simple card component made with Tailwind CSS.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

export default Dashboard;
