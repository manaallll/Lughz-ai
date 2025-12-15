// src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { api, user } = useAuth();
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Make a GET request to our backend's /users/leaderboard endpoint
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load the leaderboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [api]);

  if (isLoading) {
    return <div className="text-center p-10 font-serif text-gray-500 animate-pulse">Loading Leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  // Helper to format the email for privacy
  const formatEmail = (email) => {
    return email.split('@')[0];
  };

  return (
    <div className="w-full min-h-screen bg-indigo-50 flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-black text-gray-800 mb-2 font-display">Leaderboard 🏆</h1>
        <p className="text-lg text-gray-500 mb-8">Top 10 Players of All Time</p>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="space-y-1 p-4">
            {leaderboard.map((player, index) => (
              <div 
  key={player.email} 
  className={`flex items-center p-4 rounded-lg transition-colors overflow-hidden ${
    user?.email === player.email ? 'bg-indigo-100 border-2 border-indigo-300' : ''
  }`}
>

                <span className="font-bold text-lg text-gray-400 w-12">#{index + 1}</span>
                <span className="flex-1 text-left font-semibold text-gray-800 text-lg truncate">
                  {formatEmail(player.email)}
                </span>
                <span className="font-black text-xl text-indigo-600 flex-shrink-0">
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/" className="inline-block mt-8 text-gray-600 hover:text-gray-800 font-semibold transition-colors">
          &larr; Back to Categories
        </Link>
      </div>
    </div>
  );
}