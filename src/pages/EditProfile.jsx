import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import Aside from "../components/Aside";
import Navbar from "../components/NavBar";

export default function EditProfile() {
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            setName(auth.currentUser.displayName || "");
        }
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateProfile(auth.currentUser, { displayName: name });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please enter both current and new password.");
            return;
        }
        
        setLoading(true);
        try {
            // Re-authenticate user before updating the password
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Update password after successful re-authentication
            await updatePassword(auth.currentUser, newPassword);
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            toast.error("Error updating password: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNavbarToggle = () => { 
        const htmlElement = document.getElementById("main-html");
        if (htmlElement) {
            htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
        }
    }

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Aside />
                <div className="layout-page">
                    <Navbar />
                    <div className='content-wrapper'>
                        <div className='container-xxl flex-grow-1 container-p-y'>
                            <div className="row justify-content-center">
                                <div className="col-lg-8 col-md-8 col-12">
                                    <div className="card mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">My Profile</h5>
                                            <small className="text-muted float-end">Manage your profile</small>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleUpdateProfile}>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="fullname">Full Name</label>
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text"><i className="bx bx-user" /></span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="fullname"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3" disabled>
                                                    <label className="form-label" htmlFor="fullname">Email (Cannot be changed)</label>
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text"><i className="bx bx-user" /></span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="fullname"
                                                            value={auth.currentUser?.email || ""}
                                                            placeholder="John Doe"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary" disabled={loading}>Update Profile</button>
                                            </form>
                                            
                                            <hr className="mb-4 mt-4" />
                                            
                                            <form onSubmit={handleChangePassword}>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="current-password">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="current-password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="new-password">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="new-password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-danger" disabled={loading}>Change Password</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
        </div>
    );
}