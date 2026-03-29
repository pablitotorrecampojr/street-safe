import { realtimeDb  } from "../../firebase/firebase";
import { ref, push, set, get } from "firebase/database";

export async function sendNotification(toUserId, title, message, hazardId) { 
  try {
    const notificationRef = ref(realtimeDb, `hazardUpdates`);
    const notification = {
      userId: toUserId,
      sender: JSON.parse(localStorage.getItem("userData")).uid,
      hazardId: hazardId,
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

export async function getNotifications() {
  try {
    const notificationsRef = ref(realtimeDb, `hazardUpdates`);
    const snapshot = await get(notificationsRef);
    if (snapshot.exists()) {
      const notifications = Object.values(snapshot.val());
      return notifications.filter((notification) => notification.sender === JSON.parse(localStorage.getItem("userData")).uid);
    }
    return [];
  } catch (error) {
    console.error("[Notification] Error fetching notifications:", error);
    throw error;
  }
}