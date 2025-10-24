package com.example.ttms.repositories;

import com.example.ttms.models.ClientPhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientPhoneRepository extends JpaRepository<ClientPhone, Integer> {
    List<ClientPhone> findByUserID(Integer userID);
    void deleteByUserID(Integer userID);
}
