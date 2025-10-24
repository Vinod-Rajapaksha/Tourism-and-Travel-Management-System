import React from "react";
import Lottie from "lottie-react";
import travelLoaderJson from "../assets/loader.json";

export default function TravelLoader() {
  return (
    <div className="global-loader">
      <div className="loader-container">
        <Lottie
          animationData={travelLoaderJson}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
        <p className="loading-text">Loading…</p>

        <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          text-align: center;
        }
        .loading-text {
          margin-top: 15px;
          font-weight: 600;
          color: #2F80ED;
        }

        .global-loader {
          position: fixed;       
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;  
      `}
      </style>
      </div>
    </div>
  );
}
