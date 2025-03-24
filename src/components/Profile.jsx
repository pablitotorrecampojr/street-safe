import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import NavBar from '../components/NavBar';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Current User:", currentUser);
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Successfully logged out");
            navigate("/"); 
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center py-2 px-10 bg-white shadow-md rounded-lg m-1">
            <img src="/bg.png" alt="Profile" className="w-20 h-20 rounded-full border-2 border-gray-300" />
            <div className="ml-6">
                {user ? (
                    <>
                        <h2 className="text-lg font-bold text-gray-800">{user.displayName || "User"}</h2>
                        <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                    </>
                ) : (
                    <p className="text-gray-500">Loading user info...</p>
                )}
                <div className="flex space-x-4">
                    <a className="bg-green-500 text-white px-6 py-1 rounded-full text-sm font-medium hover:bg-green-600"
                        href="/edit-profile"
                    >
                        Edit Profile
                    </a>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}