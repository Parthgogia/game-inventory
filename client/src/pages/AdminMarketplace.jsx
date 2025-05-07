import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function AdminMarketplace() {
  const [listings, setListings] = useState([]);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newCommission, setNewCommission] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/marketplace')
      .then(res => setListings(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (item) => {
    try {
        const response = await api.delete(`/admin/deleteMarketplaceItem`, {
            data: { 
              item_id: item.item_id,
              seller_id: item.seller_id
            }
        });
      
      if (response.data.success) {
        setListings(listings.filter(listing => listing.item_id !== item.item_id));
        alert('Listing deleted successfully');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error.response?.data?.message || 'Failed to delete listing');
    }
  };

  const openCommissionModal = (item) => {
    setSelectedItem(item);
    setNewCommission(item.commission);
    setShowCommissionModal(true);
    setError('');
  };

  const handleCommissionSubmit = async () => {
    const commissionValue = parseFloat(newCommission);
    
    if (isNaN(commissionValue) || commissionValue < 0 || commissionValue > 1) {
      setError('Please enter a valid commission between 0 and 1');
      return;
    }

    try {
      const response = await api.patch(`/admin/updateCommission`, {
        commission: commissionValue,
        item_id: selectedItem.item_id,
        seller_id: selectedItem.seller_id
      });

      if (response.data.success) {
        setListings(listings.map(listing => 
          listing.item_id === selectedItem.item_id 
            ? { ...listing, commission: commissionValue }
            : listing
        ));
        setShowCommissionModal(false);
        alert('Commission updated successfully');
      }
    } catch (error) {
      console.error('Commission update failed:', error);
      alert(error.response?.data?.message || 'Failed to update commission');
    }
  };

  return (
    <div className="marketplace-container">
      <h2>Admin Marketplace Management</h2>
      <div className="table-wrapper">
        <table className="marketplace-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Item Name</th>
              <th>Rarity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Commission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={`${item.owner_name}-${item.item_name}-${item.item_id}`}>
                <td>{item.owner_name}</td>
                <td>{item.item_name}</td>
                <td className={`rarity ${item.rarity.toLowerCase()}`}>
                  {item.rarity}
                </td>
                <td>{item.selling_price} UC</td>
                <td>{item.status}</td>
                <td>{(item.commission * 100).toFixed(1)}%</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                    <button
                      className="commission-button"
                      onClick={() => openCommissionModal(item)}
                    >
                      Set Commission
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCommissionModal && (
        <div className="modal-overlay">
          <div className="commission-modal">
            <h3>Set Commission for {selectedItem?.item_name}</h3>
            <div className="modal-content">
              <label>
                New Commission (0-1):
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                />
              </label>
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-buttons">
                <button onClick={handleCommissionSubmit}>Save</button>
                <button onClick={() => setShowCommissionModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}