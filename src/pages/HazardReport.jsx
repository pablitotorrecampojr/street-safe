import { useEffect, useState } from 'react';
import { LoadingScreen } from '@webview';
import { Aside, NavBar, Badge, ViewHazards } from '@components';
import { Hazards } from '@services';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { RoadHazards, UserRole  } from '@enums';
 
export default function HazardReport() {
  const [loading, setLoading] = useState(true);

  //TODO: fetching roadzards
  const [hazards, setHazards] = useState([]);
  useEffect(() => {
    const unsubscribe = Hazards.subscribe(setHazards);
    return () => unsubscribe(); 
  }, []);

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userData")) || null);
    setRows(
      hazards.map((hazard, index) => ({
        index: index + 1,
        id: hazard.id,
        ...hazard,
      }))
    );

    setLoading(false);
  }, [hazards]);  

  //TODO: handleing viewing road hazards
  const [selectedHazard, setSelectedHazard] = useState({});
  const [isViewHazardOpen, setIsViewHazardOpen] = useState(false);

  //TODO: handling displaying road hazards
  const [rows, setRows] = useState([]);
  const columns = [
    { field: 'index', headerName: '#', width: 30 },
    { field: 'id', headerName: 'UID', width: 30 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => { 
        return <Badge 
          status={RoadHazards.Style[params.value]} 
          text={params.value} 
        />
      }
     },
    { field: 'isNationalFlag', headerName: 'National Flag', width: 150,
      renderCell: (params) => {
        return params.value ? <Badge status="success" text="Yes" /> : <Badge status="danger" text="No" />;
      }
    },
    { field: 'resolvedAt', headerName: 'Resolved At', width: 200,
      renderCell: (params) => {
        if (!params.value) return <i>To be determined</i>;
        return new Date(params.value).toLocaleString();
      }
     },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
      getActions: (params) => {
        if (currentUser?.role === UserRole.ADMIN) {
          const actions = [
            <GridActionsCellItem
              icon={<i className="fa-solid fa-eye" />}
              label="View"
              showInMenu
            />
          ];
          return actions;
        }
        if (currentUser?.role === UserRole.MUNICIPALITIES) {
          const actions = [
            <GridActionsCellItem
              label={
                <div className="hover:text-blue-500 text-sm"
                  onClick={() => {setSelectedHazard(params.row); setIsViewHazardOpen(true);} }
                >
                  <i className="fa-solid fa-eye mr-2"></i> View
                </div>
              }
              showInMenu
            />,
            <GridActionsCellItem
             label={
                <div className="hover:text-blue-500 text-sm"
                  onClick={() => {Hazards.updateStatus(params.row.pushId, RoadHazards.Status.INVESTIGATING);} }
                >
                  <i className="fa-solid fa-magnifying-glass mr-2"></i> Investigate
                </div>
              }
              showInMenu
            />,
            <GridActionsCellItem
              label={
                <div className="hover:text-blue-500 text-sm"
                  onClick={() => {Hazards.updateStatus(params.row.pushId, RoadHazards.Status.REJECTED);} }
                >
                  <i className="fa-solid fa-thumbs-down mr-2"></i> Reject
                </div>
              }
              showInMenu
            />,
            <GridActionsCellItem
              label={
                <div className="hover:text-blue-500 text-sm"
                  onClick={() => {Hazards.updateStatus(params.row.pushId, RoadHazards.Status.RESOLVED, new Date().toISOString());} }
                >
                  <i className="fa-solid fa-thumbs-up mr-2"></i> Resolve
                </div>
              }
              showInMenu
            />,
            <GridActionsCellItem
              label={
                <div className="hover:text-blue-500 text-sm"
                  onClick={() => {Hazards.updateStatus(params.row.pushId, RoadHazards.Status.NATIONAL);} }
                >
                  <i className="fa-solid fa-share-from-square mr-2"></i> National Highway
                </div>
              }
              showInMenu
            />,
          ];
          return actions;
        }
        return [
          <div>
            <i className="fa-solid fa-ban text-red-500"></i>
          </div>
        ];
      }

    },
  ];

  return (
    <>
      <ViewHazards 
        isOpen={isViewHazardOpen} 
        data={selectedHazard} 
        onClose={() => setIsViewHazardOpen(false)} 
        
      />
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
                    {loading ? <LoadingScreen /> : 
                      <div>
                        <Box sx={{ height: 400, width: '100%' }}>
                          <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection={false} 
                          />
                        </Box>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}