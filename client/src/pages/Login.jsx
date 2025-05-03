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
        await api.post('/auth/register', {
          ...form,
          age: parseInt(form.age, 10)
        });
      }

      const res = await api.post('/auth/login', {
        username: form.username,
        password: form.password
      });
      
      localStorage.setItem('token', res.data.token);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-header">
          {isRegistering ? 'REGISTER' : 'LOGIN'}
        </h2>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">
              Username
              <input
                className="auth-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">
              Password
              <input
                className="auth-input"
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
              <div className="auth-input-group">
                <label className="auth-label">
                  Email
                  <input
                    className="auth-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  Date of Birth
                  <input
                    className="auth-input"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="auth-input-group">
                <label className="auth-label">
                  Age
                  <input
                    className="auth-input"
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

          <button className="auth-button" type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="auth-toggle">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="auth-toggle-button" onClick={toggleMode}>
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
}