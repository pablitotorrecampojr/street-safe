import { realtimeDb  } from "../../firebase/firebase";
import { ref, push, set } from "firebase/database";
export async function sendNotification(toUserId, title, message) { 
  try {
    const notificationRef = ref(realtimeDb, `hazardUpdates`);
    const notification = {
      userId: toUserId,
      sender: JSON.parse(localStorage.getItem("userData")).uid,
      title: title,
      message: message,
      timestamp: Date.now(),
      notified: false
    }
    const newRef = push(notificationRef, notification);
    await set(newRef, notification);
  } catch (error) {
    console.error("[Notification] Error sending notification:", error);
    throw error;
  }
}
