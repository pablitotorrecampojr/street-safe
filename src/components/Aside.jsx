import React, {useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Aside() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Hazard Report', path: '/hazard-report' },
      { name: 'Notification', path: '/notification' },
    ];

    const navIcons = {
      'Dashboard': 'bx bx-home-circle',
      'Hazard Report': 'bx bx-error-circle',
      'Notification': 'bx bx-bell',
    }

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
              <span className="app-brand-text demo menu-text fw-bolder ms-2">Street Safe</span>
            </a>

            <a className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none" onClick={handleNavbarToggle}>
              <i className="bx bx-chevron-left bx-sm align-middle"></i>
            </a>
        </div>
        <div className="menu-inner-shadow"></div>
        <ul className="menu-inner py-1">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <a className="menu-link" onClick={() => navigate(item.path)}>
                <i className={`menu-icon tf-icons ${navIcons[item.name]}`}></i>
                <div data-i18n="Analytics">{item.name}</div>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    );
}