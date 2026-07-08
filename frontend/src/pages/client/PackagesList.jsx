import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ClientPackagesPage.css';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ClientPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_low');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(1000000);

  const navigate = useNavigate();

  // 🔹 Fetch packages from backend
  useEffect(() => {
    setLoading(true);
    api.get("/packages/with-availability")
      .then((res) => {
        const activePkgs = res.data.filter(pkg => pkg.status === "ACTIVE" || !pkg.status);
        setPackages(activePkgs);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
            api.get("/packages")
          .then((res) => {
            const activePkgs = res.data.filter(pkg => pkg.status === "ACTIVE" || !pkg.status);
            setPackages(activePkgs);
          })
          .catch((err2) => console.error("Fallback error:", err2));
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter Categories
  const categories = [
    { id: 'ALL', label: 'All Regions', icon: 'bi-globe-americas' },
    { id: 'KANDY', label: 'Kandy & Cultural', icon: 'bi-bank' },
    { id: 'BEACHES', label: 'Southern Coast', icon: 'bi-water' },
    { id: 'HIGHLANDS', label: 'Misty Highlands', icon: 'bi-cloud-fog' },
    { id: 'HERITAGE', label: 'Ancient Heritage', icon: 'bi-shield-check' },
    { id: 'WILDLIFE', label: 'Wildlife & Safaris', icon: 'bi-tree' },
  ];

  // 🔹 Filter + sort
  const filteredPackages = useMemo(() => {
    return packages
      .filter(pkg => {
        const matchesSearch = !searchTerm || 
          (pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pkg.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pkg.category?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = locationFilter === 'ALL' || 
          pkg.category?.trim().toUpperCase() === locationFilter.trim().toUpperCase() ||
          pkg.location?.trim().toUpperCase().includes(locationFilter.trim().toUpperCase());

        const priceVal = pkg.offer || pkg.price || 0;
        const matchesPrice = priceVal <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.offer || a.price || 0;
        const priceB = b.offer || b.price || 0;
        switch (sortBy) {
          case 'price_low':
            return priceA - priceB;
          case 'price_high':
            return priceB - priceA;
          case 'rating':
            return (b.rating || 4.8) - (a.rating || 4.8);
          case 'name':
            return (a.title || '').localeCompare(b.title || '');
          default:
            return 0;
        }
      });
  }, [packages, searchTerm, locationFilter, maxPrice, sortBy]);

  const calculateDiscount = (original, offer) => {
    if (!original || !offer || original <= offer) return null;
    return Math.round(((original - offer) / original) * 100);
  };

  return (
    <div className="client-packages-page">
      {/* Hero Section */}
      <section className="packages-hero">
        <div className="container text-center position-relative z-2">
          <div className="hero-badge">
            <i className="bi bi-compass-fill text-warning"></i> Ceylona Tour Packages
          </div>
          <h1 className="hero-title">Discover Your Next Extraordinary Adventure</h1>
          <p className="hero-subtitle">
            Immerse yourself in handpicked Sri Lankan itineraries with private chauffeurs, luxury boutique villas, and exclusive cultural access.
          </p>
          
          <div className="glass-search-container">
            <i className="bi bi-search text-muted ms-3 fs-5"></i>
            <input
              type="text"
              placeholder="Search destinations, villas, safari experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
            <button className="search-btn-gradient" onClick={() => {}}>
              <span>Search Tours</span> <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container filter-section">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          {/* Region Pills */}
          <div className="region-pills-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`region-pill ${locationFilter === cat.id ? 'active' : ''}`}
                onClick={() => setLocationFilter(cat.id)}
              >
                <i className={`bi ${cat.icon}`}></i> {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center">
            <span className="text-muted small fw-bold text-uppercase whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
              <option value="name">Package Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-5 text-center my-5">
            <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mt-3 fw-bold text-dark">Curating Luxury Itineraries...</h5>
            <p className="text-muted">Connecting to live database availability</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5 my-5 bg-white rounded-4 shadow-sm border p-5">
            <i className="bi bi-compass text-muted display-1 mb-3 d-block"></i>
            <h3 className="fw-bold text-dark">No Tour Packages Found</h3>
            <p className="text-muted max-w-md mx-auto mb-4">
              We couldn't find any travel packages matching your search criteria "{searchTerm}". Try adjusting your filters or browsing all regions.
            </p>
            <button
              className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
              onClick={() => { setSearchTerm(''); setLocationFilter('ALL'); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Packages Grid */
          <div className="packages-grid">
            {filteredPackages.map((pkg) => {
              const discount = calculateDiscount(pkg.price, pkg.offer);
              const pkgId = pkg.packageID || pkg.id;
              
              return (
                <div key={pkgId} className="tour-card">
                  <div className="card-img-wrapper">
                    <img
                      src={pkg.image || "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80"}
                      alt={pkg.title}
                      className="card-img"
                    />
                    <div className="card-overlay-top">
                      <span className="category-badge">
                        <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                        {pkg.category || pkg.location || "SRI LANKA"}
                      </span>
                      {discount && (
                        <span className="discount-badge">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body-content">
                    <div className="tour-meta">
                      <span><i className="bi bi-clock me-1 text-primary"></i> {pkg.duration || "5 Days / 4 Nights"}</span>
                      <div className="rating-stars">
                        <i className="bi bi-star-fill"></i>
                        <span className="text-dark fw-bold">{pkg.rating || "4.9"}</span>
                        <span className="text-muted">({Math.floor((pkg.rating || 4.9) * 12)} reviews)</span>
                      </div>
                    </div>

                    <h3 className="tour-title">{pkg.title}</h3>
                    <p className="tour-desc">{pkg.description}</p>

                    <div className="card-footer-action">
                      <div className="price-section">
                        <span className="price-label">Per Person Rate</span>
                        <div className="price-values">
                          <span className="offer-price">Rs {Number(pkg.offer || pkg.price).toLocaleString()}</span>
                          {discount && (
                            <span className="original-price">Rs {Number(pkg.price).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/package-details/${pkgId}`)}
                        className="btn-explore"
                      >
                        <span>Explore</span> <i className="bi bi-arrow-right-short fs-4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPackagesPage;
