import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateGameId } from '../utils/gameUtils';
import { Users, PlaySquare, Info } from 'lucide-react';
import RulesModal from '../components/RulesModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [joinGameId, setJoinGameId] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState('');
  
  const handleCreateGame = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    const gameId = generateGameId();
    navigate(`/game/${gameId}`, { state: { playerName, isHost: true } });
  };
  
  const handleJoinGame = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!joinGameId.trim()) {
      setError('Please enter a game ID');
      return;
    }
    
    navigate(`/game/${joinGameId}`, { state: { playerName, isHost: false } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Teen Patti</h1>
          <p className="text-white opacity-90 mt-2">The Popular Indian Card Game</p>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleCreateGame}
              className="flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <PlaySquare className="mr-2" size={20} />
              Create New Game
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or join existing game</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={joinGameId}
                onChange={(e) => setJoinGameId(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Game ID"
              />
              <button
                onClick={handleJoinGame}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                <Users size={20} />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowRules(true)}
            className="flex items-center justify-center w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Info className="mr-2" size={18} />
            Game Rules
          </button>
        </div>
      </div>
      
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default HomePage;