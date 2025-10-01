import React, { useState, useEffect } from 'react';
import './ClientPackagesPage.css';
import axios from 'axios';

const ClientPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');

  // 🔹 Fetch packages from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/packages")
      .then((res) => {
        // Only show ACTIVE packages
        setPackages(res.data.filter(pkg => pkg.status === "ACTIVE"));
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  // 🔹 Filter + sort
  const filteredPackages = packages
    .filter(pkg =>
      (pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pkg.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.offer - b.offer;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const remainingStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  const calculateDiscount = (original, offer) => {
    if (!original || !offer) return 0;
    return Math.round(((original - offer) / original) * 100);
  };

  const renderBookingModal = () => (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h3>Book Your Trip</h3>
          <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
        </div>

        <div className="booking-content">
          <div className="package-summary">
            <img src={selectedPackage?.image} alt={selectedPackage?.title} />
            <div className="summary-details">
              <h4>{selectedPackage?.title}</h4>
              <p className="location"> {selectedPackage?.location}</p>
              <p className="duration"> {selectedPackage?.duration}</p>
              <div className="booking-price">
  {selectedPackage?.offer < selectedPackage?.price ? (
    <>
      <span className="offer-price">${selectedPackage?.offer}</span>
      <span className="original-price">${selectedPackage?.price}</span>
    </>
  ) : (
    <span className="offer-price">${selectedPackage?.price}</span>
  )}
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="client-packages-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore our handpicked travel packages and create unforgettable memories</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search destinations, experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn"></button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt="Travel Hero" />
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="results-count">
            <span>{filteredPackages.length} packages found</span>
          </div>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Price (Low to High)</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="packages-section">
        <div className="packages-grid">
          {filteredPackages.map(pkg => (
            <div key={pkg.packageID} className="package-card">
              <div className="package-image-container">
                <img src={pkg.image || "https://via.placeholder.com/400x200"} alt={pkg.title} className="package-image" />
                {pkg.offer < pkg.price && (
                  <div className="discount-badge">
                  {calculateDiscount(pkg.price, pkg.offer)}% OFF
                    </div>
                  )}
                <div className="package-rating">
                  <div className="stars">{renderStars(pkg.rating)}</div>
                  <span className="rating-text">({pkg.reviews || 0} reviews)</span>
                </div>
              </div>

              <div className="package-content">
                <div className="package-header">
                  <h3>{pkg.title}</h3>
                  <p className="location"> {pkg.location || "Unknown"}</p>
                </div>
                <p className="description">{pkg.description}</p>

                <div className="package-details">
                  <div className="detail-item">
                    <span className="icon"></span>
                    <span>{pkg.duration || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon"></span>
                    <span>{pkg.rating || 0}/</span>
                  </div>
                </div>

                <div className="package-pricing">
                  <div className="price-container">
                    {pkg.offer < pkg.price ? (
                      <>
                        <span className="original-price">${pkg.price}</span>
                        <span className="offer-price">${pkg.offer}</span>
                      </>
                    ) : (
                      <span className="offer-price">${pkg.price}</span>
                    )}
                    <span className="price-note">per person</span>

                  </div>
                </div>

                <div className="package-actions">
                  <button className="view-details-btn">View Details</button>
                  <button className="book-now-btn" onClick={() => openBookingModal(pkg)}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showBookingModal && renderBookingModal()}
    </div>
  );
};

export default ClientPackagesPage;
