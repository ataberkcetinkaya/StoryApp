import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './GuessTheNumber.css';

export default function GuessTheNumber(mobile) {
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Tahmin yapmaya başla!");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [congrats, setCongrats] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 99) + 1;
  }

  function giveHint(guess) {
    let hintMessage = "";
    if (Math.abs(randomNumber - guess) <= 3) {
      hintMessage = "Çok yakın!";
    } else if (Math.abs(randomNumber - guess) <= 5) {
      hintMessage = "Biraz daha yakın!";
    } else if (Math.abs(randomNumber - guess) <= 10) {
      hintMessage = "Yaklaştın!";
    }

    hintMessage += ` ${guess < randomNumber ? "Yukarı!" : "Aşağı!"}`;
    return hintMessage;
  }

  const updateTotalReward = async (points) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        const newTotalReward = (data.totalReward || 0) + points;
        await updateDoc(userRef, {
          totalReward: newTotalReward,
        });
      }
    }
  };

  const handleGuess = () => {
    if (attempts <= 0 || isGameOver) return;

    const numGuess = parseInt(guess, 10);
    let points = 0;

    if (numGuess === randomNumber) {
      setMessage("Tebrikler, doğru tahmin ettin!");
      setCongrats(true);
      points = 5;
      setScore(score + points);
      setIsGameOver(true);
    } else {
      if (Math.abs(randomNumber - numGuess) <= 3) points = 3;
      else if (Math.abs(randomNumber - numGuess) <= 5) points = 2;
      else if (Math.abs(randomNumber - numGuess) <= 10) points = 1;

      setScore(score + points);
      setMessage(`${giveHint(numGuess)} Puan: ${points}`);
      setAttempts(attempts - 1);
    }

    updateTotalReward(points);

    if (attempts - 1 === 0 && numGuess !== randomNumber) {
      setMessage("Tahmin hakkınız bitti! Doğru sayı: " + randomNumber);
      setIsGameOver(true);
      updateTotalReward(points);
    }
  };

  const restartGame = () => {
    setRandomNumber(generateRandomNumber());
    setGuess("");
    setMessage("Tahmin yapmaya başla!");
    setScore(0);
    setAttempts(3);
    setIsGameOver(false);
    setCongrats(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.length <= 2 && !isNaN(value)) {
      setGuess(value);
    }
  };

  return (
    <>
      {mobile ? (<> </>) : (
      <div className='navbar'>
        <Link to="/">
          <button className="back-button">Geri Dön</button>
        </Link>
      </div>
      )
    }

      <div className="game-wrapper">
        <h1 className="game-title">Sayı Tahmin Oyunu</h1>

        {!isGameOver && (
          <>
            <input
              type="text"
              onChange={handleInputChange}
              value={guess}
              disabled={isGameOver}
              min="1"
              max="99"
              className="guess-input"
              maxLength={2}
            />
            <button className="guess-button" onClick={handleGuess}>Tahmin Et</button>
            <p className="attempts">Kalan Haklar: {attempts}</p>
            <p className="score">Puan: {score}</p>
            <p className="message">{message}</p>
          </>
        )}

        {isGameOver && (
          <div className="game-over">
            <p className="final-score">Oyun Bitti! Final Puanınız: {score}</p>
            <p className="correct-number">Doğru Sayı: {randomNumber}</p>
            {congrats === true && <div className="congrats-message">Tebrikler, Doğru Tahmin!</div>}
            <button className="restart-button" onClick={restartGame}>Yeniden Oyna</button>
          </div>
        )}
      </div>
    </>
  );
}