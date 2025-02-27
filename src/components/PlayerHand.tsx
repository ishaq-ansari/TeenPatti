import React from 'react';
import { Player } from '../types';
import Card from './Card';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer: boolean;
  isLocalPlayer: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, isCurrentPlayer, isLocalPlayer }) => {
  const { name, cards, isSeen, chips, currentBet, isActive } = player;

  return (
    <div className={`flex flex-col items-center p-4 rounded-lg ${isCurrentPlayer ? 'bg-yellow-100' : 'bg-gray-100'} ${!isActive ? 'opacity-50' : ''}`}>
      <div className="text-lg font-bold mb-2">{name} {isLocalPlayer ? '(You)' : ''}</div>
      <div className="flex space-x-[-10px] mb-2">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            card={card} 
            faceDown={!isLocalPlayer || !isSeen}
            className={`transform ${index === 0 ? 'rotate-[-5deg]' : index === 1 ? '' : 'rotate-[5deg]'}`}
          />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm">
          {isSeen ? 'Seen' : 'Blind'}
        </div>
        <div className="text-sm">
          Chips: {chips}
        </div>
        {currentBet > 0 && (
          <div className="text-sm">
            Bet: {currentBet}
          </div>
        )}
        {!isActive && (
          <div className="text-sm text-red-500 font-bold">
            Folded
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHand;