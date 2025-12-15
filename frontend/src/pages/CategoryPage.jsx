// src/pages/CategoryPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- ADDED: Step 1

// Your image imports are UNTOUCHED.
import spaceImg from '../assets/space.svg';
import scienceImg from '../assets/science.svg';
import historyImg from '../assets/history.svg';
import geographyImg from '../assets/geography.svg';
import mathImg from '../assets/math.svg';
import animalsImg from '../assets/animals.svg';

// Your categoriesData object is UNTOUCHED.
const categoriesData = {
  space: { name: 'Space', img: spaceImg, color: 'bg-sky-100', textColor: 'text-sky-800' },
  science: { name: 'Science', img: scienceImg, color: 'bg-green-100', textColor: 'text-green-800' },
  history: { name: 'History', img: historyImg, color: 'bg-amber-100', textColor: 'text-amber-800' },
  geography: { name: 'Geography', img: geographyImg, color: 'bg-stone-300', textColor: 'text-stone-700' },
  math: { name: 'Math', img: mathImg, color: 'bg-rose-100', textColor: 'text-rose-800' },
  animals: { name: 'Animals', img: animalsImg, color: 'bg-purple-200', textColor: 'text-purple-700' },
};

// Your CategoryCard component is UNTOUCHED.
function CategoryCard({ categoryKey }) {
  const category = categoriesData[categoryKey];
  return (
    <Link
      to={`/riddle/${categoryKey}`}
      className={`animate-fadeIn group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${category.color}`}
    >
      <img src={category.img} alt={`${category.name} icon`} className="w-20 h-20 mb-4" />
      <h2 className={`text-xl font-bold ${category.textColor}`}>{category.name}</h2>
    </Link>
  );
}

export default function CategoryPage() {
  // --- ADDED: Step 2 ---
  const { user, logout } = useAuth();

  return (
    // --- WRAPPER ADDED: Step 3 ---
    // This wrapper is necessary to position the header without affecting your main content.
    <div className="relative w-full h-full"> 

      {/* This new header will sit at the top right of the page. */}
      <header className="absolute top-4 right-4 z-20 flex items-center space-x-3">
        {user && (
          <div className="text-md font-bold text-gray-700 bg-white/70 backdrop-blur-sm p-2 px-3 rounded-lg shadow-sm">
            Score: <span className="text-indigo-600">{user.score}</span>
          </div>
        )}
        <Link 
          to="/leaderboard"
          className="bg-amber-400 text-amber-900 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
        >
          Leaderboard 🏆
        </Link>
        <button 
          onClick={logout} 
          className="bg-gray-200 text-gray-700 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* YOUR ORIGINAL PAGE CODE IS BELOW, COMPLETELY UNTOUCHED */}
      <div className="w-full min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-4xl text-center">
          <h1 className="animate-fadeIn pt-12
           text-6xl font-bold text-black mb-12 tracking-tight font-serif">
            LughzAI
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(categoriesData).map((key) => (
              <CategoryCard key={key} categoryKey={key} />
            ))}
          </div>
        </div>
      </div>
      {/* END OF YOUR ORIGINAL CODE */}
      
    </div>
  );
}