import { motion, AnimatePresence } from "framer-motion";

export default function ViewFile({ isOpen, imageSource, onClose }) {
  if (!isOpen) return null;

    const imageUrl =
        imageSource instanceof File ? URL.createObjectURL(imageSource) : imageSource;

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

                        {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="max-h-[75vh] w-full object-contain rounded-xl"
                        />
                        ) : (
                        <p className="text-center text-gray-500">No image available</p>
                        )}

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
