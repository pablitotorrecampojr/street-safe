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

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              <select className='w-full border p-2' onChange={(e) => setActiveTab(e.target.value)}>
                <option value="all" className="" defaultValue>All</option>
                <option value={RoadHazards.Status.PENDING} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)}</option>
                <option value={RoadHazards.Status.INVESTIGATING} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)}</option>
                <option value={RoadHazards.Status.REJECTED} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)}</option>
                <option value={RoadHazards.Status.RESOLVED} className="">{Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)}</option>
              </select>
            </div>
          </div>
          <div className='w-full px-2 space-y-2'>
            {
              filteredHazards.map((data, index) => {
                return(
                  <div className='w-full bg-white shadow-sm' key={index}>
                    <button
                      className="w-full flex justify-between items-center px-4 py-2 text-left font-medium hover:bg-blue-100 border-b"
                      onClick={() => toggle(index)}
                    >
                      {Letters.truncate(data.description, 40) || `hazard ${index}`}
                      <span className="ml-2">{openIndex === index ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i> }</span>
                    </button>
                    <div className={`overflow-hidden transition-all ${openIndex === index ? "p-4" : "max-h-0 p-0"}`}>
                      <div className='w-full p-2 flex flex-col md:flex-row'>
                        <div className=''>
                          <img
                            src={`data:image/jpeg;base64, ${data.image}`}
                            alt="Hazard Preview"
                            className="img-fluid mb-3"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              objectFit: "cover"
                            }}
                          />
                        </div>
                        <div className='px-4'>
                          <h1 className='font-semibold mb-4'>Details</h1>
                          <p><span className='font-semibold'>Description: </span>{data.description}</p>
                          <p><span className='font-semibold'>Reported: </span>{data.reportedAt}</p>
                          <p><span className='font-semibold'>Location: </span>{data.location}</p>
                          <p><span className='font-semibold'>Status: </span><span className={`text-${RoadHazards.Style[data.status]} font-semibold`}>{Letters.CapitalizeFirstLetter(data.status)}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}
    </div>
  );
}