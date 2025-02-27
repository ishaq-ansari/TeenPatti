import { Card, Hand, HandRank } from '../types';

// Create a deck of cards
export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const values: Record<Card['rank'], number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };

  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        value: values[rank]
      });
    }
  }

  return deck;
};

// Shuffle the deck
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal cards to players
export const dealCards = (deck: Card[], numPlayers: number, cardsPerPlayer: number = 3): { dealtCards: Card[][], remainingDeck: Card[] } => {
  const dealtCards: Card[][] = Array(numPlayers).fill(null).map(() => []);
  const remainingDeck = [...deck];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (remainingDeck.length > 0) {
        const card = remainingDeck.pop()!;
        dealtCards[j].push(card);
      }
    }
  }

  return { dealtCards, remainingDeck };
};

// Check if cards form a trio (three of a kind)
const isTrio = (cards: Card[]): boolean => {
  return cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank;
};

// Check if cards form a straight run (straight flush)
const isStraightRun = (cards: Card[]): boolean => {
  // Sort cards by value
  const sortedCards = [...cards].sort((a, b) => a.value - b.value);
  
  // Check if all cards are of the same suit
  const sameSuit = sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit;
  
  // Check if cards are in sequence
  const isSequence = (
    (sortedCards[1].value === sortedCards[0].value + 1 && sortedCards[2].value === sortedCards[1].value + 1) ||
    // Special case for A-2-3
    (sortedCards[0].rank === '2' && sortedCards[1].rank === '3' && sortedCards[2].rank === 'A')
  );
  
  return sameSuit && isSequence;
};

// Check if cards form a normal run (straight)
const isNormalRun = (cards: Card[]): boolean => {
  // Sort cards by value
  const sortedCards = [...cards].sort((a, b) => a.value - b.value);
  
  // Check if cards are in sequence
  const isSequence = (
    (sortedCards[1].value === sortedCards[0].value + 1 && sortedCards[2].value === sortedCards[1].value + 1) ||
    // Special case for A-2-3
    (sortedCards[0].rank === '2' && sortedCards[1].rank === '3' && sortedCards[2].rank === 'A')
  );
  
  // Check if cards are NOT all of the same suit
  const notSameSuit = !(sortedCards[0].suit === sortedCards[1].suit && sortedCards[1].suit === sortedCards[2].suit);
  
  return isSequence && notSameSuit;
};

// Check if cards form a color (flush)
const isColor = (cards: Card[]): boolean => {
  return cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
};

// Check if cards form a pair
const isPair = (cards: Card[]): { isPair: boolean, pairRank?: string, oddCard?: Card } => {
  if (cards[0].rank === cards[1].rank) {
    return { isPair: true, pairRank: cards[0].rank, oddCard: cards[2] };
  } else if (cards[1].rank === cards[2].rank) {
    return { isPair: true, pairRank: cards[1].rank, oddCard: cards[0] };
  } else if (cards[0].rank === cards[2].rank) {
    return { isPair: true, pairRank: cards[0].rank, oddCard: cards[1] };
  }
  return { isPair: false };
};

