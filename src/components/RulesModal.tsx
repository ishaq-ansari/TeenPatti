import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Teen Patti Rules</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Card Rankings</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Trial/Trio/Set:</strong> 3 cards having the same rank. 3 Ace cards are the highest set and 3 cards of twos are the lowest trio.
              </li>
              <li>
                <strong>Straight Run:</strong> 3 running or consecutive cards of the same suit. A-2-3 is the strongest straight run, then it is A-K-Q, right until 4-3-2.
              </li>
              <li>
                <strong>Normal Run:</strong> 3 running or consecutive cards, but not of the same suit. A-2-3 is the strongest normal run, then it is A-K-Q, right until 4-3-2. The cards 2-A-K are not valid.
              </li>
              <li>
                <strong>Color:</strong> Any 3 cards of the same suit. Compare the highest card when comparing 2 colours. If they are equal, compare the 2nd, if they too are equal compare the lowest card.
              </li>
              <li>
                <strong>Pair:</strong> A pair is 2 cards of the same rank. Always compare the pair first, between 2 such hands. Then compare the odd card if those are equal.
              </li>
              <li>
                <strong>High Card:</strong> 3 cards that do not fall in any of the above categories. Compare the highest card, then the 2nd card, then the lowest one.
              </li>
            </ol>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">How to Play</h3>
            <p>
              In a clockwise style, each player gets one card at a time until all players get 3 cards by the dealer, who is selected randomly. Each player can either fold by not betting or do an additional bet to stay in the game. Players can either leave their cards face down on the table or choose to look at their hand before betting. Blind players can see their cards at any time in the game, but then they will become seen players.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Betting Process</h3>
            <p>
              The player to the left of the dealer will start the process and it will continue clockwise with players taking turns around the table. If a player decides to fold, they will sacrifice all the money they had paid permanently during the deal and drop out of the betting.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Seen player:</strong> Must bet a minimum of twice the current stake and a maximum of four times the current stake. For the next player, the current stake then becomes half the amount that you have bet.
              </li>
              <li>
                <strong>Blind player:</strong> Must put in at least the current stake amount and a maximum of twice the current stake. For the next player, the current stake is the same amount that you put in.
              </li>
            </ul>
            <p className="mt-2">
              Betting will continue until either everyone else but 1 player have folded (that player wins), or if 2 players haven't folded yet, one of those at their turn pays for a show.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Show</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>A show will occur only if 2 players are left standing.</li>
              <li>The cost of the show for a blind player is the current stake paid in the pot, whether the 2nd player is blind or seen.</li>
              <li>You are not allowed to look at your own cards until you have paid for the show.</li>
              <li>The seen player can only drop or continue to bet if the 2nd player is blind. The seen player cannot demand a show in this case.</li>
              <li>In both the players are 'seen', either of them can pay twice the current stake for the show.</li>
              <li>Both players' cards are exposed in a show and the winner of the pot is the one whose hand is higher ranking. If the hands come out to be equal, the player who didn't pay for the show wins the pot.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Sideshow</h3>
            <p>
              If all the players are seen, instantly after betting the minimum amount at your turn, ask the player who bet just before you for a compromise, also called as a sideshow. That player has 2 options:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>If they accept the compromise, the 2 players will compare their cards. The one with lower-ranking cards will fold, and if the cards are equal, the one who asked for the compromise will fold.</li>
              <li>If the sideshow is refused, the betting will continue as usual.</li>
            </ul>
          </section>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;