import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import accountSetting from  '../constants/account-setting.json';
import municipalities from '../constants/munacipalities.json';
import { toast } from "react-toastify";
import {signUp} from '../firebase/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    district: "",
    municipality: "",
    barangay: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      // Reset fields when switching roles
      if (name === "role") {
        updatedData = {
          ...updatedData,
          district: value === "Authorities" ? prevData.district : "",
          municipality: value === "Municipalities" ? prevData.municipality : "",
          barangay: value === "Municipalities" ? prevData.barangay : "",
        };
      }
  
      // Reset barangay if municipality changes
      if (name === "municipality") {
        updatedData.barangay = "";
      }
  
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    const { username, email, role, district, barangay, municipality, password, confirmPassword } = formData;

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!role) newErrors.role = "Role is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    if (!username || !email || !role || !password || !confirmPassword || 
        (role === "1" && !district) || 
        (role === "2" && (!municipality))) {
      toast.error("Please fill in all required fields!");
      return;
    } 

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      newErrors.email = "Please enter a valid email address";
      return;
    }

    try {
      const response = await signUp(formData);
      if (response.status === 200) {
          toast.success(response.message);
          navigate("/dashboard");
      } else {
          toast.error(response.message);
      }
    } catch (error) {
      throw error;
      toast.error("Something went wrong. Please try again.");
    }
  }
  
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
        <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
        <h1 className="text-3xl font-bold mb-8">SIGN UP</h1>
        <form className="w-full max-w-sm items-center space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <select name="role" className="w-full p-3 rounded-md text-black" onChange={handleChange} value={formData.role}>
            <option value="">Select Role</option>
            {accountSetting.role.map((role, index) => {
              return (
                <option key={index} value={index}>
                  {role}
                </option>
              )
            })}
          </select>
          {errors.role && <p className="error">{errors.role}</p>}
          {formData.role === "1" && (
            <select name="district" className="w-full p-3 rounded-md text-black" onChange={handleChange} value={formData.district}>
              <option value="">Select District</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  District {i + 1}
                </option>
              ))}
            </select>
          )}
          {formData.role === "2" && (
            <select name="municipality" className="w-full p-3 rounded-md text-black" onChange={handleChange} value={formData.municipality}>
              <option value="">Select Municipality</option>
              {Object.keys(municipalities).map((municipality, index) => (
                <option key={index} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          )}
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" placeholder="Enter password" className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="relative"> 
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="password" name="confirmPassword" placeholder="Confirm password" className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <div className="flex flex-col items-center space-y-4">
            <button type="submit" className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg w-max">
              Sign Up
            </button>
            <a href="/" className="text-white font-bold w-max text-center">
              Sign In
            </a>
          </div>
        </form>
      </div>
      <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
    </div>
  );
};

export default SignUp;