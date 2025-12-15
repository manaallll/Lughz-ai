// src/components/DynamicBackground.jsx
import React from 'react';

// This object maps a category name to a set of Tailwind CSS gradient classes.
const backgroundMap = {
  space: 'from-blue-100 to-blue-200',
  science: 'from-green-100 to-green-200',
  history: 'from-amber-100 to-amber-200',
  geography: 'from-stone-300 to-stone-400',
  math: 'from-red-100 to-red-200',
  animals: 'from-purple-200 to-purple-300',
};

// A default gradient if the category doesn't have a specific one
const defaultBackground = 'from-gray-200 to-gray-300';

export default function DynamicBackground({ category }) {
  const backgroundClass = backgroundMap[category] || defaultBackground;

  return (
    <div 
      className={`absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br transition-all duration-1000 ${backgroundClass}`}
    />
  );
}