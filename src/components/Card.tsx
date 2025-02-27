import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, faceDown = false, className = '' }) => {
  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  if (faceDown) {
    return (
      <div className={`w-20 h-28 bg-blue-800 rounded-lg shadow-md flex items-center justify-center border-2 border-white ${className}`}>
        <div className="w-16 h-24 bg-blue-700 rounded-md flex items-center justify-center">
          <div className="text-white text-2xl font-bold">TP</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-20 h-28 bg-white rounded-lg shadow-md flex flex-col p-2 border border-gray-300 ${className}`}>
      <div className={`flex justify-between items-center ${getSuitColor(card.suit)}`}>
        <div className="text-lg font-bold">{card.rank}</div>
        <div className="text-lg">{getSuitSymbol(card.suit)}</div>
      </div>
      <div className={`flex-grow flex items-center justify-center ${getSuitColor(card.suit)}`}>
        <div className="text-4xl">{getSuitSymbol(card.suit)}</div>
      </div>
      <div className={`flex justify-between items-center ${getSuitColor(card.suit)} rotate-180`}>
        <div className="text-lg font-bold">{card.rank}</div>
        <div className="text-lg">{getSuitSymbol(card.suit)}</div>
      </div>
    </div>
  );
};

export default Card;