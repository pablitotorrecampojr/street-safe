import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Hazard Report', path: '/hazard-report' },
        { name: 'Notification', path: '/notification' },
    ];

    return (
        <nav className="flex border-b text-center shadow-md">
            {navItems.map((item) => (
                <div
                    key={item.path}
                    className={`w-1/3 py-4 cursor-pointer font-bold ${
                        location.pathname === item.path ? 'bg-purple-500 text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => navigate(item.path)}
                >
                    {item.name}
                </div>
            ))}
        </nav>
    );
}