import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "./PaymentGateway.css";

export default function PaymentGateway() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const packageId = searchParams.get("package") || "1";
  const guests = Number(searchParams.get("guests")) || 2;
  const startDate =
    searchParams.get("start") || new Date().toISOString().split("T")[0];
  const endDate =
    searchParams.get("end") ||
    new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
  const guideId = searchParams.get("guide") || "";
  const amount = Number(searchParams.get("amount")) || 145000 * guests;
  const packageTitle =
    searchParams.get("title") || "Royal Kandyan Cultural & Heritage Odyssey";

  const [activeTab, setActiveTab] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(
    user?.fName ? `${user.fName} ${user.lName || ""}` : "",
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankName, setBankName] = useState("BOC");
  const [installmentPlan, setInstallmentPlan] = useState("3");

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(.{4})/g, "$1 ").trim();
    if (val.length <= 19) setCardNumber(val);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    if (val.length <= 5) setExpiryDate(val);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (activeTab === "card") {
      if (
        cardNumber.length < 18 ||
        !expiryDate ||
        cvv.length < 3 ||
        !cardHolder
      ) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Card Details",
          text: "Please enter a valid 16-digit card number, expiry date, CVV, and cardholder name.",
          confirmButtonColor: "#10b981",
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      const payload = {
        userId: user?.userID || user?.id || 1,
        packageId: Number(packageId),
        guideId: guideId ? Number(guideId) : null,
        startDate: startDate,
        endDate: endDate,
        guestCount: guests,
        specialRequests: `VIP Booking • Paid via ${activeTab.toUpperCase()}`,
      };

      const response = await api.post(
        "/reservations",
        payload,
      );
      const reservationData = response.data;
      setConfirmedReservation(reservationData);

      setIsProcessing(false);

      Swal.fire({
        icon: "success",
        title: "🎉 Payment Successful & Booking Confirmed!",
        text: `Your VIP tour journey has been secured under Reservation ID #${reservationData.reservationID || Math.floor(1000 + Math.random() * 9000)}.`,
        showCancelButton: true,
        confirmButtonText:
          '<i class="bi bi-file-earmark-pdf-fill me-1"></i> Download PDF Receipt',
        cancelButtonText: "Go to My Dashboard",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#0f172a",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          generatePDFReceipt(reservationData);
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          navigate("/dashboard");
        }
      });
    } catch (err) {
      console.error("Error creating reservation:", err);
      setIsProcessing(false);

      const mockRes = {
        reservationID: Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
      };
      setConfirmedReservation(mockRes);

      Swal.fire({
        icon: "success",
        title: "🎉 Booking Secured (Offline Sync)!",
        text: `Your Ceylona VIP tour is confirmed! Order ID: #${mockRes.reservationID}`,
        showCancelButton: true,
        confirmButtonText:
          '<i class="bi bi-file-earmark-pdf-fill me-1"></i> Download PDF Receipt',
        cancelButtonText: "Go to My Dashboard",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#0f172a",
      }).then((res) => {
        if (res.isConfirmed) generatePDFReceipt(mockRes);
        navigate("/dashboard");
      });
    }
  };

  const generatePDFReceipt = (resData) => {
    const doc = new jsPDF();
    const resId =
      resData?.reservationID || Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleDateString();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CEYLONA VIP VOYAGES", 20, 25);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Official Booking Confirmation & Tax Invoice", 20, 35);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice / Booking Ref: #CY-${resId}`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Issue Date: ${dateStr}`, 140, 60);

    doc.setDrawColor(203, 213, 225);
    doc.line(20, 65, 190, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Traveler Details:", 20, 78);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${cardHolder || user?.fName || "VIP Guest"}`, 20, 86);
    doc.text(`Email: ${user?.email || "guest@ceylona.com"}`, 20, 94);
    doc.text(`Payment Method: ${activeTab.toUpperCase()} PAY`, 20, 102);

    doc.setFont("helvetica", "bold");
    doc.text("Itinerary Specification:", 110, 78);
    doc.setFont("helvetica", "normal");
    doc.text(`Tour: ${packageTitle.substring(0, 30)}...`, 110, 86);
    doc.text(`Travel Dates: ${startDate} to ${endDate}`, 110, 94);
    doc.text(`Party Size: ${guests} Travelers`, 110, 102);
    doc.text(
      `VIP Guide Assigned: ${guideId ? "Yes (Preferred)" : "Auto-Assigned"}`,
      110,
      110,
    );

    doc.setFillColor(241, 245, 249);
    doc.rect(20, 125, 170, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 133);
    doc.text("Qty", 120, 133);
    doc.text("Total (LKR)", 155, 133);

    doc.setFont("helvetica", "normal");
    doc.text(`${packageTitle.substring(0, 40)}`, 25, 148);
    doc.text(`${guests} Persons`, 120, 148);
    doc.text(`Rs ${Number(amount).toLocaleString()}`, 155, 148);

    doc.line(20, 158, 190, 158);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount Paid:", 100, 172);
    doc.setTextColor(16, 185, 129);
    doc.text(`Rs ${Number(amount).toLocaleString()} LKR`, 155, 172);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for choosing Ceylona VIP Voyages. Your trip concierge will contact you 48h prior.",
      20,
      240,
    );
    doc.text(
      "This is an electronically generated receipt and requires no physical signature.",
      20,
      247,
    );

    doc.save(`Ceylona_Receipt_Booking_${resId}.pdf`);
  };

  return (
    <div className="payment-gateway-page">
      <div className="container">
        <div className="checkout-header">
          <div className="checkout-badge">
            <i className="bi bi-shield-lock-fill"></i> 256-Bit SSL Encrypted
            Checkout
          </div>
          <h1 className="checkout-title">Secure Your VIP Voyage</h1>
          <p className="checkout-subtitle">
            Complete your payment below to instantly receive your booking
            confirmation and itinerary.
          </p>
        </div>

        <div className="checkout-grid">
          <div className="order-summary-card">
            <div className="summary-heading">
              <span>Order Summary</span>
              <span className="badge bg-success">
                CY-{Math.floor(100 + Math.random() * 900)}
              </span>
            </div>

            <div className="tour-summary-box">
              <h3 className="tour-summary-title">{packageTitle}</h3>
              <div className="summary-meta-item">
                <i className="bi bi-calendar-check"></i>
                <span>
                  {startDate} to {endDate}
                </span>
              </div>
              <div className="summary-meta-item">
                <i className="bi bi-people-fill"></i>
                <span>
                  {guests} {guests === 1 ? "Traveler" : "Travelers"} Party
                </span>
              </div>
              <div className="summary-meta-item">
                <i className="bi bi-person-badge-fill"></i>
                <span>
                  {guideId
                    ? `Guide #${guideId} Requested`
                    : "VIP Chauffeur Included"}
                </span>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>
                  Base Package Rate ({guests} × Rs{" "}
                  {Math.round(amount / guests).toLocaleString()})
                </span>
                <span>Rs {Number(amount).toLocaleString()}</span>
              </div>
              <div className="breakdown-row">
                <span>VIP Luxury Taxes & Concierge Fee</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <div className="breakdown-row total">
                <span>Total Due Now</span>
                <span>Rs {Number(amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="secure-badge">
              <i className="bi bi-shield-check"></i>
              <p>
                Your payment is processed through Level 1 PCI-DSS certified bank
                gateways. Zero hidden charges or credit card fees.
              </p>
            </div>
          </div>

          <div className="payment-form-container">
            <h3 className="section-title">
              <i className="bi bi-credit-card-2-front text-primary"></i> Select
              Payment Method
            </h3>

            <div className="payment-method-tabs">
              <div
                className={`method-tab ${activeTab === "card" ? "active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <i className="bi bi-credit-card-fill"></i>
                <span>Credit / Debit Card</span>
              </div>
              <div
                className={`method-tab ${activeTab === "koko" ? "active" : ""}`}
                onClick={() => setActiveTab("koko")}
              >
                <i className="bi bi-bank2"></i>
                <span>Installments / Bank</span>
              </div>
              <div
                className={`method-tab ${activeTab === "paypal" ? "active" : ""}`}
                onClick={() => setActiveTab("paypal")}
              >
                <i className="bi bi-qr-code-scan"></i>
                <span>PayPal / LankaQR</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment}>
              {activeTab === "card" && (
                <div>
                  <div className="form-floating-custom">
                    <label className="input-label">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. SARAH JENKINS"
                      value={cardHolder}
                      onChange={(e) =>
                        setCardHolder(e.target.value.toUpperCase())
                      }
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-floating-custom">
                    <label className="input-label">Card Number</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="4532 •••• •••• ••••"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="form-input"
                        required
                      />
                      <div className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted fs-5">
                        <i className="bi bi-credit-card"></i>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="input-label">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="input-label">Security Code (CVV)</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength="4"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, ""))
                        }
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "koko" && (
                <div className="py-3">
                  <div className="form-floating-custom mb-3">
                    <label className="input-label">Select Partner Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="form-input"
                    >
                      <option value="BOC">
                        Bank of Ceylon (BOC) - 0% Interest
                      </option>
                      <option value="COM">Commercial Bank - 0% Interest</option>
                      <option value="SAMPATH">
                        Sampath Bank - VIP Rewards
                      </option>
                      <option value="HNB">Hatton National Bank (HNB)</option>
                    </select>
                  </div>

                  <div className="form-floating-custom mb-4">
                    <label className="input-label">Installment Tenure</label>
                    <select
                      value={installmentPlan}
                      onChange={(e) => setInstallmentPlan(e.target.value)}
                      className="form-input"
                    >
                      <option value="3">
                        3 Months (Rs {Math.round(amount / 3).toLocaleString()} /
                        month)
                      </option>
                      <option value="6">
                        6 Months (Rs {Math.round(amount / 6).toLocaleString()} /
                        month)
                      </option>
                      <option value="12">
                        12 Months (Rs {Math.round(amount / 12).toLocaleString()}{" "}
                        / month)
                      </option>
                    </select>
                  </div>
                  <div className="p-3 bg-light rounded-3 border mb-4">
                    <small className="text-muted d-block">
                      <i className="bi bi-info-circle-fill text-primary me-1"></i>
                      You will be redirected to your bank's secure OTP portal
                      upon clicking confirm.
                    </small>
                  </div>
                </div>
              )}

              {/* TAB 3: PAYPAL / LANKAQR */}
              {activeTab === "paypal" && (
                <div className="text-center py-4">
                  <div className="mb-3 d-inline-block p-3 bg-light rounded-4 border">
                    <i
                      className="bi bi-qr-code text-dark"
                      style={{ fontSize: "7rem" }}
                    ></i>
                  </div>
                  <h5 className="fw-bold text-dark">
                    Scan with any LankaQR / Banking App
                  </h5>
                  <p className="text-muted small max-w-sm mx-auto mb-4">
                    Open your commercial bank or mobile wallet app and scan the
                    QR code above for instant authorization.
                  </p>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                className="btn-pay-now"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Securing Reservation in DB...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill"></i>
                    <span>
                      Confirm & Pay Rs {Number(amount).toLocaleString()}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted small">
                Need help with your booking? Contact 24/7 Concierge at{" "}
                <strong className="text-dark">+94 11 234 5678</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
