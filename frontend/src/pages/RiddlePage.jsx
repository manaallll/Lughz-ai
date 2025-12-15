// src/pages/RiddlePage.jsx
import React, { useState, useEffect , useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DynamicBackground from '../components/DynamicBackground'; // We will use this

export default function RiddlePage() {
  // --- This entire logic section is YOURS and is UNCHANGED ---
  const { categoryName } = useParams();
  const { api, user, setUser } = useAuth();
  const [riddles, setRiddles] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    // This 'if' statement is the key to preventing the double fetch
    if (effectRan.current === false) {
      const fetchRoundRiddles = async () => {
        setIsLoading(true);
        setError('');
        try {
          // This is the "fast loading" logic
          console.log("Fetching first riddle...");
          const initialResponse = await api.post('/riddle/', { category: categoryName, count: 1 });
          if (!initialResponse.data || initialResponse.data.length === 0) {
            throw new Error("API did not return the first riddle.");
          }
          const firstRiddle = initialResponse.data[0];
          setRiddles([firstRiddle]);
          setIsLoading(false); // Game starts now!

          // Fetch the rest in the background
          console.log("Fetching remaining 9 riddles...");
          const remainingResponse = await api.post('/riddle/', { category: categoryName, count: 9 });
          if (remainingResponse.data && remainingResponse.data.length > 0) {
            setRiddles(prevRiddles => [...prevRiddles, ...remainingResponse.data]);
            console.log("All riddles loaded.");
          }
        } catch (err) {
          console.error("Failed to fetch riddles:", err);
          setError('Could not start a new round. Please try again later.');
          setIsLoading(false);
        }
      };
      
      fetchRoundRiddles();
    }

    // This cleanup function runs when the component unmounts
    // It sets our flag so the effect doesn't run its API calls a second time
    return () => {
      effectRan.current = true;
    };
  }, [categoryName, api]);
  
  const handleSubmit = (e) => {
  e.preventDefault();
  if (!userAnswer) return;

  if (currentQuestionIndex < 9 && riddles.length <= currentQuestionIndex + 1) {
    alert("Still loading the next riddle, please wait a moment!");
    return;
  }

  const currentRiddle = riddles[currentQuestionIndex];
  const isCorrect = userAnswer.trim().toLowerCase() === currentRiddle.correct_answer.trim().toLowerCase();

  const answerData = {
    riddle: currentRiddle.riddle,
    userAnswer,
    correct_answer: currentRiddle.correct_answer,
    isCorrect,
    hintUsed,
    points: isCorrect ? (hintUsed ? 5 : 15) : 0,
  };

  const newAnswers = [...answers, answerData];
  setAnswers(newAnswers);

  if (currentQuestionIndex < riddles.length - 1) {
    // Move to next riddle
    setCurrentQuestionIndex(prev => prev + 1);
    setUserAnswer('');
    setHintUsed(false);

  } else {
    // Round over
    setIsRoundOver(true);

    const totalPoints = newAnswers.reduce((sum, ans) => sum + ans.points, 0);

    // Send ONLY this round's total points to backend
    api.post('/users/me/score', { score: totalPoints })
      .then(response => {
        setUser(response.data); // Backend returns updated user with correct score
        console.log("Score successfully updated on the backend.");
      })
      .catch(err => console.error("Failed to update score on backend", err));
  }
};

 //-- END OF YOUR WORKING LOGIC ---


  // --- UI RENDERING SECTION ---
  // The logic is the same, but the JSX inside is now redesigned.

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-2xl  text-indigo-300 font-serif animate-pulse">Crafting your 10-riddle challenge...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center text-center">
        <div>
          <p className="text-2xl text-red-500 mb-4">{error}</p>
          <Link to="/" className="text-indigo-500 hover:underline">&larr; Back to Categories</Link>
        </div>
      </div>
    );
  }

  if (isRoundOver) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalPoints = answers.reduce((sum, ans) => sum + ans.points, 0);
    return (
      <div className="w-full min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
        <div className="w-full max-w-2xl text-center animate-fadeIn">
          <h1 className="text-3xl font-bold text-indigo-500">Round Complete!</h1>
          <p className="text-2xl text-gray-700 text-semibold mt-2">You scored:</p>
          <p className="text-5xl font-black text-gray-800 my-2">{totalPoints}/150</p>
          <p className="text-xl text-gray-500 mb-8">You answered {correctCount} out of 10 questions correctly.</p>
          <div className="text-left bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-2 max-h-80 overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-800">Your Answers:</h3>
            {answers.map((ans, index) => (
              <div key={index} className="pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <p className="flex-1 text-gray-700 mr-4"><span className="font-bold">{index + 1}.</span> {ans.riddle}</p>
                  <p className={`font-bold text-lg ${ans.isCorrect ? (ans.hintUsed ? 'text-yellow-300' : 'text-green-400') : 'text-red-500'}`}>{ans.isCorrect ? `+${ans.points}` : '+0'}</p>
                </div>
                <div className="text-sm pl-6 mt-1">
                  {ans.isCorrect ? (<p className="text-gray-500">You correctly answered: <span className="font-semibold text-gray-700">"{ans.correct_answer}"</span></p>) : (<> <p className="text-red-700">Your answer: "{ans.userAnswer}"</p> <p className="text-green-600">Correct answer: "{ans.correct_answer}"</p> </>)}
                </div>
              </div>
            ))}
          </div>
          <Link to="/" className="mt-8 inline-block bg-indigo-500 text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-indigo-700 transition-colors">Play Another Category</Link>
        </div>
      </div>
    );
  }
  
  // This handles the blank page bug.
  if (riddles.length === 0 && !isLoading) {
    return (
        <div className="w-full min-h-screen bg-white flex items-center justify-center">
            <p className="text-2xl text-gray-500 font-serif animate-pulse">Preparing riddles...</p>
        </div>
    );
  }

  const currentRiddle = riddles[currentQuestionIndex];

  // --- THIS IS THE REDESIGNED MAIN RIDDLE UI ---
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 font-sans">
      <DynamicBackground category={categoryName} />
      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col">
        <div className="bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border pb-12 border-white/20">
          <h1 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-2">{categoryName} Challenge</h1>
          <p className="font-bold text-lg text-gray-800 mb-4">Question {currentQuestionIndex + 1} / 10</p>
          <p className="text-2xl font-serif text-gray-900 leading-relaxed min-h-[120px] flex items-center justify-center mb-6">
            "{currentRiddle?.riddle}"
          </p>
          <form onSubmit={handleSubmit} className=" flex flex-col sm:flex-row items-center sm:space-x-4 mb-2">
            <input 
              type="text" 
              placeholder="Type your answer here..." 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)} 
              className="w-full sm:flex-1  mb-3 p-4 border-2 sm:mb-0 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base "
            />
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-indigo-400 text-white font-bold py-4 px-8 rounded-lg hover:bg-indigo-500 transition-colors duration-300 shadow-lg"
            >
              Submit
            </button>
          </form>
          <div className="text-center h-28"> {/* Fixed height to prevent layout shift */}
            {!hintUsed ? (
              <button onClick={() => setHintUsed(true)} className="text-gray-600 hover:text-indigo-400 font-semibold transition-colors">
                Need a hint?
              </button>
            ) : (
              <div className="animate-fadeIn space-y-4 mt-4">
                <p className="font-bold text-black">It's one of these...</p>
                <div className="grid grid-cols-2 gap-4">
                  {currentRiddle?.options.map((option, index) => (
                    <button 
                      key={index} 
                      onClick={() => setUserAnswer(option)}
                      className="w-full p-3  text-gray-800 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Link 
  to="/" 
  className="mt-6 inline-block self-center text-white font-semibold [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)] hover:text-gray-200 transition-colors"
>
  &larr; Quit Round
</Link>

      </div>
    </div>
  );
}