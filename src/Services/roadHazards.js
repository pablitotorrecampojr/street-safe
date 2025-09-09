import { ref, get, onValue  } from "firebase/database";
import { realtimeDb } from "../firebase/firebase";

export async function getRoadHazards() {
  try {
    const roadHazardsRef = ref(realtimeDb, "roadhazards");
    const snapshot = await get(roadHazardsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("[roadHazards] Fetched road hazards:", data);

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

export function subscribeToRoadHazards(callback) {
  const roadHazardsRef = ref(realtimeDb, "roadhazards");
  const unsubscribe = onValue(roadHazardsRef, (snapshot) => {
    const data = snapshot.val();
    console.log("[roadHazards] Live update:", data);

    if (data) {
      const formatted = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      callback(formatted);
    } else {
      callback([]);
    }
  });

  return unsubscribe; // call this in cleanup
}