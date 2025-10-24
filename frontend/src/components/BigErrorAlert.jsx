import React from 'react';

const BigErrorAlert = ({ 
  title = "🚨 Error Occurred!", 
  message, 
  type = "error", 
  onClose, 
  showCloseButton = true,
  size = "large",
  animation = true 
}) => {
  const getErrorStyles = () => {
    const baseStyles = {
      position: 'relative',
      borderRadius: '20px',
      padding: size === 'large' ? '2rem' : '1.5rem',
      margin: '1rem 0',
      boxShadow: '0 20px 40px rgba(244, 67, 54, 0.3), 0 0 60px rgba(244, 67, 54, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '3px solid',
      animation: animation ? 'shake 0.5s ease-in-out' : 'none',
      zIndex: 1000,
      maxWidth: '100%',
      wordWrap: 'break-word'
    };

    const typeStyles = {
      error: {
        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(229, 57, 53, 0.95) 25%, rgba(211, 47, 47, 0.95) 50%, rgba(198, 40, 40, 0.95) 75%, rgba(183, 28, 28, 0.95) 100%)',
        borderColor: '#d32f2f',
        color: '#ffffff'
      },
      warning: {
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 143, 0, 0.95) 25%, rgba(255, 138, 0, 0.95) 50%, rgba(255, 130, 0, 0.95) 75%, rgba(255, 123, 0, 0.95) 100%)',
        borderColor: '#f57c00',
        color: '#ffffff'
      },
      info: {
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(30, 136, 229, 0.95) 25%, rgba(25, 118, 210, 0.95) 50%, rgba(21, 101, 192, 0.95) 75%, rgba(13, 71, 161, 0.95) 100%)',
        borderColor: '#1976d2',
        color: '#ffffff'
      },
      success: {
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(69, 160, 73, 0.95) 25%, rgba(56, 142, 60, 0.95) 50%, rgba(46, 125, 50, 0.95) 75%, rgba(27, 94, 32, 0.95) 100%)',
        borderColor: '#4caf50',
        color: '#ffffff'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      error: '🚨',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || icons.error;
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
          
          .big-error-alert {
            animation: ${animation ? 'pulse 2s infinite' : 'none'};
          }
        `}
      </style>
      <div 
        className="big-error-alert"
        style={getErrorStyles()}
      >
        {/* Close Button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        )}

        {/* Error Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: size === 'large' ? '3rem' : '2rem',
            marginRight: '1rem',
            animation: 'pulse 1.5s infinite'
          }}>
            {getIcon()}
          </span>
          <h2 style={{
            margin: 0,
            fontSize: size === 'large' ? '2rem' : '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            {title}
          </h2>
        </div>

        {/* Error Message */}
        <div style={{
          textAlign: 'center',
          fontSize: size === 'large' ? '1.2rem' : '1rem',
          lineHeight: '1.6',
          fontWeight: '500',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {message}
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          right: '-10px',
          bottom: '-10px',
          background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          borderRadius: '25px',
          zIndex: -1,
          animation: 'pulse 3s infinite'
        }}></div>
      </div>
    </>
  );
};

export default BigErrorAlert;
