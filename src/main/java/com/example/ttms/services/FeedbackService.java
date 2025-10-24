// services/FeedbackService.java
package com.example.ttms.services;

import com.example.ttms.dto.FeedbackDTO;
import com.example.ttms.models.Feedback;
import com.example.ttms.models.Reservation;
import com.example.ttms.repositories.FeedbackRepository;
import com.example.ttms.repositories.ReservationRepository;
import com.example.ttms.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    private final FeedbackRepository feedRepo;
    private final ReservationRepository resRepo;

    public FeedbackService(FeedbackRepository feedRepo, ReservationRepository resRepo) {
        this.feedRepo = feedRepo;
        this.resRepo = resRepo;
    }

    public List<FeedbackDTO> getAllForGuide(Integer guideId) {
        return feedRepo.findAllForGuide(guideId).stream()
                .map(this::toDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public FeedbackDTO getForReservation(Integer reservationId, Integer guideIdFromToken) {
        Reservation r = resRepo.findWithDetailsByReservationID(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (r.getGuide() == null || !Objects.equals(r.getGuide().getGuideID(), guideIdFromToken)) {
            throw new SecurityException("Forbidden: not your assignment");
        }

        return feedRepo.findByPackageAndUser(r.getPack().getPackageID(), r.getClient().getUserID())
                .map(this::toDTO)
                .orElse(null);
    }

    private FeedbackDTO toDTO(Feedback f) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setFeedbackID(f.getFeedbackID());
        dto.setRating(f.getRating());
        dto.setComment(f.getComment());
        dto.setPackageID(f.getPack().getPackageID());
        dto.setPackageTitle(f.getPack().getTitle());
        dto.setUserID(f.getClient().getUserID());
        dto.setUserName(f.getClient().getFirstName() + " " + f.getClient().getLastName());
        return dto;
    }
}