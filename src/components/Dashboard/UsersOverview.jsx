import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { UserRole } from '@enums';

export default function () {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [adminsCounst, setAdminsCount] = useState(0);
    const [authoritiesCount, setAuthoritiesCount] = useState(0);
    const [municipalitiesCount, setMunicipalitiesCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUserData(usersList);
                setLoading(false);
                countByCategory(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const countByCategory = (usersList) => {
            let admins = 0;
            let authorities = 0;
            let municipalities = 0;
            let users = 0;

            usersList.forEach((data) => {
                switch (data?.role) {
                    case UserRole.ADMIN:
                        admins++;
                        break;
                    case UserRole.AUTHORITIES:
                        authorities++;
                        break;
                    case UserRole.MUNICIPALITIES:
                        municipalities++;
                        break;
                    case UserRole.USER:
                        users++;
                        break;
                    default:
                        break;
                }
            });

            setAdminsCount(admins);
            setAuthoritiesCount(authorities);
            setMunicipalitiesCount(municipalities);
            setUsersCount(users);
        };

        fetchUsers();
    }, []); 

    return (
        <div className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
                <h2 className="mb-4 font-semibold text-gray-800">Users Overview</h2>
                <div className="overflow-x-auto">
                    {loading ? 
                        <>
                            <div className="min-w-full flex flex-col justify-center items-center rounded-lg text-sm overflow-hidden">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        </> : 
                        <>
                            <table className="min-w-full border border-gray-300 rounded-lg text-sm overflow-hidden">
                                <tbody className="text-gray-800">
                                <tr className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-1">
                                    <i className="bi bi-person-fill text-green-500"></i>
                                    </td>
                                    <td className="px-4 py-1">Admin</td>
                                    <td className="px-4 py-1 text-center">{ adminsCounst }</td>
                                </tr>
                                <tr className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-1">
                                    <i className="bi bi-person-fill-gear text-orange-500"></i>
                                    </td>
                                    <td className="px-4 py-1">Authorities</td>
                                    <td className="px-4 py-1 text-center">{ authoritiesCount }</td>
                                </tr>
                                <tr className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-1">
                                    <i className="bi bi-people-fill text-blue-500"></i>
                                    </td>
                                    <td className="px-4 py-1">Municipalties</td>
                                    <td className="px-4 py-1 text-center">{ municipalitiesCount }</td>
                                </tr>
                                <tr className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-1">
                                    <i className="bi bi-person-fill-gear text-pink-500"></i>
                                    </td>
                                    <td className="px-4 py-1">Users</td>
                                    <td className="px-4 py-1 text-center">{ usersCount }</td>
                                </tr>
                                </tbody>
                            </table>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}