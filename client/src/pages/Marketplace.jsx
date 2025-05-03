import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function Marketplace() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/user/marketplace')
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  const handleBuy = async (item) => {
    console.log(item);    
    try {
      const response = await api.post('user/purchase', {
        seller_id: item.seller_id,
        item_id: item.item_id
      });
  
      if (response.data.success) {
        // Remove purchased item from the marketplace list
        setItems(items.filter(i => i.item_id !== item.item_id));
        alert('Purchase successful!');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error.response?.data?.message || 'Failed to complete purchase');
    }
  };

  return (
    <div className="marketplace-container">
      <h2>Marketplace Listings</h2>
      <div className="table-wrapper">
        <table className="marketplace-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Owner</th>
              <th>Rarity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.owner_name}-${item.item_name}`}>
                <td>{item.item_name}</td>
                <td>{item.owner_name}</td>
                <td className={`rarity ${item.rarity.toLowerCase()}`}>
                  {item.rarity}
                </td>
                <td>{item.selling_price} UC</td>
                <td>{item.status}</td>
                <td>
                  <button 
                    className="buy-button"
                    onClick={() => handleBuy(item)}
                  >
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}