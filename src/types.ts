export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  value: number;
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  isSeen: boolean;
  isActive: boolean;
  chips: number;
  currentBet: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  pot: number;
  deck: Card[];
  currentStake: number;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  showdown: boolean;
}

export enum HandRank {
  HighCard = 1,
  Pair = 2,
  Color = 3,
  NormalRun = 4,
  StraightRun = 5,
  Trio = 6
}

export interface Hand {
  cards: Card[];
  rank: HandRank;
  highCard?: Card;
  secondHighCard?: Card;
  thirdHighCard?: Card;
  pairRank?: string;
}

export interface InviteInfo {
  gameId: string;
  hostName: string;
}