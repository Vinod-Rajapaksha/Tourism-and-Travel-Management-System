// services/CustomerFeedbackService.java
package com.example.ttms.services;

import com.example.ttms.dto.FeedbackDTO;
import com.example.ttms.models.Feedback;
import com.example.ttms.models.Client;
import com.example.ttms.models.PackageEntity;
import com.example.ttms.models.Reservation;
import com.example.ttms.repositories.FeedbackRepository;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.repositories.PackageRepository;
import com.example.ttms.repositories.ReservationRepository;
import com.example.ttms.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomerFeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final ClientRepository clientRepo;
    private final PackageRepository packageRepo;
    private final ReservationRepository reservationRepo;

    public CustomerFeedbackService(FeedbackRepository feedbackRepo, ClientRepository clientRepo, 
                                 PackageRepository packageRepo, ReservationRepository reservationRepo) {
        this.feedbackRepo = feedbackRepo;
        this.clientRepo = clientRepo;
        this.packageRepo = packageRepo;
        this.reservationRepo = reservationRepo;
    }

    public List<FeedbackDTO> getCustomerFeedback(Integer customerId) {
        return feedbackRepo.findByClient_UserID(customerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackDTO createFeedback(Integer customerId, CreateFeedbackRequest request) {
        // Validate customer exists
        Client client = clientRepo.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate package exists
        PackageEntity pack = packageRepo.findById(request.packageId())
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));

        // Check if customer has completed reservation for this package
        validateCompletedReservation(customerId, request.packageId());

        // Check if feedback already exists for this package
        if (feedbackRepo.findByPackageAndUser(request.packageId(), customerId).isPresent()) {
            throw new IllegalStateException("Feedback already exists for this package");
        }

        // Validate rating
        if (request.rating() < 1 || request.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Validate comment for inappropriate language
        validateComment(request.comment());

        // Create feedback
        Feedback feedback = new Feedback();
        feedback.setRating(request.rating());
        feedback.setComment(request.comment());
        feedback.setClient(client);
        feedback.setPack(pack);

        Feedback savedFeedback = feedbackRepo.save(feedback);
        return toDTO(savedFeedback);
    }

    @Transactional
    public FeedbackDTO updateFeedback(Integer customerId, Integer feedbackId, UpdateFeedbackRequest request) {
        // Find feedback and validate ownership
        Feedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.getClient().getUserID().equals(customerId)) {
            throw new SecurityException("Forbidden: not your feedback");
        }

        // Validate rating
        if (request.rating() < 1 || request.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Validate comment for inappropriate language
        validateComment(request.comment());

        // Update feedback
        feedback.setRating(request.rating());
        feedback.setComment(request.comment());

        Feedback savedFeedback = feedbackRepo.save(feedback);
        return toDTO(savedFeedback);
    }

    @Transactional
    public void deleteFeedback(Integer customerId, Integer feedbackId) {
        // Find feedback and validate ownership
        Feedback feedback = feedbackRepo.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.getClient().getUserID().equals(customerId)) {
            throw new SecurityException("Forbidden: not your feedback");
        }

        feedbackRepo.delete(feedback);
    }

    public List<Map<String, Object>> getCompletedReservations(Integer customerId) {
        return reservationRepo.findByClient_UserIDAndStatus(customerId, "COMPLETED").stream()
                .map(r -> {
                    Map<String, Object> reservationMap = new java.util.HashMap<>();
                    reservationMap.put("reservationId", r.getReservationID());
                    reservationMap.put("packageId", r.getPack().getPackageID());
                    reservationMap.put("packageTitle", r.getPack().getTitle());
                    reservationMap.put("startDate", r.getStartDate());
                    reservationMap.put("endDate", r.getEndDate());
                    reservationMap.put("hasFeedback", feedbackRepo.findByPackageAndUser(r.getPack().getPackageID(), customerId).isPresent());
                    return reservationMap;
                })
                .collect(Collectors.toList());
    }

    private void validateCompletedReservation(Integer customerId, Integer packageId) {
        boolean hasCompletedReservation = reservationRepo.findByClient_UserIDAndStatus(customerId, "COMPLETED")
                .stream()
                .anyMatch(r -> r.getPack().getPackageID().equals(packageId));

        if (!hasCompletedReservation) {
            throw new IllegalStateException("No completed reservation found for this package");
        }
    }

    private void validateComment(String comment) {
        if (comment == null || comment.trim().isEmpty()) {
            return; // Empty comments are allowed
        }

        // Simple inappropriate language detection (can be enhanced)
        String[] inappropriateWords = {"bad", "terrible", "awful", "hate", "stupid"};
        String lowerComment = comment.toLowerCase();
        
        for (String word : inappropriateWords) {
            if (lowerComment.contains(word)) {
                throw new IllegalArgumentException("Comment contains inappropriate language. Please revise your feedback.");
            }
        }
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

    public record CreateFeedbackRequest(Integer packageId, Integer rating, String comment) {}
    public record UpdateFeedbackRequest(Integer rating, String comment) {}
}
