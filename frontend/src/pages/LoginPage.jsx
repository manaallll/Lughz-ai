// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  // 1. HOOKS
  // useAuth() is our custom hook to get the login function and token from the context.
  const { login } = useAuth();
  // useNavigate() is a hook from react-router-dom that lets us programmatically change the URL.
  const navigate = useNavigate();
  
  // 2. STATE FOR FORM INPUTS
  // We use useState for each input field to keep track of what the user is typing.
  // This is called a "controlled component" in React.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To hold any error messages from the login attempt.

  // 3. HANDLE SUBMIT FUNCTION
  // This function will be called when the user clicks the "Log In" button.
  const handleSubmit = async (e) => {
    // e.preventDefault() stops the browser's default form submission behavior (which is to reload the page).
    e.preventDefault();
    setError(''); // Clear any previous errors.

    try {
      // We call the 'login' function from our AuthContext.
      await login(email, password);
      // If the login is successful, navigate the user to the homepage ('/').
      navigate('/');
    } catch (err) {
      // If the login function throws an error (e.g., 404 Not Found), we catch it.
      console.error("Login failed:", err);
      setError('Invalid email or password. Please try again.');
    }
  };

  // 4. JSX FOR THE UI
  return (
    <div className=" bg-indigo-50 w-full min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 font-display">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Enter your credential to login.</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className=" p-8 rounded-lg  space-y-6"
        >
          {/* Display the error message if it exists */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="  block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email} // The input's value is tied to our 'email' state variable.
              onChange={(e) => setEmail(e.target.value)} // When the user types, we update the state.
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ">
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
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            Log In
          </button>
        </form>
        
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          {/* The <Link> component creates a navigation link to the signup page */}
          <Link to="/signup" className="text-purple-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}