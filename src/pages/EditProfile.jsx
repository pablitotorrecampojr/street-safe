import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

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

    return (
        <div className="min-h-screen w-full font-sans bg-gray-50">
            <NavBar />
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Profile</h1>

                {/* Update Profile Form */}
                <form onSubmit={handleUpdateProfile} className="mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Full Name</label>
                        <input
                            type="text"
                            className="border w-full p-2 rounded-lg mt-1"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Email (Cannot be changed)</label>
                        <input
                            type="email"
                            className="border w-full p-2 rounded-lg mt-1 bg-gray-200 cursor-not-allowed"
                            value={auth.currentUser?.email || ""}
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 mt-4 text-white font-semibold rounded-lg transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>

                {/* Update Password Form */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">Current Password</label>
                        <input
                            type="password"
                            className="border w-full p-2 rounded-lg mt-1"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium">New Password</label>
                        <input
                            type="password"
                            className="border w-full p-2 rounded-lg mt-1"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 mt-4 text-white font-semibold rounded-lg transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}