import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RoadHazards, UserRole } from '@enums';
import { useEffect, useState } from 'react';
import { Hazards } from '@services';
import { Hazards as HazardUtils } from '@utils';

export default function HazardsChartOverview() {
    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser ] = useState(JSON.parse(localStorage.getItem("userData")) || null);
    const [listOfFrequency, setListOfFrequency] = useState([]);
    const [listOfTypes, setListOfTypes] = useState(RoadHazards.Types);
    const [listOfTypesColors, setListOfTypesColors] = useState(RoadHazards.hazardColors);

    //TODO: subscribe to realtime db
    useEffect(() => {
        const unsubscribe = Hazards.subscribe((data) => {
            setHazards(data);
        });
        return () => unsubscribe();
    }, []);

    //TODO: filtering out hazard based on account and role
    useEffect(() => {
        if (!hazards || hazards.length === 0) {
            setLoading(true);
            return;
        }
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
                !hazard.isNationalFlag &&
                HazardUtils.findBarangayInMunicipality(
                    hazard.location,
                    currentUser.municipality,
                    currentUser.barangay
                )
            );
        } else {
            filterHazardsByRole = hazards;
        }
        
        const listOfHazards = filterHazardsByRole.map(h => h.description);
        const frequencies = HazardUtils.countFrequencyOnType(listOfHazards, RoadHazards.TypesSnake);
        const positiveIndices = RoadHazards.TypesSnake
            .map((t, idx) => (frequencies.byType[t] > 0 ? idx : -1))
            .filter(idx => idx >= 0);

        const filteredTypes = positiveIndices.map(i => RoadHazards.TypesSnake[i]);
        const filteredCounts = positiveIndices.map(i => frequencies.countsOnly[i]);
        const filteredColors = positiveIndices.map(i => RoadHazards.hazardColors[i]);
        setListOfTypes(filteredTypes);
        setListOfFrequency(filteredCounts);
        setListOfTypesColors(filteredColors);
        setLoading(false);
    }, [hazards, currentUser?.role]);

    //TODO: handle chart js data
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: listOfTypes,
        datasets: [
            {
                label: "Frequency",
                data: listOfFrequency,
                backgroundColor: listOfTypesColors,
                borderColor: listOfTypesColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
            position: "left",
                labels: {
                    usePointStyle: true,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
                <h2 className="font-semibold mb-2">Road Hazards Frequency Overview</h2>
                <div className="p-2">
                    {loading ? 
                        <>
                            <div className="spinner-border text-primary" role="status"></div>
                        </> : 
                        <>
                            <Doughnut data={data} options={options} height={400} />
                        </> 
                    }
                </div>
            </div>
        </div>
    );
}
