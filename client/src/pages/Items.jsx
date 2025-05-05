import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SellModal = ({ item, onConfirm, onCancel }) => {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    onConfirm(price);
  };

  return (
    <div className="sell-modal-overlay">
      <div className="sell-modal">
        <h3>Sell {item.item_name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <label>
              Selling Price (UC):
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setError('');
                }}
                min="1"
                className="price-input"
                required
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="confirm-button">
                List Item
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);

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

  const handleSellClick = (item) => {
    setSelectedItem(item);
    setShowSellModal(true);
  };

  const handleConfirmSell = async (price) => {
    try {
      await api.post('user/listItem', {
        item_id: selectedItem.item_id,
        selling_price: parseFloat(price)
      });
      setShowSellModal(false);
      alert(`${selectedItem.item_name} listed in marketplace successfully!`);
    } catch (err) {
      console.error('Sell error:', err);
      alert(err.response?.data?.message || 'Failed to list item for sale');
    }
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
          
          {items.map((item) => (
            <div className="item-row" key={item.item_id}>
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
                  onClick={() => handleSellClick(item)}
                >
                  Sell Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSellModal && (
        <SellModal
          item={selectedItem}
          onConfirm={handleConfirmSell}
          onCancel={() => setShowSellModal(false)}
        />
      )}
    </div>
  );
}