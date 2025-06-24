import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface NotificationModalProps {
  message: string;
  type?: "success" | "error";
  show: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  message,
  type = "success",
  show,
  onClose,
}: NotificationModalProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }} // Mulai di luar layar atas
          animate={{ y: 0, opacity: 1 }} // Masuk ke dalam layar
          exit={{ y: "-100%", opacity: 0 }} // Keluar ke atas lagi
          transition={{ duration: 0.4 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-md text-white z-50 whitespace-nowrap overflow-hidden text-ellipsis max-w-[90vw] ${
            type === "success" ? "bg-cyan-500" : "bg-red-900"
          }`}
        >
          <div>{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
