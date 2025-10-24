// repositories/ClientRepository.java
package com.example.ttms.repositories;

import com.example.ttms.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByNic(String nic);
    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
}