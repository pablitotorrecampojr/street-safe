import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Aside() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Hazard Report', path: '/hazard-report' },
        { name: 'Notification', path: '/notification' },
    ];

    const handleNavbarToggle = () => { 
      const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    }

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
            <li className="menu-item active">
              <a className="menu-link">
                  <i className="menu-icon tf-icons bx bx-home-circle"></i>
                  <div data-i18n="Analytics">Dashboard</div>
              </a>
            </li>
            <li className="menu-header small text-uppercase">
              <span className="menu-header-text">Pages</span>
            </li>
            <li className="menu-item">
              <a className="menu-link">
                  <i className="menu-icon tf-icons bx bx-layout"></i>
                  <div data-i18n="Layouts">Layouts</div>
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link">
                  <i className="menu-icon tf-icons bx bx-dock-top"></i>
                  <div data-i18n="Account Settings">Account Settings</div>
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link">
                  <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                  <div data-i18n="Authentications">Authentications</div>
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link ">
                <i className="menu-icon tf-icons bx bx-cube-alt"></i>
                <div data-i18n="Misc">Misc</div>
              </a>
            </li>
        </ul>
      </aside>
    );
}