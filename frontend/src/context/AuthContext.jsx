// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create a base axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This interceptor is like a gatekeeper for every outgoing request.
    // Before any request is sent, this function will run.
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // This interceptor is a gatekeeper for every incoming response.
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // If we ever get a 401 error, it means our token is bad.
        // We should automatically log the user out.
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Fetch user data when the token changes
    const fetchUser = async () => {
      if (token) {
        try {
          // This endpoint doesn't exist yet, we will create it.
          // For now, this shows the pattern.
          // const response = await api.get('/users/me'); 
          // setUser(response.data);
        } catch (error) {
          console.error("Token is invalid, logging out.", error);
          logout();
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();

    // Cleanup function to remove interceptors when the component unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/login', formData);
    
    if (response.data.access_token) {
      const newToken = response.data.access_token;
      localStorage.setItem('token', newToken);
      setToken(newToken); // This will trigger the useEffect to fetch the user
    }
  };
  
  const signup = async (email, password) => {
    await api.post('/signup', { email, password }); // This should be /users/signup
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Redirect to login page on logout
    navigate('/login');
  };

  const value = { token, user, setUser, api, login, signup, logout }; // Add setUser

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}