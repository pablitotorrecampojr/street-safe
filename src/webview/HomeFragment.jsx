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
                                    <div className="col-lg-8 mb-2 order-0">
                                        <div className="card">
                                            <div className="d-flex align-items-end row">
                                                <div className="col-sm-7">
                                                    <div className="card-body">
                                                    <h5 className="card-title text-primary">Welcome back 🎉</h5>
                                                    <p className="mb-4">
                                                        You have reported <span className="fw-bold">{roadHazards.length}</span> road hazards in total. Keep the community safe by reporting any road hazards you encounter.
                                                    </p>

                                                    <a href='#' className="btn btn-sm btn-outline-primary"
                                                        onClick={() => { 
                                                            window.location.href = '/report-hazard?isHomeFramentButton=true';
                                                        }}
                                                    >Report Hazards
                                                    </a>
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
                                <div className="row px-2 py-2">
                                    <div className="col-6 p-1">
                                        <div className="card">
                                            <div className="card-body">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                <span className={`badge rounded-pill bg-label-info mr-4`}>
                                                    <i className='bx bx-time-five'></i>
                                                </span>
                                                </div>
                                                <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                </div>
                                                </div>
                                            </div>
                                            <span className="fw-semibold d-block mb-1">Profit</span>
                                                <h3 className="card-title mb-2">$12,628</h3>
                                                <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 p-1">
                                        <div className="card">
                                            <div className="card-body">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <span className={`badge rounded-pill bg-label-warning mr-4`}>
                                                        <i className='bx bx-loader-circle'></i>
                                                    </span>
                                                </div>
                                                <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                </div>
                                                </div>
                                            </div>
                                            <span className="fw-semibold d-block mb-1">Profit</span>
                                                <h3 className="card-title mb-2">$12,628</h3>
                                                <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 p-1">
                                        <div className="card">
                                            <div className="card-body">
                                            <div className="card-title d-flex align-items-start justify-content-between">
                                                <div className="avatar flex-shrink-0">
                                                    <span className={`badge rounded-pill bg-label-success mr-4`}>
                                                        <i className='bx bx-check-circle'></i>
                                                    </span>
                                                </div>
                                                <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                                </div>
                                                </div>
                                            </div>
                                            <span className="fw-semibold d-block mb-1">Profit</span>
                                                <h3 className="card-title mb-2">$12,628</h3>
                                                <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
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