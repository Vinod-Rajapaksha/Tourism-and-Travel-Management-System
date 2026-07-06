import React from "react";
import { Link } from "react-router-dom";

const GlassAuthLayout = ({
  title,
  subtitle,
  badgeText = "Ceylona Travels",
  badgeIcon = "bi-compass-fill",
  bgImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  badgeStyle = {
    background: "rgba(13, 110, 253, 0.15)",
    color: "#0d6efd",
    border: "1px solid rgba(13, 110, 253, 0.35)",
  },
  cardMaxWidth = "1020px",
  sideTitle = "Discover Paradise Island",
  sideSubtitle = "Join travelers from around the world exploring the breathtaking landscapes and heritage of Sri Lanka.",
  sideHighlights = [
    "Bespoke tour packages & custom itineraries",
    "Verified certified guides & luxury transport",
    "24/7 dedicated customer service support",
  ],
  sideIconColor = "text-primary",
  children,
  footerContent,
}) => {
  const isCustomIconColor =
    sideIconColor.startsWith("#") || sideIconColor.startsWith("rgb");

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between overflow-hidden tw-fixed tw-inset-0 tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-between tw-overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(13, 110, 253, 0.45), rgba(15, 23, 42, 0.8)), url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1000,
      }}
    >
      <style>{`
        .glass-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .glass-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03) !important;
          border-radius: 8px;
          margin: 14px 0;
        }
        .glass-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4) !important;
          border-radius: 8px;
          border: none !important;
        }
        .glass-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.65) !important;
        }
      `}</style>

      <header
        className="w-100 px-3 px-md-4 py-2 py-md-3 d-flex align-items-center justify-content-between flex-shrink-0 tw-w-full tw-px-6 tw-py-4 tw-flex tw-items-center tw-justify-between tw-z-10 tw-shrink-0"
        style={{ zIndex: 10 }}
      >
        <Link
          to="/"
          className="d-flex align-items-center gap-2 gap-md-3 text-decoration-none tw-flex tw-items-center tw-gap-3 tw-no-underline group"
        >
          <div
            className="position-relative d-flex align-items-center justify-content-center bg-white rounded-circle p-1 shadow-sm flex-shrink-0 tw-w-11 tw-h-11 tw-rounded-full tw-bg-white tw-flex tw-items-center tw-justify-center tw-shadow-md group-hover:tw-scale-105 tw-transition-transform"
            style={{ width: "42px", height: "42px" }}
          >
            <img
              src="/logo512 v2.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/logo512.png";
              }}
              alt="Ceylona Travels Logo"
              style={{ width: "36px", height: "36px", objectFit: "contain" }}
            />
          </div>
          <span
            className="fs-4 fw-bold text-white tw-text-2xl tw-font-bold tw-tracking-tight tw-text-white tw-drop-shadow-md"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Ceylona{" "}
            <span className="text-warning fw-normal tw-text-amber-400 tw-font-normal">
              Travels
            </span>
          </span>
        </Link>

        <Link
          to="/"
          className="rounded-pill px-3 px-md-4 py-1.5 py-md-2 small fw-semibold shadow-sm d-inline-flex align-items-center gap-2 text-decoration-none hover-scale tw-px-4 tw-py-2 tw-rounded-full tw-text-white tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2 tw-no-underline tw-transition-all hover:tw-scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.22)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <i className="bi bi-arrow-left"></i>
          <span className="d-none d-sm-inline">Back to Explore</span>
          <span className="d-inline d-sm-none">Back</span>
        </Link>
      </header>

      <main
        className="w-100 flex-grow-1 d-flex align-items-center justify-content-center px-2 px-sm-3 px-md-4 py-1 py-md-2 overflow-hidden tw-flex-1 tw-w-full tw-px-4 tw-py-2 tw-flex tw-items-center tw-justify-center tw-overflow-hidden tw-z-10"
        style={{ zIndex: 5 }}
      >
        <div
          className="w-100 d-flex shadow-lg position-relative tw-w-full tw-shadow-2xl tw-transition-all tw-duration-300"
          style={{
            maxWidth: cardMaxWidth,
            width: "100%",
            maxHeight: "calc(100vh - 100px)",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            boxShadow:
              "0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            borderRadius: "28px",
            overflow: "hidden",
            isolation: "isolate",
            transform: "translateZ(0)",
          }}
        >
          <div className="row g-0 w-100 m-0">
            <div
              className="col-12 col-lg-5 d-none d-lg-flex flex-column justify-content-between p-3 p-md-4 p-xl-5 border-end border-white border-opacity-25 overflow-auto glass-scroll"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.12) 100%)",
                backdropFilter: "blur(10px)",
                maxHeight: "calc(100vh - 100px)",
                borderTopLeftRadius: "28px",
                borderBottomLeftRadius: "28px",
              }}
            >
              <div>
                <div
                  className="rounded-pill px-3 py-1 mb-3 d-inline-flex align-items-center gap-2 shadow-sm fw-semibold"
                  style={{
                    ...badgeStyle,
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  <i className={`bi ${badgeIcon} fs-6`}></i>
                  <span>{badgeText}</span>
                </div>

                <h3
                  className="fw-bold text-dark display-6 mb-3 text-break"
                  style={{ letterSpacing: "-0.5px", fontSize: "1.75rem" }}
                >
                  {sideTitle}
                </h3>
                <p
                  className="text-dark text-opacity-75 small mb-3 text-break"
                  style={{ lineHeight: "1.5", fontSize: "0.92rem" }}
                >
                  {sideSubtitle}
                </p>

                <div className="d-flex flex-column gap-2.5 mt-3">
                  {sideHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3 mb-2"
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm me-1"
                        style={{
                          width: "28px",
                          height: "28px",
                          background: "rgba(255, 255, 255, 0.85)",
                          border: "1.5px solid rgba(255, 255, 255, 0.95)",
                        }}
                      >
                        <i
                          className={`bi bi-check-lg fs-6 fw-bold ${!isCustomIconColor ? sideIconColor : ""}`}
                          style={
                            isCustomIconColor ? { color: sideIconColor } : {}
                          }
                        ></i>
                      </div>
                      <span
                        className="small fw-semibold text-dark text-opacity-85 lh-sm text-break"
                        style={{ fontSize: "0.88rem" }}
                      >
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-top border-white border-opacity-25 d-flex align-items-center gap-3 mt-3 flex-shrink-0">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center small fw-bold shadow-sm flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "2px solid white",
                  }}
                >
                  <i className="bi bi-star-fill text-warning small"></i>
                </div>
                <div className="small">
                  <div className="fw-bold text-dark mb-0">
                    Premium Ceylona Hospitality
                  </div>
                  <div
                    className="text-dark text-opacity-75"
                    style={{ fontSize: "11px" }}
                  >
                    Rated #1 Travel Portal in Sri Lanka
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-lg-7 p-3 p-md-4 p-xl-5 overflow-auto glass-scroll"
              style={{
                maxHeight: "calc(100vh - 100px)",
                borderTopRightRadius: "28px",
                borderBottomRightRadius: "28px",
              }}
            >
              <div className="w-100 py-1">
                <div className="d-lg-none text-center mb-3">
                  <div
                    className="rounded-pill px-3 py-1 d-inline-flex align-items-center gap-2 shadow-sm fw-semibold"
                    style={{
                      ...badgeStyle,
                      fontSize: "12px",
                    }}
                  >
                    <i className={`bi ${badgeIcon} fs-6`}></i>
                    <span>{badgeText}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h2
                    className="fw-bold text-dark mb-1"
                    style={{ letterSpacing: "-0.5px", fontSize: "1.65rem" }}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-dark text-opacity-75 small mb-0 m-0">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="w-100 mt-2">{children}</div>

                {footerContent && (
                  <div className="pt-3 mt-3 border-top border-dark border-opacity-10 text-center small text-dark text-opacity-75">
                    {footerContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="w-100 py-2 text-center text-white text-opacity-75 small flex-shrink-0 tw-w-full tw-py-3 tw-text-center tw-text-white/70 tw-text-xs tw-z-10 tw-shrink-0"
        style={{ zIndex: 10 }}
      >
        &copy; {new Date().getFullYear()} Ceylona Travels. All rights reserved.
      </footer>
    </div>
  );
};

export default GlassAuthLayout;
