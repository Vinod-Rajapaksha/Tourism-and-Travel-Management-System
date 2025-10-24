import api from "./api";

export async function listPackages() {
  const { data } = await api.get("/public/packages");
  return data;
}

export async function checkAvailability(packageId, start, end) {
  const { data } = await api.get(`/public/packages/${packageId}/availability`, { params: { start, end } });
  return data;
}

export async function createBooking(payload) {
  const { data } = await api.post("/customer/bookings", payload);
  return data;
}

export async function getBookingHistory(email) {
  const { data } = await api.get(`/customer/bookings`, { params: { email } });
  return data;
}