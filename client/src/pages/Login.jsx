// src/pages/Login.jsx (or wherever you handle login)
import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post('/auth/login', { username, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    onLogin(); // e.g. switch view to Items or Profile
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs for username & password */}
      <button type="submit">Login</button>
    </form>
  );
}
