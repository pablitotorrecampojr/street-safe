import { realtimeDb  } from "../../firebase/firebase";
import { ref, push, set } from "firebase/database";
export async function sendNotification(toUserId, title, message) { 
  try {
    const notificationRef = ref(realtimeDb, `notifications`);
    const notification = {
        userId: toUserId,
        title: title,
        message: message,
        timestamp: Date.now()
    }
    const newRef = push(notificationRef, notification);
    await set(newRef, notification);
  } catch (error) {
    console.error("[Notification] Error sending notification:", error);
    throw error;
  }
}
