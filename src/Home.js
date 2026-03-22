import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="App">
      <div className='main-body'>
        <h2>Welcome to Career Day 2026</h2>
        <p>AI Drawing Game</p>
        <Link to="/drawing-game">
          <button className="drawing-game-button">
            Go to Drawing Game
          </button>
        </Link>
        <p>AI Grid Game</p>
        <Link to="/grid-game">
          <button className="drawing-game-button">
            Go to Grid Game
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;