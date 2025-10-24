package com.backend.service;

import com.backend.dto.BookingRequestDTO;
import com.backend.entity.Reservation;

public interface BookingService {
    Reservation createBooking(BookingRequestDTO request);
    Reservation cancelBooking(Long reservationId);
    void deleteBooking(Long reservationId);
}


