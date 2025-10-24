package com.backend.service;

import com.backend.dto.CreatePaymentProfileDto;
import com.backend.dto.PaymentProfileDto;
import com.backend.dto.UpdatePaymentProfileDto;

import java.util.List;

public interface PaymentProfileService {
    PaymentProfileDto createPaymentProfile(Long clientId, CreatePaymentProfileDto request);
    List<PaymentProfileDto> getPaymentProfiles(Long clientId);
    PaymentProfileDto getPaymentProfile(Long clientId, Long profileId);
    PaymentProfileDto updatePaymentProfile(Long clientId, Long profileId, UpdatePaymentProfileDto request);
    void deletePaymentProfile(Long clientId, Long profileId);
    PaymentProfileDto setDefaultPaymentProfile(Long clientId, Long profileId);
    PaymentProfileDto getDefaultPaymentProfile(Long clientId);
}
