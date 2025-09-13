import { useState, useEffect } from "react";
import { UserRole } from "@enums";
import { Letters } from "@utils";
import { LoadingScreen } from "@webview";
import districtSortedJson from "../constants/districts-sorted.json"
import districtJson from "../constants/districts.json"
import municipalitiesJson from "../constants/municipalities.json"
import { ViewLists, ViewImage } from "@components";
import { UserValidations } from "@services";
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
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: selectedRole,
    validIdFront: "",
    validIdBack: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    const validationErrors = UserValidations.validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation Errors:", validationErrors);
    } else {
      console.log("Form Data is valid:", formData);
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
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="px-3 text-gray-600 hover:text-blue-600"
                        onClick={() => setViewImage({ isOpen: true, imageUrl: formData.validIdFront })}
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
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="px-3 text-gray-600 hover:text-blue-600"
                        onClick={() => setViewImage({ isOpen: true, imageUrl: formData.validIdBack })}
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>
                  {selectedRole === UserRole.AUTHORITIES && (
                    loading ? <LoadingScreen /> : (
                      <>
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">District</label>
                          <div className="flex items-center border rounded-lg overflow-hidden">
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
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">Selected District</label>
                          <div className="form-control bg-gray-100 border-0">
                            {formData.district ? (
                              <>
                                {districtJson.find(d => d.district === formData.district)?.name}, {districtJson.find(d => d.district === formData.district)?.code}
                              </>
                            ) : (
                              "No district selected."
                            )}
                          </div>
                        </div>
                      </>
                    )
                  )}
                  {selectedRole === UserRole.MUNICIPALITIES && (
                    loading ? <LoadingScreen /> : (
                      <>
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">Municipality</label>
                          <div className="flex items-center border rounded-lg overflow-hidden">
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
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">Barangays within the selected municipality</label>
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <div className="form-control">
                              <a
                                href="#"
                                className={'text-blue-600 hover:underline ' + (formData.municipality ? '' : 'pointer-events-none text-gray-400')}
                                onClick={() => setOpenBarangays(true)}
                              >
                                View Barangays
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
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
