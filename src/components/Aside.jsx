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

    return (
      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo">
            <a className="app-brand-link">
              <span className="app-brand-text demo menu-text fw-bolder ms-2">Street Safe</span>
            </a>

            <a className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
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

            <li className="menu-item">
            <a className="menu-link menu-toggle">
                <i className="menu-icon tf-icons bx bx-layout"></i>
                <div data-i18n="Layouts">Layouts</div>
            </a>

            <ul className="menu-sub">
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Without menu">Without menu</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Without navbar">Without navbar</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Container">Container</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Fluid">Fluid</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Blank">Blank</div>
                </a>
                </li>
            </ul>
            </li>

            <li className="menu-header small text-uppercase">
            <span className="menu-header-text">Pages</span>
            </li>
            <li className="menu-item">
            <a className="menu-link menu-toggle">
                <i className="menu-icon tf-icons bx bx-dock-top"></i>
                <div data-i18n="Account Settings">Account Settings</div>
            </a>
            <ul className="menu-sub">
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Account">Account</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Notifications">Notifications</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link">
                    <div data-i18n="Connections">Connections</div>
                </a>
                </li>
            </ul>
            </li>
            <li className="menu-item">
            <a className="menu-link menu-toggle">
                <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                <div data-i18n="Authentications">Authentications</div>
            </a>
            <ul className="menu-sub">
                <li className="menu-item">
                <a className="menu-link" target="_blank">
                    <div data-i18n="Basic">Login</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link" target="_blank">
                    <div data-i18n="Basic">Register</div>
                </a>
                </li>
                <li className="menu-item">
                <a className="menu-link" target="_blank">
                    <div data-i18n="Basic">Forgot Password</div>
                </a>
                </li>
            </ul>
            </li>
            <li className="menu-item">
              <a className="menu-link menu-toggle">
                <i className="menu-icon tf-icons bx bx-cube-alt"></i>
                <div data-i18n="Misc">Misc</div>
              </a>
              <ul className="menu-sub">
                  <li className="menu-item">
                  <a className="menu-link">
                      <div data-i18n="Error">Error</div>
                  </a>
                  </li>
                  <li className="menu-item">
                  <a className="menu-link">
                      <div data-i18n="Under Maintenance">Under Maintenance</div>
                  </a>
                  </li>
              </ul>
            </li>
        </ul>
      </aside>
    );
}