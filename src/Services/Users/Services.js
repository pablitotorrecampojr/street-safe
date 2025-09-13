import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

/**
 * TODO: Update a user's status in Firestore
 * @param {string} userId - The ID of the user to update
 * @param {string} newStatus - The new status (e.g., "ACTIVE", "BLOCKED")
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function updateUserStatus(userId, newStatus) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { status: newStatus }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("[userServices] Error updating user status:", error);
    return { success: false, error };
  }
}
