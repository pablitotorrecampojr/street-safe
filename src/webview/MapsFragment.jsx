import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDatabase, ref, onValue } from "firebase/database";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';

export default function MapsFragment() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userLatitude = params.get("lat") || 10.3385155;
    const userLongitude = params.get("lng") || 123.91217342595031;
    const [roadHazards, setRoadHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedLat = params.get("selectedLat") || null;
    const selectedLng = params.get("selectedLng") || null;
    const fromAdmin = params.get('fromAdmin') || null;
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();
        const roadhazardsRef = ref(db, "roadhazards");
        const unsubscribe = onValue(
            roadhazardsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = Object.values(snapshot.val());
                    const sortedDescending = data.sort(
                        (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
                    );
                    setRoadHazards(sortedDescending);
                } else {
                    setRoadHazards([]);
                }
                setLoading(false); // ← stop loading after data is fetched
            },
            (error) => {
                toast.error("Error fetching roadhazards");
                console.error("Error fetching roadhazards:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const hazardIcon = new L.DivIcon({
        className: 'custom-svg-icon',
        html: `
            <div class="circle-bg">
                <svg class="danger-icon" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-radioactive" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"/>
                    <path d="M9.653 5.496A3 3 0 0 0 8 5c-.61 0-1.179.183-1.653.496L4.694 2.992A5.97 5.97 0 0 1 8 2c1.222 0 2.358.365 3.306.992zm1.342 2.324a3 3 0 0 1-.884 2.312 3 3 0 0 1-.769.552l1.342 2.683c.57-.286 1.09-.66 1.538-1.103a6 6 0 0 0 1.767-4.624zm-5.679 5.548 1.342-2.684A3 3 0 0 1 5.005 7.82l-2.994-.18a6 6 0 0 0 3.306 5.728ZM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>
                </svg>
            </div>
        `,
        iconSize: [100, 100], 
        iconAnchor: [15, 30],  
        popupAnchor: [0, -30], 
    });

    const userIcon = new L.DivIcon({
        className: 'custom-svg-icon',
        html: `
            <svg class="text-primary bounce" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
        `,
        iconSize: [200, 200], 
        iconAnchor: [15, 30],  
        popupAnchor: [0, -30], 
    });

    const selectedHazard = new L.DivIcon({
        className: 'custom-svg-icon',
        html: `
             <div class="selected-hazard">
                <svg class="selected-hazard-icon" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-radioactive" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"/>
                    <path d="M9.653 5.496A3 3 0 0 0 8 5c-.61 0-1.179.183-1.653.496L4.694 2.992A5.97 5.97 0 0 1 8 2c1.222 0 2.358.365 3.306.992zm1.342 2.324a3 3 0 0 1-.884 2.312 3 3 0 0 1-.769.552l1.342 2.683c.57-.286 1.09-.66 1.538-1.103a6 6 0 0 0 1.767-4.624zm-5.679 5.548 1.342-2.684A3 3 0 0 1 5.005 7.82l-2.994-.18a6 6 0 0 0 3.306 5.728ZM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>
                </svg>
            </div>
        `,
        iconSize: [200, 200], 
        iconAnchor: [15, 30],  
        popupAnchor: [0, -30], 
    });

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <div className="layout-page">
                    <div style={{ height: '100vh', position: 'relative' }}>
                        {loading ? (
                            <LoadingScreen loadingText="Fetching Map Data..." />
                        ) : (
                            <MapContainer 
                                center={!fromAdmin ? [userLatitude, userLongitude] : [selectedLat, selectedLng]} 
                                zoom={!fromAdmin ? 15 : 19} 
                                style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {!fromAdmin && (
                                     <Marker 
                                        position={[userLatitude, userLongitude]} 
                                        icon={userIcon}>
                                        <Popup>
                                            You are Here!
                                        </Popup>
                                    </Marker>
                                )}
                                {roadHazards.map((hazard, index) => {
                                    const { latitude, longitude } = hazard;
                                    const isSelectedHazard = ( latitude == selectedLat && longitude == selectedLng );
                                    return (
                                        <Marker
                                            key={index}
                                            position={[latitude, longitude]}
                                            icon={ isSelectedHazard ? selectedHazard : hazardIcon }
                                        >
                                            <Popup>
                                                <div>
                                                    <h4>☢️ {hazard.roadHazard} ☢️</h4>
                                                    <p>📌 {hazard.fullAddress.replace("Address:", "")}</p>
                                                    {!fromAdmin && (
                                                        <a href="#"
                                                            onClick={() => {
                                                                navigate(`/hazard-details?hazardId=${hazard.id}&lat=${userLatitude}&lng=${userLongitude}`);
                                                            }}
                                                            className="btn-link"
                                                        > <span className='bx bx-map-alt'></span> View full detail</a>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
