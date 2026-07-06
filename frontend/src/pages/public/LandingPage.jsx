import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Swal from "sweetalert2";

const LandingPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    destination: "ALL",
    destinationLabel: "All Sri Lanka Regions",
    date: "",
    dateLabel: "Select Travel Date",
    guests: "2",
    guestsLabel: "2 Travelers (Couple)",
    style: "ALL",
  });

  // Interactive UI & Dropdown States
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showDestinationsDropdown, setShowDestinationsDropdown] =
    useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Custom Search Bar Dropdowns
  const [showSearchDestDropdown, setShowSearchDestDropdown] = useState(false);
  const [showSearchGuestsDropdown, setShowSearchGuestsDropdown] =
    useState(false);
  const [showSearchDateModal, setShowSearchDateModal] = useState(false);

  // Slider States
  const [currentTourSlide, setCurrentTourSlide] = useState(0);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [reviewStart, setReviewStart] = useState(null);
  const [reviewEnd, setReviewEnd] = useState(null);
  const [isReviewDragging, setIsReviewDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const dropdownRef = useRef(null);
  const destDropdownRef = useRef(null);
  const destTimerRef = useRef(null);
  const authTimerRef = useRef(null);
  const searchDestRef = useRef(null);
  const searchGuestsRef = useRef(null);
  const searchDateRef = useRef(null);

  // Sample fallback luxury tour packages covering all Sri Lankan categories
  const defaultPackages = [
    {
      packageID: 1,
      title: "Royal Kandyan Cultural & Heritage Odyssey",
      description:
        "Experience the sacred Temple of the Tooth, ancient fortress ruins, and traditional Kandyan dance performances in luxury accommodations.",
      price: "145,000",
      offer: "129,900",
      duration: "5 Days / 4 Nights",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
      destination: "KANDY",
      category: "KANDY",
    },
    {
      packageID: 2,
      title: "Southern Coast Tropical Luxury & Whale Watching",
      description:
        "Relax in private overwater villas, explore historic Galle Fort, and embark on private yacht charters to witness majestic blue whales.",
      price: "210,000",
      offer: "189,000",
      duration: "7 Days / 6 Nights",
      rating: "5.0",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      destination: "BEACHES",
      category: "BEACHES",
    },
    {
      packageID: 3,
      title: "Misty Highlands & Luxury Tea Estate Experience",
      description:
        "Journey through emerald tea plantations aboard scenic trains, stay in colonial heritage bungalows, and enjoy exclusive tea tastings.",
      price: "135,000",
      offer: "115,000",
      duration: "4 Days / 3 Nights",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
      destination: "HIGHLANDS",
      category: "HIGHLANDS",
    },
    {
      packageID: 4,
      title: "Anuradhapura & Polonnaruwa Ancient Kingdom Expedition",
      description:
        "Discover ancient stupas, sacred bo trees, and royal palaces with private historian guides and five-star eco-lodge stays.",
      price: "160,000",
      offer: "140,000",
      duration: "6 Days / 5 Nights",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
      destination: "KANDY",
      category: "KANDY",
    },
    {
      packageID: 5,
      title: "Yala & Wilpattu Private Safari & Glamping Adventure",
      description:
        "Witness elusive leopards, elephant herds, and exotic birdlife while staying in ultra-luxury private safari tents with gourmet dining.",
      price: "190,000",
      offer: "175,000",
      duration: "5 Days / 4 Nights",
      rating: "5.0",
      image:
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
      destination: "SAFARI",
      category: "SAFARI",
    },
    {
      packageID: 6,
      title: "Sigiriya Rock Fortress & Dambulla Cave Experience",
      description:
        "Climb the 5th-century Lion Rock citadel, explore ancient fresco caves, and enjoy private hot air balloon rides over emerald jungles.",
      price: "120,000",
      offer: "99,000",
      duration: "3 Days / 2 Nights",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1588598198321-9739fd5642b5?auto=format&fit=crop&w=800&q=80",
      destination: "KANDY",
      category: "KANDY",
    },
  ];

  // Client Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: "Dr. Aristotle Vance",
      location: "London, United Kingdom",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      tour: "Southern Coast Tropical Luxury & Whale Watching",
      rating: 5,
      review:
        "Our 7-day private yacht charter and overwater villa stay in Galle was flawless! Our certified guide knew the exact secret spots for whale watching without crowds. Truly world-class luxury hospitality.",
      verified: true,
    },
    {
      id: 2,
      name: "Elena Rostova",
      location: "Geneva, Switzerland",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      tour: "Misty Highlands & Luxury Tea Estate Experience",
      rating: 5,
      review:
        "The scenic train ride across Nine Arch Bridge and staying at the colonial heritage tea plantation bungalow was a dream. Ceylona Travels handled every single transfer and dining reservation with perfection.",
      verified: true,
    },
    {
      id: 3,
      name: "Michael & Sarah Jenkins",
      location: "Sydney, Australia",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      tour: "Yala National Park Luxury Safari & Leopard Quest",
      rating: 5,
      review:
        "We spotted three leopards on our private 4x4 game drive! The 5-star eco-glamping suite under the Yala stars was the most romantic and unforgettable adventure of our lives. Worth every penny!",
      verified: true,
    },
    {
      id: 4,
      name: "Liam O'Connor",
      location: "Dublin, Ireland",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      tour: "Royal Kandyan Cultural & Heritage Odyssey",
      rating: 5,
      review:
        "Experiencing the sacred Temple of the Tooth with an identity-verified local scholar guide brought ancient Sri Lankan history to life. Transparent pricing with zero hidden costs just as promised.",
      verified: true,
    },
    {
      id: 5,
      name: "Chao Wei",
      location: "Singapore",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      tour: "Bentota Golden Sands & Water Sports VIP Escape",
      rating: 5,
      review:
        "The VIP jet ski tour and candlelit seafood dinner by the Indian Ocean were arranged impeccably by our 24/7 concierge executive. Ceylona Travels sets the gold standard for travel management.",
      verified: true,
    },
  ];

  // Scroll & Resize listener for interactive navbar and slider
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Click outside listener for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAuthDropdown(false);
      }
      if (
        destDropdownRef.current &&
        !destDropdownRef.current.contains(event.target)
      ) {
        setShowDestinationsDropdown(false);
      }
      if (
        searchDestRef.current &&
        !searchDestRef.current.contains(event.target)
      ) {
        setShowSearchDestDropdown(false);
      }
      if (
        searchGuestsRef.current &&
        !searchGuestsRef.current.contains(event.target)
      ) {
        setShowSearchGuestsDropdown(false);
      }
      if (
        searchDateRef.current &&
        !searchDateRef.current.contains(event.target)
      ) {
        setShowSearchDateModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-slide testimonials every 4.5 seconds
  useEffect(() => {
    if (isReviewPaused) return;
    const interval = setInterval(() => {
      setCurrentReviewSlide((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isReviewPaused, testimonials.length]);

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await api.get("/packages");
      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : [];
      if (list.length > 0) {
        const formattedList = list.map((pkg, idx) => ({
          ...pkg,
          category:
            pkg.category ||
            pkg.location ||
            pkg.destination ||
            (idx % 2 === 0 ? "BEACHES" : "HIGHLANDS"),
          destination:
            pkg.location ||
            pkg.destination ||
            (idx % 2 === 0 ? "BEACHES" : "HIGHLANDS"),
        }));
        setPackages(formattedList);
      } else {
        setPackages(defaultPackages);
      }
    } catch (err) {
      console.error("Error fetching packages on landing page:", err);
      setPackages(defaultPackages);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.destination !== "ALL") {
      setSelectedCategory(searchQuery.destination);
    }
    Swal.fire({
      title: "Searching Ceylona Itineraries...",
      text: `Filtering best matches for ${searchQuery.destinationLabel} for ${searchQuery.guestsLabel}.`,
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      scrollToSection(null, "featured-tours");
    });
  };

  const scrollToSection = (e, id, category = null) => {
    if (e && e.preventDefault) e.preventDefault();
    if (category) {
      setSelectedCategory(category);
    }
    setMobileNavOpen(false);
    setShowDestinationsDropdown(false);

    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getDashboardLink = () => {
    const role = user?.roles?.[0] || user?.role;
    if (role === "TOURIST") return "/dashboard";
    if (role === "GUIDE") return "/guide/dashboard";
    return "/dashboard";
  };

  // Filter displayed packages based on category tab selection
  const displayedPackages =
    selectedCategory === "ALL"
      ? packages
      : packages.filter(
          (p) =>
            (p.category &&
              p.category.toUpperCase() === selectedCategory.toUpperCase()) ||
            (p.location &&
              p.location.toUpperCase() === selectedCategory.toUpperCase()) ||
            (p.destination &&
              p.destination.toUpperCase() === selectedCategory.toUpperCase()),
        );

  const finalPackages =
    displayedPackages.length > 0
      ? displayedPackages
      : defaultPackages.filter(
          (p) =>
            selectedCategory === "ALL" ||
            p.category === selectedCategory ||
            p.destination === selectedCategory,
        );

  const formatPrice = (val) => {
    if (!val) return "0";
    const num =
      typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
    return isNaN(num) ? val : num.toLocaleString();
  };

  // Slider pagination helpers for Tour Packages (3 items per slide on desktop, 1 on mobile)
  const itemsPerSlide = windowWidth < 768 ? 1 : windowWidth < 992 ? 2 : 3;
  const maxTourSlides = Math.max(0, finalPackages.length - itemsPerSlide);

  useEffect(() => {
    if (currentTourSlide > maxTourSlides) {
      setCurrentTourSlide(0);
    }
  }, [maxTourSlides, currentTourSlide]);

  const handleNextTourSlide = () => {
    setCurrentTourSlide((prev) => (prev >= maxTourSlides ? 0 : prev + 1));
  };
  const handlePrevTourSlide = () => {
    setCurrentTourSlide((prev) => (prev <= 0 ? maxTourSlides : prev - 1));
  };

  // Touch & Mouse Swipe Handlers for tour slider
  const handleStart = (clientX) => {
    setTouchStart(clientX);
    setIsDragging(true);
  };
  const handleMove = (clientX) => {
    if (isDragging && touchStart !== null) {
      setTouchEnd(clientX);
    }
  };
  const handleEnd = () => {
    if (!isDragging || !touchStart || !touchEnd) {
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNextTourSlide();
    if (isRightSwipe) handlePrevTourSlide();
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Touch handlers
  const handleTouchStart = (e) => handleStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.targetTouches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  // Mouse handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };
  const handleMouseUp = () => handleEnd();

  // Review Swipe Handlers (Touch & Mouse)
  const handleReviewStart = (clientX) => {
    setReviewStart(clientX);
    setIsReviewDragging(true);
    setIsReviewPaused(true);
  };
  const handleReviewMove = (clientX) => {
    if (isReviewDragging && reviewStart !== null) {
      setReviewEnd(clientX);
    }
  };
  const handleReviewEnd = () => {
    if (!isReviewDragging || !reviewStart || !reviewEnd) {
      setIsReviewDragging(false);
      setReviewStart(null);
      setReviewEnd(null);
      setIsReviewPaused(false);
      return;
    }
    const distance = reviewStart - reviewEnd;
    if (distance > 50) {
      setCurrentReviewSlide((prev) => (prev + 1) % testimonials.length);
    } else if (distance < -50) {
      setCurrentReviewSlide((prev) =>
        prev <= 0 ? testimonials.length - 1 : prev - 1,
      );
    }
    setIsReviewDragging(false);
    setReviewStart(null);
    setReviewEnd(null);
    setIsReviewPaused(false);
  };

  const handleReviewTouchStart = (e) =>
    handleReviewStart(e.targetTouches[0].clientX);
  const handleReviewTouchMove = (e) =>
    handleReviewMove(e.targetTouches[0].clientX);
  const handleReviewTouchEnd = () => handleReviewEnd();

  const handleReviewMouseDown = (e) => {
    e.preventDefault();
    handleReviewStart(e.clientX);
  };
  const handleReviewMouseMove = (e) => {
    if (isReviewDragging) {
      e.preventDefault();
      handleReviewMove(e.clientX);
    }
  };
  const handleReviewMouseUp = () => handleReviewEnd();

  return (
    <div className="bg-light min-vh-100 font-sans">
      {/* Dynamic Glassmorphic Navigation Bar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top transition-all ${
          isScrolled ? "py-2 shadow-lg" : "py-3 shadow-sm"
        }`}
        style={{
          background: isScrolled
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="container-fluid px-3 px-lg-3">
          {/* Brand Logo & Name */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="navbar-brand d-flex align-items-center gap-2 gap-md-3 text-white text-decoration-none text-nowrap cursor-pointer"
          >
            <div
              className="position-relative d-flex align-items-center justify-content-center bg-white rounded-circle p-1 shadow-sm flex-shrink-0"
              style={{ width: "46px", height: "46px" }}
            >
              <img
                src="/logo512 v2.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo512.png";
                }}
                alt="Ceylona Travels Logo"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            </div>
            <div>
              <span
                className="fw-bold fs-4 tracking-tight d-block lh-1"
                style={{ letterSpacing: "-0.5px" }}
              >
                CEYLONA TRAVELS
              </span>
              <span
                className="text-warning small text-uppercase tracking-wider fw-semibold"
                style={{ fontSize: "10px", letterSpacing: "1.5px" }}
              >
                Wonder of Ceylon & Beyond
              </span>
            </div>
          </a>

          {/* Interactive Mobile Toggler */}
          <button
            className="navbar-toggler border-0 text-white p-2"
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <i
              className={`bi ${mobileNavOpen ? "bi-x-lg" : "bi-list"} fs-2`}
            ></i>
          </button>

          {/* Nav Items & Dropdowns */}
          <div
            className={`collapse navbar-collapse ${mobileNavOpen ? "show mt-3" : ""}`}
            id="ceylonaNav"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 gap-xl-4 fw-semibold small tracking-wider align-items-lg-center">
              {/* Interactive Destinations Dropdown */}
              <li
                className="nav-item position-relative"
                ref={destDropdownRef}
                onMouseEnter={() => {
                  if (window.innerWidth >= 992) {
                    if (destTimerRef.current)
                      clearTimeout(destTimerRef.current);
                    setShowDestinationsDropdown(true);
                    setShowAuthDropdown(false);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 992) {
                    destTimerRef.current = setTimeout(() => {
                      setShowDestinationsDropdown(false);
                    }, 200);
                  }
                }}
              >
                <button
                  className="nav-link text-white hover-text-warning transition-all bg-transparent border-0 d-flex align-items-center gap-1 py-2 text-nowrap"
                  onClick={() => {
                    setShowDestinationsDropdown(!showDestinationsDropdown);
                    setShowAuthDropdown(false);
                  }}
                >
                  <i className="bi bi-compass text-warning me-1"></i>{" "}
                  Destinations
                  <i
                    className={`bi bi-chevron-down small transition-all ${showDestinationsDropdown ? "rotate-180" : ""}`}
                  ></i>
                </button>

                {showDestinationsDropdown && (
                  <div
                    className="position-absolute start-0 mt-2 p-3 rounded-4 shadow-lg custom-dropdown-menu"
                    style={{
                      top: "100%",
                      background: "rgba(15, 23, 42, 0.98)",
                      backdropFilter: "blur(25px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      minWidth: "260px",
                      zIndex: 1050,
                    }}
                  >
                    <div className="text-warning small fw-bold text-uppercase tracking-wider mb-2 px-2">
                      Explore Sri Lanka
                    </div>
                    <a
                      href="#featured-tours"
                      onClick={(e) =>
                        scrollToSection(e, "featured-tours", "ALL")
                      }
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-white text-decoration-none hover-bg-white-10 transition-all mb-1"
                    >
                      <div
                        className="p-2 rounded-3"
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          color: "#ffffff",
                        }}
                      >
                        <i className="bi bi-grid-fill fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold small lh-1 mb-1">
                          All Tour Packages
                        </div>
                        <div
                          className="text-white-50"
                          style={{ fontSize: "11px" }}
                        >
                          View entire island catalog
                        </div>
                      </div>
                    </a>
                    <hr className="dropdown-divider my-2 border-secondary border-opacity-50" />
                    <div className="text-warning small fw-bold text-uppercase tracking-wider mb-2 px-2">
                      Popular Regions
                    </div>
                    <a
                      href="#featured-tours"
                      onClick={(e) =>
                        scrollToSection(e, "featured-tours", "KANDY")
                      }
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-white text-decoration-none hover-bg-white-10 transition-all"
                    >
                      <div
                        className="p-2 rounded-3"
                        style={{
                          background: "rgba(13, 110, 253, 0.2)",
                          color: "#6ea8fe",
                        }}
                      >
                        <i className="bi bi-bank fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold small lh-1 mb-1">
                          Kandy & Heritage
                        </div>
                        <div
                          className="text-white-50"
                          style={{ fontSize: "11px" }}
                        >
                          Ancient kingdoms & culture
                        </div>
                      </div>
                    </a>
                    <a
                      href="#featured-tours"
                      onClick={(e) =>
                        scrollToSection(e, "featured-tours", "BEACHES")
                      }
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-white text-decoration-none hover-bg-white-10 transition-all mt-1"
                    >
                      <div
                        className="p-2 rounded-3"
                        style={{
                          background: "rgba(13, 202, 240, 0.2)",
                          color: "#3dd5f3",
                        }}
                      >
                        <i className="bi bi-water fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold small lh-1 mb-1">
                          Southern Beaches
                        </div>
                        <div
                          className="text-white-50"
                          style={{ fontSize: "11px" }}
                        >
                          Overwater villas & whales
                        </div>
                      </div>
                    </a>
                    <a
                      href="#featured-tours"
                      onClick={(e) =>
                        scrollToSection(e, "featured-tours", "HIGHLANDS")
                      }
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-white text-decoration-none hover-bg-white-10 transition-all mt-1"
                    >
                      <div
                        className="p-2 rounded-3"
                        style={{
                          background: "rgba(25, 135, 84, 0.2)",
                          color: "#75b798",
                        }}
                      >
                        <i className="bi bi-tree-fill fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold small lh-1 mb-1">
                          Hill Country & Tea
                        </div>
                        <div
                          className="text-white-50"
                          style={{ fontSize: "11px" }}
                        >
                          Scenic trains & bungalows
                        </div>
                      </div>
                    </a>
                    <a
                      href="#featured-tours"
                      onClick={(e) =>
                        scrollToSection(e, "featured-tours", "SAFARI")
                      }
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-white text-decoration-none hover-bg-white-10 transition-all mt-1"
                    >
                      <div
                        className="p-2 rounded-3"
                        style={{
                          background: "rgba(255, 193, 7, 0.2)",
                          color: "#ffda6a",
                        }}
                      >
                        <i className="bi bi-binoculars-fill fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold small lh-1 mb-1">
                          Yala Wildlife Safari
                        </div>
                        <div
                          className="text-white-50"
                          style={{ fontSize: "11px" }}
                        >
                          Leopards & glamping
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </li>

              <li className="nav-item">
                <a
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1 text-nowrap"
                  href="#featured-tours"
                  onClick={(e) => scrollToSection(e, "featured-tours", "ALL")}
                >
                  <i className="bi bi-collection-play me-1 text-primary"></i>{" "}
                  Tour Catalog
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1 text-nowrap"
                  href="#why-ceylona"
                  onClick={(e) => scrollToSection(e, "why-ceylona")}
                >
                  <i className="bi bi-award me-1 text-success"></i> Why Choose
                  Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1 text-nowrap"
                  href="#testimonials"
                  onClick={(e) => scrollToSection(e, "testimonials")}
                >
                  <i className="bi bi-chat-quote me-1 text-info"></i>{" "}
                  Testimonials
                </a>
              </li>
            </ul>

            {/* Auth Actions - FIXED: horizontal alignment without stacking */}
            <div
              className="d-flex align-items-center gap-2 gap-lg-3 pt-3 pt-lg-0 flex-nowrap ps-lg-2"
              style={{
                borderTop: mobileNavOpen
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "none",
              }}
            >
              {isAuthenticated && user ? (
                <div className="d-flex align-items-center gap-3 w-100 justify-content-between justify-content-lg-end flex-nowrap">
                  <div className="text-end d-none d-xl-block text-nowrap">
                    <small
                      className="text-white-50 d-block lh-1"
                      style={{ fontSize: "11px" }}
                    >
                      Logged in as
                    </small>
                    <span className="text-white fw-bold small">
                      {user?.email || user?.fName || "Traveler"}
                    </span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="btn btn-warning rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 transition-all hover-scale text-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    <i className="bi bi-speedometer2"></i> My Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "38px", height: "38px" }}
                    title="Sign Out"
                  >
                    <i className="bi bi-box-arrow-right fs-6"></i>
                  </button>
                </div>
              ) : (
                <>
                  {/* Custom Sign In Dropdown */}
                  <div
                    className="dropdown position-relative"
                    ref={dropdownRef}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992) {
                        if (authTimerRef.current)
                          clearTimeout(authTimerRef.current);
                        setShowAuthDropdown(true);
                        setShowDestinationsDropdown(false);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) {
                        authTimerRef.current = setTimeout(() => {
                          setShowAuthDropdown(false);
                        }, 200);
                      }
                    }}
                  >
                    <button
                      className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 transition-all text-nowrap"
                      type="button"
                      onClick={() => {
                        setShowAuthDropdown(!showAuthDropdown);
                        setShowDestinationsDropdown(false);
                      }}
                    >
                      <i className="bi bi-person-circle"></i> Sign In
                      <i
                        className={`bi bi-chevron-down small transition-all ${showAuthDropdown ? "rotate-180" : ""}`}
                      ></i>
                    </button>

                    {showAuthDropdown && (
                      <div
                        className="position-absolute end-0 mt-2 p-3 rounded-4 shadow-lg custom-dropdown-menu"
                        style={{
                          top: "100%",
                          background: "rgba(15, 23, 42, 0.98)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(25px)",
                          minWidth: "280px",
                          zIndex: 1050,
                        }}
                      >
                        <div className="text-warning small fw-bold text-uppercase tracking-wider mb-2 px-2">
                          Select Portal
                        </div>
                        <Link
                          className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none transition-all hover-bg-white-10 mb-1"
                          to="/login"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          <div
                            className="p-2 rounded-3"
                            style={{ background: "rgba(13, 110, 253, 0.2)" }}
                          >
                            <i className="bi bi-compass-fill fs-4 text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-white small lh-1 mb-1">
                              Tourist Portal
                            </div>
                            <div
                              className="text-white-50"
                              style={{ fontSize: "11px" }}
                            >
                              For travelers booking tours
                            </div>
                          </div>
                        </Link>

                        <hr className="dropdown-divider my-2 border-secondary" />

                        <Link
                          className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none transition-all hover-bg-white-10 mb-1"
                          to="/guide/login"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          <div
                            className="p-2 rounded-3"
                            style={{ background: "rgba(25, 135, 84, 0.2)" }}
                          >
                            <i className="bi bi-person-badge-fill fs-4 text-success"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-white small lh-1 mb-1">
                              Tour Guide Portal
                            </div>
                            <div
                              className="text-white-50"
                              style={{ fontSize: "11px" }}
                            >
                              For certified tour leaders
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/register"
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition-all hover-scale d-flex align-items-center gap-2 text-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
                      border: "none",
                    }}
                  >
                    <i className="bi bi-person-plus-fill"></i> Join Ceylona
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div
        id="hero"
        className="position-relative d-flex align-items-center justify-content-center text-center text-white"
        style={{
          minHeight: "100vh",
          paddingTop: "calc(75px + 3vh)",
          paddingBottom: "3vh",
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.70), rgba(13, 110, 253, 0.45)), url('https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container position-relative z-1 py-2 py-md-3 py-lg-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-11 col-xl-10">
              <div
                className="d-inline-flex align-items-center gap-2 gap-md-3 rounded-pill px-3 py-1 py-md-2 mb-2 mb-md-3 mb-lg-4 shadow-sm"
                style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
              >
                <span className="badge bg-warning text-dark rounded-pill px-2 py-1 fw-bold d-inline-flex align-items-center gap-1">
                  <i className="bi bi-stars"></i> NEW
                </span>
                <span
                  className="small fw-semibold text-white"
                  style={{
                    color: "#ffffff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  Experience Sri Lanka's Most Exquisite Luxury Tours
                </span>
              </div>

              <h1
                className="fw-bold tracking-tight mb-2 mb-md-3 mb-lg-4 lh-1"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4.25rem)",
                  textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                Explore The Wonder of{" "}
                <span
                  className="text-warning"
                  style={{ textShadow: "0 0 25px rgba(245, 158, 11, 0.7)" }}
                >
                  Ceylon
                </span>{" "}
                & Beyond
              </h1>
              <p
                className="fw-normal text-white-50 mb-3 mb-md-4 mb-lg-5 max-w-2xl mx-auto px-md-5"
                style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)" }}
              >
                Handcrafted luxury itineraries, authentic cultural expeditions,
                and elite certified tour guides designed to make your Sri Lankan
                journey unforgettable.
              </p>

              {/* Interactive Custom Tour Finder Box */}
              <div
                className="card border-0 rounded-4 rounded-md-5 p-3 p-md-4 shadow-lg text-start mx-auto position-relative"
                style={{
                  background: "rgba(255, 255, 255, 0.96)",
                  backdropFilter: "blur(25px)",
                  WebkitBackdropFilter: "blur(25px)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  maxWidth: "1000px",
                }}
              >
                <form onSubmit={handleSearch}>
                  <div className="row g-3 align-items-center">
                    {/* Custom Destination Dropdown */}
                    <div
                      className="col-12 col-md-3 position-relative"
                      ref={searchDestRef}
                    >
                      <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-primary"></i>{" "}
                        Destination
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchDestDropdown(!showSearchDestDropdown);
                          setShowSearchGuestsDropdown(false);
                          setShowSearchDateModal(false);
                        }}
                        className="btn bg-light w-100 border-0 rounded-4 py-3 px-3 d-flex align-items-center justify-content-between text-dark fw-semibold shadow-none text-start"
                      >
                        <span className="text-truncate">
                          {searchQuery.destinationLabel}
                        </span>
                        <i
                          className={`bi bi-chevron-down small text-muted transition-all ${showSearchDestDropdown ? "rotate-180" : ""}`}
                        ></i>
                      </button>

                      {showSearchDestDropdown && (
                        <div
                          className="position-absolute start-0 w-100 mt-2 p-2 rounded-4 shadow-lg bg-white border z-3 custom-dropdown-menu"
                          style={{ minWidth: "250px", top: "100%" }}
                        >
                          {[
                            {
                              id: "ALL",
                              label: "All Sri Lanka Regions",
                              icon: "bi-globe-asia-australia",
                              color: "text-primary",
                            },
                            {
                              id: "KANDY",
                              label: "Kandy & Heritage",
                              icon: "bi-bank",
                              color: "text-warning",
                            },
                            {
                              id: "BEACHES",
                              label: "Southern Coast & Beaches",
                              icon: "bi-water",
                              color: "text-info",
                            },
                            {
                              id: "HIGHLANDS",
                              label: "Hill Country & Tea Estates",
                              icon: "bi-tree",
                              color: "text-success",
                            },
                            {
                              id: "SAFARI",
                              label: "Yala & Wildlife Safari",
                              icon: "bi-binoculars",
                              color: "text-danger",
                            },
                          ].map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSearchQuery({
                                  ...searchQuery,
                                  destination: item.id,
                                  destinationLabel: item.label,
                                });
                                setShowSearchDestDropdown(false);
                              }}
                              className="d-flex align-items-center gap-2 p-2 rounded-3 hover-bg-light cursor-pointer transition-all"
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={`bi ${item.icon} fs-5 ${item.color}`}
                              ></i>
                              <span className="small fw-semibold text-dark">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Custom Travel Date Picker Modal/Popover */}
                    <div
                      className="col-6 col-md-3 position-relative"
                      ref={searchDateRef}
                    >
                      <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-calendar-event-fill text-primary"></i>{" "}
                        Travel Date
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchDateModal(!showSearchDateModal);
                          setShowSearchDestDropdown(false);
                          setShowSearchGuestsDropdown(false);
                        }}
                        className="btn bg-light w-100 border-0 rounded-4 py-3 px-3 d-flex align-items-center justify-content-between text-dark fw-semibold shadow-none text-start"
                      >
                        <span className="text-truncate">
                          {searchQuery.dateLabel}
                        </span>
                        <i className="bi bi-calendar-check text-muted"></i>
                      </button>

                      {showSearchDateModal && (
                        <div
                          className="position-absolute start-0 mt-2 p-3 rounded-4 shadow-lg bg-white border z-3 custom-dropdown-menu text-start"
                          style={{ minWidth: "260px", top: "100%" }}
                        >
                          <div className="small fw-bold text-dark mb-2">
                            Quick Select Window:
                          </div>
                          {[
                            {
                              label: "This Weekend (2 Days)",
                              val: "This Weekend",
                            },
                            { label: "Next Week (7 Days)", val: "Next Week" },
                            {
                              label: "Next Month (Summer Escape)",
                              val: "Next Month",
                            },
                            {
                              label: "Holiday Season (December)",
                              val: "Holiday Season",
                            },
                          ].map((dt, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSearchQuery({
                                  ...searchQuery,
                                  date: dt.val,
                                  dateLabel: dt.label,
                                });
                                setShowSearchDateModal(false);
                              }}
                              className="p-2 rounded-3 hover-bg-light small fw-semibold text-dark cursor-pointer transition-all mb-1 d-flex align-items-center gap-2"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-clock-history text-primary"></i>
                              <span>{dt.label}</span>
                            </div>
                          ))}
                          <hr className="my-2" />
                          <div className="small text-muted mb-1">
                            Or pick specific date:
                          </div>
                          <input
                            type="date"
                            className="form-control form-control-sm rounded-3"
                            onChange={(e) => {
                              setSearchQuery({
                                ...searchQuery,
                                date: e.target.value,
                                dateLabel: e.target.value,
                              });
                              setShowSearchDateModal(false);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Custom Travelers Dropdown */}
                    <div
                      className="col-6 col-md-3 position-relative"
                      ref={searchGuestsRef}
                    >
                      <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-people-fill text-primary"></i>{" "}
                        Travelers
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchGuestsDropdown(
                            !showSearchGuestsDropdown,
                          );
                          setShowSearchDestDropdown(false);
                          setShowSearchDateModal(false);
                        }}
                        className="btn bg-light w-100 border-0 rounded-4 py-3 px-3 d-flex align-items-center justify-content-between text-dark fw-semibold shadow-none text-start"
                      >
                        <span className="text-truncate">
                          {searchQuery.guestsLabel}
                        </span>
                        <i
                          className={`bi bi-chevron-down small text-muted transition-all ${showSearchGuestsDropdown ? "rotate-180" : ""}`}
                        ></i>
                      </button>

                      {showSearchGuestsDropdown && (
                        <div
                          className="position-absolute start-0 w-100 mt-2 p-2 rounded-4 shadow-lg bg-white border z-3 custom-dropdown-menu"
                          style={{ minWidth: "220px", top: "100%" }}
                        >
                          {[
                            {
                              val: "1",
                              label: "1 Solo Traveler",
                              icon: "bi-person",
                              color: "text-primary",
                            },
                            {
                              val: "2",
                              label: "2 Travelers (Couple)",
                              icon: "bi-heart-fill",
                              color: "text-danger",
                            },
                            {
                              val: "4",
                              label: "4 Travelers (Family)",
                              icon: "bi-house-heart",
                              color: "text-success",
                            },
                            {
                              val: "6+",
                              label: "6+ Group Expedition",
                              icon: "bi-collection",
                              color: "text-warning",
                            },
                          ].map((g) => (
                            <div
                              key={g.val}
                              onClick={() => {
                                setSearchQuery({
                                  ...searchQuery,
                                  guests: g.val,
                                  guestsLabel: g.label,
                                });
                                setShowSearchGuestsDropdown(false);
                              }}
                              className="d-flex align-items-center gap-2 p-2 rounded-3 hover-bg-light cursor-pointer transition-all"
                              style={{ cursor: "pointer" }}
                            >
                              <i className={`bi ${g.icon} fs-5 ${g.color}`}></i>
                              <span className="small fw-semibold text-dark">
                                {g.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Search Button */}
                    <div className="col-12 col-md-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale"
                        style={{
                          background:
                            "linear-gradient(135deg, #0d6efd, #0a58ca)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-search"></i> Search Tours
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats & Social Proof Banner */}
      <div className="bg-white py-5 border-bottom shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3 border-end border-light">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#e8f0fe",
                  color: "#0d6efd",
                }}
              >
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <h2 className="fw-bold text-primary display-6 mb-0">12,500+</h2>
              <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                Happy Voyagers
              </span>
            </div>
            <div className="col-6 col-md-3 border-end-md border-light">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#d1e7dd",
                  color: "#0f5132",
                }}
              >
                <i className="bi bi-map-fill fs-4"></i>
              </div>
              <h2 className="fw-bold text-success display-6 mb-0">350+</h2>
              <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                Curated Itineraries
              </span>
            </div>
            <div className="col-6 col-md-3 border-end border-light">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#fff3cd",
                  color: "#664d03",
                }}
              >
                <i className="bi bi-person-badge-fill fs-4"></i>
              </div>
              <h2 className="fw-bold text-warning display-6 mb-0">150+</h2>
              <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                Certified Guides
              </span>
            </div>
            <div className="col-6 col-md-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#f8f9fa",
                  color: "#212529",
                }}
              >
                <i className="bi bi-star-fill fs-4 text-warning"></i>
              </div>
              <h2 className="fw-bold text-dark display-6 mb-0">4.9 / 5.0</h2>
              <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                Excellence Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tour Packages Section with Swipe Slider & Line Dot Pagination */}
      <div
        id="featured-tours"
        className="py-5 my-4"
        style={{ scrollMarginTop: "110px" }}
      >
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              {/* FIXED: Crystal clear high contrast Handcrafted Itineraries badge */}
              <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-2 shadow-sm d-inline-flex align-items-center gap-2">
                <i className="bi bi-gem"></i> Handcrafted Itineraries
              </span>
              <h2 className="fw-bold text-dark display-6 mb-1">
                Featured Ceylona Tour Packages
              </h2>
              <p className="text-muted mb-0">
                Explore our luxury guided expeditions — swipe or use controls to
                slide
              </p>
            </div>

            <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
              <Link
                to={isAuthenticated ? "/packages" : "/login"}
                className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 hover-scale"
              >
                Entire Catalog <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-5 overflow-auto pb-2">
            {[
              { id: "ALL", label: "All Tours", icon: "bi-collection" },
              { id: "KANDY", label: "Kandy & Heritage", icon: "bi-bank" },
              { id: "BEACHES", label: "Beaches & Tropical", icon: "bi-water" },
              { id: "HIGHLANDS", label: "Highlands & Tea", icon: "bi-tree" },
              { id: "SAFARI", label: "Wildlife Safari", icon: "bi-binoculars" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setCurrentTourSlide(0);
                }}
                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap d-inline-flex align-items-center gap-2 transition-all ${
                  selectedCategory === tab.id
                    ? "btn-primary shadow-sm text-white"
                    : "btn-outline-secondary text-dark bg-white"
                }`}
                style={
                  selectedCategory === tab.id
                    ? {
                        background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
                        border: "none",
                      }
                    : {}
                }
              >
                <i className={`bi ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          {loadingPackages ? (
            <div className="text-center py-5 my-5">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="text-muted mt-3 fw-semibold">
                Loading exclusive Ceylona packages...
              </p>
            </div>
          ) : (
            <div className="position-relative py-2 px-1 px-md-3">
              {/* Left Navigation Icon Button on Left Side of Slider (No Circle) */}
              <button
                onClick={handlePrevTourSlide}
                className="btn btn-link p-0 position-absolute top-50 start-0 translate-middle-y z-3 d-flex align-items-center justify-content-center transition-all slider-icon-btn text-decoration-none"
                style={{
                  border: "none",
                  background: "transparent",
                  width: "48px",
                  height: "48px",
                }}
                title="Previous Tours"
                aria-label="Previous Tours"
              >
                <i className="bi bi-chevron-left display-6 fw-bold"></i>
              </button>

              {/* Right Navigation Icon Button on Right Side of Slider (No Circle) */}
              <button
                onClick={handleNextTourSlide}
                className="btn btn-link p-0 position-absolute top-50 end-0 translate-middle-y z-3 d-flex align-items-center justify-content-center transition-all slider-icon-btn text-decoration-none"
                style={{
                  border: "none",
                  background: "transparent",
                  width: "48px",
                  height: "48px",
                }}
                title="Next Tours"
                aria-label="Next Tours"
              >
                <i className="bi bi-chevron-right display-6 fw-bold"></i>
              </button>

              <div
                className="slider-container py-2 overflow-hidden px-4 px-md-5 mx-md-3 mx-lg-4"
                style={{
                  cursor: isDragging ? "grabbing" : "grab",
                  userSelect: "none",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="slider-track row g-4 flex-nowrap transition-all"
                  style={{
                    transform: `translateX(-${currentTourSlide * (100 / itemsPerSlide)}%)`,
                    transition: isDragging
                      ? "none"
                      : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {finalPackages.map((pkg, index) => (
                    <div
                      key={pkg.packageID || index}
                      className="col-12 col-md-6 col-lg-4 flex-shrink-0 transition-all"
                    >
                      <div className="card modern-card border-0 shadow-sm rounded-5 overflow-hidden h-100 d-flex flex-column justify-content-between bg-white transition-all">
                        <div>
                          <div className="position-relative">
                            <img
                              src={
                                pkg.image ||
                                "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80"
                              }
                              alt={pkg.title || pkg.packageName}
                              className="card-img-top transition-all"
                              style={{
                                height: "230px",
                                objectFit: "cover",
                                pointerEvents: "none",
                              }}
                            />
                            <span className="badge bg-white text-dark position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm fw-bold d-inline-flex align-items-center gap-1">
                              <i className="bi bi-star-fill text-warning"></i>{" "}
                              {pkg.rating || "4.9"}
                            </span>
                            {pkg.offer &&
                              parseFloat(pkg.offer) < parseFloat(pkg.price) && (
                                <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm fw-bold d-inline-flex align-items-center gap-1">
                                  <i className="bi bi-lightning-charge-fill"></i>{" "}
                                  SPECIAL OFFER
                                </span>
                              )}
                          </div>

                          <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                              <span className="d-inline-flex align-items-center gap-1">
                                <i className="bi bi-clock text-primary"></i>{" "}
                                {pkg.duration || "5 Days / 4 Nights"}
                              </span>
                              <span>•</span>
                              <span className="d-inline-flex align-items-center gap-1">
                                <i className="bi bi-geo-alt text-danger"></i>{" "}
                                {pkg.destination || "Sri Lanka"}
                              </span>
                            </div>

                            <h5 className="fw-bold text-dark mb-2 tracking-tight">
                              {pkg.title ||
                                pkg.packageName ||
                                "Luxury Tropical Escape"}
                            </h5>
                            <p
                              className="text-muted small mb-4"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {pkg.description ||
                                "Enjoy an all-inclusive luxury vacation with certified tour guides, premium transfers, and breathtaking scenic experiences."}
                            </p>
                          </div>
                        </div>

                        <div className="card-footer bg-transparent border-top py-3 px-3 px-xl-4 d-flex justify-content-between align-items-center gap-2">
                          <div className="flex-grow-1 overflow-hidden">
                            <small
                              className="text-muted d-block fw-semibold text-uppercase"
                              style={{
                                fontSize: "10px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Starting From
                            </small>
                            <div className="d-flex align-items-baseline gap-1 flex-wrap">
                              {pkg.offer ? (
                                <>
                                  <span
                                    className="fs-5 fw-bold text-primary mb-0"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    ${formatPrice(pkg.offer)}
                                  </span>
                                  <span
                                    className="text-muted text-decoration-line-through small ms-1"
                                    style={{
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ${formatPrice(pkg.price)}
                                  </span>
                                </>
                              ) : (
                                <span
                                  className="fs-5 fw-bold text-primary mb-0"
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  ${formatPrice(pkg.price || "1,200")}
                                </span>
                              )}
                              <span
                                className="text-muted small ms-1"
                                style={{
                                  fontSize: "11px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                / person
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                navigate("/packages");
                              } else {
                                Swal.fire({
                                  title: "Sign In Required",
                                  text: "Please log into your tourist portal or create a free account to book this itinerary.",
                                  icon: "info",
                                  showCancelButton: true,
                                  confirmButtonText: "Sign In Now",
                                  confirmButtonColor: "#0d6efd",
                                }).then((res) => {
                                  if (res.isConfirmed) navigate("/login");
                                });
                              }
                            }}
                            className="btn btn-primary rounded-pill px-3 px-sm-4 py-2 fw-bold shadow-sm d-inline-flex align-items-center justify-content-center gap-1 hover-scale flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #0d6efd, #0a58ca)",
                              border: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span>Book</span>
                            <i className="bi bi-arrow-right-short fs-5 d-flex align-items-center"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Line Dot Pagination for Tour Packages */}
                <div className="line-dot-pagination">
                  {Array.from({ length: maxTourSlides + 1 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentTourSlide(i)}
                      className={`line-dot ${currentTourSlide === i ? "active" : ""}`}
                      title={`Slide ${i + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Ceylona Travels Section */}
      <div
        id="why-ceylona"
        className="py-5 bg-white border-top border-bottom"
        style={{ scrollMarginTop: "110px" }}
      >
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span
              className="badge border border-warning px-3 py-1 rounded-pill fw-bold text-uppercase tracking-wider mb-2 d-inline-flex align-items-center gap-1"
              style={{ background: "#fff3cd", color: "#664d03" }}
            >
              <i className="bi bi-shield-check"></i> The Ceylona Difference
            </span>
            <h2 className="fw-bold text-dark display-6 mb-2">
              Why Travel With Ceylona?
            </h2>
            <p className="text-muted mb-0">
              We combine island-wide expertise with world-class hospitality and
              rigorous safety standards
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 bg-light rounded-5 p-4 text-center h-100 shadow-sm transition-all hover-translate-y">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "#e8f0fe",
                    color: "#0d6efd",
                  }}
                >
                  <i className="bi bi-shield-check fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">
                  Certified Local Guides
                </h5>
                <p className="text-muted small mb-0">
                  Every tour leader is identity-verified, multilingual, and
                  approved directly by our General Manager.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 bg-light rounded-5 p-4 text-center h-100 shadow-sm transition-all hover-translate-y">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "#d1e7dd",
                    color: "#0f5132",
                  }}
                >
                  <i className="bi bi-tag-fill fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Best Price Guarantee</h5>
                <p className="text-muted small mb-0">
                  Transparent luxury pricing with zero hidden booking costs or
                  unexpected service fees.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 bg-light rounded-5 p-4 text-center h-100 shadow-sm transition-all hover-translate-y">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "#fff3cd",
                    color: "#664d03",
                  }}
                >
                  <i className="bi bi-compass-fill fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">VIP Tailored Trips</h5>
                <p className="text-muted small mb-0">
                  Customize your travel style, whether you crave wildlife
                  safaris, ancient temples, or beach serenity.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 bg-light rounded-5 p-4 text-center h-100 shadow-sm transition-all hover-translate-y">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "#cff4fc",
                    color: "#055160",
                  }}
                >
                  <i className="bi bi-headset fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">
                  24/7 Concierge Support
                </h5>
                <p className="text-muted small mb-0">
                  Our Customer Service Executives monitor your journey
                  round-the-clock to ensure absolute comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Client Testimonials & Reviews Auto-Slider Section */}
      <div
        id="testimonials"
        className="py-5 my-3 bg-light"
        style={{ scrollMarginTop: "110px" }}
      >
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-2 shadow-sm d-inline-flex align-items-center gap-2">
                <i className="bi bi-star-fill text-warning"></i> Client
                Experiences
              </span>
              <h2 className="fw-bold text-dark display-6 mb-1">
                Loved By Voyagers Worldwide
              </h2>
              <p className="text-muted mb-0">
                Discover what travelers say about their luxury Sri Lankan
                expeditions with Ceylona
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
              <button
                onClick={() =>
                  setCurrentReviewSlide((prev) =>
                    prev <= 0 ? testimonials.length - 1 : prev - 1,
                  )
                }
                className="testimonial-nav-btn p-0 text-decoration-none"
                title="Previous Review"
                aria-label="Previous Review"
              >
                <i className="bi bi-chevron-left fs-5 fw-bold"></i>
              </button>
              <button
                onClick={() =>
                  setCurrentReviewSlide(
                    (prev) => (prev + 1) % testimonials.length,
                  )
                }
                className="testimonial-nav-btn p-0 text-decoration-none"
                title="Next Review"
                aria-label="Next Review"
              >
                <i className="bi bi-chevron-right fs-5 fw-bold"></i>
              </button>
            </div>
          </div>

          {/* Testimonial Carousel Card */}
          <div
            className="card border-0 rounded-5 p-4 p-md-5 shadow-lg bg-white position-relative overflow-hidden transition-all"
            onMouseEnter={() => setIsReviewPaused(true)}
            onMouseLeave={() => {
              setIsReviewPaused(false);
              handleReviewMouseUp();
            }}
            onMouseDown={handleReviewMouseDown}
            onMouseMove={handleReviewMouseMove}
            onMouseUp={handleReviewMouseUp}
            onTouchStart={handleReviewTouchStart}
            onTouchMove={handleReviewTouchMove}
            onTouchEnd={handleReviewTouchEnd}
            style={{
              minHeight: "260px",
              cursor: isReviewDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-12 col-md-4 text-center text-md-start border-end-md border-light">
                <div className="d-inline-block position-relative mb-3">
                  <img
                    src={testimonials[currentReviewSlide].avatar}
                    alt={testimonials[currentReviewSlide].name}
                    className="rounded-circle shadow-md border border-3 border-primary"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                    }}
                  />
                  {testimonials[currentReviewSlide].verified && (
                    <span
                      className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow"
                      style={{ width: "26px", height: "26px" }}
                      title="Verified Voyager"
                    >
                      <i className="bi bi-check-lg small fw-bold"></i>
                    </span>
                  )}
                </div>
                <h5 className="fw-bold text-dark mb-1">
                  {testimonials[currentReviewSlide].name}
                </h5>
                <p className="text-muted small mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-1">
                  <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                  {testimonials[currentReviewSlide].location}
                </p>
                <div className="d-flex justify-content-center justify-content-md-start gap-1 text-warning mb-2">
                  {Array.from({
                    length: testimonials[currentReviewSlide].rating,
                  }).map((_, i) => (
                    <i key={i} className="bi bi-star-fill fs-6"></i>
                  ))}
                </div>
                <span className="badge bg-light text-dark border small">
                  Verified VIP Guest
                </span>
              </div>

              <div className="col-12 col-md-8 ps-md-4">
                <div className="text-primary opacity-25 mb-2">
                  <i className="bi bi-quote display-3 lh-1"></i>
                </div>
                <p
                  className="fs-5 fw-normal text-dark fst-italic mb-4"
                  style={{ lineHeight: "1.7" }}
                >
                  "{testimonials[currentReviewSlide].review}"
                </p>
                <div className="d-flex align-items-center gap-2 text-muted small border-top pt-3">
                  <i className="bi bi-briefcase-fill text-primary"></i>
                  <span className="fw-semibold">Expedition Took:</span>
                  <span className="text-dark fw-bold">
                    {testimonials[currentReviewSlide].tour}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Dot Pagination for Reviews */}
            <div className="line-dot-pagination mt-4 pt-2 border-top">
              {testimonials.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentReviewSlide(idx)}
                  className={`line-dot ${currentReviewSlide === idx ? "active" : ""}`}
                  title={`Review ${idx + 1}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Call-to-Action (CTA) Banners */}
      <div
        id="cta"
        className="pt-2 pb-5 my-2"
        style={{ scrollMarginTop: "80px" }}
      >
        <div className="container pt-1 pb-4">
          <div className="row g-4">
            {/* Left: Tourist CTA */}
            <div className="col-12 col-lg-6">
              <div
                className="card border-0 rounded-5 p-5 text-white h-100 shadow-lg position-relative overflow-hidden hover-translate-y"
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                }}
              >
                <div className="position-relative z-1">
                  <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-3 shadow-sm d-inline-flex align-items-center gap-2 border border-primary border-opacity-50">
                    <i className="bi bi-compass-fill"></i> For Travelers &
                    Voyagers
                  </span>
                  <h3 className="fw-bold display-6 mb-3">
                    Ready to Experience Ceylon?
                  </h3>
                  <p className="text-white-50 mb-4 pe-lg-4">
                    Create your free tourist portal account today. Access VIP
                    discounts, save favorite dream destinations to your
                    wishlist, and book confirmed tours instantly.
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow transition-all hover-scale d-inline-flex align-items-center gap-2"
                    style={{ background: "#3b82f6", border: "none" }}
                  >
                    Create Free Tourist Account{" "}
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Guide CTA - FIXED: High contrast Certified Tour Leaders badge */}
            <div className="col-12 col-lg-6">
              <div
                className="card border-0 rounded-5 p-5 text-white h-100 shadow-lg position-relative overflow-hidden hover-translate-y"
                style={{
                  background:
                    "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
                }}
              >
                <div className="position-relative z-1">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-3 shadow-sm d-inline-flex align-items-center gap-2">
                    <i className="bi bi-award-fill"></i> For Certified Tour
                    Leaders
                  </span>
                  <h3 className="fw-bold display-6 mb-3">
                    Lead Our Elite Expeditions
                  </h3>
                  <p className="text-white-50 mb-4 pe-lg-4">
                    Are you a licensed Sri Lankan travel guide? Join Ceylona
                    Travels to access consistent tour dispatches, intuitive
                    schedule management, and top industry rates.
                  </p>
                  <Link
                    to="/guide/register"
                    className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-success shadow transition-all hover-scale d-inline-flex align-items-center gap-2"
                  >
                    Apply as Tour Guide{" "}
                    <i className="bi bi-check-circle-fill"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Footer */}
      <footer
        className="text-white pt-5 pb-4 border-top border-secondary border-opacity-25"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="container pt-3">
          <div className="row g-4 justify-content-between mb-5">
            <div className="col-12 col-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "40px", height: "40px" }}
                >
                  <img
                    src="/logo512 v2.png"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo512.png";
                    }}
                    alt="Ceylona Travels Logo"
                    style={{
                      width: "46px",
                      height: "46px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span className="fw-bold fs-4 tracking-tight text-white">
                  CEYLONA TRAVELS
                </span>
              </div>
              <p className="text-white-50 small pe-lg-4 mb-4">
                Sri Lanka's premier luxury tourism and travel management system,
                delivering extraordinary travel adventures with unmatched
                hospitality and safety.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                  title="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                  title="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                  title="Twitter"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                  title="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Quick Links
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li>
                  <a
                    href="#featured-tours"
                    onClick={(e) => scrollToSection(e, "featured-tours")}
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#featured-tours"
                    onClick={(e) => scrollToSection(e, "featured-tours", "ALL")}
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Tour Catalog
                  </a>
                </li>
                <li>
                  <a
                    href="#why-ceylona"
                    onClick={(e) => scrollToSection(e, "why-ceylona")}
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Why Ceylona
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => scrollToSection(e, "testimonials")}
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Portals
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li>
                  <Link
                    to="/guide/login"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-person-badge text-success"></i> Guide
                    Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/staff/login"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-shield-lock text-info"></i> Staff Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-person-plus text-primary"></i> Register
                    Tourist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/register"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-briefcase text-warning"></i> Guide
                    Application
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Newsletter
              </h6>
              <p className="text-white-50 small mb-3">
                Subscribe for exclusive Sri Lanka travel guides and seasonal VIP
                promotions.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Subscribed!",
                    "Thank you for subscribing to Ceylona Travels newsletter.",
                    "success",
                  );
                }}
              >
                <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border border-secondary border-opacity-50">
                  <input
                    type="email"
                    className="form-control border-0 text-white ps-4 fs-6"
                    style={{ backgroundColor: "#1e293b" }}
                    placeholder="Your email address..."
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4 border-0 fw-bold transition-all hover-scale"
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-top border-secondary border-opacity-25 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 small">
            <div>
              © {new Date().getFullYear()} Ceylona Travels. All rights reserved.
            </div>
            <div className="d-flex gap-4">
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Privacy Policy",
                    "We respect your data privacy and adhere to international tourism data security standards.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Terms of Service",
                    "Standard booking terms and refund policies apply for all Ceylona tour packages.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Terms of Service
              </a>
              <a
                href="#support"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "24/7 Support",
                    "Contact our Customer Service Executive desk at support@ceylonatravels.com or call +94 11 234 5678.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Support Desk
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-to-Top Auto Navigate Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-circle position-fixed p-0 d-flex align-items-center justify-content-center transition-all back-to-top-btn text-decoration-none"
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up-short fs-1 fw-bold transition-all"></i>
        </button>
      )}
    </div>
  );
};

export default LandingPage;
