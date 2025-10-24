import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeedbackPage from "./pages/FeedbackPage";
import LandingPage from "./pages/LandingPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Packages from "./pages/customer/Packages";
import Book from "./pages/customer/Book";
import History from "./pages/customer/History";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerEditProfile from "./pages/customer/CustomerEditProfile";
import PaymentProfiles from "./pages/customer/PaymentProfiles";
import TestAuth from "./pages/customer/TestAuth";
import ProfileDebug from "./pages/customer/ProfileDebug";
import AdminProfile from "./pages/adminprofile/AdminProfile";
import EditProfile from "./pages/adminprofile/EditProfile";
import Status from "./pages/Status";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/customer/login" element={<CustomerLogin />} />
        <Route path="/auth/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/packages" element={<Packages />} />
        <Route path="/customer/book" element={<Book />} />
        <Route path="/customer/history" element={<History />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/edit-profile" element={<CustomerEditProfile />} />
        <Route path="/customer/payment-profiles" element={<PaymentProfiles />} />
        <Route path="/customer/test-auth" element={<TestAuth />} />
        <Route path="/customer/profile-debug" element={<ProfileDebug />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
