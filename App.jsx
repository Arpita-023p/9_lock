import React, { useState, useEffect } from "react";
import "./App.css";

const locks = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "echo",
    hint: "It's a sound phenomenon.",
    points: 10,
  },
  {
    question: "What has keys but can't open locks?",
    answer: "keyboard",
    hint: "You're using it right now.",
    points: 15,
  },
  {
    question: "What has to be broken before you can use it?",
    answer: "egg",
    hint: "Think about breakfast.",
    points: 20,
  },
  // Add more questions here...
];

function App() {
  const [playerName, setPlayerName] = useState("");
  const [currentLock, setCurrentLock] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shuffledLocks, setShuffledLocks] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [results, setResults] = useState([]);

  // Shuffle locks at the start of the game
  useEffect(() => {
    if (isGameActive) {
      setShuffledLocks(shuffleArray(locks));
    }
  }, [isGameActive]);

  // Timer
  useEffect(() => {
    let timerInterval;
    if (isGameActive && !isGameOver) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isGameActive, isGameOver]);

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Start the game
  const startGame = () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }
    setIsGameActive(true);
    setIsGameOver(false);
    setCurrentLock(0);
    setScore(0);
    setTime(0);
  };

  // Check the answer
  const checkAnswer = (userAnswer) => {
    const correctAnswer = shuffledLocks[currentLock].answer;
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setScore((prevScore) => prevScore + shuffledLocks[currentLock].points);
      if (currentLock + 1 < shuffledLocks.length) {
        setCurrentLock((prevLock) => prevLock + 1);
      } else {
        endGame();
      }
    } else {
      alert("Incorrect! Try again.");
    }
  };

  // End the game
  const endGame = () => {
    setIsGameActive(false);
    setIsGameOver(true);
    saveResult(playerName, score, time);
  };

  // Save the result to localStorage
  const saveResult = (name, score, time) => {
    const result = { name, score, time };
    const updatedResults = JSON.parse(localStorage.getItem("results")) || [];
    updatedResults.push(result);
    localStorage.setItem("results", JSON.stringify(updatedResults));
    setResults(updatedResults);
  };

  // Display the leaderboard
  const displayLeaderboard = () => {
    const storedResults = JSON.parse(localStorage.getItem("results")) || [];
    setResults(storedResults);
    setShowLeaderboard(true);
  };

  // Reset the game
  const resetGame = () => {
    setPlayerName("");
    setIsGameActive(false);
    setIsGameOver(false);
    setShowLeaderboard(false);
  };

  return (
    <div className="App">
      <h1>9 Locks Game</h1>
      {!isGameActive && !isGameOver && !showLeaderboard && (
        <div className="start-screen">
          <label>
            Enter your name:
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <button onClick={startGame}>Start Game</button>
          <button onClick={displayLeaderboard}>Show Leaderboard</button>
        </div>
      )}

      {isGameActive && (
        <div className="game-screen">
          <h2>Lock {currentLock + 1}</h2>
          <p>{shuffledLocks[currentLock]?.question}</p>
          <input
            type="text"
            placeholder="Enter your answer"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                checkAnswer(e.target.value);
                e.target.value = "";
              }
            }}
          />
          <button onClick={() => checkAnswer(document.querySelector("input").value)}>
            Submit
          </button>
          <button onClick={() => alert(`Hint: ${shuffledLocks[currentLock].hint}`)}>
            Hint
          </button>
          <button onClick={endGame}>Leave Game</button>
          <div className="score-screen">
            <h3>Score: {score}</h3>
            <h3>Time: {time}s</h3>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <p>Time Taken: {time}s</p>
          <button onClick={resetGame}>Play Again</button>
          <button onClick={displayLeaderboard}>Show Leaderboard</button>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-screen">
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.score}</td>
                  <td>{result.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={resetGame}>Back to Game</button>
        </div>
      )}
    </div>
  );
}

export default App;