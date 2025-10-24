package com.backend.service.Analyse.impl;

import com.backend.dto.Analyse.PopularPackageDTO;
import com.backend.repository.PaymentRepository;
import com.backend.service.Analyse.PopularPackageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PopularPackageServiceImpl implements PopularPackageService {

    private final PaymentRepository paymentRepository;

    @Override
    public PopularPackageDTO getMostPopularPackage() {
        try {
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

            Optional<Object[]> result = paymentRepository.findMostPopularPackageLast7Days(sevenDaysAgo);

            if (result.isPresent()) {
                Object[] row = result.get();

                Long packageId = ((Number) row[0]).longValue();
                String packageName = (String) row[1];
                String description = (String) row[2];
                BigDecimal price = (BigDecimal) row[3];
                BigDecimal offer = (BigDecimal) row[4];
                String image = (String) row[5];
                Long salesCount = ((Number) row[6]).longValue();

                // Calculate original price if offer exists
                BigDecimal originalPrice = null;
                if (offer != null && offer.compareTo(BigDecimal.ZERO) > 0) {
                    originalPrice = price.add(offer);
                }

                return new PopularPackageDTO(
                        packageId,
                        packageName,
                        description,
                        price,
                        originalPrice,
                        salesCount,
                        image);
            }

            log.info("No popular package found for the last 7 days");
            return getDefaultPopularPackage();

        } catch (Exception e) {
            log.error("Error fetching most popular package: {}", e.getMessage(), e);
            return getDefaultPopularPackage();
        }
    }

    private PopularPackageDTO getDefaultPopularPackage() {
        return new PopularPackageDTO(
                1L,
                "City Explorer Package",
                "Experience the best of our city with this comprehensive tour package. Includes guided tours, exclusive access to top attractions, and authentic local experiences.",
                new BigDecimal("299.00"),
                new BigDecimal("399.00"),
                25L,
                null);
    }
}