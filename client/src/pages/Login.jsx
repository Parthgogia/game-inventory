import React, { useState } from 'react';
import api from '../services/api';

export function Login({ onSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    dob: '',
    age: ''
  });
  const [error, setError] = useState('');

  const toggleMode = () => {
    setError('');
    setIsRegistering(r => !r);
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registration
        await api.post('/auth/register', {
          username: form.username,
          password: form.password,
          email:    form.email,
          dob:      form.dob,
          age:      parseInt(form.age, 10)
        });
      }

      // Login (common to both flows)
      const res = await api.post('/auth/login', {
        username: form.username,
        password: form.password
      });
      const { token } = res.data;
      localStorage.setItem('token', token);
      onSuccess();   // e.g. App.jsx will switch to Home view
    } catch (err) {
      console.error(err);
      // show either backend message or generic fallback
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong'
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Username<br/>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password<br/>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {isRegistering && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Email<br/>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Date of Birth<br/>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>
                Age<br/>
                <input
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </>
        )}

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        {isRegistering
          ? 'Already have an account? '
          : "Don't have an account? "}
        <button
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#61dafb',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}
