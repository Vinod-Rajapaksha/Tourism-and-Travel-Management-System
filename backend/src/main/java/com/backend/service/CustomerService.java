package com.backend.service;

import com.backend.entity.Packages;

import java.time.LocalDate;
import java.util.List;

public interface CustomerService {
    List<Packages> listActivePackages();
    boolean isPackageAvailable(Long packageId, LocalDate startDate, LocalDate endDate);
}


