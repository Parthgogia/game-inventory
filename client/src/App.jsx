import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { AdminNavbar } from './components/AdminNavbar';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { Profile } from './pages/Profile';
import { Items } from './pages/Items';
import { Transactions } from './pages/Transactions'; 
import { AdminHome} from './pages/AdminHome'
import { AdminMarketplace } from './pages/AdminMarketplace'
import {ListedItems} from './pages/ListedItems'


export default function App() {
  const [view, setView] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);
  
  const handleSuccess = () => {
    setIsLoggedIn(true);
    setView('Home');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    setView('Home');
  };

  if (!isLoggedIn) {
    return (
      <Login
        onSuccess={handleSuccess}
        onSetRole={role => {
          setUserRole(role);
          localStorage.setItem('role', role);
          handleSuccess();
        }}
      />
    );
  }

  let Content;
  if (userRole === 'admin') {
    switch (view) {
      case 'ListedItems':         Content = <ListedItems />;    break;
      case 'AdminMarketplace':    Content = <AdminMarketplace />;  break;
      default:                    Content = <AdminHome />;     break;
    }
  } else {
    switch (view) {
      case 'Marketplace':  Content = <Marketplace />;  break;
      case 'Profile':      Content = <Profile />;      break;
      case 'Inventory':    Content = <Items />;        break;
      case 'Transactions': Content = <Transactions />; break;
      default:             Content = <Home />;         break;
    }
  }

  const NavbarComponent = userRole === 'admin' ? AdminNavbar : Navbar;

  return (
    <>
      <NavbarComponent
        onSelect={setView}
        onSignOut={handleSignOut}
        role={userRole}
        activeView={view} 
      />
      {Content}
    </>
  );
}