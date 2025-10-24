package com.example.ttms.controllers;

import com.example.ttms.dto.FeedbackDTO;
import com.example.ttms.models.Feedback;
import com.example.ttms.repositories.FeedbackRepository;
import com.example.ttms.repositories.ReservationRepository;
import com.example.ttms.repositories.PackageRepository;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.security.AuthUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
public class EnhancedFeedbackController {
    private final FeedbackRepository feedbackRepository;
    private final ReservationRepository reservationRepository;
    private final PackageRepository packageRepository;
    private final ClientRepository clientRepository;
    private final AuthUtils auth;

    public EnhancedFeedbackController(
            FeedbackRepository feedbackRepository,
            ReservationRepository reservationRepository,
            PackageRepository packageRepository,
            ClientRepository clientRepository,
            AuthUtils auth) {
        this.feedbackRepository = feedbackRepository;
        this.reservationRepository = reservationRepository;
        this.packageRepository = packageRepository;
        this.clientRepository = clientRepository;
        this.auth = auth;
    }

    // Customer endpoints
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<FeedbackDTO>> getCustomerFeedback(@PathVariable Integer customerId) {
        auth.assertClientSelf(customerId);
        List<Feedback> feedbacks = feedbackRepository.findByClient_UserID(customerId);
        List<FeedbackDTO> dtos = feedbacks.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Transactional
    public ResponseEntity<FeedbackDTO> createFeedback(
            @PathVariable Integer customerId,
            @RequestBody CreateFeedbackRequest request) {
        auth.assertClientSelf(customerId);

        // Validate that the customer has a completed reservation for this package
        boolean hasCompletedReservation = reservationRepository.existsByClient_UserIDAndPack_PackageIDAndStatus(
                customerId, request.getPackageId(), "COMPLETED");

        if (!hasCompletedReservation) {
            return ResponseEntity.badRequest().build();
        }

        Feedback feedback = new Feedback();
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setPack(packageRepository.findById(request.getPackageId()).orElse(null));
        feedback.setClient(clientRepository.findById(customerId).orElse(null));

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(toDTO(savedFeedback));
    }

    @PutMapping("/customer/{customerId}/{feedbackId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Transactional
    public ResponseEntity<FeedbackDTO> updateFeedback(
            @PathVariable Integer customerId,
            @PathVariable Integer feedbackId,
            @RequestBody UpdateFeedbackRequest request) {
        auth.assertClientSelf(customerId);

        Feedback feedback = feedbackRepository.findById(feedbackId).orElse(null);
        if (feedback == null || !feedback.getClient().getUserID().equals(customerId)) {
            return ResponseEntity.notFound().build();
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(toDTO(savedFeedback));
    }

    @DeleteMapping("/customer/{customerId}/{feedbackId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Transactional
    public ResponseEntity<Void> deleteFeedback(
            @PathVariable Integer customerId,
            @PathVariable Integer feedbackId) {
        auth.assertClientSelf(customerId);

        Feedback feedback = feedbackRepository.findById(feedbackId).orElse(null);
        if (feedback == null || !feedback.getClient().getUserID().equals(customerId)) {
            return ResponseEntity.notFound().build();
        }

        feedbackRepository.delete(feedback);
        return ResponseEntity.ok().build();
    }

    // Guide endpoints
    @GetMapping("/guide/{guideId}")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<List<FeedbackDTO>> getGuideFeedback(@PathVariable Integer guideId) {
        auth.assertGuideSelf(guideId);
        
        // Get feedback for packages where this guide was assigned
        List<Feedback> feedbacks = feedbackRepository.findByPack_PackageIDIn(
                reservationRepository.findPackageIdsByGuideId(guideId));
        
        List<FeedbackDTO> dtos = feedbacks.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/guide/{guideId}/stats")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<GuideFeedbackStats> getGuideFeedbackStats(@PathVariable Integer guideId) {
        auth.assertGuideSelf(guideId);
        
        List<Integer> packageIds = reservationRepository.findPackageIdsByGuideId(guideId);
        List<Feedback> feedbacks = feedbackRepository.findByPack_PackageIDIn(packageIds);
        
        if (feedbacks.isEmpty()) {
            return ResponseEntity.ok(new GuideFeedbackStats(0, 0.0, 0, 0, 0, 0, 0));
        }

        double averageRating = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        long totalFeedbacks = feedbacks.size();
        long fiveStar = feedbacks.stream().mapToLong(f -> f.getRating() == 5 ? 1 : 0).sum();
        long fourStar = feedbacks.stream().mapToLong(f -> f.getRating() == 4 ? 1 : 0).sum();
        long threeStar = feedbacks.stream().mapToLong(f -> f.getRating() == 3 ? 1 : 0).sum();
        long twoStar = feedbacks.stream().mapToLong(f -> f.getRating() == 2 ? 1 : 0).sum();
        long oneStar = feedbacks.stream().mapToLong(f -> f.getRating() == 1 ? 1 : 0).sum();

        GuideFeedbackStats stats = new GuideFeedbackStats(
                totalFeedbacks, averageRating, fiveStar, fourStar, threeStar, twoStar, oneStar);
        return ResponseEntity.ok(stats);
    }

    private FeedbackDTO toDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setFeedbackID(feedback.getFeedbackID());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setPackageID(feedback.getPack().getPackageID());
        dto.setPackageTitle(feedback.getPack().getTitle());
        dto.setUserID(feedback.getClient().getUserID());
        dto.setUserName(feedback.getClient().getFirstName() + " " + feedback.getClient().getLastName());
        return dto;
    }

    // Request DTOs
    public static class CreateFeedbackRequest {
        private Integer packageId;
        private Integer rating;
        private String comment;

        public Integer getPackageId() { return packageId; }
        public void setPackageId(Integer packageId) { this.packageId = packageId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class UpdateFeedbackRequest {
        private Integer rating;
        private String comment;

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class GuideFeedbackStats {
        private long totalFeedbacks;
        private double averageRating;
        private long fiveStar;
        private long fourStar;
        private long threeStar;
        private long twoStar;
        private long oneStar;

        public GuideFeedbackStats(long totalFeedbacks, double averageRating, 
                                long fiveStar, long fourStar, long threeStar, 
                                long twoStar, long oneStar) {
            this.totalFeedbacks = totalFeedbacks;
            this.averageRating = averageRating;
            this.fiveStar = fiveStar;
            this.fourStar = fourStar;
            this.threeStar = threeStar;
            this.twoStar = twoStar;
            this.oneStar = oneStar;
        }

        // Getters
        public long getTotalFeedbacks() { return totalFeedbacks; }
        public double getAverageRating() { return averageRating; }
        public long getFiveStar() { return fiveStar; }
        public long getFourStar() { return fourStar; }
        public long getThreeStar() { return threeStar; }
        public long getTwoStar() { return twoStar; }
        public long getOneStar() { return oneStar; }
    }
}
