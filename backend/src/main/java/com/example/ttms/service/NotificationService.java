package com.example.ttms.service;

import com.example.ttms.model.Reservation;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    // For progress evaluation: just log a message
    public void sendConfirmation(Reservation reservation) {
        System.out.println("=== Notification Sent ===");
        System.out.println("To User ID: " + reservation.getUserID());
        System.out.println("Reservation ID: " + reservation.getReservationID());
        System.out.println("Reservation Status: " + reservation.getStatus());
        System.out.println("=========================");
    }
}

