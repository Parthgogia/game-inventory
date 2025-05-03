import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function Transactions() {
  const [bought, setBought] = useState([]);
  const [sold, setSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ bought: null, sold: null });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError({ bought: null, sold: null });

        const [boughtRes, soldRes] = await Promise.all([
          api.get('user/buyTransactions'),
          api.get('user/sellTransactions')
        ]);

        console.log('BUY fetched:', boughtRes.data);
        console.log('SELL fetched:', soldRes.data);

        setBought(boughtRes.data);
        setSold(soldRes.data);
      } catch (err) {
        console.error(err);
        setError({
          bought: err.response?.status === 404 ? null : 'Failed to load purchases',
          sold: err.response?.status === 404 ? null : 'Failed to load sales'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>

      <div className="transactions-section">
        <h3>Purchases</h3>
        {error.bought ? (
          <div className="error">{error.bought}</div>
        ) : bought.length === 0 ? (
          <p className="empty">No purchases found</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bought.map(t => (
                <tr key={t.transaction_id}>
                  <td>{formatDate(t.transaction_date)}</td>
                  <td>{t.item_name}</td>
                  <td>{t.seller_name}</td>
                  <td>UC {t.selling_price}</td>
                  <td className={`status ${t.status}`}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="transactions-section">
        <h3>Sales</h3>
        {error.sold ? (
          <div className="error">{error.sold}</div>
        ) : sold.length === 0 ? (
          <p className="empty">No sales found</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Buyer</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sold.map(t => (
                <tr key={t.transaction_id}>
                  <td>{formatDate(t.transaction_date)}</td>
                  <td>{t.item_name}</td>
                  <td>{t.buyer_name}</td>
                  <td>UC {t.selling_price}</td>
                  <td className={`status ${t.status}`}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}