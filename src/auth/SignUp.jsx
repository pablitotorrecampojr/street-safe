import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import accountSetting from  '../constants/account-setting.json';
import municipalities from '../constants/municipalities.json';
import districts from '../constants/districts.json';
import { toast } from "react-toastify";
import {signUp} from '../firebase/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
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
    const { fullname, email, role, district, barangay, municipality, password, confirmPassword } = formData;

    if (!fullname) newErrors.fullname = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    if (!role) newErrors.role = "Role is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    if (!fullname || !email || !role || !password || !confirmPassword || 
      (role === "1" && !district) || 
      (role === "2" && (!municipality || !barangay))) {
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

    try {git
      const response = await signUp(formData);
      if (response.status === 200) {
          toast.success(response.message);
          navigate("/dashboard");
      } else {
          toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      throw error;
    }
  }
  
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
              <div className="card">
                <div className="card-body">
                    <div className="app-brand justify-content-center">
                    <a href="/" className="app-brand-link gap-2">
                        <span className="app-brand-text demo text-body fw-bolder">Street Safe</span>
                    </a>
                    </div>
                    <h4 className="mb-2">Adventure starts here 🚀</h4>

                    <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label className="form-label">Full name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullname"
                            name="fullname"
                            placeholder="Enter your full name"
                            value={formData.fullname}
                            onChange={handleChange}
                          />
                          {errors.fullname && <p className="error">{errors.fullname}</p>}
                      </div>
                      <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="email" 
                            name="email" 
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && <p className="error">{errors.email}</p>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Select Role</label>
                        <select 
                          className="form-select" 
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                        > 
                          {accountSetting.role.map((role, index) => {
                            return (
                              <option key={index} value={index}>
                                {role}
                              </option>
                            )
                          })}
                        </select>
                        {errors.role && <p className="error">{errors.role}</p>}
                      </div>

                      {formData.role === "1" && (
                        <div className="mb-3"> 
                          <label className="form-label">Select District</label>
                          <select name="district" className="form-select" onChange={handleChange} value={formData.district}>
                            <option value="">Select District</option>
                            {districts.disctricts.map((district, index) => (
                              <option key={index} value={index}>
                                {district.code} / {district.name}
                              </option>
                            ))};
                          </select>
                        </div>
                      )}
                      {formData.role === "2" && (
                        <div className="mb-3"> 
                          <label className="form-label">Select Municipality</label>
                          <select name="municipality" className="form-select" onChange={handleChange} value={formData.municipality}>
                            <option value="">Select Municipality</option>
                            {Object.keys(municipalities).map((municipality, index) => (
                              <option key={index} value={municipality}>
                                {municipality}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {formData.municipality && (
                        <div className="mb-3"> 
                          <label className="form-label">Select Barangay</label>
                          <select name="barangay" className="form-control" onChange={handleChange} value={formData.barangay}>
                            <option value="">Select Barangay</option>
                            {municipalities[formData.municipality].map((barangay, index) => (
                              <option key={index} value={barangay}>
                                {barangay}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="mb-3 form-password-toggle">
                          <label className="form-label">Password</label>
                          <div className="input-group input-group-merge">
                          <input
                              type="password"
                              id="password"
                              className="form-control"
                              name="password"
                              placeholder="Password"
                              aria-describedby="password"
                              value={formData.password}
                              onChange={handleChange}
                          />
                          </div>
                          {errors.password && <p className="error">{errors.password}</p>}
                      </div>
                      <div className="mb-3 form-password-toggle">
                          <label className="form-label">Confirm Password</label>
                          <div className="input-group input-group-merge">
                          <input
                              type="password"
                              id="confirmPassword"
                              className="form-control"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              aria-describedby="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                          />
                          </div>
                          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                      </div>
                      <button className="btn btn-primary d-grid w-100" type="submit">Sign up</button>
                    </form>

                    <p className="text-center">
                    <span>Already have an account?</span>
                    <a href="/">
                        <span> Sign in instead</span>
                    </a>
                    </p>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SignUp;