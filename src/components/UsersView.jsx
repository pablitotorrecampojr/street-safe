import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import * as RegularIcons from "@fortawesome/free-regular-svg-icons";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import accountSetting from "../constants/account-setting.json";

export default function UsersView({ icon = "faUser", color = "primary", role = "0" }) {
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
  
    const selectedIcon =
      SolidIcons[icon] || RegularIcons[icon] || BrandIcons[icon] || RegularIcons.faUser;
  
    const roleName = accountSetting.role[role] || "Unknown Role";

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="card-title d-flex align-items-start justify-content-between">
              <div
                className={`avatar d-flex justify-content-center align-items-center flex-shrink-0 rounded-circle bg-label-${color}`}
                style={{ width: "50px", height: "50px" }}
              >
                <FontAwesomeIcon icon={selectedIcon} className={`text-${color}`} size="lg" />
              </div>
            </div>
            <h1 className="fw-semibold d-block mb-1">{roleName}</h1>
            <h3 className="card-title mb-2">{userData ? Object.keys(userData).length : 0}</h3>
          </div>
        </div>
      </div>
    );
  }