import React from 'react';


export function Navbar({ onSelect, onSignOut, activeView }) {
  return (
    <nav className="navbar">
      {['Home', 'Marketplace', 'Transactions', 'Profile', 'Inventory'].map(name => (
        <button
          key={name}
          className={`nav-item ${activeView === name ? 'active' : ''}`}
          onClick={() => onSelect(name)}
        >
          {name}
        </button>
      ))}
      <button className="nav-item sign-out-btn" onClick={onSignOut}>
        Sign Out
      </button>
    </nav>
  );
}