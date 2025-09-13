import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Aside, NavBar, Divider, HazardsView } from '@components';
import { LoadingScreen } from '@webview';
import UsersView from '../components/UsersView';
import { Hazards } from '@services';
import { UserRole, RoadHazards } from '@enums';
import { Letters } from '@utils';

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

                <div className='mb-4'><Divider text="Users Overview" /></div>
                <div className='row'>
                  <div className='col-md-3 mb-4'>
                    <UsersView icon="faUser" color="success" role="0" />
                  </div>
                  <div className='col-md-3 mb-4'>
                    <UsersView icon="faUsersGear" color="warning" role="1" />
                  </div>
                  <div className='col-md-3 mb-4'>
                    <UsersView icon="faUsers" color="primary" role="2" />
                  </div>
                  <div className='col-md-3 mb-4'>
                    <UsersView icon="faUserTie" color="danger" role="3" />
                  </div>
                </div>

                <div className='mb-4'><Divider text="Hazards Overview" /></div>
                <div className="row">
                  <div className="col-md-3">
                    <HazardsView icon="fa-solid fa-hourglass-half" color="info" status={Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)} total={hazards.length} />
                  </div>
                  <div className="col-md-3">
                    <HazardsView icon="fa-solid fa-magnifying-glass" color="success" status={Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)} total={hazards.length} />
                  </div>
                  <div className="col-md-3">
                    <HazardsView icon="fa-solid fa-thumbs-up" color="danger" status={Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)} total={hazards.length} />
                  </div>
                  <div className="col-md-3">
                    <HazardsView icon="fa-solid fa-thumbs-up" color="warning" status={Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)} total={hazards.length} />
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
