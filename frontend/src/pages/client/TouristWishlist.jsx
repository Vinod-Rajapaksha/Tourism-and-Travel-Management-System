import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Swal from 'sweetalert2';
import './TouristWishlist.css';

const TouristWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);

  const storageKey = `ceylona_vip_wishlist_${user?.clientID || user?.id || 'default'}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        setWishlistIds([]);
      }
    } else {
      setWishlistIds([]);
    }
    fetchPackages();
  }, [user]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      const data = res.data;
      const list = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
      setPackages(list);
    } catch (err) {
      console.error('Error fetching packages for wishlist:', err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (pkgId, pkgTitle) => {
    const updated = wishlistIds.filter(id => Number(id) !== Number(pkgId));
    setWishlistIds(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setCompareList(compareList.filter(id => Number(id) !== Number(pkgId)));
    Swal.fire({
      icon: 'info',
      title: 'Removed from Wishlist',
      text: `${pkgTitle} has been removed from your saved tours.`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleToggleCompare = (pkgId) => {
    if (compareList.includes(pkgId)) {
      setCompareList(compareList.filter(id => id !== pkgId));
    } else {
      if (compareList.length >= 3) {
        Swal.fire('Limit Reached', 'You can compare up to 3 tours side-by-side.', 'warning');
        return;
      }
      setCompareList([...compareList, pkgId]);
    }
  };

  const handleCompareModal = () => {
    const selectedPkgs = packages.filter(p => compareList.includes(p.packageID || p.id));
    if (selectedPkgs.length < 2) {
      Swal.fire('Select More Tours', 'Please check at least 2 tours to compare their inclusions and pricing.', 'info');
      return;
    }

    const tableHeaders = selectedPkgs.map(p => `<th style="padding: 1rem; color: #f59e0b; border-bottom: 2px solid #334155;">${p.title || 'Tour Package'}</th>`).join('');
    const durationRow = selectedPkgs.map(p => `<td style="padding: 0.8rem; border-bottom: 1px solid #334155;">${p.duration || '7 Days / 6 Nights'}</td>`).join('');
    const locationRow = selectedPkgs.map(p => `<td style="padding: 0.8rem; border-bottom: 1px solid #334155;">${p.location || p.destination || 'Sri Lanka'}</td>`).join('');
    const priceRow = selectedPkgs.map(p => `<td style="padding: 0.8rem; font-weight: bold; color: #10b981; border-bottom: 1px solid #334155;">LKR ${p.price ? Number(p.price).toLocaleString() : '145,000'}</td>`).join('');
    const ratingRow = selectedPkgs.map(() => `<td style="padding: 0.8rem; border-bottom: 1px solid #334155;">⭐⭐⭐⭐⭐ (4.9/5)</td>`).join('');
    const actionRow = selectedPkgs.map(p => `<td style="padding: 0.8rem;"><a href="/package-details/${p.packageID || p.id}" class="btn btn-sm btn-warning rounded-pill fw-bold px-3">View Details</a></td>`).join('');

    Swal.fire({
      title: 'Tour Package Comparison',
      width: '800px',
      html: `
        <div style="overflow-x: auto; text-align: left; background: #0f172a; color: #fff; border-radius: 1rem; padding: 1rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 1rem; color: #94a3b8; border-bottom: 2px solid #334155;">Feature</th>
                ${tableHeaders}
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 0.8rem; font-weight: bold; color: #94a3b8; border-bottom: 1px solid #334155;">Duration</td>${durationRow}</tr>
              <tr><td style="padding: 0.8rem; font-weight: bold; color: #94a3b8; border-bottom: 1px solid #334155;">Destination</td>${locationRow}</tr>
              <tr><td style="padding: 0.8rem; font-weight: bold; color: #94a3b8; border-bottom: 1px solid #334155;">Price</td>${priceRow}</tr>
              <tr><td style="padding: 0.8rem; font-weight: bold; color: #94a3b8; border-bottom: 1px solid #334155;">Rating</td>${ratingRow}</tr>
              <tr><td style="padding: 0.8rem; font-weight: bold; color: #94a3b8;">Action</td>${actionRow}</tr>
            </tbody>
          </table>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  const wishlistedPackages = packages.filter(p => wishlistIds.includes(Number(p.packageID || p.id)));

  return (
    <div className="wishlist-page-container container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-4">
        <div>
          <h1 className="fw-bold text-white mb-1">My Saved Wishlist</h1>
          <p className="text-white-50 mb-0">
            Save your favorite Sri Lankan tour packages and compare them side-by-side before booking.
          </p>
        </div>

        {/* Comparison Tray */}
        {compareList.length > 0 && (
          <div className="d-flex align-items-center gap-3 p-3 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-white fw-bold d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark rounded-pill">{compareList.length}</span> Selected
            </span>
            <button onClick={handleCompareModal} className="btn btn-warning btn-sm rounded-pill px-3 fw-bold">
              <i className="bi bi-columns-gap me-1"></i> Compare Tours
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 text-white-50">Loading tour packages...</p>
        </div>
      ) : wishlistedPackages.length === 0 ? (
        <div className="text-center py-5 rounded-4 p-5" style={{ background: '#1e293b', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
          <i className="bi bi-heart text-white-50 display-3 mb-3 d-block"></i>
          <h4 className="fw-bold text-white mb-2">Your Wishlist is Empty</h4>
          <p className="text-white-50 mb-4 max-w-md mx-auto">
            You haven't saved any tour packages yet. Browse our catalog to find your next travel adventure.
          </p>
          <Link to="/packages" className="btn btn-warning rounded-pill px-5 py-2 fw-bold text-dark">
            <i className="bi bi-compass-fill me-2"></i>Explore Tour Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistedPackages.map((pkg, idx) => {
            const pkgId = pkg.packageID || pkg.id || (1 + idx);
            const title = pkg.title || pkg.packageName || 'Sri Lanka Tour Package';
            const category = pkg.category || 'TOUR PACKAGE';
            const location = pkg.location || pkg.destination || 'Sri Lanka';
            const duration = pkg.duration || '7 Days / 6 Nights';
            const price = pkg.price ? Number(pkg.price).toLocaleString() : '145,000';
            const imgUrl = pkg.image || pkg.imageUrl;
            const isSelected = compareList.includes(pkgId);

            return (
              <div key={pkgId} className="col-lg-4 col-md-6">
                <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {/* Card Image */}
                  <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '200px', background: '#0f172a' }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={title} className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white-50">
                        <i className="bi bi-image fs-1"></i>
                      </div>
                    )}
                    <button 
                      onClick={() => handleRemoveFromWishlist(pkgId, title)} 
                      className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      title="Remove from wishlist"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="flex-grow-1">
                    <span className="badge bg-primary bg-opacity-25 text-primary mb-2">{category}</span>
                    <h5 className="fw-bold text-white mb-3">{title}</h5>

                    <div className="d-flex flex-wrap gap-3 mb-3 text-white-50 small">
                      <div><i className="bi bi-geo-alt text-warning me-1"></i>{location}</div>
                      <div><i className="bi bi-clock text-info me-1"></i>{duration}</div>
                    </div>

                    <div className="d-flex justify-content-between align-items-end pt-3 border-top border-secondary border-opacity-25 mb-3">
                      <div>
                        <span className="text-white-50 small d-block">Price per person</span>
                        <span className="fs-5 fw-bold text-success">LKR {price}</span>
                      </div>
                      <div className="text-warning small fw-semibold">
                        ⭐⭐⭐⭐⭐ <span className="text-white-50">(4.9)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <label className="d-flex align-items-center gap-2 text-white-50 small cursor-pointer mb-0">
                      <input 
                        type="checkbox" 
                        className="form-check-input mt-0"
                        checked={isSelected} 
                        onChange={() => handleToggleCompare(pkgId)} 
                      />
                      <span>Compare</span>
                    </label>

                    <Link to={`/package-details/${pkgId}`} className="btn btn-warning btn-sm rounded-pill px-4 fw-bold text-dark">
                      <span>View Details</span> <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TouristWishlist;
