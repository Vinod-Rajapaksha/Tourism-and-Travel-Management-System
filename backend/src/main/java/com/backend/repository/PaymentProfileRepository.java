package com.backend.repository;

import com.backend.entity.PaymentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentProfileRepository extends JpaRepository<PaymentProfile, Long> {
    
    List<PaymentProfile> findByClientUserIDAndIsActiveTrueOrderByIsDefaultDescCreatedAtDesc(Long clientUserID);
    
    Optional<PaymentProfile> findByClientUserIDAndProfileIDAndIsActiveTrue(Long clientUserID, Long profileID);
    
    Optional<PaymentProfile> findByClientUserIDAndIsDefaultTrueAndIsActiveTrue(Long clientUserID);
    
    @Query("SELECT pp FROM PaymentProfile pp WHERE pp.client.userID = :clientID AND pp.isActive = true ORDER BY pp.isDefault DESC, pp.createdAt DESC")
    List<PaymentProfile> findActiveProfilesByClient(@Param("clientID") Long clientID);
    
    @Query("SELECT COUNT(pp) FROM PaymentProfile pp WHERE pp.client.userID = :clientID AND pp.isActive = true")
    Long countActiveProfilesByClient(@Param("clientID") Long clientID);
    
    @Query("SELECT pp FROM PaymentProfile pp WHERE pp.client.userID = :clientID AND pp.profileName = :profileName AND pp.isActive = true")
    Optional<PaymentProfile> findByClientAndProfileName(@Param("clientID") Long clientID, @Param("profileName") String profileName);
    
    boolean existsByClientUserIDAndProfileNameAndIsActiveTrue(Long clientUserID, String profileName);
}
