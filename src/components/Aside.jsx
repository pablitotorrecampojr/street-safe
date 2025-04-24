import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

export default function Aside() {
    const navigate = useNavigate();
    const location = useLocation();
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
            console.log("No user document found!");
          }
        }
      });
  
      return () => unsubscribe();
    }, []);

    const navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: 'bx bx-home-circle', permissions: [0, 1, 2] },
      { name: 'Access Control', path: '/access-control', icon: 'bx bx-cog', permissions: [0] },
      { name: 'Hazard Report', path: '/hazard-report', icon: 'bx bx-error-circle', permissions: [0, 1, 2] },
      { name: 'Pending Accounts', path: '/pending-accounts', icon: 'bx bx-hourglass', permissions: [0] },
    ];

    const handleNavbarToggle = () => { 
      const htmlElement = document.getElementById("main-html");
      if (htmlElement) {
          htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
      }
    }

    useEffect(() => {
      handleNavbarToggle();
    }, [location])

    return (
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
            <a className="app-brand-link">
              <div className="d-flex justify-content-center align-items-center p-1">
                <img
                    src="./logo.png"
                    alt="Logo"
                    height={80}
                    width={80}
                    className="rounded-circle mx-auto d-block"
                  />
              </div>
              <span className="app-brand-text demo menu-text ms-2"><strong>Street Safe</strong></span>
            </a>

            <a className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none" onClick={handleNavbarToggle}>
              <i className="bx bx-chevron-left bx-sm align-middle"></i>
            </a>
        </div>
        <div className="menu-inner-shadow"></div>
        <ul className="menu-inner py-1">
          {navItems.map((item, index) => {
            if (item.permissions.includes(Number(userData?.role))) {
              return (
                <li
                  key={index}
                  className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  <a className="menu-link" onClick={() => navigate(item.path)}>
                    <i className={`menu-icon tf-icons ${item.icon}`}></i>
                    <div data-i18n="Analytics">{item.name}</div>
                  </a>
                </li>
              )
              
            }
          })}
        </ul>
      </aside>
    );
}