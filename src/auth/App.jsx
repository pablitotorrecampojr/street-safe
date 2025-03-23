
import React, { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { auth, db, signInWithEmailAndPassword, doc, getDoc } from '../firebase';


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };







  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      const usersRef = doc(db, "users", username); 
      const userSnap = await getDoc(usersRef);
  
      if (!userSnap.exists()) {
        setErrors({ username: "User not found" });
        return;
      }
  
      const userData = userSnap.data();
      const email = userData.email;
  
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-in successful!");
  
      const { role, district, barangay } = userData;
  
      if (role === "Admin") {
        navigate('/admin_dashboard');
      } else if (role === "Authorities" && district) {
        // navigate(`/district${district}-dashboard`);
         navigate(`/dashboard`);
      } else if (role === "Barangay" && barangay) {
        navigate(`/barangay-dashboard`);
      } else {
        setErrors({ role: "Invalid role" });
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrors({ firebase: error.message });
    }
  };
 

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
        <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
        <h1 className="text-3xl font-bold mb-8">SIGN IN</h1>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {errors.firebase && <p className="text-red-500 text-sm">{errors.firebase}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

      <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
    </div>
  );
};

export default SignIn;
