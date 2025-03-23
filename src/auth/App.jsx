
import React, { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import { auth, db, signInWithEmailAndPassword, doc, getDoc } from '../firebase';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/authContext';

const SignIn = () => {
  const { userLoggedIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if(!isSigningIn) {
      setIsSigningIn(true)
      await doSignInWithEmailAndPassword(email, password)
    }
  }

  return (
    <div className="flex h-screen">
      {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}
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
              onChange={(e) => setEmail(e.target.value)}
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
