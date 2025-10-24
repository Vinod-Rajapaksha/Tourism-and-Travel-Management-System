// repositories/PackageRepository.java
package com.example.ttms.repositories;

import com.example.ttms.models.PackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackageRepository extends JpaRepository<PackageEntity, Integer> {}