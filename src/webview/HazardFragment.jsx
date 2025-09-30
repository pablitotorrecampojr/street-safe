import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import LoadingScreen from './LoadingScreen';
import { hazard_icons, hazard_color, hazard_status } from '../constants/hazard-report';
import { RoadHazards } from '@enums';
import { Letters } from '@utils';

export default function HazardFragment() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId") || "null";

  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleAccordionClick = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

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
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching roadhazards:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredHazards = roadHazards.filter(hazard => {
    const matchUser = String(hazard.userid) === String(userId);
    const matchStatus = activeTab === "all" || String(hazard.status) === activeTab;
    return matchUser && matchStatus;
  });

  return (
    <div className='w-full h-screen'>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className='space-y-2'>
          <div className='w-full p-2 text-center bg-white shadow-sm'>
            <h1 className='font-semibold text-2xl'>Reported Hazards</h1>
          </div>
          <div className='flex flex-col'>
            <div className='self-end w-1/2 p-2'>
              <select className='w-full border p-2 text-xl'>
                <option value="all" className="" selected>All</option>
                <option value={RoadHazards.Status.PENDING} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)}</option>
                <option value={RoadHazards.Status.INVESTIGATING} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)}</option>
                <option value={RoadHazards.Status.REJECTED} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)}</option>
                <option value={RoadHazards.Status.RESOLVED} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}