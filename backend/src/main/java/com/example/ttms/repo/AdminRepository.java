package com.example.ttms.repo;

import com.example.ttms.entity.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    @Query("""
              SELECT a FROM Admin a
              WHERE (:q IS NULL OR :q = ''
                     OR LOWER(a.fName) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(a.lName) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(a.email) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(a.role) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    Page<Admin> search(@Param("q") String q, Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsByRole(String role);
}
