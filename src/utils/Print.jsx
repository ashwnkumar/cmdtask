// utils/Print.js
import React from "react";

export const print = {
  success: (text) => <span className="text-green-400">{text}</span>,
  warn: (text) => <span className="text-yellow-400">{text}</span>,
  danger: (text) => <span className="text-red-400">{text}</span>,
  muted: (text) => <span className="text-gray-500 italic">{text}</span>,
  complete: (text) => <span className="text-gray-500">{text}</span>,
  info: (text) => <span className="text-blue-400">{text}</span>,
  coffee: (text) => <span className="text-amber-700">{text}</span>,
};
