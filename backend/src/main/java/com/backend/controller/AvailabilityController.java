package com.backend.controller;

import java.util.Map;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:3000")
public class AvailabilityController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Map<String, Object>> getAvailability() {
        String sql = """
            SELECT p.packageID, p.title,
                   COUNT(r.reservationID) AS currentBookings,
                   (10 - COUNT(r.reservationID)) AS available,
                   CASE 
                       WHEN COUNT(r.reservationID) >= 10 THEN 'Full'
                       ELSE 'Available'
                   END AS status
            FROM packages p
            LEFT JOIN reservation r 
                ON p.packageID = r.packageID 
                AND r.status IN ('Confirmed', 'Active')
            GROUP BY p.packageID, p.title
        """;
        return jdbcTemplate.queryForList(sql);
    }
}

