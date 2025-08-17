package com.backend.service.impl;

import com.backend.dto.ManagerDashboardDTO;
import com.backend.repository.ReservationRepository;
import com.backend.repository.ClientRepository;
import com.backend.repository.PackageRepository;
import com.backend.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final ReservationRepository bookingRepo;
    private final ClientRepository clientRepo;
    private final PackageRepository packageRepo;

    @Override
    public ManagerDashboardDTO getDashboardStats() {
        long clients = clientRepo.count();
        long bookings = bookingRepo.count();
        long packages = packageRepo.count();
        long revenue = bookingRepo.sumTotalRevenue();

        return new ManagerDashboardDTO(clients, bookings, packages, revenue);
    }
}
