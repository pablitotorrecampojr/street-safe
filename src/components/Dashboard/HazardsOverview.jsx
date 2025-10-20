import { useEffect, useState } from "react";
import { Hazards } from '@services';
import { RoadHazards } from '@enums';

export default function HazardsOverview() {
    const [pendingCount, setPendingCount] = useState(0);
    const [investigatingCount, setInvestigatingCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hazards, setHazards] = useState([])

    useEffect(() => {
        const unsubscribe = Hazards.subscribe((data) => {
            setHazards(data);
            countByStatus(data);
        });
        const countByStatus = (hazardList) => {
            setPendingCount(hazardList.filter(hazard => hazard.status == RoadHazards.Status.PENDING).length);
            setInvestigatingCount(hazardList.filter(hazard => hazard.status == RoadHazards.Status.INVESTIGATING).length)
            setResolvedCount(hazardList.filter(hazard => hazard.status == RoadHazards.Status.RESOLVED).length)
            setRejectedCount(hazardList.filter(hazard => hazard.status == RoadHazards.Status.REJECTED).length)
            setLoading(false);
        };
        return () => unsubscribe && unsubscribe();
    }, []);
    return (
        <div className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
                <h2 className="mb-4 font-semibold">Hazards Overview</h2>
                <div className="overflow-x-auto">
                    <div className="min-w-full flex flex-col justify-center items-center rounded-lg text-sm overflow-hidden">
                        {loading ? 
                            <>
                                <div className="spinner-border text-primary" role="status"></div>
                            </> : 
                            <>
                                <table className="min-w-full border border-gray-300 rounded-lg text-sm overflow-hidden">
                                    <tbody className="text-gray-800">
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-1">
                                            <i className="fa-solid fa-hourglass-half text-blue-500"></i>
                                            </td>
                                            <td className="px-4 py-1">Pending</td>
                                            <td className="px-4 py-1 text-center">{ pendingCount }</td>
                                        </tr>
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-1">
                                            <i className="fa-solid fa-magnifying-glass text-orange-500"></i>
                                            </td>
                                            <td className="px-4 py-1">Investigating</td>
                                            <td className="px-4 py-1 text-center">{ investigatingCount }</td>
                                        </tr>
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-1">
                                            <i className="fa-solid fa-thumbs-up text-green-500"></i>
                                            </td>
                                            <td className="px-4 py-1">Resolved</td>
                                            <td className="px-4 py-1 text-center">{ resolvedCount }</td>
                                        </tr>
                                        <tr className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-1">
                                            <i className="fa-solid fa-thumbs-down text-red-500"></i>
                                            </td>
                                            <td className="px-4 py-1">Rejected</td>
                                            <td className="px-4 py-1 text-center">{ rejectedCount }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}