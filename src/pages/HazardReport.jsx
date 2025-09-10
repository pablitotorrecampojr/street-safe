import { useEffect, useState } from 'react';
import { LoadingScreen } from '@webview';
import { Aside, NavBar } from '@components';
import { RoadHazardServices } from '../Services';
 
export default function HazardReport() {
  const [loading, setLoading] = useState(true);

  //TODO: fetching roadzards
  const [hazards, setHazards] = useState([]);
  useEffect(() => {
    const unsubscribe = RoadHazardServices.subscribeToRoadHazards(setHazards);
    return () => unsubscribe(); 
  }, []);


  //TODO: handling displaying road hazards
  const [rows, setRows] = useState([]);
  const columns = [
    { field: 'index', headerName: '#', width: 30 },
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'resolvedAt', headerName: 'Resolved At', width: 200 },
    { field: 'reportedBy', headerName: 'Reported By', width: 200 },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 200 },
  ];

  useEffect(() => {
    if (hazards.length > 0) {
      setLoading(false);
    }
    setRows(hazards);
  });

  return (
    <div className='layout-wrapper layout-content-navbar'>
      <div className='layout-container'>
        <Aside />
        <div className='layout-page'>
          <NavBar />
          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              <div className='row mb-4 p-1'>
                <h1 style={{ fontSize: '20px' }} className='fw-bold'>Hazard Report</h1>
              </div>

              <div className='card'>
                <div className='card-body'>
                  {loading ? <LoadingScreen /> : <div>Content Loaded</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}