package com.backend.repository;

import com.backend.entity.Packages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends JpaRepository<Packages, Long> {
    @Query("SELECT p FROM Packages p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    java.util.List<Packages> findActive();
}