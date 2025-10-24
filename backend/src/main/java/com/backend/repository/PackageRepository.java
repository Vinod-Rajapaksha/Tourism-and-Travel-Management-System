package com.backend.repository;

import com.backend.entity.Packages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Packages, Long> {

    // Find packages with active offers (where offer is not null and greater than 0)
    @Query("SELECT p FROM Packages p WHERE p.offer IS NOT NULL AND p.offer > 0")
    List<Packages> findPackagesWithOffers();

    // Find active packages (status = 'ACTIVE')
    @Query("SELECT p FROM Packages p WHERE p.status = 'ACTIVE'")
    List<Packages> findActivePackages();

    // Find packages by price range
    @Query("SELECT p FROM Packages p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Packages> findPackagesByPriceRange(@Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    // Find packages created after a specific date
    @Query("SELECT p FROM Packages p WHERE p.createdAt >= :date")
    List<Packages> findPackagesCreatedAfter(@Param("date") LocalDateTime date);

    // Find packages with offers greater than a specific percentage
    @Query("SELECT p FROM Packages p WHERE p.offer IS NOT NULL AND p.offer >= :minOffer")
    List<Packages> findPackagesWithOfferGreaterThan(@Param("minOffer") BigDecimal minOffer);
}