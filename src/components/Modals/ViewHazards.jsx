import { motion, AnimatePresence } from "framer-motion";
import {useState, useEffect, use} from "react";
import { Hazards } from "@services";
import { LoadingScreen } from "@webview";
import { RoadHazards } from "@enums";
import { Badge } from "@components";

export default function ViewHazards({ isOpen, data, onClose }) {
    const [hazardData, setHazardData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isOpen && data) {
            setLoading(true);
            setHazardData(data);
            setLoading(false);
        }
    }, [isOpen, data]);

    useEffect(() => {
      console.log("Selected Hazard Data:", hazardData);
    });

  if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-4 relative max-w-3xl w-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                        <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>

                        <h1>Hazard Details</h1>

                        <div className="w-full border-t border-gray-200 mt-4">
                            {!loading ? (
                                <div className="px-4 py-2">
                                    <h2 className="text-lg font-semibold">Location:</h2>
                                    <p>{hazardData.location ? hazardData.location : "Unknown Location"}</p>

                                    <h2 className="text-lg font-semibold">Description:</h2>
                                    <p>{hazardData.description ? hazardData.description : "No Description Available"}</p>

                                    <h2 className="text-lg font-semibold">Status:</h2>
                                    {hazardData.status ? (
                                        <Badge 
                                            status={RoadHazards.Style[hazardData.status]}
                                            text={hazardData.status}
                                        />
                                    ) : (
                                        <i>Unknown Status</i>
                                    )}

                                    <h2 className="text-lg font-semibold">Resolved At:</h2>
                                    <p>{hazardData.resolvedAt ? new Date(hazardData.resolvedAt).toLocaleString() : "To be determined"}</p>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-40">
                                    <LoadingScreen />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
