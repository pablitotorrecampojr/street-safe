
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {signIn} from '../firebase/auth';
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
    
      // Proceed to dashboard only when status is 200
      navigate("/dashboard");
    
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div>
      <div className="container-xxl">
          <div className="authentication-wrapper authentication-basic container-p-y">
              <div className="authentication-inner">
                <div className="card">
                  <div className="card-body">
                  
                  <div className="d-flex justify-content-center align-items-center mb-4">
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
                  
                  <h4 className="mb-2">Welcome to Street Safe! 👋</h4>
                  <p className="mb-4">Please sign-in to your account</p>

                  <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                          type="text"
                          className="form-control"
                          id="email"
                          name="email-username"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div className="mb-3 form-password-toggle">
                      <div className="d-flex justify-content-between">
                          <label className="form-label" >Password</label>
                      </div>
                      <div className="input-group input-group-merge">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="form-control"
                          name="password"
                          placeholder="Password"
                          aria-describedby="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <span className="input-group-text cursor-pointer" onClick={toggleShowPassword}>
                          <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}></i>
                        </span>
                      </div>
                      {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                   
                    <div className="mb-3">
                      <button className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                    </div>
                  </form>

                  <p className="text-center">
                      <span>New on our platform?</span>
                      <a href="/sign-up">
                        <span> Create an account</span>
                      </a>
                  </p>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SignIn;
