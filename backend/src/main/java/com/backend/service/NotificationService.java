package com.backend.service;

import com.backend.entity.Reservation;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendConfirmation(Reservation reservation) {
        System.out.println("=== Notification Sent ===");
        System.out.println("To User ID: " + reservation.getClient().getUserID());
        System.out.println("Reservation ID: " + reservation.getReservationID());
        System.out.println("Status: " + reservation.getStatus());
        System.out.println("=========================");
    }
}
