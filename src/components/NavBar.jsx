import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {signOut} from '../firebase/auth';

export default function NavBar() {
    const navigate = useNavigate();
    return (
        <div>
            <nav className="flex border-b text-center shadow-md">
                <div 
                    className="w-1/3 bg-purple-500 text-white font-bold py-4"
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard
                </div>
                <div
                    className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/hazard-report')}
                >
                    Hazard Report
                </div>
                <div
                    className="w-1/3 py-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/notification')}
                >
                    Notification
                </div>
            </nav>
        </div>
    )
}