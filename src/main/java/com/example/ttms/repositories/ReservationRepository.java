// repositories/ReservationRepository.java
package com.example.ttms.repositories;

import com.example.ttms.models.Reservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    @Query("select r from Reservation r " +
            "join fetch r.pack p " +
            "join fetch r.client c " +
            "where r.guide.guideID = :guideId " +
            "and r.status in :statuses " +
            "order by r.startDate asc")
    List<Reservation> findAssigned(@Param("guideId") Integer guideId,
                                   @Param("statuses") Collection<String> statuses);

    boolean existsByGuide_GuideIDAndStatusIn(Integer guideId, Collection<String> statuses);

    @EntityGraph(attributePaths = {"pack", "client", "guide"})
    Optional<Reservation> findWithDetailsByReservationID(Integer reservationId);

    List<Reservation> findByClient_UserIDAndStatus(Integer userId, String status);
    
    @Query("SELECT DISTINCT r.pack.packageID FROM Reservation r WHERE r.guide.guideID = :guideId")
    List<Integer> findPackageIdsByGuideId(@Param("guideId") Integer guideId);
    
    boolean existsByClient_UserIDAndPack_PackageIDAndStatus(Integer userId, Integer packageId, String status);
}
