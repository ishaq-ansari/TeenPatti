import React, { useState, useEffect } from 'react';
import { Player, GameState } from '../types';
import PlayerHand from './PlayerHand';
import { calculateBetLimits, updateCurrentStake } from '../utils/gameUtils';
import { evaluateHand, compareHands, getHandRankName } from '../utils/cardUtils';

interface GameBoardProps {
  gameState: GameState;
  localPlayerId: string;
  onSeeCards: () => void;
  onPlaceBet: (amount: number) => void;
  onFold: () => void;
  onShow: () => void;
  onSideshow: () => void;
  canRequestSideshow: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  localPlayerId,
  onSeeCards,
  onPlaceBet,
  onFold,
  onShow,
  onSideshow,
  canRequestSideshow
}) => {
  const { players, currentPlayerIndex, pot, currentStake, gameEnded, winner, showdown } = gameState;
  const [betAmount, setBetAmount] = useState<number>(0);
  
  const localPlayerIndex = players.findIndex(p => p.id === localPlayerId);
  const localPlayer = players[localPlayerIndex];
  const isLocalPlayerTurn = localPlayerIndex === currentPlayerIndex && !gameEnded;
  
  // Calculate bet limits for the current player
  const { minBet, maxBet } = isLocalPlayerTurn
    ? calculateBetLimits(localPlayer, currentStake, localPlayer.isSeen)
    : { minBet: 0, maxBet: 0 };
  
  // Set initial bet amount when it's the player's turn
  useEffect(() => {
    if (isLocalPlayerTurn) {
      setBetAmount(minBet);
    }
  }, [isLocalPlayerTurn, minBet]);
  
  // Handle bet amount change
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setBetAmount(Math.min(Math.max(value, minBet), maxBet));
    }
  };
  
  // Arrange players so that local player is at the bottom
  const arrangedPlayers = [...players.slice(localPlayerIndex), ...players.slice(0, localPlayerIndex)];
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="bg-green-800 rounded-lg p-6 w-full mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white text-xl">
            Pot: {pot}
          </div>
          <div className="text-white text-xl">
            Current Stake: {currentStake}
          </div>
        </div>
        
        {/* Players at the top */}
        <div className="flex justify-center space-x-4 mb-8">
          {arrangedPlayers.slice(1, 3).map((player, index) => (
            <PlayerHand
              key={player.id}
              player={player}
              isCurrentPlayer={players.indexOf(player) === currentPlayerIndex}
              isLocalPlayer={player.id === localPlayerId}
            />
          ))}
        </div>
        
        {/* Players on the sides */}
        <div className="flex justify-between mb-8">
          {arrangedPlayers.length > 3 && (
            <PlayerHand
              player={arrangedPlayers[3]}
              isCurrentPlayer={players.indexOf(arrangedPlayers[3]) === currentPlayerIndex}
              isLocalPlayer={arrangedPlayers[3].id === localPlayerId}
            />
          )}
          
          {/* Center area - show winner or showdown results */}
          <div className="flex-grow flex items-center justify-center">
            {gameEnded && winner && (
              <div className="bg-white p-4 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">{winner.name} wins!</h3>
                <p>Won {pot} chips</p>
              </div>
            )}
            
            {showdown && (
              <div className="bg-white p-4 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Showdown!</h3>
                {players.filter(p => p.isActive).map(player => {
                  const hand = evaluateHand(player.cards);
                  return (
                    <div key={player.id} className="mb-2">
                      <p>{player.name}: {getHandRankName(hand)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {arrangedPlayers.length > 4 && (
            <PlayerHand
              player={arrangedPlayers[4]}
              isCurrentPlayer={players.indexOf(arrangedPlayers[4]) === currentPlayerIndex}
              isLocalPlayer={arrangedPlayers[4].id === localPlayerId}
            />
          )}
        </div>
        
        {/* Local player at the bottom */}
        <div className="flex justify-center">
          <PlayerHand
            player={arrangedPlayers[0]}
            isCurrentPlayer={players.indexOf(arrangedPlayers[0]) === currentPlayerIndex}
            isLocalPlayer={true}
          />
        </div>
      </div>
      
      {/* Game controls */}
      <div className="bg-gray-100 rounded-lg p-4 w-full">
        {isLocalPlayerTurn ? (
          <div className="flex flex-col space-y-4">
            <div className="text-center text-lg font-bold">Your turn</div>
            
            {!localPlayer.isSeen && (
              <button
                onClick={onSeeCards}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                See Cards
              </button>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={onFold}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex-1"
              >
                Fold
              </button>
              
              <div className="flex flex-col flex-1">
                <input
                  type="range"
                  min={minBet}
                  max={maxBet}
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  className="mb-2"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min={minBet}
                    max={maxBet}
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    className="border rounded p-2 w-20"
                  />
                  <button
                    onClick={() => onPlaceBet(betAmount)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex-1"
                    disabled={betAmount < minBet || betAmount > maxBet}
                  >
                    Bet
                  </button>
                </div>
              </div>
            </div>
            
            {players.filter(p => p.isActive).length === 2 && (
              <button
                onClick={onShow}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
              >
                Show (Cost: {localPlayer.isSeen ? currentStake * 2 : currentStake})
              </button>
            )}
            
            {canRequestSideshow && (
              <button
                onClick={onSideshow}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Request Sideshow
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-lg">
            {gameEnded ? 'Game ended' : `Waiting for ${players[currentPlayerIndex].name} to play...`}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;