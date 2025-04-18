import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import LoadingScreen from './LoadingScreen';
import { hazard_icons, hazard_color, hazard_status } from '../constants/hazard-report';

export default function HomeFragment() { 
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId") || "null";
    const [roadHazards, setRoadHazards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase();
        const roadhazardsRef = ref(db, "roadhazards");

        const unsubscribe = onValue(
            roadhazardsRef,
            (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val());
                const filteredHazards = data.filter(hazard => {
                    const matchUser = String(hazard.userid) === String(userId);
                    return matchUser;
                })
                const sortedDescending = filteredHazards.sort(
                    (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
                );
                setRoadHazards(sortedDescending);
            } else {
                setRoadHazards([]);
            }
            setLoading(false);
            },
            (error) => {
            console.error("Error fetching roadhazards:", error);
            setLoading(false);
            }
        );
        return () => unsubscribe();

    }, []);
    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <div className="layout-page">
                     {loading ? (
                        <LoadingScreen loadingText="Fetching Map Data..." />
                    ) : (
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                        <div className="row">
                            <div className="col-md-6 mb-4 mb-md-0 mx-auto">
                                <h1 className="text-left fw-bold">Street Safe</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8 mb-4 order-0">
                                <div className="card">
                                    <div className="d-flex align-items-end row">
                                    <div className="col-sm-7">
                                        <div className="card-body">
                                        <h5 className="card-title text-primary">Welcome back 🎉</h5>
                                        <p className="mb-4">
                                            You have reported <span className="fw-bold">{roadHazards.length}</span> road hazards in total. Keep the community safe by reporting any road hazards you encounter.
                                        </p>

                                        <a href="javascript:;" className="btn btn-sm btn-outline-primary">Report Hazards</a>
                                        </div>
                                    </div>
                                    <div className="col-sm-5 text-center text-sm-left">
                                        <div className="card-body pb-0 px-0 px-md-4">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                
                </div>
            </div> 
        </div>
    )
}