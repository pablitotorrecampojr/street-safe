import { useLocation } from 'react-router-dom';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export default function MapsFragment() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const loadingText = params.get("loadingText") || "Loading...";

    return(
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <div className="layout-page">
                    <div style={{ height: '100vh' }}>
                        <MapContainer center={[14.5995, 120.9842]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[14.5995, 120.9842]}>
                            <Popup>
                                A marker in Manila!
                            </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}