// services/ReservationService.java
package com.example.ttms.services;

import com.example.ttms.dto.ReservationDTO;
import com.example.ttms.models.Guide;
import com.example.ttms.models.Reservation;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.ReservationRepository;
import com.example.ttms.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository resRepo;
    private final GuideRepository guideRepo;

    public ReservationService(ReservationRepository resRepo, GuideRepository guideRepo) {
        this.resRepo = resRepo;
        this.guideRepo = guideRepo;
    }

    public List<ReservationDTO> getAssigned(Integer guideId, List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            statuses = List.of("CONFIRMED", "PENDING");
        }
        List<Reservation> list = resRepo.findAssigned(guideId, statuses);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void markComplete(Integer reservationId, Integer guideIdFromToken) {
        Reservation r = resRepo.findWithDetailsByReservationID(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (r.getGuide() == null || !Objects.equals(r.getGuide().getGuideID(), guideIdFromToken)) {
            throw new SecurityException("Forbidden: not your assignment");
        }
        if (!"CONFIRMED".equalsIgnoreCase(r.getStatus()) && !"PENDING".equalsIgnoreCase(r.getStatus())) {
            throw new IllegalStateException("Only CONFIRMED/PENDING reservations can be completed");
        }

        r.setStatus("COMPLETED");
        resRepo.save(r);

        boolean hasOpen = resRepo.existsByGuide_GuideIDAndStatusIn(
                guideIdFromToken, List.of("PENDING", "CONFIRMED"));
        Guide g = r.getGuide();
        g.setStatus(hasOpen ? "INACTIVE" : "ACTIVE");
        guideRepo.save(g);
    }

    public ReservationDTO toDTO(Reservation r) {
        ReservationDTO dto = new ReservationDTO();
        dto.setReservationID(r.getReservationID());
        dto.setStatus(r.getStatus());
        dto.setStartDate(r.getStartDate());
        dto.setEndDate(r.getEndDate());

        ReservationDTO.PackageSummaryDTO p = new ReservationDTO.PackageSummaryDTO();
        p.setPackageID(r.getPack().getPackageID());
        p.setTitle(r.getPack().getTitle());
        p.setImage(r.getPack().getImage());
        p.setStatus(r.getPack().getStatus());
        dto.setPack(p);

        ReservationDTO.ClientSummaryDTO c = new ReservationDTO.ClientSummaryDTO();
        c.setUserID(r.getClient().getUserID());
        c.setFName(r.getClient().getFirstName());
        c.setLName(r.getClient().getLastName());
        c.setEmail(r.getClient().getEmail());
        dto.setClient(c);

        return dto;
    }
}