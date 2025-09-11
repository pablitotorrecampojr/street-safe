import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@enums";
import { Letters } from "@utils";
import { LoadingScreen } from "@webview";
export default function SignUp() {

  const [selectedRole, setSelectedRole] = useState(UserRole.AUTHORITIES);
  const [loading, setLoading] = useState(true);
  const handleRoleChange = (role) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
    setSelectedRole(role);
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
        <h3 className="font-bold text-gray-800 mb-6">
          Create Account
        </h3>
        <div className="space-y-4">
          <div className="w-full flex justify-start space-x-2">
            <button className={`px-3 py-1 ${selectedRole === UserRole.AUTHORITIES ? "bg-indigo-600" : "bg-gray-200"} text-white rounded-lg hover:bg-indigo-700 transition`} 
              onClick={() => handleRoleChange(UserRole.AUTHORITIES)}>
              {Letters.CapitalizeFirstLetter(UserRole.AUTHORITIES)}
            </button>
            <button className={`px-3 py-1 ${selectedRole === UserRole.MUNICIPALITIES ? "bg-indigo-600" : "bg-gray-200"} text-white rounded-lg hover:bg-indigo-700 transition`} 
              onClick={() => handleRoleChange(UserRole.MUNICIPALITIES)}>
              {Letters.CapitalizeFirstLetter(UserRole.MUNICIPALITIES)}
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full p-2 space-y-4"
          >
            {selectedRole === UserRole.AUTHORITIES && (
              loading ? <LoadingScreen /> : (
                <div className="w-full grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Valid ID (Front)</label>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                          className="form-control flex-grow border-0"
                          type="file"
                          id="validIdFront"
                          name="validIdFront"
                        />
                        <button
                          type="button"
                          className="px-3 text-gray-600 hover:text-blue-600"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Valid ID (Back)</label>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                          className="form-control flex-grow border-0"
                          type="file"
                          id="validIdBack"
                          name="validIdBack"
                        />
                        <button
                          type="button"
                          className="px-3 text-gray-600 hover:text-blue-600"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            {selectedRole === UserRole.MUNICIPALITIES && (
              loading ? <LoadingScreen /> : (
                <div className="w-full grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Valid ID (Front)</label>

                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                          className="form-control flex-grow border-0"
                          type="file"
                          id="validIdFront"
                          name="validIdFront"
                        />
                        <button
                          type="button"
                          className="px-3 text-gray-600 hover:text-blue-600"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Valid ID (Front)</label>

                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                          className="form-control flex-grow border-0"
                          type="file"
                          id="validIdFront"
                          name="validIdFront"
                        />
                        <button
                          type="button"
                          className="px-3 text-gray-600 hover:text-blue-600"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </form>
          <div className="w-full flex justify-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
