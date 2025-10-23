// src/components/BookingList.jsx
/* import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import LoadingSpinner from './LoadingSpinner';

export default function BookingList({ onView }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadBookings(); }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await api.get('/api/reservations');
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      setToast('Failed to load bookings');
    } finally { setLoading(false); }
  }

  async function confirmBooking(id) {
    setLoading(true);
    try {
      await api.post(`/api/reservations/${id}/confirm`);
      setToast('Booking confirmed');
      loadBookings();
    } catch (err) {
      console.error(err);
      setToast('Confirm failed');
    } finally { setLoading(false); }
  }

  async function deleteBooking(id) {
    if (!window.confirm('Delete this reservation?')) return;
    setLoading(true);
    try {
      await api.delete(`/api/reservations/${id}`);
      setToast('Deleted');
      loadBookings();
    } catch (err) {
      console.error(err);
      setToast('Delete failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4">
      <Toast message={toast} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Reservations</h2>
        <button onClick={loadBookings} className="border px-3 py-1 rounded">Refresh</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {bookings.length === 0 && <div>No bookings found.</div>}
          {bookings.map(b => (
            <div key={b.reservationID} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">Reservation #{b.reservationID}</div>
                <div className="text-sm">Status: {b.status}</div>
                <div className="text-sm">User ID: {b.userID}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => onView(b)} className="border px-2 py-1 rounded">View</button>
                <button onClick={() => confirmBooking(b.reservationID)} className="bg-green-500 text-white px-2 py-1 rounded">Confirm</button>
                <button onClick={() => deleteBooking(b.reservationID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}*/

// src/components/BookingList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

export default function BookingList({ onView }) {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, pageSize, page]);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await api.get('/api/reservations');
      setBookings(res.data || []);
      setPage(1);
      setToast('');
    } catch (err) {
      console.error(err);
      setToast('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let list = bookings.slice(); // clone
    if (statusFilter !== 'ALL') {
      list = list.filter((b) => (b.status || '').toUpperCase() === statusFilter);
    }
    setFiltered(list);
    // ensure page is valid
    const maxPage = Math.max(1, Math.ceil(list.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }

  function handleStatusFilterChange(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  function pageSlice() {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }

  function canPrev() { return page > 1; }
  function canNext() { return page * pageSize < filtered.length; }

  // Actions
  async function confirmBooking(id) {
    if (!window.confirm('Confirm this booking?')) return;
    setLoading(true);
    try {
      await api.post(`/api/reservations/${id}/confirm`);
      setToast('Booking confirmed');
      await loadBookings();
    } catch (err) {
      console.error(err);
      setToast('Confirm failed');
    } finally { setLoading(false); }
  }

  async function deleteBooking(id) {
    if (!window.confirm('Delete this reservation?')) return;
    setLoading(true);
    try {
      await api.delete(`/api/reservations/${id}`);
      setToast('Deleted');
      await loadBookings();
    } catch (err) {
      console.error(err);
      setToast('Delete failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4">
      <Toast message={toast} />
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Active Reservations</h2>

        <div className="flex items-center gap-2">
          <label className="text-sm">Status</label>
          <select value={statusFilter} onChange={handleStatusFilterChange} className="border p-1 rounded">
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <label className="text-sm ml-2">Per page</label>
          <select value={pageSize} onChange={handlePageSizeChange} className="border p-1 rounded">
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={8}>8</option>
          </select>

          <button onClick={loadBookings} className="border px-3 py-1 rounded ml-2">Refresh</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No reservations found.</div>
          ) : (
            <div className="space-y-3">
              {pageSlice().map(b => (
                <div key={b.reservationID} className="p-3 bg-white rounded shadow flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="font-semibold">Reservation #{b.reservationID}</div>
                    <div className="text-sm text-gray-600">Status: <span className="font-medium">{b.status}</span></div>
                    <div className="text-sm text-gray-600">User ID: {b.userID}</div>
                    <div className="text-sm text-gray-600">Start: {b.startDate || '—'}</div>
                    <div className="text-sm text-gray-600">Package: {b.packageID || '—'}</div>
                  </div>

                  <div className="flex gap-2 mt-3 md:mt-0">
                    <button onClick={() => onView(b)} className="border px-2 py-1 rounded">View</button>
                    <button onClick={() => confirmBooking(b.reservationID)} className="bg-green-500 text-white px-2 py-1 rounded">Confirm</button>
                    <button onClick={() => deleteBooking(b.reservationID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(filtered.length === 0) ? 0 : ((page - 1) * pageSize + 1)} – {Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => canPrev() && setPage(page - 1)} disabled={!canPrev()} className="border px-3 py-1 rounded disabled:opacity-50">Prev</button>
                <div>Page {page}</div>
                <button onClick={() => canNext() && setPage(page + 1)} disabled={!canNext()} className="border px-3 py-1 rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

