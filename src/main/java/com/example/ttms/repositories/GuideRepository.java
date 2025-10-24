// repositories/GuideRepository.java
package com.example.ttms.repositories;

import com.example.ttms.models.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Integer> {
    Optional<Guide> findByEmail(String email);
    Optional<Guide> findByNic(String nic);
    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
}