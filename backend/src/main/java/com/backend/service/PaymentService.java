package com.backend.service;

import com.backend.dto.Analyse.PaymentDTO;
import com.backend.entity.Payment;
import com.backend.entity.Packages;
import com.backend.entity.Client;
import com.backend.entity.enums.PaymentStatus;
import com.backend.repository.ClientRepository;
import com.backend.repository.PaymentRepository;
import com.backend.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private ClientRepository clientRepository;

    // Strategy Pattern Interface
    public interface PaymentStrategy {
        boolean processPayment(BigDecimal amount);

        String getStrategyName();
    }

    // Concrete Strategies - FIXED: Made static
    public static class CreditCardPayment implements PaymentStrategy {
        @Override
        public boolean processPayment(BigDecimal amount) {
            System.out.println("Processing credit card payment of LKR " + amount);
            // Simulate credit card processing with 85% success rate
            boolean success = Math.random() < 0.85;
            System.out.println("Credit Card Payment " + (success ? "SUCCESSFUL" : "FAILED"));
            return success;
        }

        @Override
        public String getStrategyName() {
            return "Credit Card";
        }
    }

    public static class BankTransferPayment implements PaymentStrategy {
        @Override
        public boolean processPayment(BigDecimal amount) {
            System.out.println("Processing bank transfer of LKR " + amount);
            // Simulate bank transfer with 95% success rate
            boolean success = Math.random() < 0.95;
            System.out.println("Bank Transfer " + (success ? "SUCCESSFUL" : "FAILED"));
            return success;
        }

        @Override
        public String getStrategyName() {
            return "Bank Transfer";
        }
    }

    public static class DigitalWalletPayment implements PaymentStrategy {
        @Override
        public boolean processPayment(BigDecimal amount) {
            System.out.println("Processing digital wallet payment of LKR " + amount);
            // Simulate digital wallet with 90% success rate
            boolean success = Math.random() < 0.90;
            System.out.println("Digital Wallet Payment " + (success ? "SUCCESSFUL" : "FAILED"));
            return success;
        }

        @Override
        public String getStrategyName() {
            return "Digital Wallet";
        }
    }

    public static class CashPayment implements PaymentStrategy {
        @Override
        public boolean processPayment(BigDecimal amount) {
            System.out.println("Processing cash payment of LKR " + amount);
            // Cash payments are always successful
            System.out.println("Cash Payment SUCCESSFUL");
            return true;
        }

        @Override
        public String getStrategyName() {
            return "Cash";
        }
    }

    // Payment Context - FIXED: Made static
    public static class PaymentContext {
        private PaymentStrategy strategy;

        public void setPaymentStrategy(PaymentStrategy strategy) {
            this.strategy = strategy;
        }

        public boolean executePayment(BigDecimal amount) {
            if (strategy == null) {
                System.out.println("No payment strategy selected.");
                return false;
            } else {
                return strategy.processPayment(amount);
            }
        }

        public String getStrategyName() {
            return strategy != null ? strategy.getStrategyName() : "Unknown";
        }
    }

    // Convert Entity → DTO
    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentID());

        if (payment.getReservation() != null) {
            dto.setReservationId(payment.getReservation().getReservationID());
        }

        if (payment.getClient() != null) {
            dto.setUserId(payment.getClient().getUserID());
        }

        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setStatus(payment.getStatus());
        dto.setMethod(payment.getMethod());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());

        if (payment.getPackages() != null) {
            dto.setPackageId(payment.getPackages().getPackageID());
        }

        return dto;
    }

    // Convert DTO → Entity
    private Payment convertToEntity(PaymentDTO dto) {
        Payment payment = new Payment();

        if (dto.getPaymentId() != null) {
            payment.setPaymentID(dto.getPaymentId());
        }

        if (dto.getUserId() != null) {
            Client client = clientRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Client not found with id: " + dto.getUserId()));
            payment.setClient(client);
        }

        if (dto.getPackageId() != null) {
            Packages packages = packageRepository.findById(dto.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package not found with id: " + dto.getPackageId()));
            payment.setPackages(packages);
        }

        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDateTime.now());
        payment.setStatus(dto.getStatus());
        payment.setMethod(dto.getMethod());
        payment.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return payment;
    }

    // --- CRUD Operations ---
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        if (paymentDTO.getPaymentDate() == null) {
            paymentDTO.setPaymentDate(LocalDateTime.now());
        }
        if (paymentDTO.getStatus() == null) {
            paymentDTO.setStatus(PaymentStatus.PENDING);
        }

        Payment payment = convertToEntity(paymentDTO);
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDTO(savedPayment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PaymentDTO> getPaymentById(Long id) {
        return paymentRepository.findById(id).map(this::convertToDTO);
    }

    public List<PaymentDTO> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getConfirmedPayments() {
        return getPaymentsByStatus(PaymentStatus.SUCCESS.name());
    }

    public List<PaymentDTO> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByPackageId(Long packageId) {
        return paymentRepository.findByPackageId(packageId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getSuccessPaymentsBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findSuccessPaymentsBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PaymentDTO> updatePayment(Long id, PaymentDTO paymentDTO) {
        return paymentRepository.findById(id).map(existingPayment -> {
            if (paymentDTO.getAmount() != null)
                existingPayment.setAmount(paymentDTO.getAmount());
            if (paymentDTO.getMethod() != null)
                existingPayment.setMethod(paymentDTO.getMethod());
            if (paymentDTO.getStatus() != null)
                existingPayment.setStatus(paymentDTO.getStatus());

            if (paymentDTO.getPackageId() != null) {
                Packages packages = packageRepository.findById(paymentDTO.getPackageId())
                        .orElseThrow(
                                () -> new RuntimeException("Package not found with id: " + paymentDTO.getPackageId()));
                existingPayment.setPackages(packages);
            }

            existingPayment.setUpdatedAt(LocalDateTime.now());
            Payment updatedPayment = paymentRepository.save(existingPayment);
            return convertToDTO(updatedPayment);
        });
    }

    public boolean deletePayment(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // --- Payment Processing ---
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        paymentDTO.setStatus(PaymentStatus.PENDING);
        PaymentDTO createdPayment = createPayment(paymentDTO);

        boolean paymentSuccessful = simulatePaymentProcessing();
        PaymentStatus newStatus = paymentSuccessful ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        PaymentDTO statusUpdateDTO = new PaymentDTO();
        statusUpdateDTO.setStatus(newStatus);

        return updatePayment(createdPayment.getPaymentId(), statusUpdateDTO)
                .orElse(createdPayment);
    }

    private boolean simulatePaymentProcessing() {
        return Math.random() < 0.9;
    }

    // --- Reports ---
    public BigDecimal getTotalConfirmedAmount() {
        return paymentRepository.getTotalSuccessAmount();
    }

    public BigDecimal getTotalAmountByStatus(PaymentStatus status) {
        return paymentRepository.getTotalAmountByStatus(status.name());
    }

    public long getCountByStatus(PaymentStatus status) {
        return paymentRepository.countByStatus(status.name());
    }

    public long getTotalConfirmedCount() {
        return getCountByStatus(PaymentStatus.SUCCESS);
    }

    public List<PaymentDTO> getRecentPayments() {
        return paymentRepository.findRecentPayments()
                .stream()
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public int cleanupExpiredPendingPayments(int minutesOld) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutesOld);
        List<Payment> expiredPayments = paymentRepository.findExpiredPendingPayments(cutoffTime);

        for (Payment payment : expiredPayments) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
        return expiredPayments.size();
    }
}
