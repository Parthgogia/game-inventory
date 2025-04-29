import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Level: {profile.level}</p>
      <p>BP: {profile.bp}, UC: {profile.uc}</p>
    </div>
  );
}