import React, { useEffect, useState } from 'react';
import api from '../services/api';
// import './Profile.css'; // Create this CSS file

export function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    api.get('/user/profile')
      .then(res => setProfile(res.data[0]))
      .catch(console.error);
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-header">Player Profile</h2>
      
      <div className="profile-grid">
        <div className="profile-section">
          <h3>Basic Information</h3>
          <div className="profile-item">
            <span className="label">User ID:</span>
            <span className="value">{profile.user_id}</span>
          </div>
          <div className="profile-item">
            <span className="label">Username:</span>
            <span className="value">{profile.user_name}</span>
          </div>
          <div className="profile-item">
            <span className="label">Email:</span>
            <span className="value">{profile.email}</span>
          </div>
          <div className="profile-item">
            <span className="label">Level:</span>
            <span className="value">{profile.level}</span>
          </div>
        </div>

        <div className="profile-section wallet-section">
          <h3>Wallet Balance</h3>
          <div className="profile-item">
            <span className="label">Battle Points (BP):</span>
            <span className="value bp">{profile.bp}</span>
          </div>
          <div className="profile-item">
            <span className="label">Universal Credits (UC):</span>
            <span className="value uc">{profile.uc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}