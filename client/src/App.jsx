import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { Profile } from './pages/Profile';
import { Items } from './pages/Items';
import { Transactions } from './pages/Transactions'; 

export default function App() {
  const [view, setView] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSuccess = () => {
    setIsLoggedIn(true);
    setView('Home');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onSuccess={handleSuccess} />;
  }

  let Content;
  switch (view) {
    case 'Marketplace': Content = <Marketplace />; break;
    case 'Profile': Content = <Profile />; break;
    case 'Inventory': Content = <Items />; break;
    case 'Transactions': Content = <Transactions />; break; // Add this case
    default: Content = <Home />;
  }

  return (
    <>
      <Navbar onSelect={setView} onSignOut={handleSignOut}/>
      {Content}
    </>
  );
}