// Evaluate a hand of cards
export const evaluateHand = (cards: Card[]): Hand => {
  // Sort cards by value in descending order
  const sortedCards = [...cards].sort((a, b) => b.value - a.value);
  
  // Check for trio (three of a kind)
  if (isTrio(sortedCards)) {
    return {
      cards: sortedCards,
      rank: HandRank.Trio,
      highCard: sortedCards[0]
    };
  }
  
  // Check for straight run (straight flush)
  if (isStraightRun(sortedCards)) {
    // Handle A-2-3 special case
    if (sortedCards[0].rank === 'A' && sortedCards[1].rank === '3' && sortedCards[2].rank === '2') {
      return {
        cards: sortedCards,
        rank: HandRank.StraightRun,
        highCard: sortedCards[0],
        secondHighCard: sortedCards[1],
        thirdHighCard: sortedCards[2]
      };
    }
    return {
      cards: sortedCards,
      rank: HandRank.StraightRun,
      highCard: sortedCards[0],
      secondHighCard: sortedCards[1],
      thirdHighCard: sortedCards[2]
    };
  }
  
  // Check for normal run (straight)
  if (isNormalRun(sortedCards)) {
    // Handle A-2-3 special case
    if (sortedCards[0].rank === 'A' && sortedCards[1].rank === '3' && sortedCards[2].rank === '2') {
      return {
        cards: sortedCards,
        rank: HandRank.NormalRun,
        highCard: sortedCards[0],
        secondHighCard: sortedCards[1],
        thirdHighCard: sortedCards[2]
      };
    }
    return {
      cards: sortedCards,
      rank: HandRank.NormalRun,
      highCard: sortedCards[0],
      secondHighCard: sortedCards[1],
      thirdHighCard: sortedCards[2]
    };
  }
  
  // Check for color (flush)
  if (isColor(sortedCards)) {
    return {
      cards: sortedCards,
      rank: HandRank.Color,
      highCard: sortedCards[0],
      secondHighCard: sortedCards[1],
      thirdHighCard: sortedCards[2]
    };
  }
  
  // Check for pair
  const pairResult = isPair(sortedCards);
  if (pairResult.isPair) {
    return {
      cards: sortedCards,
      rank: HandRank.Pair,
      pairRank: pairResult.pairRank,
      highCard: pairResult.oddCard
    };
  }
  
  // High card
  return {
    cards: sortedCards,
    rank: HandRank.HighCard,
    highCard: sortedCards[0],
    secondHighCard: sortedCards[1],
    thirdHighCard: sortedCards[2]
  };
};

// Compare two hands to determine the winner
export const compareHands = (hand1: Hand, hand2: Hand): number => {
  // Compare by hand rank first
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }
  
  // If ranks are the same, compare based on the specific hand type
  switch (hand1.rank) {
    case HandRank.Trio:
      // Compare the rank of the trio
      return hand1.cards[0].value - hand2.cards[0].value;
      
    case HandRank.StraightRun:
    case HandRank.NormalRun:
      // Special case for A-2-3
      const isHand1A23 = hand1.cards.some(c => c.rank === 'A') && hand1.cards.some(c => c.rank === '2') && hand1.cards.some(c => c.rank === '3');
      const isHand2A23 = hand2.cards.some(c => c.rank === 'A') && hand2.cards.some(c => c.rank === '2') && hand2.cards.some(c => c.rank === '3');
      
      if (isHand1A23 && !isHand2A23) return 1;
      if (!isHand1A23 && isHand2A23) return -1;
      
      // Compare highest card
      return hand1.highCard!.value - hand2.highCard!.value;
      
    case HandRank.Color:
    case HandRank.HighCard:
      // Compare highest card
      if (hand1.highCard!.value !== hand2.highCard!.value) {
        return hand1.highCard!.value - hand2.highCard!.value;
      }
      // If highest cards are equal, compare second highest
      if (hand1.secondHighCard!.value !== hand2.secondHighCard!.value) {
        return hand1.secondHighCard!.value - hand2.secondHighCard!.value;
      }
      // If second highest cards are equal, compare third highest
      return hand1.thirdHighCard!.value - hand2.thirdHighCard!.value;
      
    case HandRank.Pair:
      // Get the value of the pair for each hand
      const pairValue1 = hand1.cards.find(c => c.rank === hand1.pairRank)!.value;
      const pairValue2 = hand2.cards.find(c => c.rank === hand2.pairRank)!.value;
      
      // Compare pair values
      if (pairValue1 !== pairValue2) {
        return pairValue1 - pairValue2;
      }
      
      // If pairs are equal, compare the odd card
      return hand1.highCard!.value - hand2.highCard!.value;
      
    default:
      return 0;
  }
};

// Get hand rank name for display
export const getHandRankName = (hand: Hand): string => {
  switch (hand.rank) {
    case HandRank.Trio:
      return 'Trial/Trio/Set';
    case HandRank.StraightRun:
      return 'Straight Run';
    case HandRank.NormalRun:
      return 'Normal Run';
    case HandRank.Color:
      return 'Color';
    case HandRank.Pair:
      return 'Pair';
    case HandRank.HighCard:
      return 'High Card';
    default:
      return 'Unknown';
  }
};