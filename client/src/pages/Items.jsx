import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('user/itemsowned')
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

  const handleSell = (item) => {
    // Implement sell logic here
    console.log('Selling item:', item);
    // Add API call to move item to marketplace
  };

  if (loading) return <div className="loading">Loading your items...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="items-container">
      <h2 className="items-header">Inventory</h2>
      
      {items.length === 0 ? (
        <div className="empty-state">You don't own any items yet.</div>
      ) : (
        <div className="items-grid">
          <div className="grid-header">
            <div>Item Name</div>
            <div>Type</div>
            <div>Rarity</div>
            <div>Actions</div>
          </div>
          
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <div className="item-name">
                {item.item_name}
              </div>
              <div className="item-type">
                {item.item_type}
              </div>
              <div className={`item-rarity ${item.item_rarity.toLowerCase()}`}>
                {item.item_rarity}
              </div>
              <div className="item-actions">
                <button 
                  className="sell-button"
                  onClick={() => handleSell(item)}
                >
                  Sell Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}