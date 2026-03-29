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
                        <h2 className="mb-4 mx-2 text-center" style={{fontSize: '25px'}}>Your Account was Blocked</h2>
                        <p className="text-center">Sorry! 😖 Your account was blocked by our admins</p>
                        <p className="text-center">For any assistance, you can contact us through this email.</p>
                        <p className="text-center mb-4"><a href="mailTo:streetsafe2025@gmail.com" className='btn btn-link'>streetsafe2025@gmail.com</a></p>
                        <p className="text-center">
                            <a href="#" onClick={handleLogout} className="btn btn-primary">Sign Out</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}