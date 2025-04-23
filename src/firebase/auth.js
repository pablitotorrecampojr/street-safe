import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signUp = async (formData) => { 
    try {
        if (!formData || !formData.fullname || !formData.email || !formData.password) {
            return { status: 400, message: "Invalid form data. Please provide all required fields." };
        }
        const { fullname, email, role, district, municipality, barangay, password, validIdFront, validIBack } = formData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await signOut(auth);
        const displayName = `${fullname}`;
        await updateProfile(userCredential.user, { displayName });
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            fullname,
            email,
            role,
            district,
            municipality,
            barangay,
            validIdFront,
            validIdBack,
            uid: user.uid, 
            createdAt: new Date().toISOString().slice(0, 10)
        });

        return {
            status: 200,
            message: "User registered successfully!",
            user
        }
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            return { status: 400, message: "This email is already registered. Please use a different one." };
        }
        return { status: 400, message: error.message };
    }
}

export const signIn = async (email, password) => { 
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // if(!user.emailVerified) return { status: 400, message: "Please verify your email address." }

        return { status: 200, message: "User signed in successfully!", user };
    } catch (error) {
        return { status: 400, message: error.message };
    }
}

export const signOut = async () => { 
    try {
        await firebaseSignOut(auth);
        return { status: 200, message: "User signed out successfully!" };
    } catch (error) {
        return { status: 400, message: error.message };
    }
}