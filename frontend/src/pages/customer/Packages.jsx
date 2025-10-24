import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { listPackages } from "../../services/auth";
import CustomerNav from "../../components/CustomerNav";
import UserProfileHeader from "../../components/UserProfileHeader";
import Swal from "sweetalert2";
import BigErrorAlert from "../../components/BigErrorAlert";

export default function Packages() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        listPackages()
            .then(setPackages)
            .catch(() => setError("Failed to load packages"))
            .finally(() => setLoading(false));
    }, []);

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const isAuthenticated = token && user;

    if (loading) return (
        <>
            <CustomerNav />
            {isAuthenticated && <UserProfileHeader />}
            <div className="container p-3">Loading packages...</div>
        </>
    );
    if (error) return (
        <>
            <CustomerNav />
            {isAuthenticated && <UserProfileHeader />}
            <div className="container p-3">
                <BigErrorAlert
                    title="🚨 Failed to Load Packages!"
                    message={error}
                    type="error"
                    onClose={() => setError("")}
                    size="large"
                    animation={true}
                />
            </div>
        </>
    );

    return (
        <>
            <CustomerNav />
            {isAuthenticated && <UserProfileHeader />}
            {!isAuthenticated && (
                <div style={{
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 25%, #ffcc80 50%, #ffb74d 75%, #ff9800 100%)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    borderBottom: '3px solid #ff9800',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        display: 'inline-block',
                        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                        border: '2px solid #ff9800',
                        maxWidth: '600px'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '0.5rem'
                        }}>
                            🔒
                        </div>
                        <h4 style={{ 
                            color: '#f57c00', 
                            fontWeight: 'bold', 
                            margin: '0 0 1rem 0',
                            fontSize: '1.3rem'
                        }}>
                            Guest Mode - Limited Access
                        </h4>
                        <p style={{ 
                            color: '#e65100', 
                            fontWeight: '600', 
                            margin: '0 0 1rem 0',
                            fontSize: '1rem'
                        }}>
                            You're viewing packages as a guest. To book tours and access full features, please login or create an account.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link 
                                to="/auth/customer/login" 
                                style={{ 
                                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.3)';
                                }}
                            >
                                🔑 Login to Book
                            </Link>
                            <Link 
                                to="/auth/customer/register" 
                                style={{ 
                                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                                }}
                            >
                                ✨ Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <div className="container p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="page-hero mb-4" style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '15px',
                border: '2px solid #1976d2',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.1)'
            }}>
                <h3 className="m-0" style={{ color: '#1976d2', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>🌟 Discover Tours</h3>
                <p className="m-0 mt-2" style={{ color: '#1976d2', opacity: 1, fontWeight: '500' }}>Choose a package and book your next experience.</p>
            </div>
            {!packages.length ? (
                <div className="alert alert-info" style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #1976d2',
                    color: '#1976d2',
                    borderRadius: '10px',
                    padding: '2rem',
                    fontWeight: '500',
                    textAlign: 'center'
                }}>
                    <h5>📦 No packages available</h5>
                    <p>Check back later for exciting travel packages!</p>
                </div>
            ) : (
                <div className="row g-4 mt-2">
                    {packages.map((p) => (
                        <div key={p.packageID} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100" style={{
                                backgroundColor: '#ffffff',
                                border: isAuthenticated ? '2px solid #1976d2' : '2px solid #ff9800',
                                borderRadius: '15px',
                                boxShadow: isAuthenticated ? '0 4px 15px rgba(25, 118, 210, 0.1)' : '0 4px 15px rgba(255, 152, 0, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}>
                                {!isAuthenticated && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                        color: '#ffffff',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        zIndex: 1,
                                        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                                    }}>
                                        🔒 Guest Mode
                                    </div>
                                )}
                                {p.image && (
                                    <img alt={p.title} src={p.image} className="card-img-top" style={{
                                        objectFit: 'cover', 
                                        height: 200,
                                        borderTopLeftRadius: '13px',
                                        borderTopRightRadius: '13px'
                                    }} />
                                )}
                                <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                                    <h5 className="card-title mb-2" style={{ color: '#1976d2', fontWeight: 'bold' }}>{p.title}</h5>
                                    <div className="mb-3">
                                        <span style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1976d2',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            border: '1px solid #1976d2'
                                        }}>
                                            LKR {p.price}
                                        </span>
                                    </div>
                                    <p className="card-text flex-grow-1" style={{ color: '#333', lineHeight: '1.5' }}>{p.description}</p>
                                    {isAuthenticated ? (
                                        <a 
                                            href={`/customer/book?packageId=${p.packageID}`} 
                                            className="btn mt-3"
                                            style={{
                                                backgroundColor: '#1976d2',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0.75rem 1.5rem',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#1565c0';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#1976d2';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            🎯 Book Now
                                        </a>
                                    ) : (
                                        <div className="mt-3">
                                            <div style={{
                                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 143, 0, 0.1) 100%)',
                                                border: '2px solid #ff9800',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                textAlign: 'center',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <p style={{
                                                    color: '#f57c00',
                                                    fontWeight: '600',
                                                    margin: '0 0 0.5rem 0',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    🔒 Login Required to Book
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <Link
                                                        to="/auth/customer/login"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                            color: '#ffffff',
                                                            textDecoration: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            fontWeight: '600',
                                                            fontSize: '0.85rem',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.transform = 'translateY(-1px)';
                                                            e.target.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.3)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        🔑 Login
                                                    </Link>
                                                    <Link
                                                        to="/auth/customer/register"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                                            color: '#ffffff',
                                                            textDecoration: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            fontWeight: '600',
                                                            fontSize: '0.85rem',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.transform = 'translateY(-1px)';
                                                            e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        ✨ Register
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </>
    );
}


