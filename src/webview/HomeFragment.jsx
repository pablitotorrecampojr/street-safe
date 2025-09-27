import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";
import LoadingScreen from './LoadingScreen';
import { RoadHazards } from '@enums';
import { Letters } from '@utils';

export default function HomeFragment() { 
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId") || "null";
    const [roadHazards, setRoadHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingHazard, setPendingHazard] = useState(0);
    const [investigating, setInvestigating] = useState(0);
    const [resolvedHazard, setResolvedHazard] = useState(0);
    const [rejectedHazard, setRejectedHazard] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const roadhazardsRef = ref(db, "roadhazards");
        let _pendingHazard = 0;
        let _investigating = 0;
        let _resolvedHazard = 0;
        let _rejectedHazard = 0;
        const unsubscribe = onValue(
            roadhazardsRef,
            (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val());
                const filteredHazards = data.filter(hazard => {
                    const matchUser = String(hazard.userid) === String(userId);
                    if (matchUser) {
                        const status = hazard.status;
                        console.log("Hazard Status:", status);
                        if (status === RoadHazards.Status.PENDING) {
                            _pendingHazard++;
                        } else if (status === RoadHazards.Status.INVESTIGATING) {
                            _investigating++;
                        } else if (status === RoadHazards.Status.RESOLVED) {
                            _resolvedHazard++;
                        } else if (status === RoadHazards.Status.REJECTED) {
                            _rejectedHazard++;
                        }
                    }
                    return matchUser;
                })
                const sortedDescending = filteredHazards.sort(
                    (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
                );
                setRoadHazards(sortedDescending);
                setPendingHazard(_pendingHazard);
                setInvestigating(_investigating);
                setResolvedHazard(_resolvedHazard);
                setRejectedHazard(_rejectedHazard);
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
                        <div className="p-4 space-y-4">
                            <div className='p-4 rounded-lg bg-white shadow-sm text-left'>
                                <h1 className='font-semibold mb-2'>Welcome back 🎉</h1>
                                <p className="">
                                    You have reported <span className="fw-bold">{roadHazards.length}</span> road hazards in total. Keep the community safe by reporting any road hazards you encounter.
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 p-4 bg-white shadow-sm rounded-md flex flex-col items-center justify-center">
                                    <i className={`fa-solid fa-hourglass-half text-2xl mb-1 text-${RoadHazards.Style["pending"]}`}></i>
                                    <p className="font-medium">
                                        {Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)}
                                    </p>
                                    <p className="text-xl font-bold mt-2">{pendingHazard}</p>
                                </div>

                                <div className="flex-1 p-4 bg-white shadow-sm rounded-md flex flex-col items-center justify-center">
                                     <i className={`fa-solid fa-magnifying-glass text-2xl mb-1 text-${RoadHazards.Style["investigating"]}`}></i>
                                    <p className="font-medium">
                                        {Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)}
                                    </p>
                                    <p className="text-xl font-bold mt-2">{investigating}</p>
                                </div>
                                <div className="flex-1 p-4 bg-white shadow-sm rounded-md flex flex-col items-center justify-center">
                                     <i className={`fa-solid fa-thumbs-up text-2xl mb-1 text-${RoadHazards.Style["resolved"]}`}></i>
                                    <p className="font-medium">
                                        {Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)}
                                    </p>
                                    <p className="text-xl font-bold mt-2">{resolvedHazard}</p>
                                </div>
                                <div className="flex-1 p-4 bg-white shadow-sm rounded-md flex flex-col items-center justify-center">
                                     <i className={`fa-solid fa-thumbs-down text-2xl mb-1 text-${RoadHazards.Style["rejected"]}`}></i>
                                    <p className="font-medium">
                                        {Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)}
                                    </p>
                                    <p className="text-xl font-bold mt-2">{rejectedHazard}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> 
        </div>
    )
}