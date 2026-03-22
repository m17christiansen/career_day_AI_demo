import React, { useState, useEffect, useCallback } from 'react';
import './GridGame.css';

const GridGame = () => {
  const GRID_SIZE = 16;
  
  // Game state
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [computerPos, setComputerPos] = useState({ x: 15, y: 15 });
  const [gameStatus, setGameStatus] = useState('playing');
  const [turn, setTurn] = useState('computer');
  const [obstacles, setObstacles] = useState([]);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Simple SVG Icons
  const PlayerIcon = () => (
    <svg viewBox="0 0 24 24" className="cell-icon">
      <circle cx="12" cy="8" r="4" fill="#2196F3" />
      <path d="M12 12 C8 12 4 16 4 20 L20 20 C20 16 16 12 12 12 Z" fill="#2196F3" />
    </svg>
  );

  const ComputerIcon = () => (
    <svg viewBox="0 0 24 24" className="cell-icon">
      <rect x="4" y="4" width="16" height="12" rx="2" fill="#f44336" />
      <rect x="6" y="6" width="12" height="8" fill="#fff" />
      <circle cx="9" cy="10" r="1" fill="#f44336" />
      <circle cx="15" cy="10" r="1" fill="#f44336" />
      <rect x="8" y="18" width="8" height="2" fill="#f44336" />
    </svg>
  );

  const ObstacleIcon = () => (
    <svg viewBox="0 0 24 24" className="cell-icon">
      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="#9c27b0" />
      <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" fill="#7b1fa2" />
    </svg>
  );

  // Arrow Key Icons
  const ArrowUpIcon = () => (
    <svg viewBox="0 0 24 24" className="arrow-icon">
      <path d="M12 8l-6 6h12l-6-6z" fill="currentColor" />
    </svg>
  );

  const ArrowDownIcon = () => (
    <svg viewBox="0 0 24 24" className="arrow-icon">
      <path d="M12 16l6-6H6l6 6z" fill="currentColor" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg viewBox="0 0 24 24" className="arrow-icon">
      <path d="M8 12l6-6v12l-6-6z" fill="currentColor" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" className="arrow-icon">
      <path d="M16 12l-6 6V6l6 6z" fill="currentColor" />
    </svg>
  );

  // Confetti component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
      size: Math.random() * 10 + 5
    }));

    return (
      <div className="confetti-container">
        {confettiPieces.map(piece => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.animationDelay}s`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`
            }}
          />
        ))}
      </div>
    );
  };

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('empty'));
    
    // Set start and end positions
    newGrid[0][0] = 'player';
    newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = 'computer';
    
    // Generate obstacles
    const newObstacles = [];
    let obstaclesCount = 0;
    const maxObstacles = Math.floor(GRID_SIZE * GRID_SIZE * 0.15);
    
    while (obstaclesCount < maxObstacles) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      if ((x === 0 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) ||
          (x === 1 && y === 0) || (x === 0 && y === 1) ||
          (x === GRID_SIZE - 2 && y === GRID_SIZE - 1) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 2)) {
        continue;
      }
      
      if (newGrid[y][x] === 'empty') {
        newGrid[y][x] = 'obstacle';
        newObstacles.push({ x, y });
        obstaclesCount++;
      }
    }
    
    setGrid(newGrid);
    setObstacles(newObstacles);
    setPlayerPos({ x: 0, y: 0 });
    setComputerPos({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
    setGameStatus('playing');
    setTurn('computer');
    setGameOverMessage('');
    setShowConfetti(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const isValidPosition = (x, y) => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && grid[y][x] !== 'obstacle';
  };

  const manhattanDistance = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  // Handle game over and reset
  const handleGameOver = useCallback((message, isWin = false) => {
    setGameStatus('gameOver');
    setGameOverMessage(message);
    
    if (isWin) {
      setShowConfetti(true);
    }
    
    // Reset the game after 2 seconds
    setTimeout(() => {
      initializeGame();
    }, 2000);
  }, [initializeGame]);

  const computerMove = useCallback(() => {
    if (gameStatus !== 'playing' || turn !== 'computer') return;

    const directions = [
      { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, 
      { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
    ];

    let bestMove = null;
    let bestDistance = manhattanDistance(computerPos, playerPos);
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);

    shuffledDirections.forEach(({ dx, dy }) => {
      const newX = computerPos.x + dx;
      const newY = computerPos.y + dy;

      if (isValidPosition(newX, newY)) {
        const newDistance = manhattanDistance({ x: newX, y: newY }, playerPos);
        if (newDistance < bestDistance || bestMove === null) {
          bestDistance = newDistance;
          bestMove = { x: newX, y: newY };
        }
      }
    });

    if (!bestMove) {
      shuffledDirections.forEach(({ dx, dy }) => {
        const newX = computerPos.x + dx;
        const newY = computerPos.y + dy;
        if (isValidPosition(newX, newY) && !bestMove) {
          bestMove = { x: newX, y: newY };
        }
      });
    }

    if (bestMove) {
      const newGrid = [...grid];
      newGrid[computerPos.y][computerPos.x] = 'empty';
      newGrid[bestMove.y][bestMove.x] = 'computer';
      
      setGrid(newGrid);
      setComputerPos(bestMove);

      // Check if computer caught the player
      if (bestMove.x === playerPos.x && bestMove.y === playerPos.y) {
        handleGameOver('Computer caught you! Game resetting...', false);
      } else {
        setTurn('player');
      }
    }
  }, [computerPos, playerPos, grid, gameStatus, turn, handleGameOver]);

  const playerMove = (dx, dy) => {
    if (gameStatus !== 'playing' || turn !== 'player') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (isValidPosition(newX, newY)) {
      const newGrid = [...grid];
      newGrid[playerPos.y][playerPos.x] = 'empty';
      newGrid[newY][newX] = 'player';
      
      setGrid(newGrid);
      setPlayerPos({ x: newX, y: newY });

      // Check win condition
      if (newX === GRID_SIZE - 1 && newY === GRID_SIZE - 1) {
        handleGameOver('You reached the goal! Game resetting...', true);
      } else {
        setTurn('computer');
      }
    }
  };

  // Handle arrow button clicks
  const handleArrowClick = (direction) => {
    switch (direction) {
      case 'up':
        playerMove(0, -1);
        break;
      case 'down':
        playerMove(0, 1);
        break;
      case 'left':
        playerMove(-1, 0);
        break;
      case 'right':
        playerMove(1, 0);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (turn !== 'player') return;
      switch (e.key) {
        case 'ArrowUp': playerMove(0, -1); break;
        case 'ArrowDown': playerMove(0, 1); break;
        case 'ArrowLeft': playerMove(-1, 0); break;
        case 'ArrowRight': playerMove(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerMove, turn]);

  useEffect(() => {
    if (turn === 'computer' && gameStatus === 'playing') {
      const timer = setTimeout(() => computerMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameStatus, computerMove]);

  const renderCell = (x, y) => {
    const cellType = grid[y][x];
    let icon = null;
    let label = null;
    let cellClass = `grid-cell ${cellType}`;

    // Add special classes for start and finish cells
    if (x === 0 && y === 0) {
      cellClass += ' start-cell';
      label = <span className="cell-label">Start</span>;
    } else if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) {
      cellClass += ' finish-cell';
      label = <span className="cell-label">Finish</span>;
    }

    switch (cellType) {
      case 'player':
        icon = <PlayerIcon />;
        break;
      case 'computer':
        icon = <ComputerIcon />;
        break;
      case 'obstacle':
        icon = <ObstacleIcon />;
        break;
      default:
        icon = null;
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
      >
        {icon}
        {label}
      </div>
    );
  };

  return (
    <div className="grid-game-container">
      {showConfetti && <Confetti />}
      <div className="grid-game">
        <div className="game-controls">
          <h2>Grid Game</h2>
          <div className="status-container">
            {gameOverMessage ? (
              <div className="game-over-message">
                <p className="game-over-text">{gameOverMessage}</p>
              </div>
            ) : (
              <>
                <p className={`status ${gameStatus}`}>
                  Status: <span className="status-text">
                    {gameStatus === 'playing' ? 'Playing' : 'Game Over'}
                  </span>
                </p>
                <p className="turn-info">
                  Turn: <span className="turn-text">
                    {turn === 'player' ? 'Your Turn' : 'Computer Thinking...'}
                  </span>
                </p>
              </>
            )}
          </div>
          
          <div className="arrow-controls">
            <div className="arrow-controls-label">Arrow Controls:</div>
            <div className="arrow-grid">
              <div className="arrow-row">
                <button 
                  className="arrow-btn up-btn"
                  onClick={() => handleArrowClick('up')}
                  disabled={turn !== 'player' || gameStatus !== 'playing'}
                >
                  <ArrowUpIcon />
                </button>
              </div>
              <div className="arrow-row middle-row">
                <button 
                  className="arrow-btn left-btn"
                  onClick={() => handleArrowClick('left')}
                  disabled={turn !== 'player' || gameStatus !== 'playing'}
                >
                  <ArrowLeftIcon />
                </button>
                <button 
                  className="arrow-btn down-btn"
                  onClick={() => handleArrowClick('down')}
                  disabled={turn !== 'player' || gameStatus !== 'playing'}
                >
                  <ArrowDownIcon />
                </button>
                <button 
                  className="arrow-btn right-btn"
                  onClick={() => handleArrowClick('right')}
                  disabled={turn !== 'player' || gameStatus !== 'playing'}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
          
          <button onClick={initializeGame} className="restart-btn">
            Restart Game Now
          </button>
        </div>
        
        <div className="grid-container">
          <div className="grid">
            {grid.map((row, y) => (
              <div key={y} className="grid-row">
                {row.map((_, x) => renderCell(x, y))}
              </div>
            ))}
          </div>
        </div>

        <div className="instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>Use arrow keys or buttons to move your character</li>
            <li>Reach the <span className="finish-text">Finish</span> (green) to win</li>
            <li>Start from the <span className="start-text">Start</span> (red) position</li>
            <li>Avoid the computer and obstacles</li>
            <li>Computer moves first each round</li>
            <li>Game automatically resets after win/lose</li>
          </ul>
          <div className="legend">
            <h4>Legend:</h4>
            <div className="legend-item">
              <PlayerIcon />
              <span>Player (You)</span>
            </div>
            <div className="legend-item">
              <ComputerIcon />
              <span>Computer (Enemy)</span>
            </div>
            <div className="legend-item">
              <ObstacleIcon />
              <span>Obstacle (Blocked)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color start-color"></div>
              <span>Start Position</span>
            </div>
            <div className="legend-item">
              <div className="legend-color finish-color"></div>
              <span>Finish Position</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridGame;
