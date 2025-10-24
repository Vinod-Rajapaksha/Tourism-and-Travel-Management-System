import React, { useState, useEffect } from "react";
import reservationAPI from "../../api/Reservations";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Select, MenuItem, FormControl, InputLabel,
  Typography, Box, Modal, Alert,
} from "@mui/material";

export default function CustomerServiceExecutiveDashboard() {
  const [reservations, setReservations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [guideId, setGuideId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
    fetchGuides();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await reservationAPI.getReservations();
      setReservations(data);
      setError("");
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations");
    }
  };

  const fetchGuides = async () => {
    try {
      const data = await reservationAPI.getGuides();
      setGuides(data || []);
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
        await reservationAPI.updateReservationStatus(
          selectedReservation.reservationID,
          newStatus
        );
      } else if (modalType === "assign") {
        if (!guideId) {
          setError("Please select a guide");
          return;
        }
        await reservationAPI.assignGuideToReservation(
          selectedReservation.reservationID,
          guideId
        );
      } else if (modalType === "delete") {
        await reservationAPI.deleteReservation(selectedReservation.reservationID);
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
            <Typography variant="h6" className="tw-text-center tw-mb-4 tw-text-blue-600 tw-font-semibold">
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
            <div className="tw-mt-6 tw-flex tw-justify-center tw-space-x-3">
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
            <Typography variant="h6" className="tw-text-center tw-mb-4 tw-text-blue-600 tw-font-semibold">
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
              <Typography color="error" className="tw-mt-2">
                No guides available. Please check if guides are properly loaded.
              </Typography>
            )}
            <div className="tw-mt-6 tw-flex tw-justify-center tw-space-x-3">
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
            <Typography variant="h6" className="tw-text-center tw-mb-4 tw-text-red-600 tw-font-semibold">
              Delete Reservation
            </Typography>
            <Typography className="tw-text-center tw-mb-4">
              Are you sure you want to delete reservation #{selectedReservation?.reservationID}?
            </Typography>
            <div className="tw-mt-6 tw-flex tw-justify-center tw-space-x-3">
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
            <Typography variant="h6" className="tw-text-center tw-mb-4 tw-text-green-600 tw-font-semibold">
              Reservation Details
            </Typography>
            {selectedReservation && (
              <div className="tw-space-y-2">
                <Typography><strong>ID:</strong> {selectedReservation.reservationID}</Typography>
                <Typography><strong>User:</strong> {selectedReservation.userID}</Typography>
                <Typography><strong>Package:</strong> {selectedReservation.packageID}</Typography>
                <Typography><strong>Guide:</strong> {selectedReservation.guideID || "—"}</Typography>
                <Typography><strong>Status:</strong> {selectedReservation.status}</Typography>
                <Typography><strong>Start Date:</strong> {selectedReservation.startDate}</Typography>
                <Typography><strong>End Date:</strong> {selectedReservation.endDate}</Typography>
              </div>
            )}
            <div className="tw-mt-6 tw-flex tw-justify-center">
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
    <div className="tw-min-h-screen tw-flex tw-flex-col tw-justify-between tw-bg-gradient-to-br tw-from-blue-200 tw-via-blue-300 tw-to-blue-400">
      {/* Header */}
      <header className="tw-bg-white/30 tw-backdrop-blur-md tw-border-b tw-border-white/40 tw-shadow-md tw-py-4 tw-px-6 tw-flex tw-justify-between tw-items-center">
        <h1 className="tw-text-2xl tw-font-bold tw-text-blue-800">
          Customer Service Executive Panel
        </h1>
        <div className="tw-space-x-3">
          <Button
            variant="contained"
            onClick={fetchReservations}
            className="!tw-bg-blue-600 hover:!tw-bg-blue-700 !tw-text-white"
          >
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="tw-flex-1 tw-p-6">
        {error && (
          <Alert severity="error" className="tw-mb-4">
            {error}
          </Alert>
        )}

        <section className="tw-mb-10">
          <Typography variant="h5" className="tw-font-semibold tw-text-gray-800 tw-mb-4">
            Active Reservations
          </Typography>

          <TableContainer 
            component={Paper} 
            className="tw-shadow-lg tw-rounded-xl tw-bg-white/30 tw-backdrop-blur-md tw-border tw-border-white/40"
          >
            <Table>
              <TableHead className="tw-bg-blue-100/50">
                <TableRow>
                  <TableCell className="tw-font-semibold">ID</TableCell>
                  <TableCell className="tw-font-semibold">User</TableCell>
                  <TableCell className="tw-font-semibold">Package</TableCell>
                  <TableCell className="tw-font-semibold">Guide</TableCell>
                  <TableCell className="tw-font-semibold">Status</TableCell>
                  <TableCell className="tw-font-semibold">Start Date</TableCell>
                  <TableCell className="tw-font-semibold">End Date</TableCell>
                  <TableCell align="center" className="tw-font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow key={res.reservationID} hover className="tw-bg-white/50">
                    <TableCell>{res.reservationID}</TableCell>
                    <TableCell>{res.userID}</TableCell>
                    <TableCell>{res.packageID}</TableCell>
                    <TableCell>{res.guideID || "—"}</TableCell>
                    <TableCell>{res.status}</TableCell>
                    <TableCell>{res.startDate}</TableCell>
                    <TableCell>{res.endDate}</TableCell>
                    <TableCell align="center">
                      <div className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-center">
                        <Button
                          size="small"
                          className="!tw-bg-amber-500 hover:!tw-bg-amber-600 !tw-text-white tw-shadow-sm"
                          onClick={() => openModal(res, "status")}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          className="!tw-bg-blue-500 hover:!tw-bg-blue-600 !tw-text-white tw-shadow-sm"
                          onClick={() => openModal(res, "assign")}
                        >
                          Assign
                        </Button>
                        <Button
                          size="small"
                          className="!tw-bg-rose-500 hover:!tw-bg-rose-600 !tw-text-white tw-shadow-sm"
                          onClick={() => openModal(res, "delete")}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          className="!tw-bg-gray-500 hover:!tw-bg-gray-600 !tw-text-white tw-shadow-sm"
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
      </main>

      {/* Footer */}
      <footer className="tw-text-center tw-text-gray-800 tw-py-4 tw-text-sm tw-bg-white/20 tw-backdrop-blur-sm">
        © {new Date().getFullYear()} Travel & Tour Management System — All rights reserved.
      </footer>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white/30 tw-backdrop-blur-md tw-border tw-border-white/40 tw-rounded-2xl tw-shadow-xl tw-p-6 tw-w-96 tw-max-h-90vh tw-overflow-y-auto">
          {renderModalContent()}
        </Box>
      </Modal>
    </div>
  );
}