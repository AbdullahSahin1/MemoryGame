import React, { useState, useEffect } from "react";
import "./App.css";

const cardImages = [
  { src: "/img/apple.jpg", matched: false },
  { src: "/img/banana.jpg", matched: false },
  { src: "/img/cherry.jpg", matched: false },
  { src: "/img/grape.jpg", matched: false },
  { src: "/img/orange.jpg", matched: false },
  { src: "/img/strawberry.jpg", matched: false },
  { src: "/img/avacado.jpg", matched: false },
  { src: "/img/pineapple.jpg", matched: false },
  { src: "/img/watermelon.jpg", matched: false },
  { src: "/img/nar.jpg", matched: false },
  { src: "/img/eggplant.jpg", matched: false },
  { src: "/img/lemon.jpg", matched: false },
];

function Game() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(""); // Kazanma mesajı için state
  const [gameStarted, setGameStarted] = useState(false); // Oyun başladı mı?
  const [gameOver, setGameOver] = useState(false); // Oyun bitti mi?

  // Kartları karıştır
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setMoves(0);
    setMessage("");
    setGameOver(false); // Oyun bitişini sıfırla
  };

  // Oyunu başlatma butonuna tıklandığında
  const startGame = () => {
    shuffleCards();
    setGameStarted(true);
  };

  // Kart seçimi
  const handleChoice = (card) => {
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  // Eşleşme kontrolü
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
        setMessage("Tebrikler! İki görsel eşleşti.");
        setTimeout(() => {
          setMessage("");
          resetTurn();
        }, 1000);
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1500);
      }
    }
  }, [firstChoice, secondChoice]);

  // Tüm eşleşmeler kontrolü
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setMessage("Tebrikler Oyunu Kazandınız!");
      setTimeout(() => {
        setMessage("");
        resetTurn();
      }, 10000);
      setGameOver(true); // Oyun bitti
    }
  }, [cards]);

  // Tur sıfırlama
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setMoves((prevMoves) => prevMoves + 1);
    setDisabled(false);
  };

  // Oyunu başlat
  useEffect(() => {
    if (gameStarted) {
      shuffleCards();
    }
  }, [gameStarted]);

  return (
    <div className="App">
      <h1>Hafıza Oyunu</h1>
      {!gameStarted ? (
        <button onClick={startGame}>Oyunu Başla</button>
      ) : (
        <>
          <p>Hamle Sayısı: {moves}</p>
          {message && <p className="message">{message}</p>} {/* Mesaj alanı */}
          {gameOver && (
            <div className="game-over">
              <p>Oyunu Kazandınız!</p>
              <button onClick={shuffleCards}>Yeniden Başlat</button>
            </div>
          )}
          <div className="card-grid">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  card === firstChoice || card === secondChoice || card.matched
                }
                disabled={disabled}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="card front" />
        <div className="back" onClick={handleClick}></div>
      </div>
    </div>
  );
}

export default Game;
