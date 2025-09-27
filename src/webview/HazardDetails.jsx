import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { get, ref, query, orderByChild, equalTo } from "firebase/database";
import { hazard_status, hazard_color, hazard_icons } from "../constants/hazard-report";
import LoadingScreen from './LoadingScreen';
import { toast } from 'react-toastify';
import { realtimeDb } from "../firebase/firebase";
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

export default function HazardDetails() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hazardId = params.get("hazardId") || null;
  const userLatitude = params.get("lat") || 10.3385155;
  const userLongitude = params.get("lng") || 123.91217342595031;

  const [roadHazards, setRoadHazards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
                  {Object.entries(roadHazards).map(([key, hazard]) => (
                    <div className="card shadow mt-4" key={key}>
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-sm"
                            onClick={() => navigate('/maps-fragment?lat=' + userLatitude + '&lng=' + userLongitude)}
                        >
                            <i className="bx bx-arrow-back"></i>
                        </button>
                        <h1 className="fw-bold m-0 text-center flex-grow-1">Hazard Details</h1>
                        <div></div> 
                        </div>
                        <div className="card-body">
                            <img
                                src={`data:image/jpeg;base64,${hazard.image}`}
                                alt="Hazard Preview"
                                className="img-fluid mb-3"
                                style={{ maxHeight: "300px", objectFit: "contain" }}
                            />
                            <p className='mb-2'>
                                <strong>Hazard:</strong> {hazard.description}
                            </p>
                            <p className="mb-2">
                                <strong>Status:</strong> {hazard.status}
                            </p>
                            <p className="mb-0">
                                <strong>Location:</strong> {hazard.location}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}