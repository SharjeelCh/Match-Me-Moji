import { useCallback, useState } from "react";

interface Card {
 id: number;
 emoji: string;
 isFlipped: boolean;
 isMatched: boolean;
}

const EMOJIS = [
 "emoticon-excited",
 "emoticon-happy",
 "emoticon-sad",
 "emoticon-angry",
 "emoticon-cool",
 "emoticon-dead",
 "emoticon-devil",
 "emoticon-kiss",
 "emoticon-lol",
 "emoticon-neutral",
 "emoticon-outline",
 "emoticon-poop",
 "emoticon-tongue",
 "emoticon-wink",
 "emoticon-cry",
 "emoticon-confused",
 "emoticon-sick",
 "emoticon-heart",
 "emoticon-happy-outline",
 "emoticon-sad-outline",
];

export const useMemoryGame = () => {
 const [cards, setCards] = useState<Card[]>([]);
 const [flippedCards, setFlippedCards] = useState<number[]>([]);
 const [moves, setMoves] = useState(0);
 const [isLocked, setIsLocked] = useState(false);
 const [matchResult, setMatchResult] = useState<"correct" | "incorrect" | null>(null);

 const initializeGame = useCallback(() => {
  const selectedEmojis = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, 10); // Select 10 emojis for 20 cards (10 pairs)

  const gameCards = [...selectedEmojis, ...selectedEmojis]
   .sort(() => Math.random() - 0.5)
   .map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
   }));

  setCards(gameCards);
  setFlippedCards([]);
  setMoves(0);
  setIsLocked(false);
 }, []);

 const flipCard = useCallback(
  (cardId: number) => {
   if (isLocked || flippedCards.includes(cardId)) return;

   const newFlippedCards = [...flippedCards, cardId];
   setFlippedCards(newFlippedCards);

   setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)));

   if (newFlippedCards.length === 2) {
    setIsLocked(true);
    setMoves((prev) => prev + 1);

    const [firstCard, secondCard] = newFlippedCards.map((id) => cards.find((card) => card.id === id)!);

    if (firstCard.emoji === secondCard.emoji) {
     setCards((prevCards) => prevCards.map((card) => (card.id === firstCard.id || card.id === secondCard.id ? { ...card, isMatched: true } : card)));
     setFlippedCards([]);
     setIsLocked(false);
     setMatchResult("correct"); // ✅ MATCH
    } else {
     setTimeout(() => {
      setCards((prevCards) => prevCards.map((card) => (card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card)));
      setFlippedCards([]);
      setIsLocked(false);
      setMatchResult("incorrect"); // ❌ NO MATCH
     }, 1000);
    }
   } else {
    setMatchResult(null); // just one card flipped, reset
   }
  },
  [cards, flippedCards, isLocked]
 );

 const isGameComplete = cards.length > 0 && cards.every((card) => card.isMatched);

 return {
  cards,
  moves,
  isGameComplete,
  initializeGame,
  flipCard,
  matchResult, // 🔊 expose it
 };
};
