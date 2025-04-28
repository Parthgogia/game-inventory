import React from 'react';

export function Navbar({ onSelect }) {
  return (
    <nav className="navbar">
      {['Home', 'Marketplace', 'Profile', 'My Items'].map(name => (
        <button key={name} onClick={() => onSelect(name)}>
          {name}
        </button>
      ))}
    </nav>
  );
}