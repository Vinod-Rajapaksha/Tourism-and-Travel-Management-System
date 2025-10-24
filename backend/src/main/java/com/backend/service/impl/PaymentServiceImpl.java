package com.backend.service.impl;

import com.backend.dto.PaymentRequestDTO;
import com.backend.entity.Client;
import com.backend.entity.Packages;
import com.backend.entity.Payment;
import com.backend.entity.enums.PaymentStatus;
import com.backend.repository.ClientRepository;
import com.backend.repository.PackageRepository;
import com.backend.repository.PaymentRepository;
import com.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ClientRepository clientRepository;
    private final PackageRepository packageRepository;

    @Override
    @Transactional
    public Payment processPayment(PaymentRequestDTO request) {
        // Validate client
        Client client = clientRepository.findByEmail(request.getCustomerEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // Validate package
        Packages pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        // Simulate payment processing
        PaymentStatus status = simulatePaymentProcessing(request);

        Payment payment = new Payment();
        payment.setClient(client);
        payment.setPackages(pkg);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(status);

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    @Override
    public boolean verifyPayment(Long paymentId) {
        Payment payment = getPaymentById(paymentId);
        return payment.getStatus() == PaymentStatus.SUCCESS;
    }

    private PaymentStatus simulatePaymentProcessing(PaymentRequestDTO request) {
        // Simulate payment gateway processing
        // In a real implementation, this would integrate with actual payment gateways like Stripe, PayPal, etc.
        
        // Basic validation
        if (request.getCardNumber() == null || request.getCardNumber().length() < 13) {
            return PaymentStatus.FAILED;
        }
        
        if (request.getCvv() == null || request.getCvv().length() != 3) {
            return PaymentStatus.FAILED;
        }
        
        // Simulate random payment failures (5% failure rate)
        if (Math.random() < 0.05) {
            return PaymentStatus.FAILED;
        }
        
        return PaymentStatus.SUCCESS;
    }
}
