import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { UserStatus } from '@enums';

export const signUp = async (formData) => {
  try {
    if (!formData || !formData.fullname || !formData.email || !formData.password) {
      return { status: 400, message: "Invalid form data. Please provide all required fields." };
    }

    const {
      fullname,
      email,
      role,
      district,
      municipality,
      password,
      validIDFront,
      validIDBack
    } = formData;

    console.log(`validIDFront type: ${typeof validIDFront}, validIDBack type: ${typeof validIDBack}`);
    return false;

    // TODO: Proceed with user creation
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await signOut(auth);
    const displayName = `${fullname}`;
    await updateProfile(userCredential.user, { displayName });

    const user = userCredential.user;

    // TODO: Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullname,
      email,
      role,
      district,
      municipality,
      validIDFront,
      validIDBack,
      status: UserStatus.PENDING,
      uid: user.uid,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    return {
      status: 200,
      message: "User registered successfully!",
      user
    };

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return { status: 400, message: "This email is already registered. Please use a different one." };
    }
    console.error("Error during sign up:", error);
    return { status: 400, message: error.message };
  }
};

export const signIn = async (email, password) => { 
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = await getDoc(doc(db, "users", user.uid));
      localStorage.setItem("userData", JSON.stringify(userData.data()));

      return { status: 200, message: "User signed in successfully!", user };
  } catch (error) {
      return { status: 400, message: error.message };
  }
}

export const signOut = async () => { 
  try {
      await firebaseSignOut(auth);
      localStorage.removeItem("userData");
      return { status: 200, message: "User signed out successfully!" };
  } catch (error) {
      return { status: 400, message: error.message };
  }
}