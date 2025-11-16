import { useEffect, useState } from 'react';
import { LoadingScreen } from '@webview';
import { Aside, NavBar, Badge, ViewHazards } from '@components';
import { Hazards } from '@services';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { RoadHazards, UserRole  } from '@enums';
import { Letters, Hazards as HazardUtils } from '@utils';
import { set } from 'firebase/database';
 
export default function HazardReport() {
  const [loading, setLoading] = useState(true);

  //TODO: fetching roadzards
  const [hazards, setHazards] = useState([]);
  const [allHazards, setAllHazards] = useState([]);
  useEffect(() => {
    const unsubscribe = Hazards.subscribe((data) => {
      setHazards(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //TODO: filter hazard based on role and national flag
  const [currentUser, setCurrentUser] = useState(null);
  const [hazardFrequencies, setHazardFrequencies] = useState(null);
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userData")) || null);
    let filterHazardsByRole = [];
    if (currentUser?.role === UserRole.AUTHORITIES) {
      filterHazardsByRole = hazards
        .filter((hazard) => 
          hazard.isNationalFlag &&
          HazardUtils.findDistrict(
            hazard.location,
            currentUser?.district
          )
        );
    } else if (currentUser?.role === UserRole.MUNICIPALITIES) {
      filterHazardsByRole = hazards
        .filter((hazard) => 
          HazardUtils.findBarangayInMunicipality(
            hazard.location,
            currentUser.municipality,
            currentUser.barangay
          )
        );
    } else {
      filterHazardsByRole = hazards;
    }
    const mapped = filterHazardsByRole.map((hazard, index) => ({
      index: index + 1,
      id: hazard.id,
      ...hazard,
    }));

    setHazardFrequencies(HazardUtils.countFrequencyOnType(
      mapped.map(h => h.description),
      RoadHazards.Types
    ).byType);

    setRows(mapped);
    setAllHazards(mapped);
  }, [hazards]);  

  //TODO: handleing viewing road hazards
  const [selectedHazard, setSelectedHazard] = useState({}); 
  const [isViewHazardOpen, setIsViewHazardOpen] = useState(false);

  //TODO: handling displaying road hazards
  const [rows, setRows] = useState([]);
  const columns = [
    { field: 'index', headerName: '#', width: 30 },
    { field: 'latitude', headerName: 'Latitude', width: 130 },
    { field: 'longitude', headerName: 'Longitude', width: 130 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'frequency', headerName: 'Frequency', width: 300 , 
      renderCell: (params) => {
        console.log(hazardFrequencies);
        const desc = params.row.description?.toLowerCase() || '';
        const matchedTypes = Object.entries(hazardFrequencies)
          .filter(([type]) => {
            return (
              desc.includes(type.toLowerCase()) ||
              desc.includes(type.toLowerCase().slice(0, -1))
            )
          })
        
        if (matchedTypes.length === 0) return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">None</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {matchedTypes.map(([type, count]) => (
              <span key={type} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                {type}: {count}
              </span>
            ))}
          </div>
        );
      }
    },
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
    { field: 'reportedAt', headerName: 'Reported At', width: 200,
      renderCell: (params) => {
        return new Date(params.value).toLocaleString();
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
        if (currentUser?.role === UserRole.ADMIN) { //TODO: admin can only view
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
            />
          ];
          return actions;
        }
        if (currentUser?.role === UserRole.MUNICIPALITIES) { //TODO: municipalities can view and update status
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
            />
          ];
          if (params.row.isNationalFlag == true && params.row.status === RoadHazards.Status.PENDING) {
            actions.push(
              <GridActionsCellItem
                label={
                  <div className="hover:text-blue-500 text-sm"
                    onClick={() => {
                      Hazards.updateStatus(params.row.pushId, RoadHazards.Status.PENDING, null, true);
                    }}
                  >
                    <i className="fa-solid fa-hourglass-half mr-2"></i> PENDING
                  </div>
                }
                showInMenu
              />,
            );
          }
          if (!params.row.isNationalFlag) {
            actions.push(
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
            );
          }
          if (params.row.status === RoadHazards.Status.PENDING || params.row.status === RoadHazards.Status.INVESTIGATING) {
            actions.push(
              <GridActionsCellItem
                label={
                  <div className="hover:text-blue-500 text-sm"
                    onClick={() => {Hazards.updateStatus(params.row.pushId, RoadHazards.Status.NATIONAL);} }
                  >
                    <i className="fa-solid fa-share-from-square mr-2"></i> National Highway
                  </div>
                }
                showInMenu
              />
            )
          }
          return actions;
        }
        if (currentUser?.role === UserRole.AUTHORITIES) { //TODO: authorities can only view national hazards
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
                  onClick={() => {
                    Hazards.updateStatus(params.row.pushId, RoadHazards.Status.PENDING, null, true);
                  }}
                >
                  <i className="fa-solid fa-hourglass-half mr-2"></i> PENDING
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
            />
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


  //TODO: handling filtering road hazards
  const [statusOpen, setStatusOpen] = useState(false);
  const [filter, setFilter] = useState({ status: null });
  const [isOpen, setIsOpen] = useState(false);
  const [isNational, setIsNational] = useState(null);
  const handleFilter = (status) => {
    setStatusOpen(false);
    setFilter({ status: status });
    setRows(allHazards.filter((hazard) => hazard.status === status));
  };
  const handleIsNational = (isNational) => {
    setIsOpen(false);
    setRows(allHazards.filter((hazard) => hazard.isNationalFlag === isNational));
    setFilter({ status: null })
  }
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

                <div className='w-full flex flex-col justify-end p-2'>
                  <div className='flex justify-end gap-2'>
                    <div className="relative">
                      <button className="btn btn-info btn-sm"
                       onClick={() => {
                          setRows(allHazards); 
                          setFilter({status: null});
                          
                        } }
                      >
                        <i className="fa-solid fa-rotate-left"></i>
                      </button>
                    </div>
                    <div className="relative">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setStatusOpen(!statusOpen);
                        }}
                      >
                        {filter.status ? Letters.CapitalizeFirstLetter(filter.status) : "Filter Status"}
                      </button>
                      {statusOpen && (
                        <div className="absolute right-0  mt-2 w-40 bg-white border rounded shadow-lg z-10">
                          <button className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => {
                              handleFilter(RoadHazards.Status.PENDING);
                            }}
                          >{Letters.CapitalizeFirstLetter(RoadHazards.Status.PENDING)}
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => {
                              handleFilter(RoadHazards.Status.INVESTIGATING);
                            }}
                          >{Letters.CapitalizeFirstLetter(RoadHazards.Status.INVESTIGATING)}
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => {
                              handleFilter(RoadHazards.Status.RESOLVED);
                            }}
                          >{Letters.CapitalizeFirstLetter(RoadHazards.Status.RESOLVED)}
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-blue-100"
                            onClick={() => {
                              handleFilter(RoadHazards.Status.REJECTED);
                            }}
                          >{Letters.CapitalizeFirstLetter(RoadHazards.Status.REJECTED)}
                          </button>
                        </div>
                      )}
                    </div>
                    {currentUser?.role === UserRole.MUNICIPALITIES && (
                      <>
                         <div className="relative">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            {isNational === null ? "Is National?" : isNational ? "Yes" : "No"}
                          </button>

                          {isOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-blue-100"
                                onClick={() => handleIsNational(true)}
                              >
                                Yes
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-blue-100"
                                onClick={() => handleIsNational(false)}
                              >
                                No
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className='card'>
                  <div className='card-body'>
                    {loading ? <LoadingScreen /> : 
                      <div>
                        <Box sx={{  height: '80vh', width: '100%' }}>
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