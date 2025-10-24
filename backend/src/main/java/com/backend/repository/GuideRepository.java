package com.backend.repository;

import com.backend.entity.Guide;
import com.backend.entity.enums.GuideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideRepository extends JpaRepository<Guide, Long> {
    List<Guide> findAllByStatus(GuideStatus status);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByNic(String nic);

    boolean existsByEmailIgnoreCaseAndGuideIDNot(String email, Long guideID);

    boolean existsByNicAndGuideIDNot(String nic, Long guideID);
}
