import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import "./PackageDetails.css";

export default function PackageDetails() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d.toISOString().split("T")[0];
  });
  const [guestCount, setGuestCount] = useState(2);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/packages/${packageId}`)
      .then((res) => setPkg(res.data))
      .catch((err) => {
        console.error("Error fetching package details:", err);
        setPkg({
          packageID: packageId,
          title: "Royal Kandyan Cultural & Heritage Odyssey",
          location: "Kandy & Cultural Triangle",
          duration: "5 Days / 4 Nights",
          price: 145000,
          offer: 129900,
          rating: 4.9,
          available: 12,
          image:
            "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
          description:
            "Experience the sacred Temple of the Tooth, ancient fortress ruins, and traditional Kandyan dance performances in luxury accommodations.",
        });
      })
      .finally(() => setLoading(false));

    api
      .get("/guides")
      .then((res) => {
        const activeGuides = res.data.filter(
          (g) => g.status === "ACTIVE" || g.status === "AVAILABLE" || !g.status,
        );
        setGuides(activeGuides);
      })
      .catch((err) => console.error("Could not load guides:", err));
  }, [packageId]);

  const handleProceedToCheckout = () => {
    if (pkg?.available !== undefined && pkg.available <= 0) {
      Swal.fire({
        icon: "error",
        title: "Fully Booked",
        text: "Sorry, this tour package currently has no remaining spots available!",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Dates",
        text: "Please select valid start and return travel dates!",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    const unitPrice = pkg?.offer || pkg?.price || 0;
    const totalPrice = unitPrice * guestCount;

    navigate(
      `/payment?package=${pkg?.packageID || pkg?.id || packageId}&guests=${guestCount}&start=${startDate}&end=${endDate}&guide=${selectedGuideId}&amount=${totalPrice}&title=${encodeURIComponent(pkg?.title || "Tour Package")}`,
    );
  };

  if (loading) {
    return (
      <div
        className="package-details-page d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3.5rem", height: "3.5rem" }}
        />
        <h4 className="mt-3 fw-bold text-dark">
          Curating Itinerary Details...
        </h4>
        <p className="text-muted">
          Fetching VIP package inclusions and live availability
        </p>
      </div>
    );
  }

  const unitPrice = pkg?.offer || pkg?.price || 0;
  const totalPrice = unitPrice * guestCount;
  const discount =
    pkg?.offer && pkg?.price
      ? Math.round(((pkg.price - pkg.offer) / pkg.price) * 100)
      : null;

  return (
    <div className="package-details-page">
      <div
        className="details-hero"
        style={{
          backgroundImage: `url(${pkg?.image || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200"})`,
        }}
      >
        <div className="details-hero-overlay" />
        <div className="container details-hero-content">
          <Link to="/packages" className="btn-back-pill">
            <i className="bi bi-arrow-left"></i> Back to All Tours
          </Link>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-success bg-opacity-75 px-3 py-1 rounded-pill fw-bold text-uppercase">
              <i className="bi bi-patch-check-fill me-1"></i> VIP Ceylona Tour
            </span>
            {discount && (
              <span className="badge bg-danger px-3 py-1 rounded-pill fw-bold">
                Save {discount}% Today
              </span>
            )}
          </div>

          <h1 className="details-title">{pkg?.title}</h1>

          <div className="details-meta-row">
            <div className="meta-pill">
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span>{pkg?.location || pkg?.category || "Sri Lanka"}</span>
            </div>
            <div className="meta-pill">
              <i className="bi bi-clock-fill text-info"></i>
              <span>{pkg?.duration || "5 Days / 4 Nights"}</span>
            </div>
            <div className="meta-pill">
              <i className="bi bi-star-fill text-warning"></i>
              <span className="fw-bold text-white">{pkg?.rating || "4.9"}</span>
              <span className="text-white-50">(Verified reviews)</span>
            </div>
            <div className="meta-pill">
              <i className="bi bi-people-fill text-success"></i>
              <span>
                {pkg?.available !== undefined
                  ? `${pkg.available} spots left`
                  : "Available Now"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-tabs-bar">
        <div className="container">
          <ul className="tabs-list">
            <li
              className={`tab-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="bi bi-info-circle-fill"></i> Overview
            </li>
            <li
              className={`tab-item ${activeTab === "itinerary" ? "active" : ""}`}
              onClick={() => setActiveTab("itinerary")}
            >
              <i className="bi bi-calendar3-range"></i> Detailed Itinerary
            </li>
            <li
              className={`tab-item ${activeTab === "inclusions" ? "active" : ""}`}
              onClick={() => setActiveTab("inclusions")}
            >
              <i className="bi bi-check2-all"></i> Inclusions & Exclusions
            </li>
            <li
              className={`tab-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <i className="bi bi-chat-heart-fill"></i> Traveler Reviews
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="details-grid">
          <div className="left-content-area">
            {activeTab === "overview" && (
              <div className="content-section-card">
                <h3 className="section-heading">
                  <i className="bi bi-compass text-primary"></i> Tour Overview
                </h3>
                <p className="lead text-dark fw-medium mb-4">
                  {pkg?.description}
                </p>

                <h5 className="fw-bold text-dark mb-3">
                  Why You'll Love This Journey:
                </h5>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-success bg-opacity-10 text-success p-2 fs-4">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">
                          Private Luxury Transport
                        </h6>
                        <small className="text-muted">
                          Chauffeur-driven VIP SUV/Sedan throughout
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2 fs-4">
                        <i className="bi bi-house-heart"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">5-Star Boutique Stays</h6>
                        <small className="text-muted">
                          Handpicked luxury villas & heritage hotels
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-2 fs-4">
                        <i className="bi bi-person-badge"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">
                          Certified VIP Tour Guide
                        </h6>
                        <small className="text-muted">
                          Expert local knowledge & private assistance
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-info bg-opacity-10 text-info p-2 fs-4">
                        <i className="bi bi-cup-hot"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">
                          Gourmet Dining Included
                        </h6>
                        <small className="text-muted">
                          Daily breakfast & signature culinary dinners
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "itinerary" && (
              <div className="content-section-card">
                <h3 className="section-heading">
                  <i className="bi bi-map text-success"></i> Day-by-Day
                  Itinerary
                </h3>

                <div className="itinerary-day">
                  <h4 className="day-title">
                    Day 1: Arrival & VIP Luxury Check-In
                  </h4>
                  <p className="text-muted mb-2">
                    Upon arrival at Bandaranaike International Airport, your
                    dedicated Ceylona private chauffeur and tour guide will
                    greet you with floral garlands. Enjoy a scenic VIP transfer
                    to your boutique luxury hotel. Evening relax by the infinity
                    pool overlooking tropical landscapes.
                  </p>
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-building me-1"></i> Stay: 5-Star
                    Heritage Villa
                  </span>
                </div>

                <div className="itinerary-day">
                  <h4 className="day-title">
                    Day 2: Sacred Heritage & Private Cultural Exploration
                  </h4>
                  <p className="text-muted mb-2">
                    After a gourmet champagne breakfast, embark on a private
                    guided tour of sacred ancient monuments and botanical
                    gardens. Enjoy exclusive access to cultural dance
                    performances and a sunset tea tasting overlooking misty
                    hills.
                  </p>
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-cup me-1"></i> Meals: Breakfast & VIP
                    Dinner
                  </span>
                </div>

                <div className="itinerary-day">
                  <h4 className="day-title">
                    Day 3: Scenic Wilderness & Scenic Train Odyssey
                  </h4>
                  <p className="text-muted mb-2">
                    Experience the world-renowned panoramic train journey
                    through emerald tea plantations and cascading waterfalls.
                    Your chauffeur will transport your luggage separately while
                    you relax in reserved first-class observation carriages.
                  </p>
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-train-front me-1"></i> Highlight: VIP
                    First-Class Rail
                  </span>
                </div>

                <div
                  className="itinerary-day"
                  style={{ borderColor: "transparent", paddingBottom: 0 }}
                >
                  <h4 className="day-title">
                    Day 4: Tropical Leisure & Airport Departure
                  </h4>
                  <p className="text-muted mb-0">
                    Enjoy a leisurely morning spa session and souvenir shopping
                    for authentic Ceylon tea and sapphires before your private
                    transfer back to the airport for your onward flight.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "inclusions" && (
              <div className="content-section-card">
                <h3 className="section-heading">
                  <i className="bi bi-list-check text-primary"></i> What's
                  Included & Excluded
                </h3>
                <div className="inclusions-grid">
                  <div>
                    <h5 className="fw-bold text-success mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i>{" "}
                      Inclusions
                    </h5>
                    <ul className="inclusions-list">
                      <li>
                        <i className="bi bi-check-lg text-success fs-5"></i>{" "}
                        5-Star Boutique Hotel accommodation (Double/Twin
                        sharing)
                      </li>
                      <li>
                        <i className="bi bi-check-lg text-success fs-5"></i>{" "}
                        Private air-conditioned luxury transport with
                        English-speaking chauffeur
                      </li>
                      <li>
                        <i className="bi bi-check-lg text-success fs-5"></i>{" "}
                        Daily gourmet breakfast and welcome dinner
                      </li>
                      <li>
                        <i className="bi bi-check-lg text-success fs-5"></i> All
                        VIP entrance fees to temples, cultural shows, and
                        national parks
                      </li>
                      <li>
                        <i className="bi bi-check-lg text-success fs-5"></i>{" "}
                        24/7 dedicated travel concierge support
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="fw-bold text-danger mb-3">
                      <i className="bi bi-x-circle-fill me-2"></i> Exclusions
                    </h5>
                    <ul className="inclusions-list">
                      <li>
                        <i className="bi bi-x-lg text-danger fs-5"></i>{" "}
                        International air tickets and Sri Lanka visa fees
                      </li>
                      <li>
                        <i className="bi bi-x-lg text-danger fs-5"></i> Personal
                        expenses (laundry, spa treatments, alcoholic beverages)
                      </li>
                      <li>
                        <i className="bi bi-x-lg text-danger fs-5"></i>{" "}
                        Gratuities and tips for guide and chauffeur (optional)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="content-section-card">
                <h3 className="section-heading">
                  <i className="bi bi-stars text-warning"></i> Traveler
                  Testimonials
                </h3>
                <div className="d-flex flex-column gap-4">
                  <div className="p-4 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: "45px", height: "45px" }}
                        >
                          S
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">
                            Sarah & David Jenkins
                          </h6>
                          <small className="text-muted">
                            London, United Kingdom • Traveled last month
                          </small>
                        </div>
                      </div>
                      <div className="text-warning fs-5">★★★★★</div>
                    </div>
                    <p className="text-muted mb-0">
                      "The Royal Kandyan Odyssey exceeded our highest
                      expectations! Our tour guide was wonderfully knowledgeable
                      and took us to secret viewpoints without crowds. The
                      luxury villas were breathtaking!"
                    </p>
                  </div>

                  <div className="p-4 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: "45px", height: "45px" }}
                        >
                          M
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">
                            Michael & Elena Rostova
                          </h6>
                          <small className="text-muted">
                            Zurich, Switzerland • Traveled 3 months ago
                          </small>
                        </div>
                      </div>
                      <div className="text-warning fs-5">★★★★★</div>
                    </div>
                    <p className="text-muted mb-0">
                      "Seamless booking and VIP treatment from airport arrival
                      to departure. Ceylona Tours truly knows how to deliver a
                      5-star experience in Sri Lanka."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="right-sidebar-area">
            <div className="sticky-booking-widget">
              <div className="widget-price-header">
                <div>
                  <span className="price">
                    Rs {Number(unitPrice).toLocaleString()}
                  </span>
                  <span className="unit"> / person</span>
                </div>
                {discount && (
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                    Best Rate Guaranteed
                  </span>
                )}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label-custom">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input-custom"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label-custom">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input-custom"
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Number of Travelers</label>
                <div className="guest-counter-box">
                  <span className="fw-bold text-dark">
                    {guestCount} {guestCount === 1 ? "Traveler" : "Travelers"}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="counter-btn"
                      onClick={() =>
                        setGuestCount(Math.min(15, guestCount + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">
                  Preferred Tour Guide (Optional)
                </label>
                <select
                  value={selectedGuideId}
                  onChange={(e) => setSelectedGuideId(e.target.value)}
                  className="form-input-custom"
                >
                  <option value="">
                    Let Ceylona automatically assign best VIP guide
                  </option>
                  {guides.map((g) => (
                    <option key={g.guideID || g.id} value={g.guideID || g.id}>
                      {g.firstName} {g.lastName} ({g.gender || "VIP Guide"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="price-summary-box">
                <div className="summary-row">
                  <span>
                    Rs {Number(unitPrice).toLocaleString()} × {guestCount}{" "}
                    travelers
                  </span>
                  <span>Rs {Number(totalPrice).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>VIP Luxury Taxes & Fees</span>
                  <span className="text-success fw-bold">FREE (Included)</span>
                </div>
                <div className="summary-row total">
                  <span>Total Investment</span>
                  <span className="text-primary">
                    Rs {Number(totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="btn-proceed-checkout"
              >
                <span>Proceed to VIP Checkout</span>
                <i className="bi bi-lock-fill"></i>
              </button>

              <div className="text-center mt-3">
                <small className="text-muted d-block">
                  <i className="bi bi-shield-check text-success me-1"></i>{" "}
                  Instant Confirmation • No Booking Fees
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
