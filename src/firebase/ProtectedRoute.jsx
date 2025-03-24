import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from './firebase';
import Spinners from "../components/Spinners";

export default function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) 
        return 
        <Spinners />
    ;

    return user ? children : <Navigate to="/" replace />;
}