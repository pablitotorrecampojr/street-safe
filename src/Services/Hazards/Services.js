import { ref, get, onValue, update } from "firebase/database";
import { realtimeDb } from "../../firebase/firebase";
import { RoadHazards } from "@enums";
import { NotificationServices } from "@services";

export async function all() {
  try {
    const roadHazardsRef = ref(realtimeDb, "roadhazards");
    const snapshot = await get(roadHazardsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
    } else {
      console.warn("[roadHazards] No data found");
      return [];
    }
  } catch (error) {
    console.error("[roadHazards] Error fetching road hazards:", error);
    throw error;
  }
}

export async function getById(hazardId) {
  try {
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardId}`);
    const snapshot = await get(hazardRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        id: hazardId,
        ...data,
      };
    } else {
      console.warn(`[roadHazard] No data found for ID: ${hazardId}`);
      return null;
    }
  } catch (error) {
    console.error(`[roadHazard] Error fetching hazard ${hazardId}:`, error);
    throw error;
  }
}

export function subscribe(callback) {
  const roadHazardsRef = ref(realtimeDb, "roadhazards");
  const unsubscribe = onValue(roadHazardsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const formatted = Object.entries(data).map(([id, value]) => ({
        pushId: id,
        ...value,
      }));
      callback(formatted);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

/**
 * TODO: update road hazard status
 * ? the following functions are used to update the status of a road hazard
 */
export async function updateStatus(hazardId, newStatus, resolvedAt = null, backtoPending = false) {
  try {
    const hazardRef = ref(realtimeDb, `roadhazards/${hazardId}`);
    const hazardSnapshot = await get(hazardRef);
    if (!hazardSnapshot.exists()) {
      throw new Error(`Hazard with ID ${hazardId} does not exist`);
    }
    const hazardData = hazardSnapshot.val();
    const userId = hazardData.userid;

    if (newStatus === RoadHazards.Status.NATIONAL) {
      await update(hazardRef, {
        isNationalFlag: true,
        resolvedAt: resolvedAt
      });
      await NotificationServices.sendNotification(
        userId,
        "Hazard Marked as National",
        "Your reported hazard has been marked as a national issue. Thank you for your contribution!"
      );
    } else if (backtoPending) {
      await update(hazardRef, {
        status: RoadHazards.Status.PENDING,
        isNationalFlag: false,
        resolvedAt: null
      });
      await NotificationServices.sendNotification(
        userId,
        "Hazard Marked as Pending",
        "Your reported hazard has been marked as pending. Thank you for your contribution!"
      );
    } else {
      await update(hazardRef, {
        status: newStatus,
        resolvedAt: resolvedAt
      });
      await NotificationServices.sendNotification(
        userId,
        "Hazard Marked as "+ newStatus,
        "Your reported hazard has been marked as "+ newStatus + ". Thank you for your contribution!"
      );
    }

    return true;
  } catch (error) {
    console.error(`[roadHazard] Error updating hazard ${hazardId} status:`, error);
    throw error;
  }
}
