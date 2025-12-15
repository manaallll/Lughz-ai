// src/components/ProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <motion.div
        className="bg-gradient-to-r from-purple-400 to-blue-500 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}