import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from "firebase/database";
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

  const handleAccordionClick = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    const db = getDatabase();
    const roadhazardsRef = ref(db, "roadhazards");

    const q = query(roadhazardsRef, orderByChild("userId"), equalTo(userId));
    const unsubscribe = onValue(
      q,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          console.log('data', data);
          const sortedDescending = data.sort(
            (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)
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

  const [filterHazards, setFilterHazards] = useState([]);
  const [activeFilter, setActiveIndex] = useState('all');
  useEffect(() => {
    setFilterHazards(roadHazards);
  }, [roadHazards]);

  useEffect(() => {
    console.log(roadHazards);
    console.log(filterHazards);
  })
 
  const handleOnChange = (value) => {
    if (value === 'all') {
      setFilterHazards(roadHazards);
    } else {
      setFilterHazards(
        roadHazards.filter((hazard) => hazard.status === value )
      );
    }
  };

  return (
    <>
      {loading ? (
        <div className='w-full h-screen flex flex-col item-center'> 
          <LoadingScreen  />
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='w-full text-center pb-2 pt-2 bg-white '>
            <h1 className='font-semibold text-2xl'>Reported Hazard</h1>
          </div>
          <div className="flex justify-end p-2">
            <div className="w-1/2">
              <div className="relative w-full">
                <select
                  id="status"
                  className="w-full border-2 border-blue-500 rounded-md pl-3 pr-10 py-2 appearance-none bg-white focus:outline-none"
                  defaultValue=""
                  onChange={e => handleOnChange(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value={RoadHazards.Status.PENDING}>
                    {Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)}
                  </option>
                  <option value={RoadHazards.Status.INVESTIGATING}>
                    {Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)}
                  </option>
                  <option value={RoadHazards.Status.RESOLVED}>
                    {Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)}
                  </option>
                  <option value={RoadHazards.Status.REJECTED}>
                    {Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)}
                  </option>
                </select>
                <i className="bi bi-caret-down-fill"></i>
              </div>
            </div>
          </div>
          <div className='w-full bg-white p-2'>
            {filterHazards.map((hazard, index) => (
              <div
                className="bg-white w-full border-2 border-red-500"
                key={hazard.id || index}
              >
                <span>{hazard.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}