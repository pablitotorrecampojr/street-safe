import React, { useEffect, useRef, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Aside from "../components/Aside";
import Navbar from "../components/NavBar";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import accountSetting from "../constants/account-setting.json";
import districtLists from "../constants/districts.json";

const AccessControl = () => {
  const tableRef = useRef(null);
  const [userData, setUserData] = useState([]);

  const handleNavbarToggle = () => {
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
      htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  };

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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (userData.length > 0 && tableRef.current) {
      const table = $(tableRef.current).DataTable();
      return () => {
        table.destroy(); // Destroy previous instance before reinitializing
      };
    }
  }, [userData]);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Aside />
        <div className="layout-page">
          <Navbar />

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-3 mb-4">
                  <h1 style={{ fontSize: "20px" }} className="fw-bold">
                    Access Control
                  </h1>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <table ref={tableRef} className="display">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Barangay</th>
                        <th>District</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                     {userData && userData.map((user, index) => {
                        return (
                          <tr key={index}>
                            <td>{(index) + 1}</td>
                            <td className="text-nowrap">{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{accountSetting.role[user.role]}</td>
                            <td>{user.barangay ? user.role : "N/A"}</td>
                            <td>{user.district ? districtLists.districts[user.district].code +", "+districtLists.districts[user.district].name : "N/A"}</td>
                            <td>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                          </tr>
                        )
                     })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

export default AccessControl;