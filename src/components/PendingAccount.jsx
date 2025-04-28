import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function PendingAccount () {
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
       <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div className="demo-inline-spacing">
                <div className="container-xxl container-p-y">
                    <div className="misc-wrapper">
                        <h2 className="mb-4 mx-2 text-center" style={{fontSize: '25px'}}>Your Account is Pending</h2>
                        <p className="text-center">Oops! 😖 Your account is currently pending for review by our admins.</p>
                        <p className="text-center mb-4">It should not take more thant 3 to 5 business days.</p>
                        <p className="text-center">
                            <a href="#" onClick={handleLogout} className="btn btn-primary">Sign Out</a>
                        </p>
                    </div>
                </div>
            </div>
    </div>
    )
}