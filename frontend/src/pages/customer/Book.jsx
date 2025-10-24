import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { checkAvailability, createBooking } from "../../services/auth";
import Swal from "sweetalert2";
import BigErrorAlert from "../../components/BigErrorAlert";
import TravelAvailabilityValidation from "../../components/TravelAvailabilityValidation";
import PaymentProfileSelector from "../../components/PaymentProfileSelector";

export default function Book() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const packageId = useMemo(() => Number(params.get("packageId")), [params]);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        startDate: "",
        endDate: "",
        amount: "",
    });
    const [available, setAvailable] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(true);
    const [selectedPaymentProfile, setSelectedPaymentProfile] = useState(null);

    const availabilityRef = useRef(null);
    const messageRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        setAvailable(null);
        setMessage("");
    }, [form.startDate, form.endDate, packageId]);

    const scrollToElement = (elementRef, offset = 0) => {
        if (elementRef.current) {
            const elementPosition = elementRef.current.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

            setShowScrollTop(scrollTop > 200);
            setShowScrollDown(distanceFromBottom > 100);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    async function onCheck() {
        if (!packageId || !form.startDate || !form.endDate) return;
        const res = await checkAvailability(packageId, form.startDate, form.endDate);
        setAvailable(res.available);
        setTimeout(() => scrollToElement(availabilityRef, 80), 300);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (!token || !user) {
            setError("Authentication Required! Please login to make a booking.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        
        if (!packageId) {
            setError("Invalid package selected! Please go back and select a valid package.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }

        // Validate form fields
        if (!form.firstName.trim()) {
            setError("First Name is required! Please enter your first name.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.lastName.trim()) {
            setError("Last Name is required! Please enter your last name.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.email.trim()) {
            setError("Email is required! Please enter your email address.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.phone.trim()) {
            setError("Phone number is required! Please enter your phone number.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.startDate) {
            setError("Start Date is required! Please select your travel start date.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.endDate) {
            setError("End Date is required! Please select your travel end date.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }
        if (!form.amount || Number(form.amount) <= 0) {
            setError("Valid amount is required! Please enter a valid amount in LKR.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }

        // Check if end date is after start date
        if (new Date(form.endDate) <= new Date(form.startDate)) {
            setError("End date must be after start date! Please select valid travel dates.");
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            return;
        }

        setSaving(true);
        try {
            const result = await createBooking({
                packageId,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                startDate: form.startDate,
                endDate: form.endDate,
                amount: Number(form.amount),
            });
            setMessage(`Booking successful! Confirmation Number: ${result.confirmationNumber || result.reservationID}`);
            setTimeout(() => scrollToElement(messageRef, 80), 300);
            setTimeout(() => navigate(`/customer/history?email=${encodeURIComponent(form.email)}`), 2000);
        } catch (e) {
            const errorMessage = e?.response?.data?.message || "Booking failed! Please try again or contact support.";
            setError(errorMessage);
            setTimeout(() => scrollToElement(messageRef, 80), 300);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container py-3" style={{
            maxWidth: '900px',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(66, 165, 245, 0.2), 0 0 60px rgba(66, 165, 245, 0.1)',
            marginTop: '1rem',
            marginBottom: '1rem'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                padding: '1.5rem',
                borderRadius: '15px',
                border: '2px solid rgba(66, 165, 245, 0.3)',
                boxShadow: '0 8px 25px rgba(66, 165, 245, 0.15)',
                backdropFilter: 'blur(10px)'
            }}>
                <h4 className="m-0" style={{
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    textShadow: '0 2px 4px rgba(66, 165, 245, 0.3)'
                }}>
                    ✈️ Book Your Tour
                </h4>
                <div className="d-flex gap-3">
                    <button 
                        type="button" 
                        className="btn btn-lg" 
                        onClick={scrollToBottom}
                        style={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            fontWeight: '600',
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '120px'
                        }}
                    >
                        ↓ Bottom
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-lg" 
                        onClick={scrollToTop}
                        style={{
                            background: 'linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            fontWeight: '600',
                            boxShadow: '0 8px 20px rgba(66, 165, 245, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '120px'
                        }}
                    >
                        ↑ Top
                    </button>
                </div>
            </div>

            <form onSubmit={onSubmit} className="row g-3" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '2rem',
                border: '2px solid rgba(66, 165, 245, 0.2)',
                boxShadow: '0 8px 25px rgba(66, 165, 245, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Personal Information */}
                <div className="col-12">
                    <h6 className="mb-3 mt-1" style={{
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        textShadow: '0 1px 2px rgba(66, 165, 245, 0.3)'
                    }}>
                        👤 Personal Information
                    </h6>
                </div>
                <div className="col-md-6">
                    <label className="form-label mb-2" htmlFor="firstName" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>First Name</label>
                    <input 
                        id="firstName" 
                        className="form-control" 
                        value={form.firstName} 
                        onChange={(e)=>setForm({...form, firstName:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label mb-2" htmlFor="lastName" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>Last Name</label>
                    <input 
                        id="lastName" 
                        className="form-control" 
                        value={form.lastName} 
                        onChange={(e)=>setForm({...form, lastName:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label mb-2" htmlFor="email" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>Email</label>
                    <input 
                        id="email" 
                        type="email" 
                        className="form-control" 
                        value={form.email} 
                        onChange={(e)=>setForm({...form, email:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label mb-2" htmlFor="phone" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>Phone</label>
                    <input 
                        id="phone" 
                        className="form-control" 
                        value={form.phone} 
                        onChange={(e)=>setForm({...form, phone:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                {/* Booking Details */}
                <div className="col-12">
                    <h6 className="mb-3 mt-4" style={{
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        textShadow: '0 1px 2px rgba(66, 165, 245, 0.3)'
                    }}>
                        📅 Booking Details
                    </h6>
                </div>
                <div className="col-md-4">
                    <label className="form-label mb-2" htmlFor="startDate" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>Start Date</label>
                    <input 
                        id="startDate" 
                        type="date" 
                        className="form-control" 
                        value={form.startDate} 
                        onChange={(e)=>setForm({...form, startDate:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label mb-2" htmlFor="endDate" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>End Date</label>
                    <input 
                        id="endDate" 
                        type="date" 
                        className="form-control" 
                        value={form.endDate} 
                        onChange={(e)=>setForm({...form, endDate:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label mb-2" htmlFor="amount" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>Amount (LKR)</label>
                    <input 
                        id="amount" 
                        type="number" 
                        className="form-control" 
                        min={1} 
                        value={form.amount} 
                        onChange={(e)=>setForm({...form, amount:e.target.value})} 
                        required 
                        style={{
                            border: '2px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <div className="col-12 mt-3">
                    <button 
                        type="button" 
                        className="btn btn-lg" 
                        onClick={onCheck}
                        style={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '15px 30px',
                            fontWeight: '600',
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '200px',
                            fontSize: '1.1rem'
                        }}
                    >
                        🔍 Check Availability
                    </button>
                </div>

                {available !== null && (
                    <TravelAvailabilityValidation 
                        ref={availabilityRef}
                        available={available}
                        dates={{
                            startDate: form.startDate,
                            endDate: form.endDate
                        }}
                        packageName={`Package #${packageId}`}
                    />
                )}

                {/* Payment Profile Selection */}
                <div className="col-12">
                    <h6 className="mb-3 mt-4" style={{
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        textShadow: '0 1px 2px rgba(66, 165, 245, 0.3)'
                    }}>
                        💳 Payment Profile
                    </h6>
                    <PaymentProfileSelector
                        onProfileSelect={setSelectedPaymentProfile}
                        selectedProfileId={selectedPaymentProfile?.profileID}
                    />
                    <div className="mt-2">
                        <small className="text-muted">
                            <i className="fas fa-cog me-1"></i>
                            <a 
                                href="/customer/payment-profiles" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#1976d2', textDecoration: 'none' }}
                            >
                                Manage Payment Profiles
                            </a>
                        </small>
                    </div>
                    {selectedPaymentProfile && (
                        <div className="mt-3 p-3" style={{
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            border: '1px solid rgba(40, 167, 69, 0.3)',
                            borderRadius: '10px'
                        }}>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                <strong>Selected: {selectedPaymentProfile.profileName}</strong>
                            </div>
                            <div className="text-muted small mt-1">
                                {selectedPaymentProfile.paymentMethod.replace('_', ' ')} • {selectedPaymentProfile.cardNumber}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="col-12 mt-4 d-flex gap-4 flex-wrap justify-content-center">
                    <button 
                        type="button" 
                        className="btn btn-lg" 
                        onClick={() => {
                            if (!selectedPaymentProfile) {
                                Swal.fire('Payment Profile Required', 'Please select a payment profile to process payment.', 'warning');
                                return;
                            }
                            // Handle payment processing with selected profile
                            Swal.fire({
                                title: 'Process Payment',
                                html: `
                                    <div class="text-start">
                                        <p><strong>Amount:</strong> LKR ${form.amount}</p>
                                        <p><strong>Payment Method:</strong> ${selectedPaymentProfile.paymentMethod.replace('_', ' ')}</p>
                                        <p><strong>Card:</strong> ${selectedPaymentProfile.cardNumber}</p>
                                        <p><strong>Profile:</strong> ${selectedPaymentProfile.profileName}</p>
                                    </div>
                                `,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Process Payment',
                                cancelButtonText: 'Cancel'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire('Payment Processed!', 'Your payment has been processed successfully.', 'success');
                                }
                            });
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '15px 30px',
                            fontWeight: '600',
                            boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '180px',
                            fontSize: '1.1rem'
                        }}
                    >
                        💳 Process Payment
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-lg" 
                        disabled={saving}
                        style={{
                            background: saving ? 
                                'linear-gradient(135deg, #90a4ae 0%, #b0bec5 100%)' : 
                                'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '15px 30px',
                            fontWeight: '600',
                            boxShadow: saving ? 
                                '0 4px 10px rgba(144, 164, 174, 0.3)' : 
                                '0 8px 20px rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '200px',
                            fontSize: '1.1rem',
                            cursor: saving ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {saving ? "⏳ Processing..." : "✅ Complete Booking"}
                    </button>
                </div>

                {error && (
                    <div ref={messageRef} className="col-12 mt-3">
                        <BigErrorAlert
                            title="🚨 Booking Error!"
                            message={error}
                            type="error"
                            onClose={() => setError("")}
                            size="large"
                            animation={true}
                        />
                    </div>
                )}

                {message && (
                    <div ref={messageRef} className="col-12 alert alert-info py-2 mt-2">
                        <small>{message}</small>
                    </div>
                )}

                {/* Bottom marker for scroll */}
                <div ref={bottomRef} className="col-12" style={{height: '1px'}}></div>
            </form>

            {/* Floating Scroll Buttons */}
            {showScrollTop && (
                <button
                    className="btn rounded-circle position-fixed shadow"
                    style={{
                        bottom: '20px',
                        right: '20px',
                        width: '60px',
                        height: '60px',
                        zIndex: 1000,
                        fontSize: '24px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4), 0 0 30px rgba(66, 165, 245, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={scrollToTop}
                    title="Back to Top"
                >
                    ↑
                </button>
            )}

            {showScrollDown && (
                <button
                    className="btn rounded-circle position-fixed shadow"
                    style={{
                        bottom: '20px',
                        right: '90px',
                        width: '60px',
                        height: '60px',
                        zIndex: 1000,
                        fontSize: '24px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%)',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(66, 165, 245, 0.4), 0 0 30px rgba(100, 181, 246, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={scrollToBottom}
                    title="Scroll to Bottom"
                >
                    ↓
                </button>
            )}
        </div>
    );
}