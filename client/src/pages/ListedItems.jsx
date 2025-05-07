import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AddItemModal = ({ onConfirm, onCancel }) => {
    const [newItem, setNewItem] = useState({
      name: '',
      type: 'Weapon',
      rarity: 'Common',
      uc_price: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Modified handleSubmit
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      if (!newItem.name || !newItem.uc_price || isNaN(newItem.uc_price)) {
        setError('Please fill all fields with valid values');
        return;
      }
  
      try {
        setIsSubmitting(true);
        await onConfirm(newItem);
        // Reset form after successful submission
        setNewItem({
          name: '',
          type: 'Weapon',
          rarity: 'Common',
          uc_price: ''
        });
      } catch (err) {
        // Errors are already handled in parent
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="modal-overlay">
      <div className="admin-add-item-modal">
        <h3>Add New Item</h3>
        <form onSubmit={handleSubmit}>
            <div className="admin-modal-content">
            <label>
              Item Name:
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
            </label>

            <label>
              Type:
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({...newItem, type: e.target.value})}
              >
                <option value="Weapon">Weapon</option>
                <option value="Armor">Armor</option>
                <option value="Potion">Potion</option>
                <option value="Accessory">Accessory</option>
              </select>
            </label>

            <label>
              Rarity:
              <select
                value={newItem.rarity}
                onChange={(e) => setNewItem({...newItem, rarity: e.target.value})}
              >
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </label>

            <label>
              UC Price:
              <input
                type="number"
                value={newItem.uc_price}
                onChange={(e) => setNewItem({...newItem, uc_price: e.target.value})}
                min="1"
                required
              />
            </label>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="confirm-button" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export function ListedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    api.get('admin/listedItems')
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load items');
        setLoading(false);
      });
  };

  const handleDelete = async (item) => {
    console.log(item);
    try {
        const response = await api.delete(`admin/deleteListedItem`, {
        data: { 
            item_id: item.item_id,
        }});

        if (response.data.success) {
            setItems(items.filter(i => i.item_id !== item.item_id ));
            alert('Item deleted successfully');
        }

    } catch (err) {
        console.error('Delete error:', err);
        alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

const handleAddItem = async (item) => {
    try {
      const response = await api.post('admin/addItem', {
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        uc_price: parseFloat(item.uc_price)
      });
  
      if (response.data.success) {
        setItems([...items, response.data.item]);
        setShowAddModal(false);  // This is the only state update needed here
        alert('Item added successfully');
      }
    } catch (err) {
      console.error('Add item error:', err);
      alert(err.response?.data?.message || 'Failed to add item');
    }
  };

  if (loading) return <div className="loading">Loading items...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-listed-container">
      <div className="header-row">
        <h2 className="items-header">Listed Items</h2>
        <button 
          className="admin-add-item-button"
          onClick={() => setShowAddModal(true)}
        >
          Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">No items found.</div>
      ) : (
        <div className="admin-items-grid">
            <div className="admin-grid-header">
            <div>Name</div>
            <div>Type</div>
            <div>Rarity</div>
            <div>UC Price</div>
            <div>Actions</div>
          </div>
          
          {items.map((item) => (
            <div className="item-row" key={item.item_id}>
              <div className="item-name">{item.name}</div>
              <div className="item-type">{item.type}</div>
              <div className={`item-rarity ${item.rarity.toLowerCase()}`}>
                {item.rarity}
              </div>
              <div className="item-price">{item.uc_price} UC</div>
              <div className="item-actions">
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddItemModal
          onConfirm={handleAddItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}