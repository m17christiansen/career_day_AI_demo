import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

import EmojiIcon from './emoji_game/emojiIcon'
import GridGameIcon from './grid_game/gridIcon'
import AnimatedDrawingGameIcon from './drawing_app/drawingIcon'

function Home() {
  return (
    <div className="App">
      <div className='main-body'>
        <h2 className="page-title">Hewitt Elementary, Welcome to Career Day 2026</h2>
        
        <div className="buttons-container">
          <Link to="/drawing-game" className="game-link">
            <button className="drawing-game-button">
              <AnimatedDrawingGameIcon size={60} />
            </button>
            <p>AI Drawing Game</p>
          </Link>
          
          <Link to="/grid-game" className="game-link">
            <button className="drawing-game-button">
              <GridGameIcon size={60} />
            </button>
            <p>AI Grid Game</p>
          </Link>
          
          <Link to="/emoji-game" className="game-link">
            <button className="drawing-game-button">
              <EmojiIcon size={60} />
            </button>
            <p>AI Emoji Game</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
