package com.backend.config;

import com.backend.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(c -> {
                })
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/error").permitAll()

                        .requestMatchers("/api/manager/dashboard/**").hasAnyRole("GENERAL_MANAGER", "ADMIN")
                        .requestMatchers("/api/consultant/**").hasAnyRole("SENIOR_TRAVEL_CONSULTANT", "ADMIN")
                        .requestMatchers("/api/customer-service/**").hasAnyRole("CUSTOMER_SERVICE_EXECUTIVE", "ADMIN")
                        .requestMatchers("/api/marketing/**").hasAnyRole("MARKETING_MANAGER", "ADMIN")

                        .requestMatchers("/api/admin/**").hasAnyRole(
                                "GENERAL_MANAGER",
                                "SENIOR_TRAVEL_CONSULTANT",
                                "CUSTOMER_SERVICE_EXECUTIVE",
                                "MARKETING_MANAGER",
                                "ADMIN")

                        .requestMatchers("/api/clients/**")
                        .hasAnyRole("GENERAL_MANAGER", "TOURIST", "CUSTOMER_SERVICE_EXECUTIVE", "ADMIN")

                        .requestMatchers("/api/adminmanagement/**").hasAnyRole("GENERAL_MANAGER", "ADMIN")

                        .requestMatchers("/api/promotions/**").permitAll()

                        .requestMatchers("/api/packages/**").permitAll()

                        .requestMatchers("/api/guides/**").permitAll()

                        .requestMatchers("/api/reservations/**")
                        .hasAnyRole("CUSTOMER_SERVICE_EXECUTIVE", "TOURIST", "GUIDE", "GENERAL_MANAGER")

                        .requestMatchers("/api/availability/**").permitAll()

                        .requestMatchers("/api/reports/**").permitAll()

                        .anyRequest().authenticated())

                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var cfg = new org.springframework.web.cors.CorsConfiguration();
        cfg.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
        cfg.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
