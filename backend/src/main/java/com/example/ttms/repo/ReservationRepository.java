/*package com.example.ttms.repo;

import com.example.ttms.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIDAndDeletedFalseOrderByCreatedAtDesc(Long userID);
    List<Reservation> findAllByOrderByCreatedAtDesc();
}*/

package com.example.ttms.repo;

import com.example.ttms.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findAllByOrderByCreatedAtDesc();

    List<Reservation> findByUserIDOrderByCreatedAtDesc(Long userId);
}


