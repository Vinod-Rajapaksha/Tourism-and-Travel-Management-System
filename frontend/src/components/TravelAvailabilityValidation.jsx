import React from 'react';

const TravelAvailabilityValidation = ({ available, dates, packageName }) => {
    if (available === null) return null;

    return (
        <div className="col-12 mt-3">
            <div 
                className={`alert ${available ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}
                style={{
                    borderRadius: '15px',
                    border: available ? '2px solid #28a745' : '2px solid #dc3545',
                    backgroundColor: available ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    padding: '1.5rem',
                    boxShadow: available ? 
                        '0 8px 25px rgba(40, 167, 69, 0.2)' : 
                        '0 8px 25px rgba(220, 53, 69, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderLeft: available ? '6px solid #28a745' : '6px solid #dc3545',
                    animation: 'slideInFromTop 0.5s ease-out'
                }}
            >
                <div className="d-flex align-items-center w-100">
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: available ? '#28a745' : '#dc3545',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            boxShadow: available ? 
                                '0 4px 15px rgba(40, 167, 69, 0.4)' : 
                                '0 4px 15px rgba(220, 53, 69, 0.4)'
                        }}
                    >
                        {available ? '✓' : '✗'}
                    </div>
                    <div className="flex-grow-1">
                        <h5 
                            className="mb-2" 
                            style={{
                                color: available ? '#28a745' : '#dc3545',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}
                        >
                            {available ? 'Travel Available!' : 'Cannot Place Travel'}
                        </h5>
                        <p 
                            className="mb-1" 
                            style={{
                                color: available ? '#155724' : '#721c24',
                                fontSize: '1rem',
                                margin: 0
                            }}
                        >
                            {available ? 
                                `✅ Your selected travel package is available for the dates ${dates?.startDate} to ${dates?.endDate}` :
                                `❌ Sorry, the travel package is not available for the selected dates ${dates?.startDate} to ${dates?.endDate}`
                            }
                        </p>
                        {!available && (
                            <div className="mt-2">
                                <small 
                                    style={{
                                        color: '#721c24',
                                        fontSize: '0.9rem',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    💡 Please try selecting different dates or contact our support team for alternative options.
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slideInFromTop {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TravelAvailabilityValidation;
