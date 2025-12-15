// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Import all three of your page components
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage'; // <-- 1. IMPORT THE NEW SIGNUP PAGE
import RiddlePage from './pages/RiddlePage';
import LeaderboardPage from './pages/LeaderboardPage'; 
// Keep the placeholder for the RiddlePage
function App() {
  return (
    <Routes>
      {/* Define the routes for login and signup */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} /> {/* <-- 2. ADD THE ROUTE FOR THE SIGNUP PAGE */}
      
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      {/* The main pages of your app */}
      <Route path="/" element={<CategoryPage />} />
      <Route path="/riddle/:categoryName" element={<RiddlePage />} />
    </Routes>
  );
}

export default App;