import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDatabase, ref, onValue } from "firebase/database";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';  // Leaflet library for creating custom icons
import { toast } from 'react-toastify';  // If you're using toast notifications for success/error messages

export default function MapsFragment() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userLatitude = params.get("lat") || 10.3385155;
    const userLongitude = params.get("lng") || 123.91217342595031;
    const [roadHazards, setRoadHazards] = useState([]);

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
                    toast.success("New Road Hazard Report!");
                    setRoadHazards(sortedDescending);
                } else {
                    setRoadHazards([]);
                }
            },
            (error) => {
                toast.error("Error fetching roadhazards");
                console.error("Error fetching roadhazards:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    // Define the SVG icon for road hazards
    const hazardIcon = new L.DivIcon({
        className: 'custom-svg-icon',
        html: `
            <svg class="text-danger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
        `,
        iconSize: [100, 100], 
        iconAnchor: [15, 30],  // Adjust anchor point to center the icon
        popupAnchor: [0, -30],  // Adjust position of popup relative to the icon
    });

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <div className="layout-page">
                    <div style={{ height: '100vh' }}>
                        <MapContainer center={[userLatitude, userLongitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[userLatitude, userLongitude]}>
                                <Popup>
                                    A marker in Manila!
                                </Popup>
                            </Marker>
                            {roadHazards.map((hazard, index) => {
                                const { latitude, longitude } = hazard;

                                return (
                                    <Marker
                                        key={index}
                                        position={[latitude, longitude]}
                                        icon={hazardIcon}
                                    >
                                        <Popup>
                                            <div>
                                                <h4>Road Hazard</h4>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
