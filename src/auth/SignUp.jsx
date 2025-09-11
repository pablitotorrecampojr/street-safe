import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@enums";
import { Letters } from "@utils";

export default function SignUp() {

  const [selectedRole, setSelectedRole] = useState(UserRole.MUNICIPALITIES);
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h3 className="font-bold text-gray-800 mb-6">
          Create Account
        </h3>
        <div className="space-y-4">
          <div className="w-full flex justify-start space-x-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" 
              onClick={() => handleRoleChange(UserRole.AUTHORITIES)}>
              {Letters.CapitalizeFirstLetter(UserRole.AUTHORITIES)}
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" 
              onClick={() => handleRoleChange(UserRole.MUNICIPALITIES)}>
              {Letters.CapitalizeFirstLetter(UserRole.MUNICIPALITIES)}
            </button>
          </div>
          <div className="w-full">
            
          </div>
        </div>

      </div>
    </div>
  );
}
