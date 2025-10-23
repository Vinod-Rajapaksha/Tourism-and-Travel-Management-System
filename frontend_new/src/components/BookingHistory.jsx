// src/components/BookingHistory.jsx
/*import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function BookingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const userId = 1; // TODO: replace with actual user id from auth if available
      const res = await api.get(`/api/reservations/history/${userId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {history.map(h => (
            <div key={h.reservationID} className="bg-white p-3 rounded shadow">
              <p><b>ID:</b> {h.reservationID}</p>
              <p>Status: {h.status}</p>
              <p>Start: {h.startDate}</p>
              <p>End: {h.endDate}</p>
            </div>
          ))}
          {history.length === 0 && <div>No history found.</div>}
        </div>
      )}
    </div>
  );
}*/

// src/components/BookingHistory.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

export default function BookingHistory() {
  const [userId, setUserId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchByUser() {
    if (!userId) {
      alert('Enter a user ID to search');
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/reservations/history/${userId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  }

  // optionally show all history by current user on mount (if you have current user id)
  useEffect(() => {
    // no auto action for now
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={searchByUser} className="bg-blue-600 text-white px-3 py-2 rounded">Search</button>
        <button onClick={() => { setUserId(''); setHistory([]); }} className="border px-3 py-2 rounded">Clear</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-sm text-gray-500">No history found.</div>
          ) : (
            history.map(h => (
              <div key={h.reservationID} className="bg-white p-3 rounded shadow">
                <div className="font-semibold">Reservation #{h.reservationID}</div>
                <div className="text-sm">Status: {h.status}</div>
                <div className="text-sm">Start: {h.startDate || '—'}</div>
                <div className="text-sm">End: {h.endDate || '—'}</div>
                <div className="text-sm">Package: {h.packageID || '—'}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

