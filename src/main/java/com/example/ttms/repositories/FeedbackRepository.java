// repositories/FeedbackRepository.java
package com.example.ttms.repositories;

import com.example.ttms.models.Feedback;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    @Query("""
           select f from Feedback f
           where f.pack.packageID in (
               select r.pack.packageID from Reservation r
               where r.guide.guideID = :guideId
           )
           """)
    List<Feedback> findAllForGuide(@Param("guideId") Integer guideId);

    @Query("""
           select f from Feedback f
           where f.pack.packageID = :packageId and f.client.userID = :userId
           """)
    Optional<Feedback> findByPackageAndUser(@Param("packageId") Integer packageId,
                                            @Param("userId") Integer userId);

    List<Feedback> findByClient_UserID(Integer userId);
    
    List<Feedback> findByPack_PackageIDIn(List<Integer> packageIds);
}