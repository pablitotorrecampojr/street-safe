import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { signOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
           setUser(currentUser);
        });
        return () => unsubscribe;
    }, []);
    const handleLogout = async () => {
        const response = await signOut();
        if (response.status === 200) {
            toast.success(response.message);
            navigate("/"); // Redirect to login page
        } else {
            toast.error(response.message);
        }
    };
    return (
        <div className="flex items-center py-2 px-10 bg-white shadow-md rounded-lg m-1">
            <img src="/bg.png" alt="Profile" className="w-20 h-20 rounded-full border-2 border-gray-300" />
            <div className="ml-6">
            <h2 className="text-10 font-bold text-gray-800">Auth Sean Kyle Ceniza</h2>
            <p className=" text-10 text-gray-600 mb-4">cenizaseankyle0@gmail.com</p>
            <div className="flex space-x-4">
                <button className="bg-green-500 text-white px-6 py-1 rounded-full text-sm font-medium hover:bg-green-600">
                Edit Profile
                </button>
                <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600"
                >
                Logout
                </button>
            </div>
            </div>
        </div>
    )
}