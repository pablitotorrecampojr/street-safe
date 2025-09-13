import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AccountSetting from '../constants/account-setting.json';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
      
          if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
      
            if (userSnap.exists()) {
              setUserData(userSnap.data());
            } else {
              const defaultData = {
                email: currentUser.email,
                createdAt: new Date(),
                role: "0",
                fullname: currentUser.displayName || "admin account",
                uid: currentUser.uid,
              };
              await setDoc(userRef, defaultData);
              setUserData(defaultData);
            }
          }
        });
      
        return () => unsubscribe();
      }, []);

    const handleNavbarToggle = () => {
        const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.add("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    };

    const handleToggleUserProfile = () => { 
        const dropdownProfile = document.getElementById('dropdown-profile');
        if (dropdownProfile) {
            dropdownProfile.classList.toggle('show');
        }
    }

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
        <nav
            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
        >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"
                onClick={handleNavbarToggle}
            >
                <a className="nav-item nav-link px-0 me-xl-4" >
                    <i className="bx bx-menu bx-sm" ></i>
                </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
            <div className="navbar-nav align-items-center">
                <h4 className="fw-bold">Street Safe</h4>
            </div>

            <ul className="navbar-nav flex-row align-items-center ms-auto">
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                    <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown" onClick={handleToggleUserProfile}>
                        <div className="avatar avatar-online bg-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px" }}>
                            <span className="fw-bold fs-5 text-white">
                                {userData ? userData.fullname.charAt(0).toUpperCase() : "A"}
                            </span>
                        </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" data-bs-popper="static" id='dropdown-profile'>
                        <li>
                            <a className="dropdown-item" href="#">
                                <div className="d-fle</ul>x">
                                <div className="flex-grow-1">
                                    <span className="fw-semibold d-block">{userData ? userData.fullname : "User" }</span>
                                    <small className="text-muted">
                                        {userData ? AccountSetting.role[userData.role] : "...fetching"}
                                    </small>
                                </div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <div className="dropdown-divider"></div>
                        </li>
                        <li>
                            <a className="dropdown-item" href="/edit-profile">
                                <i className="bx bx-user me-2"></i>
                                <span className="align-middle">My Profile</span>
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" onClick={handleLogout}>
                                <i className="bx bx-power-off me-2"></i>
                                <span className="align-middle">Log Out</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            </div>
        </nav>
    )
}