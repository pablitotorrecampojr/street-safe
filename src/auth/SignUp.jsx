import { useState, useEffect } from "react";
import { UserRole } from "@enums";
import { Letters } from "@utils";
import { LoadingScreen } from "@webview";
import districtSortedJson from "../constants/districts-sorted.json"
import districtJson from "../constants/districts.json"
import municipalitiesJson from "../constants/municipalities.json"
import { ViewLists, ViewImage } from "@components";
import { UserValidations } from "@services";
import { toast } from "react-toastify";
import { signUp } from '../firebase/auth';
import { Images } from "@utils";

export default function SignUp() {

  const [selectedRole, setSelectedRole] = useState(UserRole.AUTHORITIES);
  const [loading, setLoading] = useState(true);
  const handleRoleChange = (role) => {
    formData.role = role;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
    setSelectedRole(role);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: selectedRole,
    validIDFront: "",
    validIDBack: "",
    municipality: "",
    district: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = UserValidations.validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please provide all required fields.");
      setErrors(validationErrors);
    } else {
      setIsProcessing(true);
      setFormData({
        ...formData,
        validIDFront: formData.validIDFront ? Images.fileToDataUrl(formData.validIDFront) : "",
        validIDBack: formData.validIDBack ? Images.fileToDataUrl(formData.validIDBack) : "",
      })
      console.log("Form Data Submitted:", Images.fileToDataUrl(formData.validIDFront), Images.fileToDataUrl(formData.validIDFront));
      const response = signUp(formData);
      console.log("Sign up response:", response);
      if (response.status === 200) {
        toast.success("Sign up successful!");
      } else {
        toast.error("Sign up failed.");
      }
      setIsProcessing(false);
    }
  };

  const [openBarangays, setOpenBarangays] = useState(false);
  const [viewImage, setViewImage] = useState({ isOpen: false, imageUrl: "" });
  return (
    <>
      {openBarangays && (
        <ViewLists
          isOpen={openBarangays}
          onClose={() => setOpenBarangays(false)}
          list={municipalitiesJson[formData.municipality] || []}
          header="List of Barangays"
        />
      )}

      <ViewImage
        isOpen={viewImage.isOpen}
        imageSource={viewImage.imageUrl}
        onClose={() => setViewImage({ isOpen: false, imageUrl: "" })}
      />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
          <h3 className="font-bold text-gray-800 mb-6">
            Create Account
          </h3>
          <div className="space-y-4">
            <div className="w-full flex justify-start space-x-2">
              <button 
                className={`px-3 py-1 rounded-lg transition ${
                  selectedRole === UserRole.AUTHORITIES
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-black hover:bg-gray-300 hover:text-black"
                }`}
                onClick={() => handleRoleChange(UserRole.AUTHORITIES)}>
                {Letters.CapitalizeFirstLetter(UserRole.AUTHORITIES)}
              </button>
              <button 
                className={`px-3 py-1 rounded-lg transition ${
                  selectedRole === UserRole.MUNICIPALITIES
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-black hover:bg-gray-300 hover:text-black"
                }`}
                onClick={() => handleRoleChange(UserRole.MUNICIPALITIES)}>
                {Letters.CapitalizeFirstLetter(UserRole.MUNICIPALITIES)}
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full p-2 space-y-4"
            >
              <div className="w-full grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      value={formData.fullname}
                      onChange={handleChange}
                      className={`form-control border rounded px-3 py-2 ${
                        errors.fullname ? "input-error" : "border-gray-300"
                      }`}
                    />
                    {errors.fullname && (
                      <span className="text-xs text-red-500 mt-1">{errors.fullname}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control border rounded px-3 py-2 ${
                        errors.email ? "input-error" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500 mt-1">{errors.email}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control border rounded px-3 py-2 ${
                        errors.password ? "input-error" : "border-gray-300"
                      }`}
                    />
                    {errors.password && (
                      <span className="text-xs text-red-500 mt-1">{errors.password}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control border rounded px-3 py-2 ${
                        errors.confirmPassword ? "input-error" : "border-gray-300"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <span className="text-xs text-red-500 mt-1">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Valid ID (Front)</label>
                    <div
                      className={`flex items-center border rounded-lg overflow-hidden ${
                        errors.validIDFront ? "input-error" : ""
                      }`}
                    >
                      <input
                        className="form-control flex-grow border-0"
                        type="file"
                        id="validIDFront"
                        name="validIDFront"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="px-3 text-gray-600 hover:text-blue-600"
                        onClick={() =>
                          setViewImage({ isOpen: true, imageUrl: formData.validIDFront })
                        }
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                    {errors.validIDFront && (
                      <span className="text-xs text-red-500 mt-1">{errors.validIDFront}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Valid ID (Back)</label>
                    <div
                      className={`flex items-center border rounded-lg overflow-hidden ${
                        errors.validIDBack ? "input-error" : ""
                      }`}
                    >
                      <input
                        className="form-control flex-grow border-0"
                        type="file"
                        id="validIDBack"
                        name="validIDBack"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="px-3 text-gray-600 hover:text-blue-600"
                        onClick={() =>
                          setViewImage({ isOpen: true, imageUrl: formData.validIDBack })
                        }
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                    {errors.validIDBack && (
                      <span className="text-xs text-red-500 mt-1">{errors.validIDBack}</span>
                    )}
                  </div>

                  {selectedRole === UserRole.AUTHORITIES &&
                    (loading ? (
                      <LoadingScreen />
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">District</label>
                          <div
                            className={`flex items-center border rounded-lg overflow-hidden ${
                              errors.district ? "input-error" : ""
                            }`}
                          >
                            <select
                              className="form-control"
                              name="district"
                              id="district"
                              value={formData.district}
                              onChange={handleChange}
                            >
                              <option value="">Select a district</option>
                              {Object.keys(districtSortedJson).map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.district && (
                            <span className="text-xs text-red-500 mt-1">
                              {errors.district}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">Selected District</label>
                          <div className="form-control bg-gray-100 border-0">
                            {formData.district ? (
                              <>
                                {
                                  districtJson.find(
                                    (d) => d.district === formData.district
                                  )?.name
                                }
                                ,{" "}
                                {
                                  districtJson.find(
                                    (d) => d.district === formData.district
                                  )?.code
                                }
                              </>
                            ) : (
                              "No district selected."
                            )}
                          </div>
                        </div>
                      </>
                    ))}

                  {selectedRole === UserRole.MUNICIPALITIES &&
                    (loading ? (
                      <LoadingScreen />
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">Municipality</label>
                          <div
                            className={`flex items-center border rounded-lg overflow-hidden ${
                              errors.municipality ? "input-error" : ""
                            }`}
                          >
                            <select
                              className="form-control"
                              name="municipality"
                              id="municipality"
                              value={formData.municipality}
                              onChange={handleChange}
                            >
                              <option value="">Select a municipality</option>
                              {Object.keys(municipalitiesJson).map((municipality) => (
                                <option key={municipality} value={municipality}>
                                  {municipality}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.municipality && (
                            <span className="text-xs text-red-500 mt-1">
                              {errors.municipality}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">
                            Barangays within the selected municipality
                          </label>
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <div className="form-control">
                              <a
                                href="#"
                                className={
                                  "text-blue-600 hover:underline " +
                                  (formData.municipality
                                    ? ""
                                    : "pointer-events-none text-gray-400")
                                }
                                onClick={() => setOpenBarangays(true)}
                              >
                                View Barangays
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>

              <div className="w-full flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>
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
    </>
  );
}
