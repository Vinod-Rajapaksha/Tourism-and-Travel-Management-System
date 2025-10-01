import { Routes, Route, Navigate } from "react-router-dom";
import SeniorTravelConsultantDashboard from "./pages/dashboard/SeniorTravelConsultantDashboard";
import PackagesList from "./pages/client/PackagesList";

function App() {
  return (
    <Routes>
      {/* Customer side */}
      <Route path="/packages" element={<PackagesList />} />

      {/* Senior Travel Consultant dashboard */}
      <Route
        path="/dashboard/senior-travel-consultant"
        element={<SeniorTravelConsultantDashboard />}
      />

      {/* Default: if no route matches, go to customer packages */}
      <Route path="*" element={<Navigate to="/packages" replace />} />
    </Routes>
  );
}

export default App;
