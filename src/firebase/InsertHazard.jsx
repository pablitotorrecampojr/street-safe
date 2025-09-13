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
                    id: generateRandomId(),
                    image: "iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAIAAABM5OhcAAABk0lEQVR4nO3c0WqDMABA0Wbs/3/ZPQxC0JYx9HY4znko1tQgeElKHzq2bXvA1T7++gb4n4RFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRF",
                    location: "123 Test St, Test City, Test Country",
                    description: "This is a test hazard report.",
                    status: "pending",
                    resolvedAt: null,
                    latitude: 10.123456,
                    longitude: 123.123456,
                }

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
