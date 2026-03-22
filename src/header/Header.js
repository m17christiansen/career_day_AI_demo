import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="App-header">
      <div className="header-content">
        <button className="icon-button" onClick={() => window.location.href = '/'}>HE</button>
        <h1>Career day 2026</h1>
      </div>
    </header>
  );
}

export default Header;