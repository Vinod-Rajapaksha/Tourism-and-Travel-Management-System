
/*import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function BookingDetail({ booking, onClose }) {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await api.get('/api/guides');
        console.log('Guides:', res.data);
        setGuides(res.data);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setMessage('Failed to load guides');
      }
    };
    fetchGuides();
  }, []);

  const handleAssign = async () => {
    if (!selectedGuide) {
      setMessage('Please select a guide first');
      return;
    }
    try {
      await api.put(`/api/reservations/${booking.reservationID}/assignGuide?guideId=${selectedGuide}`);
      setMessage('Guide assigned successfully');
    } catch (err) {
      console.error('Error assigning guide:', err);
      setMessage('Failed to assign guide');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-3">Reservation #{booking.reservationID}</h2>

        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>User:</strong> {booking.userID}</p>
        <p><strong>Package:</strong> {booking.packageID}</p>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Select Guide</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedGuide}
            onChange={(e) => setSelectedGuide(e.target.value)}
          >
            <option value="">Select...</option>
            {guides.length > 0 ? (
              guides.map((g) => (
                <option key={g.guideID} value={g.guideID}>
                  {g.name || g.fullName || `Guide #${g.guideID}`}
                </option>
              ))
            ) : (
              <option disabled>No guides available</option>
            )}
          </select>
        </div>

        {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Assign
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} */

// src/components/BookingDetail.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

export default function BookingDetail({ booking, onClose, onAssigned }) {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!booking) return;
    fetchGuides();
  }, [booking]);

  async function fetchGuides() {
    setLoading(true);
    try {
      const res = await api.get('/api/guides');
      setGuides(res.data || []);
    } catch (err) {
      console.error('Failed to load guides', err);
      setToast('Failed to load guides');
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    if (!selectedGuide) return setToast('Select a guide first');
    setLoading(true);
    try {
      // adjust endpoint param as backend expects
      await api.put(`/api/reservations/${booking.reservationID}/assignGuide?guideId=${selectedGuide}`);
      setToast('Guide assigned');
      if (onAssigned) onAssigned();
      // option: refresh reservation details from server here
    } catch (err) {
      console.error(err);
      setToast('Assign failed');
    } finally {
      setLoading(false);
    }
  }

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        <Toast message={toast} />

        <h3 className="text-xl font-bold mb-3">Reservation #{booking.reservationID}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600"><b>Status:</b> {booking.status}</div>
            <div className="text-sm text-gray-600"><b>User ID:</b> {booking.userID}</div>
            <div className="text-sm text-gray-600"><b>Package ID:</b> {booking.packageID}</div>
            <div className="text-sm text-gray-600"><b>Start date:</b> {booking.startDate || '—'}</div>
            <div className="text-sm text-gray-600"><b>End date:</b> {booking.endDate || '—'}</div>
            <div className="text-sm text-gray-600"><b>Payment ID:</b> {booking.paymentID || '—'}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600"><b>Guide ID:</b> {booking.guideID || '—'}</div>
            <div className="text-sm text-gray-600"><b>Created at:</b> {booking.createdAt || '—'}</div>
            <div className="text-sm text-gray-600"><b>Updated at:</b> {booking.updatedAt || '—'}</div>
            <div className="text-sm text-gray-600"><b>Notes:</b> {booking.notes || '—'}</div>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <label className="block mb-2 font-semibold">Select Guide</label>
          {loading ? <LoadingSpinner /> : (
            <select value={selectedGuide} onChange={(e) => setSelectedGuide(e.target.value)} className="border w-full p-2 rounded">
              <option value="">Select...</option>
              {guides.map(g => (
                <option key={g.guideID || g.id} value={g.guideID || g.id}>
                  {g.name || (g.fName ? `${g.fName} ${g.lName || ''}` : `Guide #${g.guideID || g.id}`)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={handleAssign} className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
          <button onClick={onClose} className="border px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}


