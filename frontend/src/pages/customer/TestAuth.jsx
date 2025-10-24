import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function TestAuth() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    setToken(storedToken || 'No token found');
    setUser(storedUser || 'No user found');
  }, []);

  const testAPI = async () => {
    try {
      setTestResult("Testing...");
      const response = await api.get('/customer/bookings', { 
        params: { email: 'nethmifernando164@gmail.com' } 
      });
      setTestResult(`Success! Found ${response.data?.length || 0} bookings`);
    } catch (error) {
      setTestResult(`Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container p-3">
      <h3>Authentication Test</h3>
      
      <div className="card mb-3">
        <div className="card-body">
          <h5>Stored Token:</h5>
          <p className="text-break small">{token}</p>
          
          <h5>Stored User:</h5>
          <p className="text-break small">{user}</p>
          
          <button className="btn btn-primary" onClick={testAPI}>
            Test API Call
          </button>
          
          {testResult && (
            <div className="mt-3">
              <h5>Test Result:</h5>
              <p className={testResult.includes('Error') ? 'text-danger' : 'text-success'}>
                {testResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
