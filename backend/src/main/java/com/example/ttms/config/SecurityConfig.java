package com.example.ttms.config;

import com.example.ttms.filter.JwtAuthenticationFilter;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/manager/dashboard/**").hasRole("GENERAL_MANAGER")
                        .requestMatchers("/api/consultant/**").hasRole("SENIOR_TRAVEL_CONSULTANT")
                        .requestMatchers("/api/customer-service/**").hasRole("CUSTOMER_SERVICE_EXECUTIVE")
                        .requestMatchers("/api/marketing/**").hasRole("MARKETING_MANAGER")
                        .requestMatchers("/api/admin/**").hasAnyRole(
                                "GENERAL_MANAGER",
                                "SENIOR_TRAVEL_CONSULTANT",
                                "CUSTOMER_SERVICE_EXECUTIVE",
                                "MARKETING_MANAGER")
                        .requestMatchers("/api/clients/**").hasRole("GENERAL_MANAGER")
                        .requestMatchers("/api/adminmanagement/**").hasRole("GENERAL_MANAGER")
                        .requestMatchers("/api/reservations/**").hasAnyRole(
                                "CUSTOMER_SERVICE_EXECUTIVE",
                                "SENIOR_TRAVEL_CONSULTANT",
                                "GENERAL_MANAGER")
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
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
        cfg.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        cfg.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}