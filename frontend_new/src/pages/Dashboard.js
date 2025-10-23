import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Modal,
  Alert,
} from "@mui/material";

export default function Dashboard() {
  const { logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [guideId, setGuideId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/reservations/history/${userId}`);
      setHistory(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
      setError("Failed to fetch booking history");
    }
  };


  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchReservations();
    fetchGuides();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/api/reservations");
      setReservations(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations");
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await api.get("/api/guides");
      console.log("Guides data:", res.data);
      setGuides(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load guides. Please check the API endpoint.");
    }
  };

  const openModal = (reservation, type) => {
    setSelectedReservation(reservation);
    setModalType(type);
    setNewStatus(reservation.status);
    setGuideId(reservation.guideID || "");
    setModalOpen(true);
    setError("");
  };

  const handleAction = async () => {
    try {
      if (!selectedReservation) return;
      
      if (modalType === "status") {
        await api.put(`/api/reservations/${selectedReservation.reservationID}/status`, {
          status: newStatus,
        });
      } else if (modalType === "assign") {
        if (!guideId) {
          setError("Please select a guide");
          return;
        }
        await api.put(`/api/reservations/${selectedReservation.reservationID}/assign-guide`, {
          guideId,
        });
      } else if (modalType === "delete") {
        await api.delete(`/api/reservations/${selectedReservation.reservationID}`);
      }
      
      fetchReservations();
      setModalOpen(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError(`Failed to ${modalType} reservation`);
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "status":
        return (
          <>
            <Typography variant="h6" className="text-center mb-4 text-blue-600 font-semibold">
              Update Reservation Status
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </Select>
            </FormControl>
            <div className="mt-6 flex justify-center space-x-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAction}
              >
                Update Status
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        );

      case "assign":
        return (
          <>
            <Typography variant="h6" className="text-center mb-4 text-blue-600 font-semibold">
              Assign Guide
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Guide</InputLabel>
              <Select
                value={guideId}
                onChange={(e) => setGuideId(e.target.value)}
                label="Select Guide"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {guides.map((guide) => (
                  <MenuItem 
                    key={guide.guideID} 
                    value={guide.guideID}
                  >
                    {guide.fname} {guide.lname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {guides.length === 0 && (
              <Typography color="error" className="mt-2">
                No guides available. Please check if guides are properly loaded.
              </Typography>
            )}
            <div className="mt-6 flex justify-center space-x-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAction}
                disabled={guides.length === 0}
              >
                Assign Guide
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        );

      case "delete":
        return (
          <>
            <Typography variant="h6" className="text-center mb-4 text-red-600 font-semibold">
              Delete Reservation
            </Typography>
            <Typography className="text-center mb-4">
              Are you sure you want to delete reservation #{selectedReservation?.reservationID}?
            </Typography>
            <div className="mt-6 flex justify-center space-x-3">
              <Button
                variant="contained"
                color="error"
                onClick={handleAction}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        );

      case "view":
        return (
          <>
            <Typography variant="h6" className="text-center mb-4 text-green-600 font-semibold">
              Reservation Details
            </Typography>
            {selectedReservation && (
              <div className="space-y-2">
                <Typography><strong>ID:</strong> {selectedReservation.reservationID}</Typography>
                <Typography><strong>User:</strong> {selectedReservation.userID}</Typography>
                <Typography><strong>Package:</strong> {selectedReservation.packageID}</Typography>
                <Typography><strong>Guide:</strong> {selectedReservation.guideID || "—"}</Typography>
                <Typography><strong>Status:</strong> {selectedReservation.status}</Typography>
                <Typography><strong>Start Date:</strong> {selectedReservation.startDate}</Typography>
                <Typography><strong>End Date:</strong> {selectedReservation.endDate}</Typography>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/40 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">
          Customer Service Executive Panel
        </h1>
        <div className="space-x-3">
          <Button
            variant="contained"
            onClick={fetchReservations}
            className="!bg-blue-600 hover:!bg-blue-700 !text-white"
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={logout}
            className="!border-red-500 !text-red-600 hover:!bg-red-50"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <section className="mb-10">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Active Reservations
          </Typography>

          <TableContainer 
            component={Paper} 
            className="shadow-lg rounded-xl bg-white/30 backdrop-blur-md border border-white/40"
          >
            <Table>
              <TableHead className="bg-blue-100/50">
                <TableRow>
                  <TableCell className="font-semibold">ID</TableCell>
                  <TableCell className="font-semibold">User</TableCell>
                  <TableCell className="font-semibold">Package</TableCell>
                  <TableCell className="font-semibold">Guide</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Start Date</TableCell>
                  <TableCell className="font-semibold">End Date</TableCell>
                  <TableCell align="center" className="font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow key={res.reservationID} hover className="bg-white/50">
                    <TableCell>{res.reservationID}</TableCell>
                    <TableCell>{res.userID}</TableCell>
                    <TableCell>{res.packageID}</TableCell>
                    <TableCell>{res.guideID || "—"}</TableCell>
                    <TableCell>{res.status}</TableCell>
                    <TableCell>{res.startDate}</TableCell>
                    <TableCell>{res.endDate}</TableCell>
                    <TableCell align="center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          size="small"
                          className="!bg-amber-500 hover:!bg-amber-600 !text-white shadow-sm"
                          onClick={() => openModal(res, "status")}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          className="!bg-blue-500 hover:!bg-blue-600 !text-white shadow-sm"
                          onClick={() => openModal(res, "assign")}
                        >
                          Assign
                        </Button>
                        <Button
                          size="small"
                          className="!bg-rose-500 hover:!bg-rose-600 !text-white shadow-sm"
                          onClick={() => openModal(res, "delete")}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          className="!bg-gray-500 hover:!bg-gray-600 !text-white shadow-sm"
                          onClick={() => openModal(res, "view")}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </section>

        {/* Booking History Section */}
        <section className="mt-12">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Search Booking History by User ID
          </Typography>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              placeholder="Enter User ID"
              value={userId || ""}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
            />
            <Button
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 !text-white"
              onClick={fetchHistory}
             >
              Search
            </Button>
          </div>

          {history.length > 0 ? (
            <TableContainer
              component={Paper}
              className="shadow-lg rounded-xl bg-white/30 backdrop-blur-md border border-white/40"
            >
              <Table>
                <TableHead className="bg-blue-100/50">
                  <TableRow>
                    <TableCell className="font-semibold">ID</TableCell>
                    <TableCell className="font-semibold">User</TableCell>
                    <TableCell className="font-semibold">Package</TableCell>
                    <TableCell className="font-semibold">Guide</TableCell>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell className="font-semibold">Start Date</TableCell>
                    <TableCell className="font-semibold">End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((res) => (
                    <TableRow key={res.reservationID} hover className="bg-white/50">
                      <TableCell>{res.reservationID}</TableCell>
                      <TableCell>{res.userID}</TableCell>
                      <TableCell>{res.packageID}</TableCell>
                      <TableCell>{res.guideID || "—"}</TableCell>
                      <TableCell>{res.status}</TableCell>
                      <TableCell>{res.startDate}</TableCell>
                      <TableCell>{res.endDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" className="mt-2">
             No booking history found for this user.
            </Typography>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center text-gray-800 py-4 text-sm bg-white/20 backdrop-blur-sm">
        © {new Date().getFullYear()} Travel & Tour Management System — All rights reserved.
      </footer>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6 w-96 max-h-90vh overflow-y-auto">
          {renderModalContent()}
        </Box>
      </Modal>
    </div>
  );
}




