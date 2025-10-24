package com.backend.service.impl;

import com.backend.entity.Packages;
import com.backend.repository.PackageRepository;
import com.backend.repository.ReservationRepository;
import com.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final PackageRepository packageRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public List<Packages> listActivePackages() {
        return packageRepository.findActive();
    }

    @Override
    public boolean isPackageAvailable(Long packageId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || endDate.isBefore(startDate)) {
            return false;
        }
        boolean overlap = reservationRepository.existsActiveOverlap(packageId, startDate, endDate);
        return !overlap;
    }
}


