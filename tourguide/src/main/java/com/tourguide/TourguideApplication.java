package com.tourguide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TourguideApplication {

    public static void main(String[] args) {
        System.out.println("🎯 Starting Tour Guide Spring Boot application...");
        System.out.println("📋 Loading configuration...");

        try {
            SpringApplication.run(TourguideApplication.class, args);
            System.out.println("✅ Application started successfully on port 8080");
            System.out.println("🌐 CORS configured for: http://localhost:3000");
            System.out.println("🚀 Ready to accept API requests at: http://localhost:8080/api/");
        } catch (Exception e) {
            System.err.println("❌ Application failed to start: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
