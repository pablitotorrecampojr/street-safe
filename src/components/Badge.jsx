import React from "react";

const statusStyles = {
  success: "bg-green-100 text-green-800",
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status, text }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style}`}
    >
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </span>
  );
}
