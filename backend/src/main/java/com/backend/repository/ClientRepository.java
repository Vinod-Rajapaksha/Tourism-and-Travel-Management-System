package com.backend.repository;

import com.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByNic(String nic);
}
