import { useEffect, useState } from "react";
import { db, realtimeDb } from './firebase';
import { ref, push, set } from "firebase/database";

export default function ProtectedRoute({ children }) {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const insertData = async () => {
            try {
                const hazardRef = ref(realtimeDb, "roadhazards");
                const newHazard = {
                    imageUrl: "base64Image",
                    dateSubmitted: "2025-04-11 00:00:00",
                    fullAddress: "8WQ3+5W7, Camp Lapu-Lapu Rd, Lungsod ng Cebu, 6000 Lalawigan ng Cebu",
                    roadHazard: "Test Data",
                    status: 0,
                    latitude: 10.337927,
                    longitude: 123.904806,
                    userid: "vCdg9SpVlreJSEnHLY4De2HSW4F2"
                };

                const newRef = push(hazardRef);
                await set(newRef, newHazard);

                setResponse({ status: 200, message: "Insert success" });
            } catch (error) {
                console.error("Insert error:", error);
                setResponse({ status: 500, message: "Insert failed", error: error.message });
            }
        };

        insertData();
    }, []);

    return (
        <>
            {children}
            {response && (
                <pre style={{ position: 'fixed', bottom: 10, left: 10, background: '#eee', padding: '10px', borderRadius: '5px' }}>
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </>
    );
}
