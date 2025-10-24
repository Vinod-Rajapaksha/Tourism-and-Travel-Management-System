package com.example.ttms.repositories;

import com.example.ttms.models.GuidePhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GuidePhoneRepository extends JpaRepository<GuidePhone, Integer> {
    List<GuidePhone> findByGuideID(Integer guideID);
    void deleteByGuideID(Integer guideID);
}
