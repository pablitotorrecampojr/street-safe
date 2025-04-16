import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { hazard_status } from "../constants/hazard-report";
import LoadingScreen from './LoadingScreen';
import { hazard_icons } from '../constants/hazard-report';

export default function HazardFragment() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId") || "null";

  const [roadHazards, setRoadHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

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

  const filteredHazards = roadHazards.filter(
    hazard => String(hazard.userid) === String(userId)
  );

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h1 className="text-center fw-bold">Hazards</h1>
                  {loading ? (
                    <LoadingScreen loadingText="Fetching Map Data..." />
                  ) : filteredHazards.length === 0 ? (
                    <div className="card">
                      <div className="card-body">
                        <h1 className="text-center">No Data Found!</h1>
                      </div>
                    </div>
                  ) : (
                    <div className="accordion mt-4" id="accordionExample">
                      {filteredHazards.map((hazard, index) => {
                        const headingId = `heading${index}`;
                        const collapseId = `collapse${index}`;
                        const isActive = activeIndex === index;

                        return (
                          <div
                            className={`card accordion-item ${isActive ? 'active' : ''}`}
                            key={hazard.id || index}
                          >
                            <h2 className="accordion-header border-bottom" id={headingId}>
                              <button
                                type="button"
                                className={`accordion-button ${isActive ? '' : 'collapsed'}`}
                                aria-expanded={isActive}
                                onClick={() => handleAccordionClick(index)}
                              >
                               <span className={`tf-icons bx ${hazard_icons[hazard.status]} mr-4`}></span> {hazard.roadHazard || `Hazard ${index + 1}`}
                              </button>
                            </h2>

                            <div
                              id={collapseId}
                              className={`accordion-collapse ${isActive ? 'show mt-4 mb-4' : 'collapse'}`}
                            >
                              <div className="accordion-body">
                                <img
                                  src={"data:image/jpeg;base64," + hazard.imageUrl}
                                  alt="Hazard Preview"
                                  className="img-fluid mb-3"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    objectFit: "cover"
                                  }}
                                />
                                <p className="text-black">
                                  <strong>Date Submitted:</strong> {hazard.dateSubmitted || 'N/A'}<br />
                                  <strong>Location:</strong> {hazard.fullAddress}<br />
                                  <strong>Status:</strong> {hazard_status[hazard.status] || 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
