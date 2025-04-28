import { useEffect, useState } from "react";
import { db, realtimeDb } from './firebase';
import { ref, push, set } from "firebase/database";

export default function ProtectedRoute({ children }) {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const generateRandomId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let id = '';
            for (let i = 0; i < 28; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        };
        const insertData = async () => {
            try {
                const hazardRef = ref(realtimeDb, "roadhazards");
                const newHazard = {
                    imageUrl: "base64Image",
                    dateSubmitted: "2025-04-11 00:00:00",
                    fullAddress: "NEW Somewhere in Apas, Cebu City, Cebu",
                    roadHazard: "Dummy Data",
                    status: 0,
                    latitude: 10.339278,
                    longitude: 123.904334,
                    userid: "opbG2JQJBpZj4sjZ9i0PsqynbkQ2",
                    id: generateRandomId(),
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
