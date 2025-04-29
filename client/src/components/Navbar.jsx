import React from 'react';

export function Navbar({ onSelect,onSignOut }) {
  return (
    <nav className="navbar">
      {['Home', 'Marketplace', 'Profile', 'My Items'].map(name => (
        <button key={name} onClick={() => onSelect(name)}>
          {name}
        </button>
      ))}

      <button
        style={{ marginLeft: 'auto', backgroundColor: '#e74c3c', color: 'white' }}
        onClick={onSignOut}
      >
        Sign Out
      </button>
    </nav>
  );
}