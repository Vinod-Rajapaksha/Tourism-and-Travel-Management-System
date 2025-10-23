
/*import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import BookingList from './components/BookingList';
import BookingDetail from './components/BookingDetail';
import BookingHistory from './components/BookingHistory';

function Dashboard() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('list');
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white flex justify-between shadow">
        <h1 className="font-bold text-xl">Customer Service Executive Panel</h1>
        <nav className="space-x-3">
          <button
            onClick={() => setView('list')}
            className={`border px-3 py-1 rounded ${view === 'list' ? 'bg-blue-200' : ''}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setView('history')}
            className={`border px-3 py-1 rounded ${view === 'history' ? 'bg-blue-200' : ''}`}
          >
            History
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="p-6">
        {view === 'list' && <BookingList onView={setSelected} />}
        {view === 'history' && <BookingHistory />}
      </main>

      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';  // Changed from named to default import
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


