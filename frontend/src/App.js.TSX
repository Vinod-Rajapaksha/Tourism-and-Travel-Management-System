import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ ADD
import './App.css';
import Calendar from './components/Calendar'; // ✅ ADD
import Reports from './components/Reports';   // ✅ ADD

function App() {
  return (
    <BrowserRouter> {/* ✅ WRAP EVERYTHING */}
      <div className="App">
        <header className="App-header">
          <h1>🎯 Promotions</h1>
          <p>Discover our latest offers and discounts</p>
        </header>
        
        <Routes> {/* ✅ ADD ROUTES */}
          <Route path="/" element={
            <main className="promotions-container">
              <div className="promotion-card">
                <h2>Limited Time Offer</h2>
                <p>Special discounts available this week only!</p>
                <span className="discount">20% OFF</span>
              </div>
              
              <div className="promotion-card">
                <h2>Weekend Special</h2>
                <p>Enjoy amazing deals every weekend</p>
                <span className="discount">15% OFF</span>
              </div>
              
              <div className="promotion-card">
                <h2>New Customer Bonus</h2>
                <p>First-time customers get extra benefits</p>
                <span className="discount">25% OFF</span>
              </div>
            </main>
          } />
          
          <Route path="/calendar" element={<Calendar promotions={[]} />} />
          <Route path="/reports" element={<Reports promotions={[]} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
