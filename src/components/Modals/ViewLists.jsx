import { motion, AnimatePresence } from "framer-motion";
export default function ViewLists({ isOpen, onClose, list = [], header = "List of Items" }) {
  if (!isOpen) return null; // Only render when open

  return (
     <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 className="text-xl font-semibold mb-4">{header}</h2>

            <div className="space-y-2">
              <ul className="list-disc list-inside max-h-60 overflow-y-auto">
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <li key={index} className="py-1">{item}</li>
                  ))
                ) : (
                  <li className="py-1">No items found.</li>
                )}
              </ul>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
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
