package com.backend.repository;

import com.backend.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByEmail(String email);

    boolean existsByNic(String nic);

    Optional<Client> findByEmail(String email);

    @Query("""
              SELECT c FROM Client c
              WHERE (:q IS NULL OR :q = ''
                     OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(c.nic) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    Page<Client> search(@Param("q") String q, Pageable pageable);
}
