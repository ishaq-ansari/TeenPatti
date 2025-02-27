import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Player, GameState } from '../types';
import GameBoard from '../components/GameBoard';
import InviteModal from '../components/InviteModal';
import RulesModal from '../components/RulesModal';
import { createPlayer, initializeGameState, createInviteLink, canRequestSideshow } from '../utils/gameUtils';
import { Users, Play, Info } from 'lucide-react';

interface LocationState {
  playerName: string;
  isHost: boolean;
}

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName, isHost } = (location.state as LocationState) || {};
  
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize the game
  useEffect(() => {
    if (!gameId || !playerName) {
      navigate('/');
      return;
    }
    
    // Create local player
    const player = createPlayer(playerName);
    setLocalPlayer(player);
    
    if (isHost) {
      // Host initializes the game with themselves as the first player
      setPlayers([player]);
    } else {
      // Non-host joins an existing game
      // In a real implementation, this would connect to a server to join the game
      setPlayers([player]);
      // For demo purposes, we'll add some AI players
      const aiPlayers = [
        createPlayer('AI Player 1'),
        createPlayer('AI Player 2'),
        createPlayer('AI Player 3')
      ];
      setPlayers(prevPlayers => [...prevPlayers, ...aiPlayers]);
    }
    
    // Generate invite link
    const link = createInviteLink(gameId);
    setInviteLink(link);
    
    // Show invite modal for host
    if (isHost) {
      setShowInviteModal(true);
    }
    
    // In a real implementation, this would set up socket connections
    // For demo purposes, we'll simulate this with local state
    
  }, [gameId, playerName, isHost, navigate]);
  
  // Start the game
  const handleStartGame = () => {
    if (players.length < 2) {
      setError('Need at least 2 players to start the game');
      return;
    }
    
    const initialGameState = initializeGameState(players);
    setGameState(initialGameState);
    setGameStarted(true);
  };
  
  // Game actions
  const handleSeeCards = () => {
    if (!gameState || !localPlayer) return;
    
    // Update the local player to be "seen"
    const updatedPlayers = gameState.players.map(player => 
      player.id === localPlayer.id ? { ...player, isSeen: true } : player
    );
    
    setGameState({
      ...gameState,
      players: updatedPlayers
    });
  };
  
  const handlePlaceBet = (amount: number) => {
    if (!gameState || !localPlayer) return;
    
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[currentPlayerIndex];
    
    // Ensure it's the local player's turn
    if (currentPlayer.id !== localPlayer.id) return;
    
    // Update player's chips and bet
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === localPlayer.id) {
        return {
          ...player,
          chips: player.chips - amount,
          currentBet: player.currentBet + amount
        };
      }
      return player;
    });
    
    // Update game state
    const newPot = gameState.pot + amount;
    const newCurrentStake = currentPlayer.isSeen ? amount / 2 : amount;
    const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      pot: newPot,
      currentStake: newCurrentStake
    });
    
    // For demo purposes, simulate AI players' turns
    if (gameState.players[nextPlayerIndex].id.includes('AI')) {
      setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
    }
  };
  
  const handleFold = () => {
    if (!gameState || !localPlayer) return;
    
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[currentPlayerIndex];
    
    // Ensure it's the local player's turn
    if (currentPlayer.id !== localPlayer.id) return;
    
    // Mark player as inactive (folded)
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === localPlayer.id) {
        return { ...player, isActive: false };
      }
      return player;
    });
    
    // Check if only one player remains active
    const activePlayers = updatedPlayers.filter(p => p.isActive);
    if (activePlayers.length === 1) {
      // Game ends, remaining player wins
      setGameState({
        ...gameState,
        players: updatedPlayers,
        gameEnded: true,
        winner: activePlayers[0]
      });
      return;
    }
    
    // Move to next player
    const nextPlayerIndex = findNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex
    });
    
    // For demo purposes, simulate AI players' turns
    if (updatedPlayers[nextPlayerIndex].id.includes('AI')) {
      setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
    }
  };
  
  const handleShow = () => {
    if (!gameState || !localPlayer) return;
    
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[currentPlayerIndex];
    
    // Ensure it's the local player's turn
    if (currentPlayer.id !== localPlayer.id) return;
    
    // Calculate show cost
    const showCost = currentPlayer.isSeen ? gameState.currentStake * 2 : gameState.currentStake;
    
    // Update player's chips and pot
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === localPlayer.id) {
        return {
          ...player,
          chips: player.chips - showCost,
          currentBet: player.currentBet + showCost
        };
      }
      return player;
    });
    
    // Find the other active player
    const activePlayers = updatedPlayers.filter(p => p.isActive);
    if (activePlayers.length !== 2) return;
    
    // Determine winner based on card rankings
    // For demo purposes, we'll randomly select a winner
    const winner = Math.random() > 0.5 ? activePlayers[0] : activePlayers[1];
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      pot: gameState.pot + showCost,
      gameEnded: true,
      winner,
      showdown: true
    });
  };
  
  const handleSideshow = () => {
    if (!gameState || !localPlayer) return;
    
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[currentPlayerIndex];
    
    // Ensure it's the local player's turn
    if (currentPlayer.id !== localPlayer.id) return;
    
    // Find previous active player
    const prevPlayerIndex = findPrevActivePlayerIndex(gameState.players, currentPlayerIndex);
    const prevPlayer = gameState.players[prevPlayerIndex];
    
    // For demo purposes, randomly decide if the previous player accepts the sideshow
    const sideshowAccepted = Math.random() > 0.3;
    
    if (sideshowAccepted) {
      // Randomly determine the loser (for demo purposes)
      const loser = Math.random() > 0.5 ? currentPlayer : prevPlayer;
      
      // Mark loser as inactive
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === loser.id) {
          return { ...player, isActive: false };
        }
        return player;
      });
      
      // Check if only one player remains active
      const activePlayers = updatedPlayers.filter(p => p.isActive);
      if (activePlayers.length === 1) {
        // Game ends, remaining player wins
        setGameState({
          ...gameState,
          players: updatedPlayers,
          gameEnded: true,
          winner: activePlayers[0]
        });
        return;
      }
      
      // Move to next player
      const nextPlayerIndex = findNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex
      });
      
      // For demo purposes, simulate AI turns
      if (updatedPlayers[nextPlayerIndex].id.includes('AI')) {
        setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
      }
    } else {
      // Sideshow rejected, continue normal betting
      // For demo purposes, we'll just move to the next player
      const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
      
      setGameState({
        ...gameState,
        currentPlayerIndex: nextPlayerIndex
      });
      
      // For demo purposes, simulate AI turns
      if (gameState.players[nextPlayerIndex].id.includes('AI')) {
        setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
      }
    }
  };
  
  // Helper function to find the next active player
  const findNextActivePlayerIndex = (players: Player[], currentIndex: number): number => {
    let nextIndex = (currentIndex + 1) % players.length;
    while (!players[nextIndex].isActive) {
      nextIndex = (nextIndex + 1) % players.length;
      // Safety check to prevent infinite loop
      if (nextIndex === currentIndex) break;
    }
    return nextIndex;
  };
  
  // Helper function to find the previous active player
  const findPrevActivePlayerIndex = (players: Player[], currentIndex: number): number => {
    let prevIndex = (currentIndex - 1 + players.length) % players.length;
    while (!players[prevIndex].isActive) {
      prevIndex = (prevIndex - 1 + players.length) % players.length;
      // Safety check to prevent infinite loop
      if (prevIndex === currentIndex) break;
    }
    return prevIndex;
  };
  
  // Simulate AI player turns (for demo purposes)
  const simulateAITurn = (aiPlayerIndex: number) => {
    if (!gameState) return;
    
    const aiPlayer = gameState.players[aiPlayerIndex];
    
    // Randomly decide action: fold (20% chance), bet, or show
    const action = Math.random();
    
    if (action < 0.2) {
      // AI folds
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === aiPlayer.id) {
          return { ...player, isActive: false };
        }
        return player;
      });
      
      // Check if only one player remains active
      const activePlayers = updatedPlayers.filter(p => p.isActive);
      if (activePlayers.length === 1) {
        // Game ends, remaining player wins
        setGameState({
          ...gameState,
          players: updatedPlayers,
          gameEnded: true,
          winner: activePlayers[0]
        });
        return;
      }
      
      // Move to next player
      const nextPlayerIndex = findNextActivePlayerIndex(updatedPlayers, aiPlayerIndex);
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex
      });
      
      // Continue AI turns if next player is also AI
      if (updatedPlayers[nextPlayerIndex].id.includes('AI')) {
        setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
      }
    } else if (gameState.players.filter(p => p.isActive).length === 2 && action > 0.8) {
      // AI shows (only if 2 players remain)
      const showCost = aiPlayer.isSeen ? gameState.currentStake * 2 : gameState.currentStake;
      
      // Update AI player's chips and pot
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === aiPlayer.id) {
          return {
            ...player,
            chips: player.chips - showCost,
            currentBet: player.currentBet + showCost
          };
        }
        return player;
      });
      
      // Find the other active player
      const activePlayers = updatedPlayers.filter(p => p.isActive);
      if (activePlayers.length !== 2) return;
      
      // Determine winner based on card rankings
      // For demo purposes, we'll randomly select a winner
      const winner = Math.random() > 0.5 ? activePlayers[0] : activePlayers[1];
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        pot: gameState.pot + showCost,
        gameEnded: true,
        winner,
        showdown: true
      });
    } else {
      // AI bets
      // Randomly decide if AI sees cards (50% chance if not already seen)
      let updatedAIPlayer = { ...aiPlayer };
      if (!aiPlayer.isSeen && Math.random() > 0.5) {
        updatedAIPlayer.isSeen = true;
      }
      
      // Calculate bet amount
      const { minBet, maxBet } = updatedAIPlayer.isSeen
        ? { minBet: gameState.currentStake * 2, maxBet: gameState.currentStake * 4 }
        : { minBet: gameState.currentStake, maxBet: gameState.currentStake * 2 };
      
      const betAmount = Math.floor(minBet + Math.random() * (maxBet - minBet + 1));
      
      // Update AI player's chips and bet
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === aiPlayer.id) {
          return {
            ...updatedAIPlayer,
            chips: player.chips - betAmount,
            currentBet: player.currentBet + betAmount
          };
        }
        return player;
      });
      
      // Update game state
      const newPot = gameState.pot + betAmount;
      const newCurrentStake = updatedAIPlayer.isSeen ? betAmount / 2 : betAmount;
      const nextPlayerIndex = findNextActivePlayerIndex(updatedPlayers, aiPlayerIndex);
      
      setGameState({
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        pot: newPot,
        currentStake: newCurrentStake
      });
      
      // Continue AI turns if next player is also AI
      if (updatedPlayers[nextPlayerIndex].id.includes('AI')) {
        setTimeout(() => simulateAITurn(nextPlayerIndex), 1000);
      }
    }
  };
  
  // Check if local player can request a sideshow
  const canLocalPlayerRequestSideshow = (): boolean => {
    if (!gameState || !localPlayer) return false;
    
    const localPlayerIndex = gameState.players.findIndex(p => p.id === localPlayer.id);
    if (localPlayerIndex === -1) return false;
    
    return canRequestSideshow(gameState, localPlayerIndex);
  };
  
  // Add a player to the game (for demo purposes)
  const handleAddPlayer = () => {
    if (players.length >= 6) {
      setError('Maximum 6 players allowed');
      return;
    }
    
    const aiPlayer = createPlayer(`AI Player ${players.length}`);
    setPlayers(prevPlayers => [...prevPlayers, aiPlayer]);
  };
  
  if (!gameId || !playerName) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teen Patti</h1>
          <div className="flex space-x-4">
            {!gameStarted && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 flex items-center"
              >
                <Users className="mr-1" size={18} />
                Invite
              </button>
            )}
            <button
              onClick={() => setShowRulesModal(true)}
              className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 flex items-center"
            >
              <Info className="mr-1" size={18} />
              Rules
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {!gameStarted ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Game Lobby</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Players ({players.length}/6)</h3>
              <ul className="bg-gray-50 rounded-md p-2">
                {players.map(player => (
                  <li key={player.id} className="py-2 border-b border-gray-200 last:border-0">
                    {player.name} {player.id === localPlayer?.id ? '(You)' : ''}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleAddPlayer}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 flex-1"
              >
                Add AI Player
              </button>
              <button
                onClick={handleStartGame}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex-1 flex items-center justify-center"
                disabled={players.length < 2}
              >
                <Play className="mr-2" size={18} />
                Start Game
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Game ID: {gameId}</p>
              <p>Share this ID with friends to let them join your game.</p>
            </div>
          </div>
        ) : (
          gameState && localPlayer && (
            <GameBoard
              gameState={gameState}
              localPlayerId={localPlayer.id}
              onSeeCards={handleSeeCards}
              onPlaceBet={handlePlaceBet}
              onFold={handleFold}
              onShow={handleShow}
              onSideshow={handleSideshow}
              canRequestSideshow={canLocalPlayerRequestSideshow()}
            />
          )
        )}
      </main>
      
      {showInviteModal && (
        <InviteModal
          inviteLink={inviteLink}
          onClose={() => setShowInviteModal(false)}
        />
      )}
      
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
};

export default GamePage;