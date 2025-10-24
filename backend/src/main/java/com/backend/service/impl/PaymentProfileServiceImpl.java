package com.backend.service.impl;

import com.backend.dto.CreatePaymentProfileDto;
import com.backend.dto.PaymentProfileDto;
import com.backend.dto.UpdatePaymentProfileDto;
import com.backend.entity.Client;
import com.backend.entity.PaymentProfile;
import com.backend.repository.ClientRepository;
import com.backend.repository.PaymentProfileRepository;
import com.backend.service.PaymentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentProfileServiceImpl implements PaymentProfileService {

    private final PaymentProfileRepository paymentProfileRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public PaymentProfileDto createPaymentProfile(Long clientId, CreatePaymentProfileDto request) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        // Check if profile name already exists
        if (paymentProfileRepository.existsByClientUserIDAndProfileNameAndIsActiveTrue(clientId, request.getProfileName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment profile with this name already exists");
        }

        // If this is set as default, unset other default profiles
        if (request.getIsDefault()) {
            paymentProfileRepository.findByClientUserIDAndIsDefaultTrueAndIsActiveTrue(clientId)
                    .ifPresent(profile -> {
                        profile.setIsDefault(false);
                        paymentProfileRepository.save(profile);
                    });
        }

        PaymentProfile paymentProfile = new PaymentProfile();
        paymentProfile.setClient(client);
        paymentProfile.setProfileName(request.getProfileName());
        paymentProfile.setPaymentMethod(request.getPaymentMethod());
        paymentProfile.setCardNumber(maskCardNumber(request.getCardNumber()));
        paymentProfile.setCardHolderName(request.getCardHolderName());
        paymentProfile.setExpiryMonth(request.getExpiryMonth());
        paymentProfile.setExpiryYear(request.getExpiryYear());
        paymentProfile.setBillingAddress(request.getBillingAddress());
        paymentProfile.setCity(request.getCity());
        paymentProfile.setPostalCode(request.getPostalCode());
        paymentProfile.setCountry(request.getCountry());
        paymentProfile.setIsDefault(request.getIsDefault());
        paymentProfile.setIsActive(true);
        paymentProfile.setCreatedAt(LocalDateTime.now());
        paymentProfile.setUpdatedAt(LocalDateTime.now());

        PaymentProfile savedProfile = paymentProfileRepository.save(paymentProfile);
        return convertToDto(savedProfile);
    }

    @Override
    public List<PaymentProfileDto> getPaymentProfiles(Long clientId) {
        List<PaymentProfile> profiles = paymentProfileRepository.findActiveProfilesByClient(clientId);
        return profiles.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentProfileDto getPaymentProfile(Long clientId, Long profileId) {
        PaymentProfile profile = paymentProfileRepository.findByClientUserIDAndProfileIDAndIsActiveTrue(clientId, profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment profile not found"));
        return convertToDto(profile);
    }

    @Override
    @Transactional
    public PaymentProfileDto updatePaymentProfile(Long clientId, Long profileId, UpdatePaymentProfileDto request) {
        PaymentProfile profile = paymentProfileRepository.findByClientUserIDAndProfileIDAndIsActiveTrue(clientId, profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment profile not found"));

        // Check if profile name already exists (excluding current profile)
        if (request.getProfileName() != null && !request.getProfileName().equals(profile.getProfileName())) {
            if (paymentProfileRepository.existsByClientUserIDAndProfileNameAndIsActiveTrue(clientId, request.getProfileName())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment profile with this name already exists");
            }
        }

        // If this is set as default, unset other default profiles
        if (request.getIsDefault() != null && request.getIsDefault()) {
            paymentProfileRepository.findByClientUserIDAndIsDefaultTrueAndIsActiveTrue(clientId)
                    .ifPresent(existingDefault -> {
                        if (!existingDefault.getProfileID().equals(profileId)) {
                            existingDefault.setIsDefault(false);
                            paymentProfileRepository.save(existingDefault);
                        }
                    });
        }

        // Update fields
        if (request.getProfileName() != null) profile.setProfileName(request.getProfileName());
        if (request.getPaymentMethod() != null) profile.setPaymentMethod(request.getPaymentMethod());
        if (request.getCardNumber() != null) profile.setCardNumber(maskCardNumber(request.getCardNumber()));
        if (request.getCardHolderName() != null) profile.setCardHolderName(request.getCardHolderName());
        if (request.getExpiryMonth() != null) profile.setExpiryMonth(request.getExpiryMonth());
        if (request.getExpiryYear() != null) profile.setExpiryYear(request.getExpiryYear());
        if (request.getBillingAddress() != null) profile.setBillingAddress(request.getBillingAddress());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getPostalCode() != null) profile.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getIsDefault() != null) profile.setIsDefault(request.getIsDefault());
        if (request.getIsActive() != null) profile.setIsActive(request.getIsActive());

        profile.setUpdatedAt(LocalDateTime.now());
        PaymentProfile savedProfile = paymentProfileRepository.save(profile);
        return convertToDto(savedProfile);
    }

    @Override
    @Transactional
    public void deletePaymentProfile(Long clientId, Long profileId) {
        PaymentProfile profile = paymentProfileRepository.findByClientUserIDAndProfileIDAndIsActiveTrue(clientId, profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment profile not found"));

        profile.setIsActive(false);
        profile.setUpdatedAt(LocalDateTime.now());
        paymentProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public PaymentProfileDto setDefaultPaymentProfile(Long clientId, Long profileId) {
        PaymentProfile profile = paymentProfileRepository.findByClientUserIDAndProfileIDAndIsActiveTrue(clientId, profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment profile not found"));

        // Unset current default
        paymentProfileRepository.findByClientUserIDAndIsDefaultTrueAndIsActiveTrue(clientId)
                .ifPresent(existingDefault -> {
                    existingDefault.setIsDefault(false);
                    paymentProfileRepository.save(existingDefault);
                });

        // Set new default
        profile.setIsDefault(true);
        profile.setUpdatedAt(LocalDateTime.now());
        PaymentProfile savedProfile = paymentProfileRepository.save(profile);
        return convertToDto(savedProfile);
    }

    @Override
    public PaymentProfileDto getDefaultPaymentProfile(Long clientId) {
        PaymentProfile profile = paymentProfileRepository.findByClientUserIDAndIsDefaultTrueAndIsActiveTrue(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No default payment profile found"));
        return convertToDto(profile);
    }

    private PaymentProfileDto convertToDto(PaymentProfile profile) {
        PaymentProfileDto dto = new PaymentProfileDto();
        dto.setProfileID(profile.getProfileID());
        dto.setProfileName(profile.getProfileName());
        dto.setPaymentMethod(profile.getPaymentMethod());
        dto.setCardNumber(profile.getCardNumber());
        dto.setCardHolderName(profile.getCardHolderName());
        dto.setExpiryMonth(profile.getExpiryMonth());
        dto.setExpiryYear(profile.getExpiryYear());
        dto.setBillingAddress(profile.getBillingAddress());
        dto.setCity(profile.getCity());
        dto.setPostalCode(profile.getPostalCode());
        dto.setCountry(profile.getCountry());
        dto.setIsDefault(profile.getIsDefault());
        dto.setIsActive(profile.getIsActive());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return cardNumber;
        }
        // Keep last 4 digits, mask the rest
        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        return "****-****-****-" + lastFour;
    }
}
