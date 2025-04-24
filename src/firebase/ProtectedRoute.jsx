import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from './firebase';
import Spinners from "../components/Spinners";
import PendingAccount from "../components/PendingAccount";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [checkingUserData, setCheckingUserData] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                }
            }
            setCheckingUserData(false);
        };

        fetchUserData();
    }, [user]);

    if (loading || checkingUserData) return <Spinners />;

    if (user && userData?.accountStatus === 0) {
        return <PendingAccount />;
    }

    return user ? children : <Navigate to="/" replace />;
}