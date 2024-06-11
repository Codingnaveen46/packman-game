/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import wall from "./assets/wall.png";
import coin from "./assets/coin.png";
import pacman from "./assets/pacman.png";
import bg from "./assets/bg.png";
import ghost from "./assets/ghost2.png";
import "./App.css"; // Import your CSS file

const PacManGame = () => {
  // State for PacMan position and game map
  const [pacmanPos, setPacmanPos] = useState({ x: 6, y: 4 });
  const [ghostPos, setGhostPos] = useState({ x: 7, y: 7 });
  const [map, setMap] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [gameOver, setGameOver] = useState(false);

  // Function to handle PacMan movement
  const handleKeyDown = useCallback(
    (event) => {
      if (gameOver) {
        return; // If the game is over, don't handle key events
      }
      let newX = pacmanPos.x;
      let newY = pacmanPos.y;

      if (event.keyCode === 37 && pacmanPos.x > 0 && map[pacmanPos.y][pacmanPos.x - 1] !== 1) {
        newX = pacmanPos.x - 1;
      } else if (event.keyCode === 38 && pacmanPos.y > 0 && map[pacmanPos.y - 1][pacmanPos.x] !== 1) {
        newY = pacmanPos.y - 1;
      } else if (event.keyCode === 39 && pacmanPos.x < map[0].length - 1 && map[pacmanPos.y][pacmanPos.x + 1] !== 1) {
        newX = pacmanPos.x + 1;
      } else if (event.keyCode === 40 && pacmanPos.y < map.length - 1 && map[pacmanPos.y + 1][pacmanPos.x] !== 1) {
        newY = pacmanPos.y + 1;
      }

      if (newX !== pacmanPos.x || newY !== pacmanPos.y) {
        setMap((prevMap) => {
          const newMap = [...prevMap];
          newMap[pacmanPos.y][pacmanPos.x] = 3;
          newMap[newY][newX] = 5;
          return newMap;
        });
        setPacmanPos({ x: newX, y: newY });
        checkWinningCondition(newX, newY);
      }
    },
    [pacmanPos, map, gameOver]
  );

  // Function to check for winning condition and collision detection
  const checkWinningCondition = (newX, newY) => {
    if (!map.some((row) => row.includes(2))) {
      setGameOver(true);
      alert("Congratulations! You collected all the coins. You win!");
    } else if (map[newY][newX] === 4) {
      setGameOver(true);
      alert("Game over !! You collided with the ghost");
    }
  };

  // Function to move the ghost
  const moveGhost = () => {
    if (gameOver) return;

    const directions = [
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 },  // right
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
    ];

    let validMoves = directions.filter((dir) => {
      const newX = ghostPos.x + dir.x;
      const newY = ghostPos.y + dir.y;
      return newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length && map[newY][newX] !== 1;
    });

    if (validMoves.length > 0) {
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      const newX = ghostPos.x + move.x;
      const newY = ghostPos.y + move.y;

      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[ghostPos.y][ghostPos.x] = 3; // Set old ghost position to ground
        newMap[newY][newX] = 4; // Set new ghost position
        return newMap;
      });

      setGhostPos({ x: newX, y: newY });
      checkWinningCondition(pacmanPos.x, pacmanPos.y);
    }
  };

  // Initial rendering
  useEffect(() => {
    const handleKeyDownEvent = (event) => handleKeyDown(event);
    document.addEventListener("keydown", handleKeyDownEvent);

    // Move ghost every second
    const ghostInterval = setInterval(() => {
      moveGhost();
    }, 1000);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDownEvent);
      clearInterval(ghostInterval);
    };
  }, [handleKeyDown, ghostPos, gameOver]);

  return (
    <div id="world" style={{ backgroundColor: "white" }}>
      {/* Render the game map */}
      {map.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={
                cell === 1
                  ? "wall"
                  : cell === 2
                  ? "coin"
                  : cell === 3
                  ? "ground"
                  : cell === 4
                  ? "ghost"
                  : cell === 5
                  ? "pacman"
                  : null
              }
              style={
                cell === 1
                  ? { backgroundImage: `url(${wall})` }
                  : cell === 2
                  ? { backgroundImage: `url(${coin})` }
                  : cell === 3
                  ? { backgroundImage: `url(${bg})` }
                  : cell === 4
                  ? { backgroundImage: `url(${ghost})` }
                  : cell === 5
                  ? { backgroundImage: `url(${pacman})` }
                  : null
              }
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PacManGame;
