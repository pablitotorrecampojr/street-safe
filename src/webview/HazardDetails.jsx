import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { get, ref, query, orderByChild, equalTo } from "firebase/database";
import { hazard_status, hazard_color, hazard_icons } from "../constants/hazard-report";
import LoadingScreen from './LoadingScreen';
import { toast } from 'react-toastify';
import { realtimeDb } from "../firebase/firebase";
import 'leaflet/dist/leaflet.css';

export default function HazardDetails() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hazardId = params.get("hazardId") || null;

  const [roadHazards, setRoadHazards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHazard = async () => {
      try {
        const hazardQuery = query(
          ref(realtimeDb, "roadhazards"),
          orderByChild("id"),
          equalTo(hazardId)
        );

        const snapshot = await get(hazardQuery);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setRoadHazards(data);
          console.log("Hazard Data:", data);
        } else {
          console.log("No hazard found with the given ID.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching hazard details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHazard();
  }, [hazardId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h1 className="text-center fw-bold">Hazard Details</h1>
                  {/* Render your hazard details here using `roadHazards` */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}