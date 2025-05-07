import React from 'react';


export function AdminNavbar({ activeView, onSelect, onSignOut }) {
    const navItems = [
      { display: 'Home', view: 'AdminHome' },
      { display: 'Listed Items', view: 'ListedItems' },
      { display: 'Marketplace', view: 'AdminMarketplace' },
    ];
  
    return (
      <nav className="navbar">
        {navItems.map(({ display, view }) => (
          <button
            key={view}
            className={`nav-item ${activeView === view ? 'active' : ''}`}
            onClick={() => onSelect(view)}
          >
            {display}
          </button>
        ))}
        <button className="nav-item sign-out-btn" onClick={onSignOut}>
          Sign Out
        </button>
      </nav>
    );
  }