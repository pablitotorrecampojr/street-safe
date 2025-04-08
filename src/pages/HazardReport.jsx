import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';
import Aside from '../components/Aside';
import Navbar from '../components/NavBar';
import Profile from '../components/Profile';
import { getDatabase, ref, get } from "firebase/database";

const HazardReport = () => {
  const navigate = useNavigate();
  
  // State to store roadhazards data
  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch roadhazards data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const roadhazardsRef = ref(db, 'roadhazards');
        const snapshot = await get(roadhazardsRef);

        if (snapshot.exists()) {
          // Assuming data is stored as an array of objects, map over it
          setRoadHazards(Object.values(snapshot.val())); 
        } else {
          toast.error("No roadhazards found");
        }
      } catch (error) {
        toast.error("Error fetching roadhazards");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Aside />
        <div className="layout-page">
          <Navbar />

          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className='row'>
                  {roadHazards.map((hazard, index) => {
                    const imageUrl = `data:image/jpeg;base64,${hazard.imageUrl}`;

                    return (
                      <div key={index} className="col-md-3 mb-4">
                        <img src={imageUrl} alt="Captured Hazard" height={100} width={100} />
                        <p>{hazard.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

export default HazardReport;