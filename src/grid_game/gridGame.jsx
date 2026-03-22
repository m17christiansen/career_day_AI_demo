import React, { useState, useEffect, useCallback } from 'react';
import './GridGame.css';

const GridGame = () => {
  const GRID_SIZE = 16;
  
  // Game state
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [computerPos, setComputerPos] = useState({ x: 15, y: 15 });
  const [computer2Pos, setComputer2Pos] = useState({ x: 7, y: 7 });
  const [computer3Pos, setComputer3Pos] = useState({ x: 8, y: 8 });
  const [gameStatus, setGameStatus] = useState('playing');
  const [turn, setTurn] = useState('computer');
  const [obstacles, setObstacles] = useState([]);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [showInfoPane, setShowInfoPane] = useState(false);

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

  const Computer2Icon = () => (
    <svg viewBox="0 0 24 24" className="cell-icon">
      <rect x="4" y="4" width="16" height="12" rx="2" fill="#FF9800" />
      <rect x="6" y="6" width="12" height="8" fill="#fff" />
      <circle cx="9" cy="10" r="1" fill="#FF9800" />
      <circle cx="15" cy="10" r="1" fill="#FF9800" />
      <rect x="8" y="18" width="8" height="2" fill="#FF9800" />
    </svg>
  );

  const Computer3Icon = () => (
    <svg viewBox="0 0 24 24" className="cell-icon">
      <rect x="4" y="4" width="16" height="12" rx="2" fill="#9C27B0" />
      <rect x="6" y="6" width="12" height="8" fill="#fff" />
      <circle cx="9" cy="10" r="1" fill="#9C27B0" />
      <circle cx="15" cy="10" r="1" fill="#9C27B0" />
      <rect x="8" y="18" width="8" height="2" fill="#9C27B0" />
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

  // Info Icon
  const InfoIcon = () => (
    <svg viewBox="0 0 24 24" className="info-icon">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">i</text>
    </svg>
  );

  // Close Icon
  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" className="close-icon">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
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

  // Calculate Manhattan distance
  const manhattanDistance = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  // Check if position is valid (not obstacle, not another computer, within bounds)
  const isValidPosition = useCallback((x, y, occupiedPositions = []) => {
    // Check bounds
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return false;
    }
    
    // Check for obstacle
    if (grid[y] && grid[y][x] === 'obstacle') {
      return false;
    }
    
    // Check if position is occupied by another computer or player
    const isOccupied = occupiedPositions.some(pos => pos.x === x && pos.y === y);
    if (isOccupied) {
      return false;
    }
    
    return true;
  }, [grid]);

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('empty'));
    
    // Set start and end positions
    newGrid[0][0] = 'player';
    
    // Set computer positions based on difficulty
    if (difficulty === 'hard') {
      newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = 'computer1';
      newGrid[7][7] = 'computer2';
      newGrid[8][8] = 'computer3';
    } else {
      newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = 'computer';
    }
    
    // Generate obstacles
    const newObstacles = [];
    let obstaclesCount = 0;
    const maxObstacles = Math.floor(GRID_SIZE * GRID_SIZE * 0.15);
    
    while (obstaclesCount < maxObstacles) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      // Don't place obstacles on start/end positions or where computers are
      const isOccupied = (x === 0 && y === 0) || 
        (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) ||
        (difficulty === 'hard' && ((x === 7 && y === 7) || (x === 8 && y === 8))) ||
        (x === 1 && y === 0) || (x === 0 && y === 1) ||
        (x === GRID_SIZE - 2 && y === GRID_SIZE - 1) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 2);
      
      if (isOccupied) {
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
    
    if (difficulty === 'hard') {
      setComputer2Pos({ x: 7, y: 7 });
      setComputer3Pos({ x: 8, y: 8 });
    }
    
    setGameStatus('playing');
    setTurn('computer');
    setGameOverMessage('');
    setShowConfetti(false);
  }, [difficulty]);

  // Initialize on mount and when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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

  // Improved computer AI for different difficulties
  const getComputerMove = useCallback((currentPos, targetPos, occupiedPositions = [], avoidMovingAway = false) => {
    const directions = [
      { dx: 0, dy: -1, name: 'up' }, 
      { dx: 1, dy: 0, name: 'right' }, 
      { dx: 0, dy: 1, name: 'down' }, 
      { dx: -1, dy: 0, name: 'left' }
    ];

    // Get all valid moves (not obstacles, not occupied by other entities)
    const validMoves = directions
      .map(({ dx, dy, name }) => ({
        x: currentPos.x + dx,
        y: currentPos.y + dy,
        name,
        distance: manhattanDistance({ x: currentPos.x + dx, y: currentPos.y + dy }, targetPos)
      }))
      .filter(move => isValidPosition(move.x, move.y, [...occupiedPositions, playerPos]));

    if (validMoves.length === 0) {
      return null; // No valid moves
    }

    // For medium/hard difficulty: prioritize moves that get closer
    if (avoidMovingAway) {
      const currentDistance = manhattanDistance(currentPos, targetPos);
      const closerMoves = validMoves.filter(move => move.distance < currentDistance);
      
      if (closerMoves.length > 0) {
        // Choose the move that gets closest
        const bestMove = closerMoves.reduce((best, current) => 
          current.distance < best.distance ? current : best
        );
        return { x: bestMove.x, y: bestMove.y };
      }
      
      // If no closer moves, try to maintain same distance
      const sameDistanceMoves = validMoves.filter(move => move.distance === currentDistance);
      if (sameDistanceMoves.length > 0) {
        // Randomly choose from same-distance moves
        const randomIndex = Math.floor(Math.random() * sameDistanceMoves.length);
        const chosenMove = sameDistanceMoves[randomIndex];
        return { x: chosenMove.x, y: chosenMove.y };
      }
    }

    // For easy difficulty or when no good moves found
    // Choose randomly from valid moves
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const chosenMove = validMoves[randomIndex];
    return { x: chosenMove.x, y: chosenMove.y };
  }, [isValidPosition, playerPos]);

  const computerMove = useCallback(() => {
    if (gameStatus !== 'playing' || turn !== 'computer') return;

    const newGrid = [...grid];
    let playerCaught = false;

    // For hard difficulty: plan all moves first, then execute
    if (difficulty === 'hard') {
      // Get planned moves for all computers
      const plannedMoves = [];
      
      // Plan move for computer 1 (red)
      const computer1Move = getComputerMove(
        computerPos, 
        playerPos,
        [computer2Pos, computer3Pos], // Avoid other computers
        true
      );
      plannedMoves.push({ 
        originalPos: computerPos, 
        move: computer1Move, 
        type: 'computer1',
        setter: setComputerPos 
      });
      
      // Plan move for computer 2 (orange) - avoid planned computer1 move
      const occupiedForComputer2 = [
        computer3Pos,
        ...(computer1Move ? [computer1Move] : [computerPos]) // Avoid computer1's new position
      ];
      const computer2Move = getComputerMove(
        computer2Pos, 
        playerPos,
        occupiedForComputer2,
        true
      );
      plannedMoves.push({ 
        originalPos: computer2Pos, 
        move: computer2Move, 
        type: 'computer2',
        setter: setComputer2Pos 
      });
      
      // Plan move for computer 3 (purple) - avoid planned moves of other computers
      const occupiedForComputer3 = [
        ...(computer1Move ? [computer1Move] : [computerPos]),
        ...(computer2Move ? [computer2Move] : [computer2Pos])
      ];
      const computer3Move = getComputerMove(
        computer3Pos, 
        playerPos,
        occupiedForComputer3,
        true
      );
      plannedMoves.push({ 
        originalPos: computer3Pos, 
        move: computer3Move, 
        type: 'computer3',
        setter: setComputer3Pos 
      });
      
      // Execute all planned moves
      plannedMoves.forEach(({ originalPos, move, type, setter }) => {
        if (move) {
          // Clear old position
          newGrid[originalPos.y][originalPos.x] = 'empty';
          
          // Set new position
          newGrid[move.y][move.x] = type;
          
          // Update position state
          setter(move);
          
          // Check if caught player
          if (move.x === playerPos.x && move.y === playerPos.y) {
            playerCaught = true;
          }
        }
      });
    } else {
      // For easy/medium: just move the main computer
      const occupiedPositions = difficulty === 'medium' ? [] : [];
      const mainComputerMove = getComputerMove(
        computerPos, 
        playerPos,
        occupiedPositions,
        difficulty === 'medium' || difficulty === 'hard'
      );

      if (mainComputerMove) {
        newGrid[computerPos.y][computerPos.x] = 'empty';
        newGrid[mainComputerMove.y][mainComputerMove.x] = 'computer';
        setComputerPos(mainComputerMove);
        
        if (mainComputerMove.x === playerPos.x && mainComputerMove.y === playerPos.y) {
          playerCaught = true;
        }
      }
    }

    setGrid(newGrid);

    if (playerCaught) {
      handleGameOver('Computer caught you! Game resetting...', false);
    } else {
      setTurn('player');
    }
  }, [computerPos, computer2Pos, computer3Pos, playerPos, grid, gameStatus, turn, difficulty, getComputerMove, handleGameOver]);

  const playerMove = (dx, dy) => {
    if (gameStatus !== 'playing' || turn !== 'player') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Player can't move onto obstacles or computers
    const occupiedPositions = difficulty === 'hard' 
      ? [computerPos, computer2Pos, computer3Pos]
      : [computerPos];
    
    if (isValidPosition(newX, newY, occupiedPositions)) {
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

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Toggle info pane
  const toggleInfoPane = () => {
    setShowInfoPane(!showInfoPane);
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
    const cellType = grid[y] && grid[y][x];
    let icon = null;
    let label = null;
    let cellClass = `grid-cell ${cellType || 'empty'}`;

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
      case 'computer1':
        icon = <ComputerIcon />;
        break;
      case 'computer2':
        icon = <Computer2Icon />;
        break;
      case 'computer3':
        icon = <Computer3Icon />;
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
      
      {/* Info Button */}
      <button className="info-button" onClick={toggleInfoPane}>
        <InfoIcon />
      </button>
      
      {/* Info Pane */}
      <div className={`info-pane ${showInfoPane ? 'open' : ''}`}>
        <div className="info-pane-header">
          <h2>AI Behind This Game</h2>
          <button className="close-button" onClick={toggleInfoPane}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="info-pane-content">
          <div className="ai-section">
            <h3>Pathfinding Algorithm</h3>
            <p>The computer opponents use a <strong>Manhattan Distance</strong> heuristic to chase the player:</p>
            <ul>
              <li><strong>Distance Calculation:</strong> |x1 - x2| + |y1 - y2|</li>
              <li><strong>Movement Logic:</strong> Computers evaluate all possible moves each turn</li>
              <li><strong>Obstacle Avoidance:</strong> Paths around obstacles automatically</li>
              <li><strong>Collision Prevention:</strong> Computers avoid moving into each other</li>
            </ul>
          </div>
          
          <div className="difficulty-section">
            <h3>Difficulty Levels Explained</h3>
            
            <div className="difficulty-detail">
              <h4>Easy Mode</h4>
              <p><strong>AI Behavior:</strong> Random movement with obstacle avoidance</p>
              <p><strong>Strategy:</strong> Computer moves randomly but won't hit obstacles</p>
            </div>
            
            <div className="difficulty-detail">
              <h4>Medium Mode</h4>
              <p><strong>AI Behavior:</strong> Greedy pathfinding towards player</p>
              <p><strong>Strategy:</strong> Always chooses moves that reduce distance to player</p>
              <p><strong>Algorithm:</strong> Prioritizes moves that decrease Manhattan distance</p>
            </div>
            
            <div className="difficulty-detail">
              <h4>Hard Mode</h4>
              <p><strong>AI Behavior:</strong> Coordinated multi-agent pursuit</p>
              <p><strong>Strategy:</strong> Three computers with coordinated movement</p>
              <p><strong>Features:</strong>
                <ul>
                  <li>Simultaneous movement planning</li>
                  <li>Collision avoidance between computers</li>
                  <li>Surrounding tactics</li>
                  <li>Fallback to random movement when blocked</li>
                </ul>
              </p>
            </div>
          </div>
          
          <div className="technical-section">
            <h3>Technical Implementation</h3>
            <p><strong>State Management:</strong> React hooks for game state and AI decisions</p>
            <p><strong>Move Validation:</strong> Checks for boundaries, obstacles, and collisions</p>
            <p><strong>Turn-based System:</strong> Alternating player/computer turns</p>
            <p><strong>Real-time Updates:</strong> 500ms delay for computer "thinking"</p>
          </div>
          
          <div className="strategy-tips">
            <h3>Player Strategy Tips</h3>
            <ul>
              <li>Use obstacles as shields against computers</li>
              <li>Plan moves several steps ahead</li>
              <li>In hard mode, watch for coordinated movements</li>
              <li>Use the grid edges to limit approach directions</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Overlay for when info pane is open */}
      {showInfoPane && <div className="overlay" onClick={toggleInfoPane}></div>}
      
      <div className="horizontal-scroll-container">
        <div className="grid-game">
          <div className="game-controls">
            <h2>Grid Game</h2>
            
            <div className="difficulty-controls">
              <div className="difficulty-label">Difficulty:</div>
              <div className="difficulty-buttons">
                <button 
                  className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('easy')}
                >
                  Easy
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('hard')}
                >
                  Hard
                </button>
              </div>
              <div className="difficulty-description">
                {difficulty === 'easy' && 'Computer moves randomly'}
                {difficulty === 'medium' && 'Computer always tries to get closer'}
                {difficulty === 'hard' && 'Three smart computers chase you!'}
              </div>
            </div>
            
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
                  <p className="difficulty-info">
                    Difficulty: <span className="difficulty-text">{difficulty.toUpperCase()}</span>
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
              <li>Avoid the computers and obstacles</li>
              <li>Computer moves first each round</li>
              <li>Game automatically resets after win/lose</li>
            </ul>
            
            <div className="difficulty-info-section">
              <h4>Difficulty Levels:</h4>
              <ul>
                <li><strong>Easy:</strong> Computer moves randomly (avoids obstacles)</li>
                <li><strong>Medium:</strong> Computer always tries to get closer to you</li>
                <li><strong>Hard:</strong> Three smart computers chase you simultaneously!</li>
              </ul>
            </div>
            
            <div className="legend">
              <h4>Legend:</h4>
              <div className="legend-item">
                <PlayerIcon />
                <span>Player (You)</span>
              </div>
              <div className="legend-item">
                <ComputerIcon />
                <span>Computer (Red)</span>
              </div>
              {difficulty === 'hard' && (
                <>
                  <div className="legend-item">
                    <Computer2Icon />
                    <span>Computer (Orange)</span>
                  </div>
                  <div className="legend-item">
                    <Computer3Icon />
                    <span>Computer (Purple)</span>
                  </div>
                </>
              )}
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
    </div>
  );
};

export default GridGame;
