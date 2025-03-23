import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signUp = async (formData) => { 
    try {
        const { username, email, role, district, municipality, barangay, password } = formData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username,
            email,
            role,
            district,
            municipality,
            barangay,
            uid: user.uid,
            createdAt: new Date()
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