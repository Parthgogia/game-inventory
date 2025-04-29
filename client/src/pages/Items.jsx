import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/items/owned')
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load items');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your items…</p>;
  if (error)   return <p>{error}</p>;

  return (
    <div>
      <h2>My Items</h2>
      {items.length === 0
        ? <p>You don’t own any items yet.</p>
        : (
          <ul>
            {items.map(item => (
              <li key={item.item_id}>{item.name}</li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
