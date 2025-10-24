import React, { useEffect, useState } from "react";
import axios from "axios";

const Status = () => {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [frontendStatus, setFrontendStatus] = useState("running");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/public/health", {
          timeout: 5000
        });
        setBackendStatus("connected");
        console.log("Backend response:", response.data);
      } catch (error) {
        console.error("Backend check failed:", error);
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          setBackendStatus("disconnected");
        } else {
          setBackendStatus("error");
        }
      }
    };

    checkBackend();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "connected": return "text-success";
      case "disconnected": return "text-danger";
      case "error": return "text-warning";
      default: return "text-info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected": return "✅";
      case "disconnected": return "❌";
      case "error": return "⚠️";
      default: return "🔄";
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>🔧 System Status</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Frontend (React)</span>
                <span className={`badge bg-success`}>
                  {getStatusIcon("running")} Running
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Backend (Spring Boot)</span>
                <span className={`badge ${backendStatus === "connected" ? "bg-success" : "bg-danger"}`}>
                  {getStatusIcon(backendStatus)} {backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  🔄 Refresh Status
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => window.open("http://localhost:3000/customer/profile-debug", "_blank")}
                >
                  🐛 Debug Profile
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => window.open("http://localhost:3000/customer/packages", "_blank")}
                >
                  📦 Go to Packages
                </button>
                {backendStatus === "disconnected" && (
                  <div className="alert alert-warning mt-3">
                    <small>
                      <strong>Backend not running.</strong><br/>
                      To start the backend, run:<br/>
                      <code>cd backend && .\mvnw.cmd spring-boot:run</code>
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
