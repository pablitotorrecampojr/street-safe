import { useEffect, useState } from 'react';
import { LoadingScreen } from '@webview';
import { Aside, NavBar, Badge } from '@components';
import { RoadHazardServices } from '@services';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { RoadHazards} from '@enums';
 
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
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => { 
        console.log(params.value);
        console.log(RoadHazards.Style[params.value]);
        return <Badge 
          status={RoadHazards.Style[params.value]} 
          text={params.value} 
        />
      }
     },
    { field: 'resolvedAt', headerName: 'Resolved At', width: 200,
      renderCell: (params) => {
        if (!params.value) return <i>To be determined</i>;
        return new Date(params.value).toLocaleString();
      }
     },
    { field: 'reportedBy', headerName: 'Reported By', width: 200 },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 200,
      getActions: (params) => [
        <GridActionsCellItem
          label={
            <div className="hover:text-blue-500 text-sm">
              <i className="fa-solid fa-eye mr-2"></i>
              View
            </div>
          }
          showInMenu 
        />,
        <GridActionsCellItem
          label={
            <div className="hover:text-blue-500 text-sm">
              <i className="fa-solid fa-lock-open mr-2"></i>
              Unblock
            </div>
          }
          showInMenu
        />,
        <GridActionsCellItem
          label={
            <div className="hover:text-blue-500 text-sm">
              <i className="fa-solid fa-lock mr-2"></i>
              Block
            </div>
          }
          showInMenu
        />,
      ]
    },
  ];

  useEffect(() => {
    if (hazards.length > 0) {
      setLoading(false);
    }

    setRows(
      hazards.map((hazard, index) => ({
        index: index + 1,
        ...hazard,
      }))
    );
  }, [hazards]);  

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
  )
}