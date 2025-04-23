import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import accountSetting from  '../constants/account-setting.json';
import municipalities from '../constants/municipalities.json';
import districts from '../constants/districts.json';
import { toast } from "react-toastify";
import {signUp} from '../firebase/auth';
import { set } from "firebase/database";

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
    validIdFront: null,
    validIdBack: null,
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
  
    if (!file) return;
  
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG files are allowed for valid IDs.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Each file must be less than 2MB.");
      return;
    }    
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: reader.result, 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    const { fullname, email, role, district, barangay, municipality, password, confirmPassword } = formData;

    if (!fullname) newErrors.fullname = "First name is required";
    if (!email) newErrors.email = "Email is required";
    // if (!role) newErrors.role = "Role is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    if (!fullname || !email || !password || !confirmPassword || 
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

    if (!formData.validIdFront || !formData.validIdBack) {
      toast.error("Please upload both front and back of your valid ID.");
      return;
    }

    try {
      const response = await signUp(formData);
      if (response.status === 200) {
          toast.success(response.message);
          navigate("/");
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
                  <div className="d-flex justify-content-center align-items-center">
                    <a href="/" className="text-center">
                      <img
                        src="./logo.png"
                        alt="Logo"
                        height={100}
                        width={100}
                        className="rounded-circle mx-auto d-block"
                      />
                    </a>
                  </div>

                    <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label className="form-label">Full name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            name="fullname"
                            placeholder="Full name"
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
                          <option value="">Choose option</option>
                          {accountSetting.role.map((role, index) => {
                           if (index < 3 && index != 0) {
                            return (
                              <option key={index} value={index}>
                                {role}
                              </option>
                            )
                           }
                          })}
                        </select>
                        {errors.role && <p className="error">{errors.role}</p>}
                      </div>

                      {formData.role === "1" && (
                        <div className="mb-3"> 
                          <label className="form-label">Select District</label>
                          <select name="district" className="form-select" onChange={handleChange} value={formData.district}>
                            <option value="">Select District</option>
                            {Object.entries(districts.districts).map(([key, district]) => (
                              <option key={key} value={key}>
                                {district.code} / {district.name}
                              </option>
                            ))}
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

                      <div className="mb-3">
                        <label className="form-label">Valid ID (Front)</label>
                        <input
                          className="form-control"
                          type="file"
                          id="validIdFront"
                          name="validIdFront"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Valid ID (Back)</label>
                        <input
                          className="form-control"
                          type="file"
                          id="validIdBack"
                          name="validIdBack"
                          onChange={handleFileChange}
                        />
                      </div>

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