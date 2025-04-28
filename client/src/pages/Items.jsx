import React, { useEffect, useState } from 'react';
// import api from '../services/api';

export function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/items/owned')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>My Items</h2>
      <ul>
        {items.map(it => <li key={it.item_id}>{it.name}</li>)}
      </ul>
    </div>
  );
}