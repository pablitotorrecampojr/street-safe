
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {signIn} from '../firebase/auth';
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email, password} = formData;
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please provide all required fields.");
      return;
    } 

    try {
      const response = await signIn(email, password);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      } 
      navigate("/dashboard");

    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      throw error;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
        <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
        <h1 className="text-3xl font-bold mb-8">SIGN IN</h1>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <button type="submit" className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg w-max">
              Sign In
            </button>
            <a href="/sign-up" className="text-white font-bold w-max text-center">
              Sign Up
            </a>
          </div>
        </form>
      </div>

      <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
    </div>
  );
};

export default SignIn;
