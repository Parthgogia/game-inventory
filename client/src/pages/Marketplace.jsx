import React, { useEffect, useState } from 'react';
// import api from '../services/api';

export function Marketplace() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/items/marketplace')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Marketplace</h2>
      <ul>
        {items.map(item => (
          <li key={item.item_id}>
            {item.name} - {item.selling_price}
          </li>
        ))}
      </ul>
    </div>
  );
}