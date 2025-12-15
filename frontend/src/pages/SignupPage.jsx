// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpPage() {
  // Get the signup function from our global AuthContext
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  // State for the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Call the signup function from the context
      await signup(email, password);
      // If signup is successful, it also logs the user in.
      // Navigate them to the main category page.
      navigate('/');
    } catch (err) {
      console.error("Signup failed:", err);
      // The backend sends a 409 Conflict error if the email already exists.
      if (err.response && err.response.status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 font-display">
            Sign Up
          </h1>
          <p className="text-gray-500 mt-2">Create your account to start playing.</p>
        </div>

        <form onSubmit={handleSubmit} className=" p-8 rounded-lg  space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700  transition-colors duration-300"
          >
            Create Account
          </button>
        </form>
        
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}