import { v4 as uuidv4 } from 'uuid';
import { Player, GameState, Card } from '../types';
import { createDeck, shuffleDeck, dealCards } from './cardUtils';

// Initialize a new game state
export const initializeGameState = (players: Player[]): GameState => {
  const deck = shuffleDeck(createDeck());
  const { dealtCards, remainingDeck } = dealCards(deck, players.length);
  
  // Assign cards to players
  const playersWithCards = players.map((player, index) => ({
    ...player,
    cards: dealtCards[index],
    isSeen: false,
    isActive: true,
    currentBet: 0
  }));
  
  // Randomly select dealer (first player)
  const dealerIndex = Math.floor(Math.random() * players.length);
  
  return {
    players: playersWithCards,
    currentPlayerIndex: (dealerIndex + 1) % players.length, // Player to the left of dealer starts
    pot: 0,
    deck: remainingDeck,
    currentStake: 10, // Initial stake
    gameStarted: true,
    gameEnded: false,
    winner: null,
    showdown: false
  };
};

// Create a new player
export const createPlayer = (name: string, initialChips: number = 1000): Player => {
  return {
    id: uuidv4(),
    name,
    cards: [],
    isSeen: false,
    isActive: true,
    chips: initialChips,
    currentBet: 0
  };
};

// Calculate the minimum and maximum bet for a player
export const calculateBetLimits = (
  player: Player,
  currentStake: number,
  isSeen: boolean
): { minBet: number; maxBet: number } => {
  if (isSeen) {
    // Seen player: min = 2x current stake, max = 4x current stake
    return {
      minBet: currentStake * 2,
      maxBet: currentStake * 4
    };
  } else {
    // Blind player: min = current stake, max = 2x current stake
    return {
      minBet: currentStake,
      maxBet: currentStake * 2
    };
  }
};

// Update current stake based on the last bet
export const updateCurrentStake = (
  lastBetAmount: number,
  isSeen: boolean
): number => {
  if (isSeen) {
    // If seen player, current stake becomes half the bet amount
    return lastBetAmount / 2;
  } else {
    // If blind player, current stake remains the same as the bet amount
    return lastBetAmount;
  }
};

// Check if a player can request a sideshow
export const canRequestSideshow = (
  gameState: GameState,
  playerIndex: number
): boolean => {
  const { players, currentPlayerIndex } = gameState;
  
  // Can only request sideshow if there are more than 2 players active
  if (players.filter(p => p.isActive).length <= 2) {
    return false;
  }
  
  // Current player must be seen
  if (!players[playerIndex].isSeen) {
    return false;
  }
  
  // Previous player must be seen
  const prevPlayerIndex = (playerIndex - 1 + players.length) % players.length;
  if (!players[prevPlayerIndex].isSeen || !players[prevPlayerIndex].isActive) {
    return false;
  }
  
  return true;
};

// Generate a unique game ID
export const generateGameId = (): string => {
  return uuidv4().substring(0, 8);
};

// Create an invitation link
export const createInviteLink = (gameId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${gameId}`;
};